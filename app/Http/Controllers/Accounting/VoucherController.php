<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use App\Models\PaymentMethod;
use App\Models\Account;
use App\Models\JournalEntry;
use App\Models\JournalEntryLine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VoucherController extends Controller
{
    private function sharedData(int $cid): array
    {
        return [
            'paymentMethods' => PaymentMethod::where('company_id', $cid)
                ->where('is_active', true)->orderBy('name')
                ->get(['id', 'name', 'type']),
            'accounts' => Account::where('company_id', $cid)
                ->where('is_active', true)->orderBy('name')
                ->get(['id', 'name', 'code', 'type']),
        ];
    }

    /* ── LIST pages (one per type) ── */
    private function list(Request $request, string $type, string $page, string $title): \Inertia\Response
    {
        $cid = auth()->user()->company_id;
        $vouchers = Voucher::where('company_id', $cid)
            ->where('voucher_type', $type)
            ->with(['paymentMethod', 'fromMethod', 'toMethod', 'account:id,name', 'creator:id,name'])
            ->when($request->search, fn($q, $s) =>
                $q->where('voucher_number', 'like', "%{$s}%")
                  ->orWhere('narration', 'like', "%{$s}%")
            )
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->latest()->paginate(15)->withQueryString();

        return Inertia::render($page, array_merge($this->sharedData($cid), [
            'vouchers' => $vouchers,
            'filters'  => $request->only('search', 'status'),
            'title'    => $title,
            'type'     => $type,
        ]));
    }

    public function debitIndex(Request $request)    { return $this->list($request, 'debit',          'Accounting/Vouchers/VoucherList', 'Debit Vouchers'); }
    public function creditIndex(Request $request)   { return $this->list($request, 'credit',         'Accounting/Vouchers/VoucherList', 'Credit Vouchers'); }
    public function contraIndex(Request $request)   { return $this->list($request, 'contra',         'Accounting/Vouchers/VoucherList', 'Contra Vouchers'); }
    public function serviceIndex(Request $request)  { return $this->list($request, 'service',        'Accounting/Vouchers/VoucherList', 'Service Payments'); }
    public function adjustIndex(Request $request)   { return $this->list($request, 'cash_adjustment','Accounting/Vouchers/VoucherList', 'Cash Adjustments'); }

    public function approvalIndex(Request $request)
    {
        $cid = auth()->user()->company_id;
        $vouchers = Voucher::where('company_id', $cid)
            ->whereIn('status', ['pending', 'approved', 'rejected'])
            ->with(['paymentMethod', 'fromMethod', 'toMethod', 'account:id,name', 'creator:id,name', 'approvedBy:id,name'])
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->type,   fn($q, $t) => $q->where('voucher_type', $t))
            ->latest()->paginate(20)->withQueryString();

        $counts = [
            'pending'  => Voucher::where('company_id', $cid)->where('status', 'pending')->count(),
            'approved' => Voucher::where('company_id', $cid)->where('status', 'approved')->count(),
            'rejected' => Voucher::where('company_id', $cid)->where('status', 'rejected')->count(),
        ];

        return Inertia::render('Accounting/Vouchers/Approval', [
            'vouchers' => $vouchers,
            'counts'   => $counts,
            'filters'  => $request->only('status', 'type'),
        ]);
    }

    /* ── CREATE form ── */
    public function create(Request $request)
    {
        $cid  = auth()->user()->company_id;
        $type = $request->query('type', 'debit');
        return Inertia::render('Accounting/Vouchers/Form', array_merge($this->sharedData($cid), [
            'voucher' => null,
            'type'    => $type,
        ]));
    }

    /* ── STORE ── */
    public function store(Request $request)
    {
        $cid = auth()->user()->company_id;

        $base = [
            'voucher_type' => 'required|in:debit,credit,contra,service,cash_adjustment',
            'voucher_date' => 'required|date',
            'amount'       => 'required|numeric|min:0.01',
            'narration'    => 'nullable|string|max:500',
            'reference'    => 'nullable|string|max:100',
            'status'       => 'required|in:draft,pending',
        ];

        $v = $request->validate(array_merge($base, [
            'payment_method_id'      => 'nullable|exists:payment_methods,id',
            'from_payment_method_id' => 'nullable|exists:payment_methods,id',
            'to_payment_method_id'   => 'nullable|exists:payment_methods,id',
            'account_id'             => 'nullable|exists:accounts,id',
        ]));

        Voucher::create(array_merge($v, [
            'company_id'    => $cid,
            'voucher_number'=> Voucher::nextNumber($cid, $v['voucher_type']),
            'created_by'    => auth()->id(),
        ]));

        $typeRoutes = [
            'debit'          => 'accounting.vouchers.debit',
            'credit'         => 'accounting.vouchers.credit',
            'contra'         => 'accounting.vouchers.contra',
            'service'        => 'accounting.vouchers.service',
            'cash_adjustment'=> 'accounting.vouchers.adjustment',
        ];

        // Notify admins when a voucher is submitted for approval
        if ($v['status'] === 'pending') {
            \App\Support\Notify::admins($cid, 'Voucher Pending Approval', ucfirst($v['voucher_type']) . ' voucher submitted for approval.', '/accounting/vouchers/approval');
        }

        return redirect()->route($typeRoutes[$v['voucher_type']])
            ->with('success', 'Voucher saved.');
    }

    /* ── SHOW ── */
    public function show(Voucher $voucher)
    {
        abort_if($voucher->company_id !== auth()->user()->company_id, 403);
        return Inertia::render('Accounting/Vouchers/Show', [
            'voucher' => $voucher->load(['paymentMethod', 'fromMethod', 'toMethod', 'account', 'creator', 'approvedBy']),
        ]);
    }

    /* ── EDIT ── */
    public function edit(Voucher $voucher)
    {
        abort_if($voucher->company_id !== auth()->user()->company_id, 403);
        abort_if($voucher->isApproved(), 403, 'Cannot edit an approved voucher.');
        $cid = auth()->user()->company_id;
        return Inertia::render('Accounting/Vouchers/Form', array_merge($this->sharedData($cid), [
            'voucher' => $voucher,
            'type'    => $voucher->voucher_type,
        ]));
    }

    /* ── UPDATE ── */
    public function update(Request $request, Voucher $voucher)
    {
        abort_if($voucher->company_id !== auth()->user()->company_id, 403);
        abort_if($voucher->isApproved(), 403, 'Cannot edit an approved voucher.');

        $v = $request->validate([
            'voucher_date'           => 'required|date',
            'amount'                 => 'required|numeric|min:0.01',
            'narration'              => 'nullable|string|max:500',
            'reference'              => 'nullable|string|max:100',
            'status'                 => 'required|in:draft,pending',
            'payment_method_id'      => 'nullable|exists:payment_methods,id',
            'from_payment_method_id' => 'nullable|exists:payment_methods,id',
            'to_payment_method_id'   => 'nullable|exists:payment_methods,id',
            'account_id'             => 'nullable|exists:accounts,id',
        ]);

        $voucher->update($v);
        return back()->with('success', 'Voucher updated.');
    }

    /* ── APPROVE ── */
    public function approve(Voucher $voucher)
    {
        abort_if($voucher->company_id !== auth()->user()->company_id, 403);
        abort_if(!$voucher->isPending(), 403, 'Voucher is not pending.');

        DB::transaction(function () use ($voucher) {
            $voucher->update([
                'status'      => 'approved',
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);
            // Auto-post journal entry
            $this->postJournalEntry($voucher);
        });

        \App\Support\Notify::user($voucher->created_by, 'Voucher Approved', "Voucher {$voucher->voucher_number} has been approved and posted.", '/accounting/vouchers/approval');
        return back()->with('success', 'Voucher approved and posted to journal.');
    }

    /* ── REJECT ── */
    public function reject(Request $request, Voucher $voucher)
    {
        abort_if($voucher->company_id !== auth()->user()->company_id, 403);
        abort_if(!$voucher->isPending(), 403, 'Voucher is not pending.');

        $v = $request->validate(['rejection_reason' => 'nullable|string|max:500']);
        $voucher->update(array_merge($v, ['status' => 'rejected']));
        \App\Support\Notify::user($voucher->created_by, 'Voucher Rejected', "Voucher {$voucher->voucher_number} has been rejected.", '/accounting/vouchers/approval');
        return back()->with('success', 'Voucher rejected.');
    }

    /* ── DESTROY ── */
    public function destroy(Voucher $voucher)
    {
        abort_if($voucher->company_id !== auth()->user()->company_id, 403);
        abort_if($voucher->isApproved(), 403, 'Cannot delete an approved voucher.');
        $voucher->delete();
        return back()->with('success', 'Voucher deleted.');
    }

    /* ── PRIVATE: Post to Journal ── */
    private function postJournalEntry(Voucher $voucher): void
    {
        $cid    = $voucher->company_id;
        $num    = 'JV-' . strtoupper($voucher->voucher_type[0]) . '-' . date('Ymd') . '-' . $voucher->id;
        $typeLabels = [
            'debit'          => 'Debit Voucher',
            'credit'         => 'Credit Voucher',
            'contra'         => 'Contra Voucher',
            'service'        => 'Service Payment',
            'cash_adjustment'=> 'Cash Adjustment',
        ];

        $je = JournalEntry::create([
            'company_id'     => $cid,
            'voucher_number' => $num,
            'date'           => $voucher->voucher_date,
            'reference'      => $voucher->reference,
            'narration'      => ($typeLabels[$voucher->voucher_type] ?? 'Voucher') . ': ' . ($voucher->narration ?? $voucher->voucher_number),
            'status'         => 'posted',
            'created_by'     => auth()->id(),
        ]);

        $this->createJournalLines($je, $voucher);

        $voucher->update(['journal_entry_id' => $je->id]);
    }

    private function createJournalLines(JournalEntry $je, Voucher $v): void
    {
        $pmAccountId   = $v->paymentMethod?->account_id;
        $fromAccountId = $v->fromMethod?->account_id;
        $toAccountId   = $v->toMethod?->account_id;
        $acId          = $v->account_id;
        $amt           = $v->amount;

        switch ($v->voucher_type) {
            case 'debit':   // Expense Dr, Cash/Bank Cr
            case 'service':
                if ($acId)       JournalEntryLine::create(['journal_entry_id'=>$je->id,'account_id'=>$acId,       'debit'=>$amt, 'credit'=>0,   'narration'=>$v->narration]);
                if ($pmAccountId)JournalEntryLine::create(['journal_entry_id'=>$je->id,'account_id'=>$pmAccountId,'debit'=>0,   'credit'=>$amt, 'narration'=>$v->narration]);
                break;
            case 'credit':  // Cash/Bank Dr, Income/Receivable Cr
                if ($pmAccountId)JournalEntryLine::create(['journal_entry_id'=>$je->id,'account_id'=>$pmAccountId,'debit'=>$amt, 'credit'=>0,   'narration'=>$v->narration]);
                if ($acId)       JournalEntryLine::create(['journal_entry_id'=>$je->id,'account_id'=>$acId,       'debit'=>0,   'credit'=>$amt, 'narration'=>$v->narration]);
                break;
            case 'contra':  // To Cash/Bank Dr, From Cash/Bank Cr
                if ($toAccountId)  JournalEntryLine::create(['journal_entry_id'=>$je->id,'account_id'=>$toAccountId,  'debit'=>$amt,'credit'=>0,   'narration'=>$v->narration]);
                if ($fromAccountId)JournalEntryLine::create(['journal_entry_id'=>$je->id,'account_id'=>$fromAccountId,'debit'=>0,   'credit'=>$amt,'narration'=>$v->narration]);
                break;
            case 'cash_adjustment':
                if ($acId)       JournalEntryLine::create(['journal_entry_id'=>$je->id,'account_id'=>$acId,       'debit'=>$amt, 'credit'=>0,   'narration'=>$v->narration]);
                if ($pmAccountId)JournalEntryLine::create(['journal_entry_id'=>$je->id,'account_id'=>$pmAccountId,'debit'=>0,   'credit'=>$amt, 'narration'=>$v->narration]);
                break;
        }
    }
}

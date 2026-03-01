<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\FiscalYear;
use App\Models\OpeningBalance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OpeningBalanceController extends Controller
{
    public function index(Request $request)
    {
        $cid = auth()->user()->company_id;

        $fiscalYears = FiscalYear::where('company_id', $cid)
            ->orderBy('start_date', 'desc')
            ->get(['id', 'name', 'start_date', 'end_date', 'status']);

        $selectedFY = $request->fiscal_year_id
            ? FiscalYear::find($request->fiscal_year_id)
            : FiscalYear::where('company_id', $cid)->where('status', 'active')->first();

        $accounts = Account::where('company_id', $cid)
            ->where('is_active', true)
            ->orderBy('code')
            ->get(['id', 'name', 'code', 'type'])
            ->map(function ($account) use ($cid, $selectedFY) {
                $ob = OpeningBalance::where('company_id', $cid)
                    ->where('account_id', $account->id)
                    ->when($selectedFY, fn($q) => $q->where('fiscal_year_id', $selectedFY->id))
                    ->first();
                $account->opening_debit  = $ob?->debit  ?? 0;
                $account->opening_credit = $ob?->credit ?? 0;
                $account->ob_id          = $ob?->id;
                return $account;
            });

        return Inertia::render('Accounting/OpeningBalance/Index', [
            'accounts'       => $accounts,
            'fiscalYears'    => $fiscalYears,
            'selectedFY'     => $selectedFY,
            'filters'        => $request->only('fiscal_year_id'),
        ]);
    }

    public function upsert(Request $request)
    {
        $cid = auth()->user()->company_id;

        $v = $request->validate([
            'fiscal_year_id'  => 'nullable|exists:fiscal_years,id',
            'balances'        => 'required|array',
            'balances.*.account_id' => 'required|exists:accounts,id',
            'balances.*.debit'      => 'required|numeric|min:0',
            'balances.*.credit'     => 'required|numeric|min:0',
            'balances.*.notes'      => 'nullable|string|max:255',
        ]);

        foreach ($v['balances'] as $row) {
            OpeningBalance::updateOrCreate(
                [
                    'company_id'    => $cid,
                    'account_id'    => $row['account_id'],
                    'fiscal_year_id'=> $v['fiscal_year_id'] ?? null,
                ],
                [
                    'debit'      => $row['debit'],
                    'credit'     => $row['credit'],
                    'notes'      => $row['notes'] ?? null,
                    'created_by' => auth()->id(),
                ]
            );
        }

        return back()->with('success', 'Opening balances saved successfully.');
    }
}

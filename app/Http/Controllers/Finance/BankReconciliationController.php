<?php
namespace App\Http\Controllers\Finance;
use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use App\Models\BankTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BankReconciliationController extends Controller {
    public function index(Request $request) {
        $cid = auth()->user()->company_id;
        $accounts = BankAccount::where('company_id', $cid)->where('is_active', true)->get(['id','account_name','bank_name','account_number','opening_balance']);
        $selectedAccountId = $request->account_id;
        $transactions = [];
        if ($selectedAccountId) {
            $transactions = BankTransaction::where('company_id', $cid)
                ->where('bank_account_id', $selectedAccountId)
                ->when($request->from_date, fn($q,$d) => $q->where('transaction_date','>=',$d))
                ->when($request->to_date, fn($q,$d) => $q->where('transaction_date','<=',$d))
                ->orderBy('transaction_date')
                ->orderBy('id')
                ->get();
        }
        return Inertia::render('Finance/BankReconciliation/Index', [
            'accounts' => $accounts,
            'transactions' => $transactions,
            'filters' => $request->only('account_id','from_date','to_date'),
        ]);
    }

    public function reconcile(Request $request) {
        $v = $request->validate([
            'transaction_ids' => 'required|array',
            'transaction_ids.*' => 'exists:bank_transactions,id',
        ]);
        $cid = auth()->user()->company_id;
        BankTransaction::whereIn('id', $v['transaction_ids'])
            ->where('company_id', $cid)
            ->update(['is_reconciled' => true, 'reconciled_date' => now()->toDateString()]);
        return back()->with('success', count($v['transaction_ids']) . ' transactions reconciled.');
    }

    public function unreoncile(BankTransaction $bankTransaction) {
        abort_if($bankTransaction->company_id !== auth()->user()->company_id, 403);
        $bankTransaction->update(['is_reconciled' => false, 'reconciled_date' => null]);
        return back()->with('success', 'Transaction un-reconciled.');
    }
}

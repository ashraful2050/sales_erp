<?php
namespace App\Http\Controllers\Accounting;
use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\BudgetLine;
use App\Models\Account;
use App\Models\CostCenter;
use App\Models\FiscalYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BudgetController extends Controller {
    public function index() {
        $cid = auth()->user()->company_id;
        return Inertia::render('Accounting/Budgets/Index', [
            'budgets' => Budget::where('company_id', $cid)
                ->with(['fiscalYear','costCenter'])
                ->orderBy('created_at','desc')
                ->get()
        ]);
    }
    public function create() {
        $cid = auth()->user()->company_id;
        return Inertia::render('Accounting/Budgets/Form', [
            'budget' => null,
            'lines' => [],
            'fiscalYears' => FiscalYear::where('company_id', $cid)->orderBy('start_date','desc')->get(['id','name']),
            'costCenters' => CostCenter::where('company_id', $cid)->where('is_active', true)->orderBy('name')->get(['id','name','code']),
            'accounts' => Account::where('company_id', $cid)->where('is_active', true)->orderBy('code')->get(['id','name','code']),
        ]);
    }
    public function store(Request $request) {
        $v = $request->validate([
            'fiscal_year_id' => 'required|exists:fiscal_years,id',
            'cost_center_id' => 'nullable|exists:cost_centers,id',
            'name' => 'required|max:200',
            'period' => 'required|in:monthly,quarterly,annual',
            'lines' => 'array',
            'lines.*.account_id' => 'required|exists:accounts,id',
            'lines.*.month' => 'nullable|integer|min:1|max:12',
            'lines.*.budgeted_amount' => 'required|numeric|min:0',
        ]);
        $cid = auth()->user()->company_id;
        $budget = Budget::create([
            'company_id' => $cid,
            'fiscal_year_id' => $v['fiscal_year_id'],
            'cost_center_id' => $v['cost_center_id'] ?? null,
            'name' => $v['name'],
            'period' => $v['period'],
            'status' => 'draft',
        ]);
        foreach (($v['lines'] ?? []) as $line) {
            $budget->lines()->create([
                'account_id' => $line['account_id'],
                'month' => $line['month'] ?? null,
                'budgeted_amount' => $line['budgeted_amount'],
            ]);
        }
        return redirect()->route('accounting.budgets.index')->with('success', 'Budget created.');
    }
    public function edit(Budget $budget) {
        abort_if($budget->company_id !== auth()->user()->company_id, 403);
        $cid = auth()->user()->company_id;
        return Inertia::render('Accounting/Budgets/Form', [
            'budget' => $budget,
            'lines' => $budget->lines()->with('account')->get(),
            'fiscalYears' => FiscalYear::where('company_id', $cid)->orderBy('start_date','desc')->get(['id','name']),
            'costCenters' => CostCenter::where('company_id', $cid)->where('is_active', true)->orderBy('name')->get(['id','name','code']),
            'accounts' => Account::where('company_id', $cid)->where('is_active', true)->orderBy('code')->get(['id','name','code']),
        ]);
    }
    public function update(Request $request, Budget $budget) {
        abort_if($budget->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'fiscal_year_id' => 'required|exists:fiscal_years,id',
            'cost_center_id' => 'nullable|exists:cost_centers,id',
            'name' => 'required|max:200',
            'period' => 'required|in:monthly,quarterly,annual',
            'status' => 'in:draft,approved',
            'lines' => 'array',
            'lines.*.account_id' => 'required|exists:accounts,id',
            'lines.*.month' => 'nullable|integer|min:1|max:12',
            'lines.*.budgeted_amount' => 'required|numeric|min:0',
        ]);
        $budget->update([
            'fiscal_year_id' => $v['fiscal_year_id'],
            'cost_center_id' => $v['cost_center_id'] ?? null,
            'name' => $v['name'],
            'period' => $v['period'],
            'status' => $v['status'] ?? $budget->status,
        ]);
        $budget->lines()->delete();
        foreach (($v['lines'] ?? []) as $line) {
            $budget->lines()->create([
                'account_id' => $line['account_id'],
                'month' => $line['month'] ?? null,
                'budgeted_amount' => $line['budgeted_amount'],
            ]);
        }
        return redirect()->route('accounting.budgets.index')->with('success', 'Budget updated.');
    }
    public function destroy(Budget $budget) {
        abort_if($budget->company_id !== auth()->user()->company_id, 403);
        $budget->lines()->delete();
        $budget->delete();
        return redirect()->route('accounting.budgets.index')->with('success', 'Budget deleted.');
    }
}

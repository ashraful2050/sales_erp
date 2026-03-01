<?php
namespace App\Http\Controllers\Finance;
use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $cid = auth()->user()->company_id;
        $expenses = Expense::where('company_id', $cid)
            ->with(['category:id,name', 'bankAccount:id,bank_name,account_number'])
            ->when($request->search, fn($q,$s) => $q->where('title','like',"%{$s}%")->orWhere('expense_number','like',"%{$s}%"))
            ->when($request->category_id, fn($q,$v) => $q->where('expense_category_id',$v))
            ->when($request->from, fn($q,$v) => $q->whereDate('expense_date','>=',$v))
            ->when($request->to,   fn($q,$v) => $q->whereDate('expense_date','<=',$v))
            ->latest('expense_date')->paginate(15)->withQueryString();

        return Inertia::render('Finance/Expenses/Index', [
            'expenses'   => $expenses,
            'categories' => ExpenseCategory::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name']),
            'filters'    => $request->only('search','category_id','from','to'),
        ]);
    }

    public function create()
    {
        $cid = auth()->user()->company_id;
        return Inertia::render('Finance/Expenses/Form', [
            'expense'          => null,
            'categories'       => ExpenseCategory::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name']),
            'bankAccounts'     => BankAccount::where('company_id',$cid)->where('is_active',true)->get(['id','bank_name','account_name','account_number']),
        ]);
    }

    public function store(Request $request)
    {
        $cid = auth()->user()->company_id;
        $v = $request->validate([
            'expense_category_id' => 'nullable|exists:expense_categories,id',
            'expense_date'        => 'required|date',
            'title'               => 'required|max:255',
            'amount'              => 'required|numeric|min:0.01',
            'payment_method'      => 'required|in:cash,bank,bkash,nagad,rocket,upay,cheque,other',
            'bank_account_id'     => 'nullable|exists:bank_accounts,id',
            'reference'           => 'nullable|max:100',
            'notes'               => 'nullable',
            'status'              => 'nullable|in:draft,approved,rejected',
        ]);
        $num = 'EXP-'.date('Ymd').'-'.str_pad(Expense::where('company_id',$cid)->count()+1,4,'0',STR_PAD_LEFT);
        Expense::create(array_merge($v,[
            'company_id'     => $cid,
            'expense_number' => $num,
            'status'         => $v['status'] ?? 'approved',
            'created_by'     => auth()->id(),
        ]));
        return redirect()->route('finance.expenses.index')->with('success','Expense recorded.');
    }

    public function edit(Expense $expense)
    {
        abort_if($expense->company_id !== auth()->user()->company_id, 403);
        $cid = auth()->user()->company_id;
        return Inertia::render('Finance/Expenses/Form', [
            'expense'      => $expense,
            'categories'   => ExpenseCategory::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name']),
            'bankAccounts' => BankAccount::where('company_id',$cid)->where('is_active',true)->get(['id','bank_name','account_name','account_number']),
        ]);
    }

    public function update(Request $request, Expense $expense)
    {
        abort_if($expense->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'expense_category_id' => 'nullable|exists:expense_categories,id',
            'expense_date'        => 'required|date',
            'title'               => 'required|max:255',
            'amount'              => 'required|numeric|min:0.01',
            'payment_method'      => 'required|in:cash,bank,bkash,nagad,rocket,upay,cheque,other',
            'bank_account_id'     => 'nullable|exists:bank_accounts,id',
            'reference'           => 'nullable|max:100',
            'notes'               => 'nullable',
            'status'              => 'nullable|in:draft,approved,rejected',
        ]);
        $expense->update($v);
        return redirect()->route('finance.expenses.index')->with('success','Expense updated.');
    }

    public function destroy(Expense $expense)
    {
        abort_if($expense->company_id !== auth()->user()->company_id, 403);
        $expense->delete();
        return redirect()->route('finance.expenses.index')->with('success','Expense deleted.');
    }

    // Expense Categories (inline management)
    public function categories(Request $request)
    {
        $cid = auth()->user()->company_id;
        return Inertia::render('Finance/Expenses/Categories', [
            'categories' => ExpenseCategory::where('company_id',$cid)->orderBy('name')->get(),
        ]);
    }

    public function storeCategory(Request $request)
    {
        $cid = auth()->user()->company_id;
        $v = $request->validate(['name' => 'required|max:100', 'description' => 'nullable']);
        ExpenseCategory::create(array_merge($v,['company_id'=>$cid,'is_active'=>true]));
        return back()->with('success','Category added.');
    }

    public function updateCategory(Request $request, ExpenseCategory $expenseCategory)
    {
        abort_if($expenseCategory->company_id !== auth()->user()->company_id, 403);
        $expenseCategory->update($request->validate(['name'=>'required|max:100','description'=>'nullable','is_active'=>'boolean']));
        return back()->with('success','Category updated.');
    }

    public function destroyCategory(ExpenseCategory $expenseCategory)
    {
        abort_if($expenseCategory->company_id !== auth()->user()->company_id, 403);
        $expenseCategory->delete();
        return back()->with('success','Category deleted.');
    }
}

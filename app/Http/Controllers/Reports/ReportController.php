<?php
namespace App\Http\Controllers\Reports;
use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Invoice;
use App\Models\JournalEntry;
use App\Models\JournalEntryLine;
use App\Models\BankAccount;
use App\Models\BankTransaction;
use App\Models\PurchaseOrder;
use App\Models\Employee;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Customer;
use App\Models\Vendor;
use App\Models\Payment;
use App\Models\ProductStock;
use App\Models\Warehouse;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
class ReportController extends Controller {
    public function trialBalance(Request $request) {
        $cid=auth()->user()->company_id;
        $dateFrom=$request->from_date??date("Y-01-01");
        $dateTo=$request->to_date??date("Y-m-d");
        $report=Account::where("company_id",$cid)->with(["journalLines"=>function($q) use($dateFrom,$dateTo){
            $q->whereHas("journalEntry",fn($q2)=>$q2->where("status","posted")->whereBetween("date",[$dateFrom,$dateTo]));
        },"group:id,name,type"])->get()->map(fn($a)=>["id"=>$a->id,"code"=>$a->code,"name"=>$a->name,"type"=>$a->type,"group"=>$a->group?->name,"debit"=>(float)$a->journalLines->sum("debit"),"credit"=>(float)$a->journalLines->sum("credit")])->filter(fn($a)=>$a["debit"]>0||$a["credit"]>0)->values();
        return Inertia::render("Reports/TrialBalance",["report"=>$report,"filters"=>["from_date"=>$dateFrom,"to_date"=>$dateTo]]);
    }
    public function profitLoss(Request $request) {
        $cid=auth()->user()->company_id;
        $dateFrom=$request->from_date??date("Y-01-01");
        $dateTo=$request->to_date??date("Y-m-d");
        $revenue=Account::where("company_id",$cid)->where("type","revenue")->with(["journalLines"=>fn($q)=>$q->whereHas("journalEntry",fn($q2)=>$q2->where("status","posted")->whereBetween("date",[$dateFrom,$dateTo]))])->get()->map(fn($a)=>["name"=>$a->name,"amount"=>(float)$a->journalLines->sum("credit")-(float)$a->journalLines->sum("debit")])->filter(fn($a)=>$a["amount"]!=0)->values();
        $expenses=Account::where("company_id",$cid)->where("type","expense")->with(["journalLines"=>fn($q)=>$q->whereHas("journalEntry",fn($q2)=>$q2->where("status","posted")->whereBetween("date",[$dateFrom,$dateTo]))])->get()->map(fn($a)=>["name"=>$a->name,"amount"=>(float)$a->journalLines->sum("debit")-(float)$a->journalLines->sum("credit")])->filter(fn($a)=>$a["amount"]!=0)->values();
        return Inertia::render("Reports/ProfitLoss",["report"=>["revenue"=>$revenue,"expenses"=>$expenses],"filters"=>["from_date"=>$dateFrom,"to_date"=>$dateTo]]);
    }
    public function balanceSheet(Request $request) {
        $cid=auth()->user()->company_id;
        $asOf=$request->as_of??date("Y-m-d");
        $toGroups=function($accounts){
            return $accounts->groupBy(fn($a)=>$a->group?->name??"Uncategorised")->map(fn($grp,$name)=>["name"=>$name,"accounts"=>$grp->map(fn($a)=>["name"=>$a->name,"code"=>$a->code,"balance"=>$a->balance_type==="debit"?(float)$a->opening_balance+(float)$a->journalLines->sum("debit")-(float)$a->journalLines->sum("credit"):(float)$a->opening_balance+(float)$a->journalLines->sum("credit")-(float)$a->journalLines->sum("debit")])->filter(fn($a)=>$a["balance"]!=0)->values()])->filter(fn($g)=>$g["accounts"]->isNotEmpty())->values();
        };
        $all=Account::where("company_id",$cid)->with(["journalLines"=>fn($q)=>$q->whereHas("journalEntry",fn($q2)=>$q2->where("status","posted")->where("date","<=",$asOf)),"group:id,name,type"])->get();
        $report=[
            "assets"=>$toGroups($all->where("type","asset")),
            "liabilities"=>$toGroups($all->where("type","liability")),
            "equity"=>$toGroups($all->where("type","equity")),
        ];
        return Inertia::render("Reports/BalanceSheet",["report"=>$report,"filters"=>["as_of"=>$asOf]]);
    }
    public function cashFlow(Request $request) {
        $cid=auth()->user()->company_id;
        return Inertia::render("Reports/CashFlow",["year"=>$request->year??date("Y")]);
    }
    public function agedReceivables(Request $request) {
        $cid=auth()->user()->company_id;
        $asOf=$request->as_of??date("Y-m-d");
        $invoices=Invoice::where("company_id",$cid)->whereIn("status",["sent","partial","overdue"])->with("customer:id,name")->get();
        $report=$invoices->groupBy("customer_id")->map(function($items) use($asOf){
            $buckets=[0.0,0.0,0.0,0.0,0.0];
            foreach($items as $i){
                $amt=max(0,(float)$i->total_amount-(float)$i->paid_amount);
                if($amt<=0) continue;
                $days=$i->due_date?max(0,(int)round((strtotime($asOf)-strtotime($i->due_date))/86400)):0;
                if($days<=0) $buckets[0]+=$amt;
                elseif($days<=30) $buckets[1]+=$amt;
                elseif($days<=60) $buckets[2]+=$amt;
                elseif($days<=90) $buckets[3]+=$amt;
                else $buckets[4]+=$amt;
            }
            return ["customer_name"=>$items->first()->customer?->name??"Unknown","buckets"=>$buckets];
        })->filter(fn($r)=>array_sum($r["buckets"])>0)->values();
        return Inertia::render("Reports/AgedReceivables",["report"=>$report,"filters"=>["as_of"=>$asOf]]);
    }
    public function agedPayables(Request $request) {
        $cid=auth()->user()->company_id;
        $asOf=$request->as_of??date("Y-m-d");
        $orders=PurchaseOrder::where("company_id",$cid)->whereIn("status",["received","partial","approved"])->with("vendor:id,name")->get();
        $report=$orders->groupBy("vendor_id")->map(function($items) use($asOf){
            $buckets=[0.0,0.0,0.0,0.0,0.0];
            foreach($items as $p){
                $amt=max(0,(float)$p->total_amount-(float)$p->paid_amount);
                if($amt<=0) continue;
                $days=$p->due_date?max(0,(int)round((strtotime($asOf)-strtotime($p->due_date))/86400)):0;
                if($days<=0) $buckets[0]+=$amt;
                elseif($days<=30) $buckets[1]+=$amt;
                elseif($days<=60) $buckets[2]+=$amt;
                elseif($days<=90) $buckets[3]+=$amt;
                else $buckets[4]+=$amt;
            }
            return ["vendor_name"=>$items->first()->vendor?->name??"Unknown","buckets"=>$buckets];
        })->filter(fn($r)=>array_sum($r["buckets"])>0)->values();
        return Inertia::render("Reports/AgedPayables",["report"=>$report,"filters"=>["as_of"=>$asOf]]);
    }
    public function vatReturn(Request $request) {
        $cid=auth()->user()->company_id;
        $dateFrom=$request->from_date??date("Y-m-01");
        $dateTo=$request->to_date??date("Y-m-d");
        $outputVat=(float)Invoice::where("company_id",$cid)->whereBetween("invoice_date",[$dateFrom,$dateTo])->sum("tax_amount");
        $inputVat=(float)PurchaseOrder::where("company_id",$cid)->whereBetween("po_date",[$dateFrom,$dateTo])->sum("tax_amount");
        return Inertia::render("Reports/VatReturn",["report"=>["output_vat"=>$outputVat,"input_vat"=>$inputVat],"filters"=>["from_date"=>$dateFrom,"to_date"=>$dateTo]]);
    }
    public function stock(Request $request) {
        $cid=auth()->user()->company_id;
        $warehouseId=$request->warehouse_id;
        $lowStock=$request->low_stock;
        $warehouses=Warehouse::where("company_id",$cid)->where("is_active",true)->get(["id","name"]);
        $stocks=ProductStock::with(["product:id,company_id,name,code,reorder_level,cost_price,unit_id,category_id","product.category:id,name","product.unit:id,name","warehouse:id,name"])
            ->whereHas("product",fn($q)=>$q->where("company_id",$cid))
            ->when($warehouseId,fn($q)=>$q->where("warehouse_id",$warehouseId))
            ->get()
            ->map(fn($s)=>[
                "product_name"=>$s->product?->name,
                "sku"=>$s->product?->code,
                "category"=>$s->product?->category?->name,
                "warehouse"=>$s->warehouse?->name,
                "qty_in_stock"=>$s->quantity,
                "reorder_level"=>$s->product?->reorder_level,
                "unit"=>$s->product?->unit?->name,
                "stock_value"=>round((float)$s->quantity*(float)$s->avg_cost,2),
            ]);
        if($lowStock) $stocks=$stocks->filter(fn($r)=>$r["qty_in_stock"]<=$r["reorder_level"])->values();
        else $stocks=$stocks->values();
        return Inertia::render("Reports/Stock",["report"=>$stocks,"warehouses"=>$warehouses,"filters"=>["warehouse_id"=>$warehouseId,"low_stock"=>(bool)$lowStock]]);
    }
    public function payrollSummary(Request $request) {
        $cid=auth()->user()->company_id;
        return Inertia::render("Reports/PayrollSummary",["month"=>$request->month??date("Y-m")]);
    }

    public function dayBook(Request $request) {
        $cid = auth()->user()->company_id;
        $dateFrom = $request->date_from ?? date('Y-m-d');
        $dateTo = $request->date_to ?? date('Y-m-d');
        $entries = JournalEntry::where('company_id', $cid)
            ->where('status', 'posted')
            ->whereBetween('date', [$dateFrom, $dateTo])
            ->with(['lines.account:id,code,name'])
            ->orderBy('date')
            ->orderBy('id')
            ->get();
        return Inertia::render('Reports/DayBook', [
            'entries' => $entries,
            'filters' => ['date_from' => $dateFrom, 'date_to' => $dateTo],
        ]);
    }

    public function ledger(Request $request) {
        $cid = auth()->user()->company_id;
        $accountId = $request->account_id;
        $dateFrom = $request->date_from ?? date('Y-01-01');
        $dateTo = $request->date_to ?? date('Y-m-d');
        $accounts = Account::where('company_id', $cid)->where('is_active', true)->orderBy('code')->get(['id','code','name']);
        $lines = [];
        $account = null;
        if ($accountId) {
            $account = Account::where('company_id', $cid)->findOrFail($accountId);
            $lines = JournalEntryLine::where('account_id', $accountId)
                ->whereHas('journalEntry', fn($q) => $q->where('company_id',$cid)->where('status','posted')->whereBetween('date',[$dateFrom,$dateTo]))
                ->with(['journalEntry:id,entry_number,date,description,reference'])
                ->orderBy(JournalEntry::select('date')->whereColumn('journal_entries.id','journal_entry_lines.journal_entry_id')->limit(1))
                ->orderBy('id')
                ->get();
            // Calculate running balance
            $openingBal = JournalEntryLine::where('account_id', $accountId)
                ->whereHas('journalEntry', fn($q) => $q->where('company_id',$cid)->where('status','posted')->where('date','<',$dateFrom))
                ->selectRaw('COALESCE(SUM(debit),0) - COALESCE(SUM(credit),0) as balance')
                ->value('balance') ?? 0;
            $running = $openingBal;
            $lines = $lines->map(function($l) use (&$running) {
                $running += ($l->debit - $l->credit);
                return array_merge($l->toArray(), ['running_balance' => $running]);
            });
        }
        return Inertia::render('Reports/Ledger', [
            'accounts' => $accounts,
            'account' => $account,
            'lines' => $lines,
            'openingBalance' => $openingBal ?? 0,
            'filters' => ['account_id' => $accountId, 'date_from' => $dateFrom, 'date_to' => $dateTo],
        ]);
    }

    public function salesRegister(Request $request) {
        $cid = auth()->user()->company_id;
        $dateFrom = $request->date_from ?? date('Y-m-01');
        $dateTo = $request->date_to ?? date('Y-m-d');
        $invoices = Invoice::where('company_id', $cid)
            ->where('type', 'sales')
            ->whereBetween('invoice_date', [$dateFrom, $dateTo])
            ->with('customer:id,name')
            ->when($request->status, fn($q,$s) => $q->where('status',$s))
            ->orderBy('invoice_date')
            ->get();
        return Inertia::render('Reports/SalesRegister', [
            'invoices' => $invoices,
            'filters' => ['date_from' => $dateFrom, 'date_to' => $dateTo, 'status' => $request->status],
            'totals' => [
                'subtotal' => $invoices->sum('subtotal'),
                'tax_amount' => $invoices->sum('tax_amount'),
                'total_amount' => $invoices->sum('total_amount'),
                'paid_amount' => $invoices->sum('paid_amount'),
            ],
        ]);
    }

    public function purchaseRegister(Request $request) {
        $cid = auth()->user()->company_id;
        $dateFrom = $request->date_from ?? date('Y-m-01');
        $dateTo = $request->date_to ?? date('Y-m-d');
        $orders = PurchaseOrder::where('company_id', $cid)
            ->where('type', 'purchase')
            ->whereBetween('po_date', [$dateFrom, $dateTo])
            ->with('vendor:id,name')
            ->when($request->status, fn($q,$s) => $q->where('status',$s))
            ->orderBy('po_date')
            ->get();
        return Inertia::render('Reports/PurchaseRegister', [
            'orders' => $orders,
            'filters' => ['date_from' => $dateFrom, 'date_to' => $dateTo, 'status' => $request->status],
            'totals' => [
                'subtotal' => $orders->sum('subtotal'),
                'tax_amount' => $orders->sum('tax_amount'),
                'total_amount' => $orders->sum('total_amount'),
                'paid_amount' => $orders->sum('paid_amount'),
            ],
        ]);
    }

    public function cashBook(Request $request) {
        $cid = auth()->user()->company_id;
        $dateFrom = $request->date_from ?? date('Y-m-01');
        $dateTo = $request->date_to ?? date('Y-m-d');
        $bankAccountId = $request->bank_account_id;
        $accounts = BankAccount::where('company_id', $cid)->where('is_active', true)->get(['id','account_name','bank_name','payment_method']);
        $transactions = [];
        if ($bankAccountId) {
            $transactions = BankTransaction::where('company_id', $cid)
                ->where('bank_account_id', $bankAccountId)
                ->whereBetween('transaction_date', [$dateFrom, $dateTo])
                ->orderBy('transaction_date')
                ->orderBy('id')
                ->get();
        }
        return Inertia::render('Reports/CashBook', [
            'accounts' => $accounts,
            'transactions' => $transactions,
            'filters' => ['date_from' => $dateFrom, 'date_to' => $dateTo, 'bank_account_id' => $bankAccountId],
        ]);
    }

    public function expenseReport(Request $request) {
        $cid = auth()->user()->company_id;
        $dateFrom = $request->date_from ?? date('Y-m-01');
        $dateTo   = $request->date_to   ?? date('Y-m-d');
        $expenses = Expense::where('company_id', $cid)
            ->whereBetween('expense_date', [$dateFrom, $dateTo])
            ->with('category:id,name')
            ->when($request->status, fn($q,$s) => $q->where('status',$s))
            ->when($request->category_id, fn($q,$id) => $q->where('expense_category_id',$id))
            ->orderBy('expense_date')
            ->get();
        $categories = ExpenseCategory::where('company_id',$cid)->where('is_active',true)->get(['id','name']);
        return Inertia::render('Reports/ExpenseReport', [
            'expenses'   => $expenses,
            'categories' => $categories,
            'total'      => (float) $expenses->sum('amount'),
            'filters'    => ['date_from'=>$dateFrom,'date_to'=>$dateTo,'status'=>$request->status,'category_id'=>$request->category_id],
        ]);
    }

    public function customerStatement(Request $request) {
        $cid = auth()->user()->company_id;
        $customers  = Customer::where('company_id', $cid)->orderBy('name')->get(['id','name']);
        $customerId = $request->customer_id;
        $dateFrom   = $request->date_from ?? date('Y-01-01');
        $dateTo     = $request->date_to   ?? date('Y-m-d');
        $customer = null; $invoices = []; $payments = [];
        if ($customerId) {
            $customer = Customer::where('company_id',$cid)->findOrFail($customerId);
            $invoices = Invoice::where('company_id',$cid)->where('customer_id',$customerId)
                ->whereBetween('invoice_date',[$dateFrom,$dateTo])
                ->orderBy('invoice_date')->get();
            $payments = Payment::where('company_id',$cid)->where('customer_id',$customerId)
                ->whereBetween('payment_date',[$dateFrom,$dateTo])
                ->orderBy('payment_date')->get();
        }
        return Inertia::render('Reports/CustomerStatement', [
            'customers' => $customers,
            'customer'  => $customer,
            'invoices'  => $invoices,
            'payments'  => $payments,
            'filters'   => ['customer_id'=>$customerId,'date_from'=>$dateFrom,'date_to'=>$dateTo],
        ]);
    }

    public function vendorStatement(Request $request) {
        $cid = auth()->user()->company_id;
        $vendors  = Vendor::where('company_id', $cid)->orderBy('name')->get(['id','name']);
        $vendorId = $request->vendor_id;
        $dateFrom = $request->date_from ?? date('Y-01-01');
        $dateTo   = $request->date_to   ?? date('Y-m-d');
        $vendor = null; $orders = []; $payments = [];
        if ($vendorId) {
            $vendor = Vendor::where('company_id',$cid)->findOrFail($vendorId);
            $orders = PurchaseOrder::where('company_id',$cid)->where('vendor_id',$vendorId)
                ->whereBetween('po_date',[$dateFrom,$dateTo])
                ->orderBy('po_date')->get();
            $payments = Payment::where('company_id',$cid)->where('vendor_id',$vendorId)
                ->whereBetween('payment_date',[$dateFrom,$dateTo])
                ->orderBy('payment_date')->get();
        }
        return Inertia::render('Reports/VendorStatement', [
            'vendors'  => $vendors,
            'vendor'   => $vendor,
            'orders'   => $orders,
            'payments' => $payments,
            'filters'  => ['vendor_id'=>$vendorId,'date_from'=>$dateFrom,'date_to'=>$dateTo],
        ]);
    }

}
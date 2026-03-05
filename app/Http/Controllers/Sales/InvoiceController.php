<?php
namespace App\Http\Controllers\Sales;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\TaxRate;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
class InvoiceController extends Controller {
    public function index(Request $request) {
        $cid=auth()->user()->company_id;
        $invoices=Invoice::where("company_id",$cid)->with("customer:id,name")
            ->when($request->search,fn($q,$s)=>$q->where("invoice_number","like","%{$s}%")->orWhereHas("customer",fn($q2)=>$q2->where("name","like","%{$s}%")))
            ->when($request->status,fn($q,$s)=>$q->where("status",$s))
            ->latest("invoice_date")->paginate(15)->withQueryString();
        return Inertia::render("Sales/Invoices/Index",["invoices"=>$invoices,"filters"=>$request->only("search","status")]);
    }
    public function create() {
        $cid=auth()->user()->company_id;
        return Inertia::render("Sales/Invoices/Form",[
            "invoice"=>null,
            "customers"=>Customer::where("company_id",$cid)->where("is_active",true)->orderBy("name")->get(["id","name","currency_code","credit_days"]),
            "products"=>Product::where("company_id",$cid)->where("is_active",true)->with("unit:id,abbreviation","stocks")->orderBy("name")->get(["id","name","code","sale_price","tax_rate_id"]),
            "taxRates"=>TaxRate::where("company_id",$cid)->where("is_active",true)->get(["id","name","rate"]),
            "warehouses"=>Warehouse::where("company_id",$cid)->where("is_active",true)->get(["id","name"]),
        ]);
    }
    public function store(Request $request) {
        $cid=auth()->user()->company_id;
        $v=$request->validate(["customer_id"=>"required|exists:customers,id","invoice_date"=>"required|date","due_date"=>"nullable|date","currency_code"=>"required|max:3","notes"=>"nullable","terms"=>"nullable","status"=>"nullable|in:draft,sent","discount_amount"=>"nullable|numeric|min:0","items"=>"required|array|min:1","items.*.description"=>"required","items.*.quantity"=>"required|numeric|min:0.0001","items.*.unit_price"=>"required|numeric|min:0"]);
        $num="INV-".date("Ymd")."-".str_pad(Invoice::where("company_id",$cid)->count()+1,4,"0",STR_PAD_LEFT);
        $invoice=Invoice::create(array_merge($v,["company_id"=>$cid,"invoice_number"=>$num,"status"=>$v["status"]??"draft","type"=>"sales","created_by"=>auth()->id(),"subtotal"=>0,"tax_amount"=>0,"discount_amount"=>$v["discount_amount"]??0,"total_amount"=>0,"paid_amount"=>0]));
        $subtotal=0;$taxAmount=0;
        foreach($request->items as $i=>$item) {
            $qty=(float)($item["quantity"]??0);$price=(float)($item["unit_price"]??0);
            $discPct=(float)($item["discount_pct"]??0);$discAmt=round($qty*$price*$discPct/100,4);
            $lineTotal=round($qty*$price-$discAmt,4);$taxRate2=(float)($item["tax_rate"]??0);
            $taxAmt=round($lineTotal*$taxRate2/100,4);$total=$lineTotal+$taxAmt;
            InvoiceItem::create(["invoice_id"=>$invoice->id,"product_id"=>$item["product_id"]??null,"warehouse_id"=>$item["warehouse_id"]??null,"tax_rate_id"=>$item["tax_rate_id"]??null,"description"=>$item["description"],"unit"=>$item["unit"]??null,"quantity"=>$qty,"unit_price"=>$price,"discount_pct"=>$discPct,"discount_amount"=>$discAmt,"tax_rate"=>$taxRate2,"tax_amount"=>$taxAmt,"total"=>$total,"sort_order"=>$i]);
            $subtotal+=$lineTotal;$taxAmount+=$taxAmt;
        }
        $disc=(float)($v["discount_amount"]??0);
        $invoice->update(["subtotal"=>$subtotal,"tax_amount"=>$taxAmount,"total_amount"=>$subtotal+$taxAmount-$disc]);
        \App\Support\Notify::admins($cid, 'New Invoice Created', "Invoice {$num} has been created.", "/sales/invoices/{$invoice->id}");
        return redirect()->route("sales.invoices.show",$invoice)->with("success","Invoice created.");
    }
    public function show(Invoice $invoice) {
        abort_if($invoice->company_id!==auth()->user()->company_id,403);
        $company = \App\Models\Company::find(auth()->user()->company_id);
        return Inertia::render("Sales/Invoices/Show",[
            "invoice"=>$invoice->load(["customer","items.product","items.taxRate"]),
            "company"=>$company,
        ]);
    }
    public function edit(Invoice $invoice) {
        abort_if($invoice->company_id!==auth()->user()->company_id,403);
        $cid=auth()->user()->company_id;
        return Inertia::render("Sales/Invoices/Form",[
            "invoice"=>$invoice->load("items"),
            "customers"=>Customer::where("company_id",$cid)->where("is_active",true)->orderBy("name")->get(["id","name"]),
            "products"=>Product::where("company_id",$cid)->where("is_active",true)->with("unit:id,abbreviation")->get(["id","name","code","sale_price","tax_rate_id"]),
            "taxRates"=>TaxRate::where("company_id",$cid)->where("is_active",true)->get(["id","name","rate"]),
            "warehouses"=>Warehouse::where("company_id",$cid)->where("is_active",true)->get(["id","name"]),
        ]);
    }
    public function update(Request $request,Invoice $invoice) {
        abort_if($invoice->company_id!==auth()->user()->company_id,403);
        $cid=auth()->user()->company_id;
        $v=$request->validate(["customer_id"=>"required|exists:customers,id","invoice_date"=>"required|date","due_date"=>"nullable|date","currency_code"=>"required|max:3","notes"=>"nullable","terms"=>"nullable","status"=>"nullable|in:draft,sent,paid,partial,overdue,cancelled","discount_amount"=>"nullable|numeric|min:0","items"=>"required|array|min:1","items.*.description"=>"required","items.*.quantity"=>"required|numeric|min:0.0001","items.*.unit_price"=>"required|numeric|min:0"]);
        $invoice->update(["customer_id"=>$v["customer_id"],"invoice_date"=>$v["invoice_date"],"due_date"=>$v["due_date"]??null,"currency_code"=>$v["currency_code"],"notes"=>$v["notes"]??null,"terms"=>$v["terms"]??null,"status"=>$v["status"]??$invoice->status,"discount_amount"=>$v["discount_amount"]??0]);
        $invoice->items()->delete();
        $subtotal=0;$taxAmount=0;
        foreach($request->items as $i=>$item) {
            $qty=(float)($item["quantity"]??0);$price=(float)($item["unit_price"]??0);
            $discPct=(float)($item["discount_pct"]??0);$discAmt=round($qty*$price*$discPct/100,4);
            $lineTotal=round($qty*$price-$discAmt,4);
            $taxRate2=(float)($item["tax_rate"]??0);
            $taxAmt=round($lineTotal*$taxRate2/100,4);$total=$lineTotal+$taxAmt;
            InvoiceItem::create(["invoice_id"=>$invoice->id,"product_id"=>$item["product_id"]??null,"warehouse_id"=>$item["warehouse_id"]??null,"tax_rate_id"=>$item["tax_rate_id"]??null,"description"=>$item["description"],"unit"=>$item["unit"]??null,"quantity"=>$qty,"unit_price"=>$price,"discount_pct"=>$discPct,"discount_amount"=>$discAmt,"tax_rate"=>$taxRate2,"tax_amount"=>$taxAmt,"total"=>$total,"sort_order"=>$i]);
            $subtotal+=$lineTotal;$taxAmount+=$taxAmt;
        }
        $disc=(float)($v["discount_amount"]??0);
        $invoice->update(["subtotal"=>$subtotal,"tax_amount"=>$taxAmount,"total_amount"=>$subtotal+$taxAmount-$disc]);
        return redirect()->route("sales.invoices.show",$invoice)->with("success","Invoice updated.");
    }
    public function destroy(Invoice $invoice) {
        abort_if($invoice->company_id!==auth()->user()->company_id,403);
        $invoice->delete();
        return redirect()->route("sales.invoices.index")->with("success","Invoice deleted.");
    }
    public function send(Invoice $invoice) {
        abort_if($invoice->company_id!==auth()->user()->company_id,403);
        $invoice->update(["status"=>"sent"]);
        \App\Support\Notify::admins($invoice->company_id, 'Invoice Sent', "Invoice {$invoice->invoice_number} has been marked as sent.", "/sales/invoices/{$invoice->id}");
        return back()->with("success","Invoice marked as sent.");
    }
    public function cancel(Invoice $invoice) {
        abort_if($invoice->company_id!==auth()->user()->company_id,403);
        $invoice->update(["status"=>"cancelled"]);
        return back()->with("success","Invoice cancelled.");
    }
}
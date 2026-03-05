<?php
namespace App\Http\Controllers\Purchase;
use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Vendor;
use App\Models\Product;
use App\Models\TaxRate;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
class PurchaseOrderController extends Controller {
    public function index(Request $request) {
        $cid=auth()->user()->company_id;
        $orders=PurchaseOrder::where("company_id",$cid)->with("vendor:id,name")
            ->when($request->search,fn($q,$s)=>$q->where("po_number","like","%{$s}%"))
            ->when($request->status,fn($q,$v)=>$q->where("status",$v))
            ->latest("po_date")->paginate(15)->withQueryString();
        return Inertia::render("Purchase/PurchaseOrders/Index",["orders"=>$orders,"filters"=>$request->only("search","status")]);
    }
    public function create() {
        $cid=auth()->user()->company_id;
        return Inertia::render("Purchase/PurchaseOrders/Form",[
            "order"=>null,
            "vendors"=>Vendor::where("company_id",$cid)->where("is_active",true)->orderBy("name")->get(["id","name","credit_days"]),
            "products"=>Product::where("company_id",$cid)->where("is_active",true)->with("unit:id,abbreviation")->get(["id","name","code","cost_price","tax_rate_id"]),
            "taxRates"=>TaxRate::where("company_id",$cid)->where("is_active",true)->get(["id","name","rate"]),
            "warehouses"=>Warehouse::where("company_id",$cid)->where("is_active",true)->get(["id","name"]),
        ]);
    }
    public function store(Request $request) {
        $cid=auth()->user()->company_id;
        $v=$request->validate(["vendor_id"=>"required|exists:vendors,id","po_date"=>"required|date","expected_date"=>"nullable|date","due_date"=>"nullable|date","currency_code"=>"nullable|max:3","notes"=>"nullable","items"=>"required|array|min:1","items.*.product_id"=>"nullable|exists:products,id","items.*.description"=>"required","items.*.quantity"=>"required|numeric|min:0.0001","items.*.unit_price"=>"required|numeric|min:0"]);
        $num="PO-".date("Ymd")."-".str_pad(PurchaseOrder::where("company_id",$cid)->count()+1,4,"0",STR_PAD_LEFT);
        $order=PurchaseOrder::create(array_merge(["company_id"=>$cid,"po_number"=>$num,"status"=>"draft","created_by"=>auth()->id(),"subtotal"=>0,"tax_amount"=>0,"total_amount"=>0,"paid_amount"=>0],$v));
        $subtotal=0;$taxAmount=0;
        foreach($request->items as $i=>$item) {
            $qty=(float)($item["quantity"]??0);$price=(float)($item["unit_price"]??0);
            $lineTotal=round($qty*$price,4);$taxRate2=(float)($item["tax_rate"]??0);
            $taxAmt=round($lineTotal*$taxRate2/100,4);
            PurchaseOrderItem::create(["purchase_order_id"=>$order->id,"product_id"=>$item["product_id"]??null,"warehouse_id"=>$item["warehouse_id"]??null,"tax_rate_id"=>$item["tax_rate_id"]??null,"description"=>$item["description"],"quantity"=>$qty,"unit_price"=>$price,"tax_rate"=>$taxRate2,"tax_amount"=>$taxAmt,"total"=>$lineTotal+$taxAmt,"received_quantity"=>0,"sort_order"=>$i]);
            $subtotal+=$lineTotal;$taxAmount+=$taxAmt;
        }
        $order->update(["subtotal"=>$subtotal,"tax_amount"=>$taxAmount,"total_amount"=>$subtotal+$taxAmount]);
        \App\Support\Notify::admins($cid, 'New Purchase Order', "PO {$num} has been created.", "/purchase/purchase-orders/{$order->id}");
        return redirect()->route("purchase.purchase-orders.show",$order)->with("success","Purchase order created.");
    }
    public function show(PurchaseOrder $purchaseOrder) {
        abort_if($purchaseOrder->company_id!==auth()->user()->company_id,403);
        return Inertia::render("Purchase/PurchaseOrders/Show",["order"=>$purchaseOrder->load(["vendor","items.product"])]);
    }
    public function edit(PurchaseOrder $purchaseOrder) {
        abort_if($purchaseOrder->company_id!==auth()->user()->company_id,403);
        $cid=auth()->user()->company_id;
        return Inertia::render("Purchase/PurchaseOrders/Form",[
            "order"=>$purchaseOrder->load("items"),
            "vendors"=>Vendor::where("company_id",$cid)->where("is_active",true)->get(["id","name"]),
            "products"=>Product::where("company_id",$cid)->where("is_active",true)->with("unit:id,abbreviation")->get(["id","name","code","cost_price"]),
            "taxRates"=>TaxRate::where("company_id",$cid)->where("is_active",true)->get(["id","name","rate"]),
            "warehouses"=>Warehouse::where("company_id",$cid)->where("is_active",true)->get(["id","name"]),
        ]);
    }
    public function update(Request $request,PurchaseOrder $purchaseOrder) {
        abort_if($purchaseOrder->company_id!==auth()->user()->company_id,403);
        return redirect()->route("purchase.purchase-orders.show",$purchaseOrder)->with("success","Purchase order updated.");
    }
    public function destroy(PurchaseOrder $purchaseOrder) {
        abort_if($purchaseOrder->company_id!==auth()->user()->company_id,403);
        $purchaseOrder->items()->delete();$purchaseOrder->delete();
        return redirect()->route("purchase.purchase-orders.index")->with("success","Purchase order deleted.");
    }
}
<?php
namespace App\Http\Controllers\Inventory;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\TaxRate;
use App\Models\Unit;
use App\Models\Warehouse;
use App\Models\ProductStock;
use Illuminate\Http\Request;
use Inertia\Inertia;
class ProductController extends Controller {
    public function index(Request $request) {
        $cid=auth()->user()->company_id;
        $products=Product::where("company_id",$cid)->with(["category:id,name","unit:id,abbreviation","stocks"])
            ->when($request->search,fn($q,$s)=>$q->where("name","like","%{$s}%")->orWhere("code","like","%{$s}%")->orWhere("barcode","like","%{$s}%"))
            ->when($request->category_id,fn($q,$v)=>$q->where("category_id",$v))
            ->orderBy("name")->paginate(15)->withQueryString();
        return Inertia::render("Inventory/Products/Index",["products"=>$products,"filters"=>$request->only("search","category_id"),"categories"=>ProductCategory::where("company_id",$cid)->get(["id","name"])]);
    }
    public function create() {
        $cid=auth()->user()->company_id;
        return Inertia::render("Inventory/Products/Form",[
            "product"=>null,
            "categories"=>ProductCategory::where("company_id",$cid)->where("is_active",true)->get(["id","name"]),
            "units"=>Unit::where("company_id",$cid)->where("is_active",true)->get(["id","name","abbreviation"]),
            "taxRates"=>TaxRate::where("company_id",$cid)->where("is_active",true)->get(["id","name","rate"]),
            "warehouses"=>Warehouse::where("company_id",$cid)->where("is_active",true)->get(["id","name"]),
        ]);
    }
    public function store(Request $request) {
        $cid=auth()->user()->company_id;
        $v=$request->validate(["name"=>"required|max:255","name_bn"=>"nullable|max:255","code"=>"nullable|max:50","barcode"=>"nullable|max:100","category_id"=>"nullable|exists:product_categories,id","unit_id"=>"nullable|exists:units,id","tax_rate_id"=>"nullable|exists:tax_rates,id","type"=>"required|in:product,service,combo","cost_price"=>"nullable|numeric|min:0","sale_price"=>"nullable|numeric|min:0","min_sale_price"=>"nullable|numeric|min:0","reorder_level"=>"nullable|numeric|min:0","reorder_quantity"=>"nullable|numeric|min:0","valuation_method"=>"nullable|in:fifo,lifo,weighted_avg","track_inventory"=>"boolean","has_batch"=>"boolean","has_expiry"=>"boolean","description"=>"nullable"]);
        $v["company_id"]=$cid;$v["is_active"]=true;
        $v["reorder_level"]    = $v["reorder_level"]    ?? 0;
        $v["reorder_quantity"] = $v["reorder_quantity"] ?? 0;
        $v["cost_price"]  = $v["cost_price"]  ?? 0;
        $v["sale_price"]  = $v["sale_price"]  ?? 0;
        $product=Product::create($v);
        // Create default stock entries for all warehouses
        if($v["track_inventory"]??false) {
            Warehouse::where("company_id",$cid)->each(fn($w)=>ProductStock::create(["product_id"=>$product->id,"warehouse_id"=>$w->id,"quantity"=>0,"avg_cost"=>$v["cost_price"]??0]));
        }
        return redirect()->route("inventory.products.index")->with("success","Product created.");
    }
    public function show(Product $product) {
        abort_if($product->company_id!==auth()->user()->company_id,403);
        return Inertia::render("Inventory/Products/Show",["product"=>$product->load(["category","unit","taxRate","stocks.warehouse","stockMovements"=>fn($q)=>$q->latest()->limit(20)])]);
    }
    public function edit(Product $product) {
        abort_if($product->company_id!==auth()->user()->company_id,403);
        $cid=auth()->user()->company_id;
        return Inertia::render("Inventory/Products/Form",[
            "product"=>$product,
            "categories"=>ProductCategory::where("company_id",$cid)->where("is_active",true)->get(["id","name"]),
            "units"=>Unit::where("company_id",$cid)->where("is_active",true)->get(["id","name","abbreviation"]),
            "taxRates"=>TaxRate::where("company_id",$cid)->where("is_active",true)->get(["id","name","rate"]),
            "warehouses"=>Warehouse::where("company_id",$cid)->where("is_active",true)->get(["id","name"]),
        ]);
    }
    public function update(Request $request,Product $product) {
        abort_if($product->company_id!==auth()->user()->company_id,403);
        $v=$request->validate(["name"=>"required|max:255","name_bn"=>"nullable|max:255","code"=>"nullable|max:50","barcode"=>"nullable|max:100","category_id"=>"nullable|exists:product_categories,id","unit_id"=>"nullable|exists:units,id","tax_rate_id"=>"nullable|exists:tax_rates,id","type"=>"required|in:product,service,combo","cost_price"=>"nullable|numeric|min:0","sale_price"=>"nullable|numeric|min:0","min_sale_price"=>"nullable|numeric|min:0","reorder_level"=>"nullable|numeric|min:0","reorder_quantity"=>"nullable|numeric|min:0","valuation_method"=>"nullable|in:fifo,lifo,weighted_avg","track_inventory"=>"boolean","has_batch"=>"boolean","has_expiry"=>"boolean","is_active"=>"boolean","description"=>"nullable"]);
        $v["reorder_level"]    = $v["reorder_level"]    ?? 0;
        $v["reorder_quantity"] = $v["reorder_quantity"] ?? 0;
        $v["cost_price"]  = $v["cost_price"]  ?? 0;
        $v["sale_price"]  = $v["sale_price"]  ?? 0;
        $product->update($v);
        return redirect()->route("inventory.products.index")->with("success","Product updated.");
    }
    public function destroy(Product $product) {
        abort_if($product->company_id!==auth()->user()->company_id,403);
        $product->delete();
        return redirect()->route("inventory.products.index")->with("success","Product deleted.");
    }
}
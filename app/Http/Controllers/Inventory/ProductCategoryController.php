<?php
namespace App\Http\Controllers\Inventory;
use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
class ProductCategoryController extends Controller {
    public function index() {
        $cid=auth()->user()->company_id;
        return Inertia::render("Inventory/Categories/Index",["categories"=>ProductCategory::where("company_id",$cid)->orderBy("name")->get()]);
    }
    public function create() { return Inertia::render("Inventory/Categories/Form",["category"=>null]); }
    public function store(Request $request) {
        $v=$request->validate(["name"=>"required|max:255","name_bn"=>"nullable|max:255","code"=>"nullable|max:20"]);
        $v["company_id"]=auth()->user()->company_id;$v["is_active"]=true;
        ProductCategory::create($v);
        return redirect()->route("inventory.categories.index")->with("success","Category created.");
    }
    public function show(ProductCategory $productCategory) { abort_if($productCategory->company_id!==auth()->user()->company_id,403); return Inertia::render("Inventory/Categories/Show",["category"=>$productCategory->load("products")]); }
    public function edit(ProductCategory $productCategory) { abort_if($productCategory->company_id!==auth()->user()->company_id,403); return Inertia::render("Inventory/Categories/Form",["category"=>$productCategory]); }
    public function update(Request $request,ProductCategory $productCategory) {
        abort_if($productCategory->company_id!==auth()->user()->company_id,403);
        $v=$request->validate(["name"=>"required|max:255","name_bn"=>"nullable|max:255","code"=>"nullable|max:20","is_active"=>"boolean"]);
        $productCategory->update($v);
        return redirect()->route("inventory.categories.index")->with("success","Category updated.");
    }
    public function destroy(ProductCategory $productCategory) { abort_if($productCategory->company_id!==auth()->user()->company_id,403); $productCategory->delete(); return redirect()->route("inventory.categories.index")->with("success","Category deleted."); }
}
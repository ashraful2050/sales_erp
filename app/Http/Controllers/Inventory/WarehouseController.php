<?php
namespace App\Http\Controllers\Inventory;
use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
class WarehouseController extends Controller {
    public function index() {
        $cid=auth()->user()->company_id;
        return Inertia::render("Inventory/Warehouses/Index",["warehouses"=>Warehouse::where("company_id",$cid)->get()]);
    }
    public function create() { return Inertia::render("Inventory/Warehouses/Form",["warehouse"=>null]); }
    public function store(Request $request) {
        $v=$request->validate(["name"=>"required|max:255","code"=>"nullable|max:20","address"=>"nullable","capacity"=>"nullable|numeric|min:0"]);
        $v["company_id"]=auth()->user()->company_id;$v["is_active"]=true;
        Warehouse::create($v);
        return redirect()->route("inventory.warehouses.index")->with("success","Warehouse created.");
    }
    public function show(Warehouse $warehouse) { abort_if($warehouse->company_id!==auth()->user()->company_id,403); return Inertia::render("Inventory/Warehouses/Show",["warehouse"=>$warehouse->load("stocks.product")]); }
    public function edit(Warehouse $warehouse) { abort_if($warehouse->company_id!==auth()->user()->company_id,403); return Inertia::render("Inventory/Warehouses/Form",["warehouse"=>$warehouse]); }
    public function update(Request $request,Warehouse $warehouse) {
        abort_if($warehouse->company_id!==auth()->user()->company_id,403);
        $v=$request->validate(["name"=>"required|max:255","code"=>"nullable|max:20","address"=>"nullable","capacity"=>"nullable|numeric|min:0","is_active"=>"boolean"]);
        $warehouse->update($v);
        return redirect()->route("inventory.warehouses.index")->with("success","Warehouse updated.");
    }
    public function destroy(Warehouse $warehouse) { abort_if($warehouse->company_id!==auth()->user()->company_id,403); $warehouse->delete(); return redirect()->route("inventory.warehouses.index")->with("success","Warehouse deleted."); }
}
<?php
namespace App\Http\Controllers\Purchase;
use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;
class VendorController extends Controller {
    public function index(Request $request) {
        $cid=auth()->user()->company_id;
        $vendors=Vendor::where("company_id",$cid)
            ->when($request->search,fn($q,$s)=>$q->where("name","like","%{$s}%")->orWhere("email","like","%{$s}%")->orWhere("phone","like","%{$s}%"))
            ->orderBy("name")->paginate(15)->withQueryString();
        return Inertia::render("Purchase/Vendors/Index",["vendors"=>$vendors,"filters"=>$request->only("search")]);
    }
    public function create() { return Inertia::render("Purchase/Vendors/Form",["vendor"=>null]); }
    public function store(Request $request) {
        $v=$request->validate(["name"=>"required|max:255","name_bn"=>"nullable|max:255","contact_person"=>"nullable|max:255","email"=>"nullable|email","phone"=>"nullable|max:30","mobile"=>"nullable|max:30","address"=>"nullable","city"=>"nullable|max:100","country"=>"nullable|max:100","tin_number"=>"nullable|max:30","bin_number"=>"nullable|max:30","credit_limit"=>"nullable|numeric|min:0","credit_days"=>"nullable|integer|min:0","opening_balance"=>"nullable|numeric","notes"=>"nullable"]);
        $v["company_id"]=auth()->user()->company_id;$v["is_active"]=true;
        Vendor::create($v);
        return redirect()->route("purchase.vendors.index")->with("success","Vendor created.");
    }
    public function show(Vendor $vendor) {
        abort_if($vendor->company_id!==auth()->user()->company_id,403);
        return Inertia::render("Purchase/Vendors/Show",["vendor"=>$vendor->load(["purchaseOrders"=>fn($q)=>$q->latest()->limit(10)])]);
    }
    public function edit(Vendor $vendor) {
        abort_if($vendor->company_id!==auth()->user()->company_id,403);
        return Inertia::render("Purchase/Vendors/Form",["vendor"=>$vendor]);
    }
    public function update(Request $request,Vendor $vendor) {
        abort_if($vendor->company_id!==auth()->user()->company_id,403);
        $v=$request->validate(["name"=>"required|max:255","name_bn"=>"nullable|max:255","contact_person"=>"nullable|max:255","email"=>"nullable|email","phone"=>"nullable|max:30","mobile"=>"nullable|max:30","address"=>"nullable","city"=>"nullable|max:100","country"=>"nullable|max:100","tin_number"=>"nullable|max:30","bin_number"=>"nullable|max:30","credit_limit"=>"nullable|numeric|min:0","credit_days"=>"nullable|integer|min:0","opening_balance"=>"nullable|numeric","is_active"=>"boolean","notes"=>"nullable"]);
        $vendor->update($v);
        return redirect()->route("purchase.vendors.index")->with("success","Vendor updated.");
    }
    public function destroy(Vendor $vendor) {
        abort_if($vendor->company_id!==auth()->user()->company_id,403);
        $vendor->delete();
        return redirect()->route("purchase.vendors.index")->with("success","Vendor deleted.");
    }
}
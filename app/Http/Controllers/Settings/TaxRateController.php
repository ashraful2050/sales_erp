<?php
namespace App\Http\Controllers\Settings;
use App\Http\Controllers\Controller;
use App\Models\TaxRate;
use Illuminate\Http\Request;
use Inertia\Inertia;
class TaxRateController extends Controller {
    public function index() {
        $cid=auth()->user()->company_id;
        return Inertia::render("Settings/TaxRates",["taxRates"=>TaxRate::where("company_id",$cid)->orderBy("name")->get()]);
    }
    public function store(Request $request) {
        $v=$request->validate(["name"=>"required|max:100","code"=>"nullable|max:20","rate"=>"required|numeric|min:0|max:100","type"=>"required|in:vat,gst,tds,custom","description"=>"nullable"]);
        $v["company_id"]=auth()->user()->company_id;$v["is_active"]=true;
        TaxRate::create($v);
        return back()->with("success","Tax rate created.");
    }
    public function update(Request $request,TaxRate $taxRate) {
        abort_if($taxRate->company_id!==auth()->user()->company_id,403);
        $v=$request->validate(["name"=>"required|max:100","code"=>"nullable|max:20","rate"=>"required|numeric|min:0|max:100","type"=>"required|in:vat,gst,tds,custom","description"=>"nullable","is_active"=>"boolean"]);
        $taxRate->update($v);
        return back()->with("success","Tax rate updated.");
    }
    public function destroy(TaxRate $taxRate) {
        abort_if($taxRate->company_id!==auth()->user()->company_id,403);
        $taxRate->delete();
        return back()->with("success","Tax rate deleted.");
    }
    public function create() { return $this->index(); }
    public function show(TaxRate $t) { return $this->index(); }
    public function edit(TaxRate $t) { return $this->index(); }
}
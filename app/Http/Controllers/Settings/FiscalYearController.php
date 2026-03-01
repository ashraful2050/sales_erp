<?php
namespace App\Http\Controllers\Settings;
use App\Http\Controllers\Controller;
use App\Models\FiscalYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
class FiscalYearController extends Controller {
    public function index() {
        $cid=auth()->user()->company_id;
        return Inertia::render("Settings/FiscalYears",["fiscalYears"=>FiscalYear::where("company_id",$cid)->orderByDesc("start_date")->get()]);
    }
    public function store(Request $request) {
        $v=$request->validate(["name"=>"required|max:100","start_date"=>"required|date","end_date"=>"required|date|after:start_date","status"=>"required|in:active,closed,pending"]);
        $v["company_id"]=auth()->user()->company_id;
        FiscalYear::create($v);
        return back()->with("success","Fiscal year created.");
    }
    public function update(Request $request,FiscalYear $fiscalYear) {
        abort_if($fiscalYear->company_id!==auth()->user()->company_id,403);
        $v=$request->validate(["name"=>"required|max:100","start_date"=>"required|date","end_date"=>"required|date|after:start_date","status"=>"required|in:active,closed,pending"]);
        $fiscalYear->update($v);
        return back()->with("success","Fiscal year updated.");
    }
    public function destroy(FiscalYear $fiscalYear) {
        abort_if($fiscalYear->company_id!==auth()->user()->company_id,403);
        $fiscalYear->delete();
        return back()->with("success","Fiscal year deleted.");
    }
    public function create() { return $this->index(); }
    public function show(FiscalYear $f) { return $this->index(); }
    public function edit(FiscalYear $f) { return $this->index(); }
}
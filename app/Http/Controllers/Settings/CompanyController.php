<?php
namespace App\Http\Controllers\Settings;
use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
class CompanyController extends Controller {
    public function edit() {
        $company=Company::findOrFail(auth()->user()->company_id);
        return Inertia::render("Settings/Company",["company"=>$company]);
    }
    public function update(Request $request) {
        $company=Company::findOrFail(auth()->user()->company_id);
        $v=$request->validate(["name"=>"required|max:255","name_bn"=>"nullable|max:255","trade_license"=>"nullable|max:50","tin_number"=>"nullable|max:20","bin_number"=>"nullable|max:20","address"=>"nullable","city"=>"nullable|max:100","country"=>"nullable|max:100","phone"=>"nullable|max:30","email"=>"nullable|email","website"=>"nullable|url","currency_code"=>"nullable|max:3","fiscal_year_start"=>"nullable|max:5","language"=>"nullable|in:en,bn"]);
        $company->update($v);
        return back()->with("success","Company settings updated.");
    }
}
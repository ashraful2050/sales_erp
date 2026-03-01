<?php
namespace App\Http\Controllers\Settings;
use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\Request;
use Inertia\Inertia;
class CurrencyController extends Controller {
    public function index() {
        return Inertia::render("Settings/Currencies",["currencies"=>Currency::where("is_active",true)->orderBy("code")->get()]);
    }
    public function store(Request $request) {
        $v=$request->validate(["code"=>"required|max:3|unique:currencies,code","name"=>"required|max:100","symbol"=>"required|max:10","exchange_rate"=>"required|numeric|min:0"]);
        $v["is_active"]=true;Currency::create($v);
        return back()->with("success","Currency added.");
    }
    public function update(Request $request,Currency $currency) {
        $v=$request->validate(["name"=>"required|max:100","symbol"=>"required|max:10","exchange_rate"=>"required|numeric|min:0","is_active"=>"boolean"]);
        $currency->update($v);
        return back()->with("success","Currency updated.");
    }
    public function destroy(Currency $currency) { $currency->delete(); return back()->with("success","Currency deleted."); }
    public function create() { return $this->index(); }
    public function show(Currency $c) { return $this->index(); }
    public function edit(Currency $c) { return $this->index(); }
}
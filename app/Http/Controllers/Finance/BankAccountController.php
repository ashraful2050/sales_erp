<?php
namespace App\Http\Controllers\Finance;
use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;
class BankAccountController extends Controller {
    public function index() {
        $cid=auth()->user()->company_id;
        return Inertia::render("Finance/BankAccounts/Index",["bankAccounts"=>BankAccount::where("company_id",$cid)->orderBy("bank_name")->get()]);
    }
    public function create() {
        $cid=auth()->user()->company_id;
        return Inertia::render("Finance/BankAccounts/Form",["bankAccount"=>null,"glAccounts"=>Account::where("company_id",$cid)->orderBy("name")->get(["id","code","name"])]);
    }
    public function store(Request $request) {
        $v=$request->validate(["account_id"=>"required|exists:accounts,id","account_name"=>"required|max:255","account_number"=>"required|max:50","bank_name"=>"required|max:255","branch_name"=>"nullable|max:255","routing_number"=>"nullable|max:50","swift_code"=>"nullable|max:20","currency_code"=>"nullable|max:3","opening_balance"=>"nullable|numeric","payment_method"=>"nullable|in:cash,bank,bkash,nagad,rocket,upay,other"]);
        $v["company_id"]=auth()->user()->company_id;$v["is_active"]=true;
        BankAccount::create($v);
        return redirect()->route("finance.bank-accounts.index")->with("success","Bank account added.");
    }
    public function show(BankAccount $bankAccount) {
        abort_if($bankAccount->company_id!==auth()->user()->company_id,403);
        return Inertia::render("Finance/BankAccounts/Show",["bankAccount"=>$bankAccount->load(["transactions"=>fn($q)=>$q->latest()->limit(20)])]);
    }
    public function edit(BankAccount $bankAccount) {
        abort_if($bankAccount->company_id!==auth()->user()->company_id,403);
        $cid=auth()->user()->company_id;
        return Inertia::render("Finance/BankAccounts/Form",["bankAccount"=>$bankAccount,"glAccounts"=>Account::where("company_id",$cid)->orderBy("name")->get(["id","code","name"])]);
    }
    public function update(Request $request,BankAccount $bankAccount) {
        abort_if($bankAccount->company_id!==auth()->user()->company_id,403);
        $v=$request->validate(["account_id"=>"required|exists:accounts,id","account_name"=>"required|max:255","account_number"=>"required|max:50","bank_name"=>"required|max:255","branch_name"=>"nullable|max:255","routing_number"=>"nullable|max:50","swift_code"=>"nullable|max:20","currency_code"=>"nullable|max:3","payment_method"=>"nullable|in:cash,bank,bkash,nagad,rocket,upay,other","is_active"=>"boolean"]);
        $bankAccount->update($v);
        return redirect()->route("finance.bank-accounts.index")->with("success","Bank account updated.");
    }
    public function destroy(BankAccount $bankAccount) {
        abort_if($bankAccount->company_id!==auth()->user()->company_id,403);
        $bankAccount->delete();
        return redirect()->route("finance.bank-accounts.index")->with("success","Bank account deleted.");
    }
}
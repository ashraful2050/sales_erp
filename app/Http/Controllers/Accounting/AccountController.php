<?php
namespace App\Http\Controllers\Accounting;
use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\AccountGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;
class AccountController extends Controller {
    public function index(Request $request) {
        $cid=auth()->user()->company_id;
        $accounts=Account::where("company_id",$cid)->with("group:id,name,type")
            ->when($request->search,fn($q,$s)=>$q->where("name","like","%{$s}%")->orWhere("code","like","%{$s}%"))
            ->when($request->type,fn($q,$v)=>$q->where("type",$v))
            ->orderBy("code")->paginate(20)->withQueryString();
        return Inertia::render("Accounting/Accounts/Index",["accounts"=>$accounts,"filters"=>$request->only("search","type")]);
    }
    public function create() {
        $cid=auth()->user()->company_id;
        return Inertia::render("Accounting/Accounts/Form",["account"=>null,"groups"=>AccountGroup::where("company_id",$cid)->orderBy("name")->get(["id","name","type"])]);
    }
    public function store(Request $request) {
        $cid=auth()->user()->company_id;
        $v=$request->validate(["account_group_id"=>"required|exists:account_groups,id","code"=>"nullable|max:20","name"=>"required|max:255","name_bn"=>"nullable|max:255","type"=>"required|in:asset,liability,equity,revenue,expense","sub_type"=>"nullable|max:50","opening_balance"=>"nullable|numeric","balance_type"=>"nullable|in:debit,credit","currency_code"=>"nullable|max:3","description"=>"nullable"]);
        $v["company_id"]=$cid;$v["is_active"]=true;
        Account::create($v);
        return redirect()->route("accounting.accounts.index")->with("success","Account created.");
    }
    public function show(Account $account) {
        abort_if($account->company_id!==auth()->user()->company_id,403);
        return Inertia::render("Accounting/Accounts/Show",["account"=>$account->load("group","journalLines.journalEntry")]);
    }
    public function edit(Account $account) {
        abort_if($account->company_id!==auth()->user()->company_id,403);
        $cid=auth()->user()->company_id;
        return Inertia::render("Accounting/Accounts/Form",["account"=>$account,"groups"=>AccountGroup::where("company_id",$cid)->orderBy("name")->get(["id","name","type"])]);
    }
    public function update(Request $request,Account $account) {
        abort_if($account->company_id!==auth()->user()->company_id,403);
        $v=$request->validate(["account_group_id"=>"required|exists:account_groups,id","code"=>"nullable|max:20","name"=>"required|max:255","name_bn"=>"nullable|max:255","type"=>"required|in:asset,liability,equity,revenue,expense","sub_type"=>"nullable|max:50","opening_balance"=>"nullable|numeric","balance_type"=>"nullable|in:debit,credit","currency_code"=>"nullable|max:3","is_active"=>"boolean","description"=>"nullable"]);
        $account->update($v);
        return redirect()->route("accounting.accounts.index")->with("success","Account updated.");
    }
    public function destroy(Account $account) {
        abort_if($account->company_id!==auth()->user()->company_id,403);
        abort_if($account->is_system,403,"System accounts cannot be deleted.");
        $account->delete();
        return redirect()->route("accounting.accounts.index")->with("success","Account deleted.");
    }
}
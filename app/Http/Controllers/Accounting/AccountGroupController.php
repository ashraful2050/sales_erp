<?php
namespace App\Http\Controllers\Accounting;
use App\Http\Controllers\Controller;
use App\Models\AccountGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;
class AccountGroupController extends Controller {
    public function index(Request $request) {
        $cid=auth()->user()->company_id;
        $groups=AccountGroup::where("company_id",$cid)->orderBy("type")->orderBy("name")->paginate(20)->withQueryString();
        return Inertia::render("Accounting/AccountGroups/Index",["groups"=>$groups]);
    }
    public function create() { return Inertia::render("Accounting/AccountGroups/Form",["group"=>null]); }
    public function store(Request $request) {
        $v=$request->validate(["name"=>"required|max:255","name_bn"=>"nullable|max:255","code"=>"nullable|max:20","type"=>"required|in:asset,liability,equity,revenue,expense","nature"=>"nullable|in:debit,credit"]);
        $v["company_id"]=auth()->user()->company_id;$v["is_system"]=false;
        AccountGroup::create($v);
        return redirect()->route("accounting.account-groups.index")->with("success","Account group created.");
    }
    public function show(AccountGroup $accountGroup) {
        abort_if($accountGroup->company_id!==auth()->user()->company_id,403);
        return Inertia::render("Accounting/AccountGroups/Show",["group"=>$accountGroup->load("accounts")]);
    }
    public function edit(AccountGroup $accountGroup) {
        abort_if($accountGroup->company_id!==auth()->user()->company_id,403);
        return Inertia::render("Accounting/AccountGroups/Form",["group"=>$accountGroup]);
    }
    public function update(Request $request,AccountGroup $accountGroup) {
        abort_if($accountGroup->company_id!==auth()->user()->company_id,403);
        $v=$request->validate(["name"=>"required|max:255","name_bn"=>"nullable|max:255","code"=>"nullable|max:20","type"=>"required|in:asset,liability,equity,revenue,expense","nature"=>"nullable|in:debit,credit"]);
        $accountGroup->update($v);
        return redirect()->route("accounting.account-groups.index")->with("success","Account group updated.");
    }
    public function destroy(AccountGroup $accountGroup) {
        abort_if($accountGroup->company_id!==auth()->user()->company_id,403);
        abort_if($accountGroup->is_system,403,"System groups cannot be deleted.");
        $accountGroup->delete();
        return redirect()->route("accounting.account-groups.index")->with("success","Account group deleted.");
    }
}
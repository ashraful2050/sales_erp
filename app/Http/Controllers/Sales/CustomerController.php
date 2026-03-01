<?php
namespace App\Http\Controllers\Sales;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
class CustomerController extends Controller {
    public function index(Request $request) {
        $cid = auth()->user()->company_id;
        $customers = Customer::where("company_id",$cid)
            ->when($request->search,fn($q,$s)=>$q->where("name","like","%{$s}%")->orWhere("email","like","%{$s}%")->orWhere("phone","like","%{$s}%"))
            ->when($request->status,fn($q,$s)=>$q->where("is_active",$s==="active"))
            ->orderBy("name")->paginate(15)->withQueryString();
        return Inertia::render("Sales/Customers/Index",["customers"=>$customers,"filters"=>$request->only("search","status")]);
    }
    public function create() {
        return Inertia::render("Sales/Customers/Form",["customer"=>null]);
    }
    public function store(Request $request) {
        $v=$request->validate(["name"=>"required|max:255","name_bn"=>"nullable|max:255","contact_person"=>"nullable|max:255","email"=>"nullable|email","phone"=>"nullable|max:30","mobile"=>"nullable|max:30","address"=>"nullable","city"=>"nullable|max:100","country"=>"nullable|max:100","tin_number"=>"nullable|max:30","bin_number"=>"nullable|max:30","currency_code"=>"nullable|max:3","credit_limit"=>"nullable|numeric|min:0","credit_days"=>"nullable|integer|min:0","opening_balance"=>"nullable|numeric","notes"=>"nullable"]);
        $v["company_id"]=auth()->user()->company_id;
        $v["is_active"]=true;
        Customer::create($v);
        return redirect()->route("sales.customers.index")->with("success","Customer created.");
    }
    public function show(Customer $customer) {
        abort_if($customer->company_id!==auth()->user()->company_id,403);
        $totalInvoiced=$customer->invoices()->sum("total_amount");
        $totalPaid=$customer->invoices()->sum("paid_amount");
        return Inertia::render("Sales/Customers/Show",["customer"=>$customer->load(["invoices"=>fn($q)=>$q->latest()->limit(10)]),"summary"=>["totalInvoiced"=>(float)$totalInvoiced,"totalPaid"=>(float)$totalPaid,"outstanding"=>(float)($totalInvoiced-$totalPaid)]]);
    }
    public function edit(Customer $customer) {
        abort_if($customer->company_id!==auth()->user()->company_id,403);
        return Inertia::render("Sales/Customers/Form",["customer"=>$customer]);
    }
    public function update(Request $request,Customer $customer) {
        abort_if($customer->company_id!==auth()->user()->company_id,403);
        $v=$request->validate(["name"=>"required|max:255","name_bn"=>"nullable|max:255","contact_person"=>"nullable|max:255","email"=>"nullable|email","phone"=>"nullable|max:30","mobile"=>"nullable|max:30","address"=>"nullable","city"=>"nullable|max:100","country"=>"nullable|max:100","tin_number"=>"nullable|max:30","bin_number"=>"nullable|max:30","currency_code"=>"nullable|max:3","credit_limit"=>"nullable|numeric|min:0","credit_days"=>"nullable|integer|min:0","opening_balance"=>"nullable|numeric","is_active"=>"boolean","notes"=>"nullable"]);
        $customer->update($v);
        return redirect()->route("sales.customers.index")->with("success","Customer updated.");
    }
    public function destroy(Customer $customer) {
        abort_if($customer->company_id!==auth()->user()->company_id,403);
        $customer->delete();
        return redirect()->route("sales.customers.index")->with("success","Customer deleted.");
    }
}
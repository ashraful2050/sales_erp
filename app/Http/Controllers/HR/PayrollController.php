<?php
namespace App\Http\Controllers\HR;
use App\Http\Controllers\Controller;
use App\Models\PayrollPeriod;
use App\Models\PayrollRecord;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
class PayrollController extends Controller {
    public function index(Request $request) {
        $cid=auth()->user()->company_id;
        $periods=PayrollPeriod::where("company_id",$cid)->orderByDesc("start_date")->paginate(12)->withQueryString();
        return Inertia::render("HR/Payroll/Index",["periods"=>$periods]);
    }
    public function create() { return Inertia::render("HR/Payroll/CreatePeriod",["period"=>null]); }
    public function store(Request $request) {
        $cid=auth()->user()->company_id;
        $v=$request->validate(["name"=>"required|max:100","start_date"=>"required|date","end_date"=>"required|date|after_or_equal:start_date","payment_date"=>"required|date"]);
        $v["company_id"]=$cid;$v["status"]="draft";
        $period=PayrollPeriod::create($v);
        // Auto-generate payroll records for active employees
        Employee::where("company_id",$cid)->where("status","active")->each(function($emp) use ($period, $cid) {
            PayrollRecord::create(["company_id"=>$cid,"payroll_period_id"=>$period->id,"employee_id"=>$emp->id,"basic_salary"=>$emp->basic_salary,"total_earnings"=>$emp->basic_salary,"total_deductions"=>0,"net_salary"=>$emp->basic_salary,"status"=>"draft"]);
        });
        return redirect()->route("hr.payroll.show",$period)->with("success","Payroll period created with ".$period->records()->count()." records.");
    }
    public function show(PayrollPeriod $payroll) {
        abort_if($payroll->company_id!==auth()->user()->company_id,403);
        return Inertia::render("HR/Payroll/Show",["period"=>$payroll->load(["records.employee:id,name,employee_id,department_id","records.employee.department:id,name"])]);
    }
    public function edit(PayrollPeriod $payroll) { abort_if($payroll->company_id!==auth()->user()->company_id,403); return back(); }
    public function update(Request $request,PayrollPeriod $payroll) {
        abort_if($payroll->company_id!==auth()->user()->company_id,403);
        if($request->action==="process") $payroll->update(["status"=>"processed"]);
        if($request->action==="approve") $payroll->update(["status"=>"approved","approved_by"=>auth()->id()]);
        return back()->with("success","Payroll status updated.");
    }
    public function destroy(PayrollPeriod $payroll) {
        abort_if($payroll->company_id!==auth()->user()->company_id,403);
        $payroll->records()->delete();$payroll->delete();
        return redirect()->route("hr.payroll.index")->with("success","Payroll period deleted.");
    }
}
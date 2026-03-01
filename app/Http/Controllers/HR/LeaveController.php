<?php
namespace App\Http\Controllers\HR;
use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
class LeaveController extends Controller {
    public function index(Request $request) {
        $cid=auth()->user()->company_id;
        $leaves=LeaveRequest::where("company_id",$cid)->with(["employee:id,name","leaveType:id,name"])
            ->when($request->status,fn($q,$v)=>$q->where("status",$v))
            ->when($request->employee_id,fn($q,$v)=>$q->where("employee_id",$v))
            ->latest("from_date")->paginate(15)->withQueryString();
        return Inertia::render("HR/Leaves/Index",["leaves"=>$leaves,"filters"=>$request->only("status","employee_id"),"leaveTypes"=>LeaveType::where("company_id",$cid)->get(["id","name"])]);
    }
    public function create() {
        $cid=auth()->user()->company_id;
        return Inertia::render("HR/Leaves/Form",["leave"=>null,"employees"=>Employee::where("company_id",$cid)->where("status","active")->orderBy("name")->get(["id","name","employee_id"]),"leaveTypes"=>LeaveType::where("company_id",$cid)->where("is_active",true)->get(["id","name","allowed_days"])]);
    }
    public function store(Request $request) {
        $cid=auth()->user()->company_id;
        $v=$request->validate(["employee_id"=>"required|exists:employees,id","leave_type_id"=>"required|exists:leave_types,id","start_date"=>"required|date","end_date"=>"required|date|after_or_equal:start_date","reason"=>"nullable"]);
        $start=\Carbon\Carbon::parse($v["start_date"]);$end=\Carbon\Carbon::parse($v["end_date"]);
        LeaveRequest::create([
            "company_id"    => $cid,
            "employee_id"   => $v["employee_id"],
            "leave_type_id" => $v["leave_type_id"],
            "from_date"     => $v["start_date"],
            "to_date"       => $v["end_date"],
            "total_days"    => $start->diffInWeekdays($end) + 1,
            "reason"        => $v["reason"] ?? null,
            "status"        => "pending",
        ]);
        return redirect()->route("hr.leaves.index")->with("success","Leave request submitted.");
    }
    public function show(LeaveRequest $leave) { abort_if($leave->company_id!==auth()->user()->company_id,403); return Inertia::render("HR/Leaves/Show",["leave"=>$leave->load(["employee","leaveType"])]); }
    public function edit(LeaveRequest $leave) { abort_if($leave->company_id!==auth()->user()->company_id,403); $cid=auth()->user()->company_id; return Inertia::render("HR/Leaves/Form",["leave"=>$leave,"employees"=>Employee::where("company_id",$cid)->where("status","active")->get(["id","name"]),"leaveTypes"=>LeaveType::where("company_id",$cid)->where("is_active",true)->get(["id","name"])]); }
    public function update(Request $request,LeaveRequest $leave) {
        abort_if($leave->company_id!==auth()->user()->company_id,403);
        if($request->action==="approve") { $leave->update(["status"=>"approved","approved_by"=>auth()->id()]); return back()->with("success","Leave approved."); }
        if($request->action==="reject") { $leave->update(["status"=>"rejected","approved_by"=>auth()->id()]); return back()->with("success","Leave rejected."); }
        $v=$request->validate(["employee_id"=>"required|exists:employees,id","leave_type_id"=>"required|exists:leave_types,id","start_date"=>"required|date","end_date"=>"required|date|after_or_equal:start_date","reason"=>"nullable"]);
        $start=\Carbon\Carbon::parse($v["start_date"]);$end=\Carbon\Carbon::parse($v["end_date"]);
        $leave->update([
            "employee_id"   => $v["employee_id"],
            "leave_type_id" => $v["leave_type_id"],
            "from_date"     => $v["start_date"],
            "to_date"       => $v["end_date"],
            "total_days"    => $start->diffInWeekdays($end) + 1,
            "reason"        => $v["reason"] ?? null,
        ]);
        return redirect()->route("hr.leaves.index")->with("success","Leave updated.");
    }
    public function destroy(LeaveRequest $leave) { abort_if($leave->company_id!==auth()->user()->company_id,403); $leave->delete(); return redirect()->route("hr.leaves.index")->with("success","Leave deleted."); }
}
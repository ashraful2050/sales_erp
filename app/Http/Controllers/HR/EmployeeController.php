<?php
namespace App\Http\Controllers\HR;
use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
class EmployeeController extends Controller {
    public function index(Request $request) {
        $cid=auth()->user()->company_id;
        $employees=Employee::where("company_id",$cid)->with(["department:id,name","designation:id,name"])
            ->when($request->search,fn($q,$s)=>$q->where("name","like","%{$s}%")->orWhere("employee_id","like","%{$s}%")->orWhere("email","like","%{$s}%"))
            ->when($request->department_id,fn($q,$v)=>$q->where("department_id",$v))
            ->when($request->status,fn($q,$s)=>$q->where("status",$s))
            ->orderBy("name")->paginate(15)->withQueryString();
        return Inertia::render("HR/Employees/Index",["employees"=>$employees,"filters"=>$request->only("search","department_id","status"),"departments"=>Department::where("company_id",$cid)->get(["id","name"])]);
    }
    public function create() {
        $cid=auth()->user()->company_id;
        return Inertia::render("HR/Employees/Form",["employee"=>null,"departments"=>Department::where("company_id",$cid)->get(["id","name"]),"designations"=>Designation::where("company_id",$cid)->get(["id","name"])]);
    }
    public function store(Request $request) {
        $cid=auth()->user()->company_id;
        $v=$request->validate(["employee_id"=>"nullable|max:20","name"=>"required|max:255","name_bn"=>"nullable|max:255","gender"=>"nullable|in:male,female,other","date_of_birth"=>"nullable|date","joining_date"=>"required|date","email"=>"nullable|email","phone"=>"nullable|max:30","mobile"=>"nullable|max:30","address"=>"nullable","department_id"=>"nullable|exists:departments,id","designation_id"=>"nullable|exists:designations,id","basic_salary"=>"required|numeric|min:0","salary_type"=>"required|in:monthly,weekly,daily,hourly","payment_method"=>"required|in:cash,bank,bkash,nagad","bank_account_number"=>"nullable|max:50","bank_name"=>"nullable|max:100","nid_number"=>"nullable|max:30","tin_number"=>"nullable|max:20","pf_number"=>"nullable|max:30"]);
        $v["company_id"]=$cid;$v["status"]="active";
        Employee::create($v);
        return redirect()->route("hr.employees.index")->with("success","Employee created.");
    }
    public function show(Employee $employee) {
        abort_if($employee->company_id!==auth()->user()->company_id,403);
        return Inertia::render("HR/Employees/Show",["employee"=>$employee->load(["department","designation","payrollRecords"=>fn($q)=>$q->latest()->limit(12)])]);
    }
    public function edit(Employee $employee) {
        abort_if($employee->company_id!==auth()->user()->company_id,403);
        $cid=auth()->user()->company_id;
        return Inertia::render("HR/Employees/Form",["employee"=>$employee,"departments"=>Department::where("company_id",$cid)->get(["id","name"]),"designations"=>Designation::where("company_id",$cid)->get(["id","name"])]);
    }
    public function update(Request $request,Employee $employee) {
        abort_if($employee->company_id!==auth()->user()->company_id,403);
        $v=$request->validate(["employee_id"=>"nullable|max:20","name"=>"required|max:255","name_bn"=>"nullable|max:255","gender"=>"nullable|in:male,female,other","date_of_birth"=>"nullable|date","joining_date"=>"required|date","leaving_date"=>"nullable|date","email"=>"nullable|email","phone"=>"nullable|max:30","mobile"=>"nullable|max:30","address"=>"nullable","department_id"=>"nullable|exists:departments,id","designation_id"=>"nullable|exists:designations,id","basic_salary"=>"required|numeric|min:0","salary_type"=>"required|in:monthly,weekly,daily,hourly","payment_method"=>"required|in:cash,bank,bkash,nagad","bank_account_number"=>"nullable|max:50","bank_name"=>"nullable|max:100","status"=>"required|in:active,inactive,terminated"]);
        $employee->update($v);
        return redirect()->route("hr.employees.index")->with("success","Employee updated.");
    }
    public function destroy(Employee $employee) {
        abort_if($employee->company_id!==auth()->user()->company_id,403);
        $employee->delete();
        return redirect()->route("hr.employees.index")->with("success","Employee deleted.");
    }
}
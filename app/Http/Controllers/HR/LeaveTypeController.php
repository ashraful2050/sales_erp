<?php
namespace App\Http\Controllers\HR;
use App\Http\Controllers\Controller;
use App\Models\LeaveType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveTypeController extends Controller {
    public function index() {
        $cid = auth()->user()->company_id;
        return Inertia::render('HR/LeaveTypes/Index', [
            'leaveTypes' => LeaveType::where('company_id', $cid)->orderBy('name')->get()
        ]);
    }
    public function store(Request $request) {
        $v = $request->validate(['name'=>'required|max:100']);
        $v['company_id'] = auth()->user()->company_id;
        LeaveType::create($v);
        return back()->with('success', 'Leave type created.');
    }
    public function update(Request $request, LeaveType $leaveType) {
        abort_if($leaveType->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate(['name'=>'required|max:100']);
        $leaveType->update($v);
        return back()->with('success', 'Leave type updated.');
    }
    public function destroy(LeaveType $leaveType) {
        abort_if($leaveType->company_id !== auth()->user()->company_id, 403);
        $leaveType->delete();
        return back()->with('success', 'Leave type deleted.');
    }
}

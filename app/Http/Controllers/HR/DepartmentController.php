<?php
namespace App\Http\Controllers\HR;
use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller {
    public function index() {
        $cid = auth()->user()->company_id;
        return Inertia::render('HR/Departments/Index', [
            'departments' => Department::where('company_id', $cid)
                ->with('parent')
                ->orderBy('name')
                ->get()
        ]);
    }
    public function store(Request $request) {
        $v = $request->validate([
            'name' => 'required|max:100',
            'code' => 'nullable|max:20',
            'parent_id' => 'nullable|exists:departments,id',
        ]);
        $v['company_id'] = auth()->user()->company_id;
        $v['is_active'] = true;
        Department::create($v);
        return back()->with('success', 'Department created.');
    }
    public function update(Request $request, Department $department) {
        abort_if($department->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'name' => 'required|max:100',
            'code' => 'nullable|max:20',
            'parent_id' => 'nullable|exists:departments,id',
            'is_active' => 'boolean',
        ]);
        $department->update($v);
        return back()->with('success', 'Department updated.');
    }
    public function destroy(Department $department) {
        abort_if($department->company_id !== auth()->user()->company_id, 403);
        $department->delete();
        return back()->with('success', 'Department deleted.');
    }
}

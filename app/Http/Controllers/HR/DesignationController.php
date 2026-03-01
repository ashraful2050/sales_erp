<?php
namespace App\Http\Controllers\HR;
use App\Http\Controllers\Controller;
use App\Models\Designation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DesignationController extends Controller {
    public function index() {
        $cid = auth()->user()->company_id;
        return Inertia::render('HR/Designations/Index', [
            'designations' => Designation::where('company_id', $cid)->orderBy('name')->get()
        ]);
    }
    public function store(Request $request) {
        $v = $request->validate(['name' => 'required|max:100']);
        $v['company_id'] = auth()->user()->company_id;
        $v['is_active'] = true;
        Designation::create($v);
        return back()->with('success', 'Designation created.');
    }
    public function update(Request $request, Designation $designation) {
        abort_if($designation->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate(['name' => 'required|max:100','is_active' => 'boolean']);
        $designation->update($v);
        return back()->with('success', 'Designation updated.');
    }
    public function destroy(Designation $designation) {
        abort_if($designation->company_id !== auth()->user()->company_id, 403);
        $designation->delete();
        return back()->with('success', 'Designation deleted.');
    }
}

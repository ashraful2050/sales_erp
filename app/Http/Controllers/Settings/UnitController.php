<?php
namespace App\Http\Controllers\Settings;
use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller {
    public function index() {
        $cid = auth()->user()->company_id;
        return Inertia::render('Settings/Units/Index', [
            'units' => Unit::where('company_id', $cid)->orderBy('name')->get()
        ]);
    }
    public function store(Request $request) {
        $v = $request->validate(['name'=>'required|max:100','abbreviation'=>'required|max:10']);
        $v['company_id'] = auth()->user()->company_id;
        $v['is_active'] = true;
        Unit::create($v);
        return back()->with('success', 'Unit created.');
    }
    public function update(Request $request, Unit $unit) {
        abort_if($unit->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate(['name'=>'required|max:100','abbreviation'=>'required|max:10','is_active'=>'boolean']);
        $unit->update($v);
        return back()->with('success', 'Unit updated.');
    }
    public function destroy(Unit $unit) {
        abort_if($unit->company_id !== auth()->user()->company_id, 403);
        $unit->delete();
        return back()->with('success', 'Unit deleted.');
    }
}

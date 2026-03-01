<?php
namespace App\Http\Controllers\Accounting;
use App\Http\Controllers\Controller;
use App\Models\CostCenter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CostCenterController extends Controller {
    public function index() {
        $cid = auth()->user()->company_id;
        return Inertia::render('Accounting/CostCenters/Index', [
            'costCenters' => CostCenter::where('company_id', $cid)->with('parent')->orderBy('name')->get()
        ]);
    }
    public function create() {
        $cid = auth()->user()->company_id;
        return Inertia::render('Accounting/CostCenters/Form', [
            'costCenter' => null,
            'parents' => CostCenter::where('company_id', $cid)->orderBy('name')->get(['id','name','code']),
        ]);
    }
    public function store(Request $request) {
        $v = $request->validate([
            'name' => 'required|max:100',
            'code' => 'nullable|max:20',
            'parent_id' => 'nullable|exists:cost_centers,id',
        ]);
        $v['company_id'] = auth()->user()->company_id;
        $v['is_active'] = true;
        CostCenter::create($v);
        return redirect()->route('accounting.cost-centers.index')->with('success', 'Cost center created.');
    }
    public function edit(CostCenter $costCenter) {
        abort_if($costCenter->company_id !== auth()->user()->company_id, 403);
        $cid = auth()->user()->company_id;
        return Inertia::render('Accounting/CostCenters/Form', [
            'costCenter' => $costCenter,
            'parents' => CostCenter::where('company_id', $cid)->where('id','!=',$costCenter->id)->orderBy('name')->get(['id','name','code']),
        ]);
    }
    public function update(Request $request, CostCenter $costCenter) {
        abort_if($costCenter->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'name' => 'required|max:100',
            'code' => 'nullable|max:20',
            'parent_id' => 'nullable|exists:cost_centers,id',
            'is_active' => 'boolean',
        ]);
        $costCenter->update($v);
        return redirect()->route('accounting.cost-centers.index')->with('success', 'Cost center updated.');
    }
    public function destroy(CostCenter $costCenter) {
        abort_if($costCenter->company_id !== auth()->user()->company_id, 403);
        $costCenter->delete();
        return redirect()->route('accounting.cost-centers.index')->with('success', 'Cost center deleted.');
    }
}

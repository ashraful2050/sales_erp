<?php
namespace App\Http\Controllers\HR;
use App\Http\Controllers\Controller;
use App\Models\SalaryComponent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalaryComponentController extends Controller {
    public function index() {
        $cid = auth()->user()->company_id;
        return Inertia::render('HR/SalaryComponents/Index', [
            'components' => SalaryComponent::where('company_id', $cid)->orderBy('type')->orderBy('name')->get()
        ]);
    }
    public function store(Request $request) {
        $v = $request->validate([
            'name' => 'required|max:100',
            'type' => 'required|in:earning,deduction',
            'is_taxable' => 'boolean',
            'is_pf_applicable' => 'boolean',
        ]);
        $v['company_id'] = auth()->user()->company_id;
        $v['is_active'] = true;
        $v['is_taxable'] = $v['is_taxable'] ?? false;
        $v['is_pf_applicable'] = $v['is_pf_applicable'] ?? false;
        SalaryComponent::create($v);
        return back()->with('success', 'Salary component created.');
    }
    public function update(Request $request, SalaryComponent $salaryComponent) {
        abort_if($salaryComponent->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'name' => 'required|max:100',
            'type' => 'required|in:earning,deduction',
            'is_taxable' => 'boolean',
            'is_pf_applicable' => 'boolean',
            'is_active' => 'boolean',
        ]);
        $salaryComponent->update($v);
        return back()->with('success', 'Salary component updated.');
    }
    public function destroy(SalaryComponent $salaryComponent) {
        abort_if($salaryComponent->company_id !== auth()->user()->company_id, 403);
        $salaryComponent->delete();
        return back()->with('success', 'Salary component deleted.');
    }
}

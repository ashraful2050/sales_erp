<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\PricingRule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PricingRuleController extends Controller
{
    public function index()
    {
        $cid   = auth()->user()->company_id;
        $rules = PricingRule::where('company_id', $cid)->orderBy('priority', 'desc')->orderBy('name')->paginate(20);
        return Inertia::render('Sales/Pricing/Index', ['rules' => $rules]);
    }

    public function create()
    {
        return Inertia::render('Sales/Pricing/Form', ['rule' => null]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'name'            => 'required|max:255',
            'type'            => 'required|in:fixed,percentage,tiered,dynamic',
            'applies_to'      => 'required|in:all,category,product,customer,segment',
            'applies_to_id'   => 'nullable|integer',
            'adjustment_value'=> 'required|numeric',
            'adjustment_type' => 'required|in:percentage,fixed',
            'start_date'      => 'nullable|date',
            'end_date'        => 'nullable|date|after_or_equal:start_date',
            'priority'        => 'nullable|integer',
            'conditions'      => 'nullable|array',
        ]);
        $v['company_id'] = auth()->user()->company_id;
        $v['is_active']  = true;
        PricingRule::create($v);
        return redirect()->route('sales.pricing-rules.index')->with('success', 'Pricing rule created.');
    }

    public function edit(PricingRule $pricingRule)
    {
        abort_if($pricingRule->company_id !== auth()->user()->company_id, 403);
        return Inertia::render('Sales/Pricing/Form', ['rule' => $pricingRule]);
    }

    public function update(Request $request, PricingRule $pricingRule)
    {
        abort_if($pricingRule->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'name'            => 'required|max:255',
            'type'            => 'required|in:fixed,percentage,tiered,dynamic',
            'applies_to'      => 'required|in:all,category,product,customer,segment',
            'applies_to_id'   => 'nullable|integer',
            'adjustment_value'=> 'required|numeric',
            'adjustment_type' => 'required|in:percentage,fixed',
            'start_date'      => 'nullable|date',
            'end_date'        => 'nullable|date|after_or_equal:start_date',
            'priority'        => 'nullable|integer',
            'is_active'       => 'boolean',
            'conditions'      => 'nullable|array',
        ]);
        $pricingRule->update($v);
        return redirect()->route('sales.pricing-rules.index')->with('success', 'Pricing rule updated.');
    }

    public function destroy(PricingRule $pricingRule)
    {
        abort_if($pricingRule->company_id !== auth()->user()->company_id, 403);
        $pricingRule->delete();
        return redirect()->route('sales.pricing-rules.index')->with('success', 'Pricing rule deleted.');
    }
}

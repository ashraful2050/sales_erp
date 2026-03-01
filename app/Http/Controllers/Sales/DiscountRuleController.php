<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\DiscountRule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscountRuleController extends Controller
{
    public function index()
    {
        $cid   = auth()->user()->company_id;
        $rules = DiscountRule::where('company_id', $cid)->orderByDesc('created_at')->paginate(20);
        return Inertia::render('Sales/Discounts/Index', ['rules' => $rules]);
    }

    public function create()
    {
        return Inertia::render('Sales/Discounts/Form', ['rule' => null]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'name'                => 'required|max:255',
            'code'                => 'nullable|max:50',
            'type'                => 'required|in:percentage,fixed,buy_x_get_y',
            'value'               => 'required|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'min_order_amount'    => 'nullable|numeric|min:0',
            'applies_to'          => 'required|in:all,category,product,customer,segment',
            'applies_to_id'       => 'nullable|integer',
            'usage_limit'         => 'nullable|integer|min:1',
            'start_date'          => 'nullable|date',
            'end_date'            => 'nullable|date|after_or_equal:start_date',
            'requires_approval'   => 'boolean',
        ]);
        $v['company_id'] = auth()->user()->company_id;
        $v['status']     = $v['requires_approval'] ? 'pending_approval' : 'active';
        $v['is_active']  = true;
        DiscountRule::create($v);
        return redirect()->route('sales.discount-rules.index')->with('success', 'Discount rule created.');
    }

    public function edit(DiscountRule $discountRule)
    {
        abort_if($discountRule->company_id !== auth()->user()->company_id, 403);
        return Inertia::render('Sales/Discounts/Form', ['rule' => $discountRule]);
    }

    public function update(Request $request, DiscountRule $discountRule)
    {
        abort_if($discountRule->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'name'                => 'required|max:255',
            'code'                => 'nullable|max:50',
            'type'                => 'required|in:percentage,fixed,buy_x_get_y',
            'value'               => 'required|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'min_order_amount'    => 'nullable|numeric|min:0',
            'applies_to'          => 'required|in:all,category,product,customer,segment',
            'applies_to_id'       => 'nullable|integer',
            'usage_limit'         => 'nullable|integer|min:1',
            'start_date'          => 'nullable|date',
            'end_date'            => 'nullable|date|after_or_equal:start_date',
            'requires_approval'   => 'boolean',
            'is_active'           => 'boolean',
        ]);
        $discountRule->update($v);
        return redirect()->route('sales.discount-rules.index')->with('success', 'Discount rule updated.');
    }

    public function approve(DiscountRule $discountRule)
    {
        abort_if($discountRule->company_id !== auth()->user()->company_id, 403);
        $discountRule->update(['status' => 'active', 'approved_by' => auth()->id()]);
        return back()->with('success', 'Discount rule approved.');
    }

    public function destroy(DiscountRule $discountRule)
    {
        abort_if($discountRule->company_id !== auth()->user()->company_id, 403);
        $discountRule->delete();
        return redirect()->route('sales.discount-rules.index')->with('success', 'Discount rule deleted.');
    }
}

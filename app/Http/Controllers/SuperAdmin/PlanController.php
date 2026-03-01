<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::withCount('subscriptions')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('SuperAdmin/Plans/Index', ['plans' => $plans]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'name'                      => 'required|string|max:100',
            'description'               => 'nullable|string|max:500',
            'price_monthly'             => 'required|numeric|min:0',
            'price_yearly'              => 'required|numeric|min:0',
            'max_users'                 => 'required|integer|min:1',
            'max_invoices_per_month'    => 'required|integer|min:1',
            'max_products'              => 'required|integer|min:1',
            'max_employees'             => 'required|integer|min:1',
            'trial_days'                => 'required|integer|min:0',
            'features'                  => 'nullable|array',
            'is_active'                 => 'boolean',
            'sort_order'                => 'integer',
        ]);

        $v['slug'] = Str::slug($v['name']) . '-' . Str::random(4);
        Plan::create($v);

        return redirect()->route('superadmin.plans.index')->with('success', 'Plan created.');
    }

    public function update(Request $request, Plan $plan)
    {
        $v = $request->validate([
            'name'                      => 'required|string|max:100',
            'description'               => 'nullable|string|max:500',
            'price_monthly'             => 'required|numeric|min:0',
            'price_yearly'              => 'required|numeric|min:0',
            'max_users'                 => 'required|integer|min:1',
            'max_invoices_per_month'    => 'required|integer|min:1',
            'max_products'              => 'required|integer|min:1',
            'max_employees'             => 'required|integer|min:1',
            'trial_days'                => 'required|integer|min:0',
            'features'                  => 'nullable|array',
            'is_active'                 => 'boolean',
            'sort_order'                => 'integer',
        ]);

        $plan->update($v);
        return back()->with('success', 'Plan updated.');
    }

    public function destroy(Plan $plan)
    {
        if ($plan->subscriptions()->whereIn('status', ['active', 'trial'])->exists()) {
            return back()->with('error', 'Cannot delete a plan with active subscriptions.');
        }
        $plan->delete();
        return redirect()->route('superadmin.plans.index')->with('success', 'Plan deleted.');
    }
}

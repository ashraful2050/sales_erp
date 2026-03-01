<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\PaymentMethod;
use App\Models\Plan;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\User;
use App\Support\Permissions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index(Request $request)
    {
        $query = Company::with(['primaryUser', 'activeSubscription.plan', 'subscriptions'])
            ->withCount('users');

        if ($request->filled('search')) {
            $q = '%' . $request->search . '%';
            $query->where(fn($qb) => $qb->where('name', 'like', $q)->orWhere('email', 'like', $q)->orWhere('slug', 'like', $q));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $tenants = $query->orderByDesc('created_at')->paginate(20)->withQueryString();

        return Inertia::render('SuperAdmin/Tenants/Index', [
            'tenants' => $tenants,
            'filters' => $request->only('search', 'status'),
            'plans'   => Plan::where('is_active', true)->get(['id', 'name', 'slug']),
        ]);
    }

    public function show(Company $company)
    {
        $company->load([
            'primaryUser',
            'users' => fn($q) => $q->orderBy('name'),
            'subscriptions.plan',
            'activeSubscription.plan',
        ]);

        $stats = [
            'invoices'  => $company->invoices()->count(),
            'customers' => $company->customers()->count(),
            'products'  => $company->products()->count(),
            'employees' => $company->employees()->count(),
            'total_revenue' => $company->invoices()
                ->where('type', 'sales')
                ->whereIn('status', ['paid', 'partial'])
                ->sum('total_amount'),
        ];

        return Inertia::render('SuperAdmin/Tenants/Show', [
            'tenant'  => $company,
            'stats'   => $stats,
            'plans'   => Plan::where('is_active', true)->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('SuperAdmin/Tenants/Form', [
            'tenant' => null,
            'plans'  => Plan::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'company_name'   => 'required|string|max:255',
            'company_email'  => 'required|email|max:255',
            'company_phone'  => 'nullable|string|max:30',
            'company_country'=> 'nullable|string|max:100',
            'admin_name'     => 'required|string|max:255',
            'admin_email'    => 'required|email|unique:users,email',
            'admin_password' => 'required|min:8',
            'plan_id'        => 'required|exists:plans,id',
            'billing_cycle'  => 'required|in:monthly,yearly,trial,lifetime',
        ]);

        DB::transaction(function () use ($v, $request) {
            $plan = Plan::findOrFail($v['plan_id']);

            // Create company
            $company = Company::create([
                'name'          => $v['company_name'],
                'email'         => $v['company_email'],
                'phone'         => $v['company_phone'] ?? null,
                'country'       => $v['company_country'] ?? 'Bangladesh',
                'status'        => 'active',
                'currency_code' => 'BDT',
            ]);

            // Create admin user for the company
            $user = User::create([
                'name'          => $v['admin_name'],
                'email'         => $v['admin_email'],
                'password'      => Hash::make($v['admin_password']),
                'company_id'    => $company->id,
                'role'          => 'admin',
                'is_active'     => true,
                'is_superadmin' => false,
            ]);

            $company->update(['primary_user_id' => $user->id]);

            // Seed default payment methods
            PaymentMethod::seedDefaults($company->id);
            \App\Models\ExpenseCategory::seedDefaults($company->id);
            \App\Models\Unit::seedDefaults($company->id);

            // Create default admin Role with full permissions
            Role::create([
                'company_id'  => $company->id,
                'name'        => 'admin',
                'guard_name'  => 'web',
                'is_system'   => true,
                'permissions' => Permissions::adminDefaults(),
            ]);

            // Create subscription
            $trialEnd = now()->addDays($plan->trial_days);
            $status   = $v['billing_cycle'] === 'trial' ? 'trial' : 'active';

            Subscription::create([
                'company_id'    => $company->id,
                'plan_id'       => $plan->id,
                'billing_cycle' => $v['billing_cycle'],
                'status'        => $status,
                'starts_at'     => now(),
                'trial_ends_at' => $v['billing_cycle'] === 'trial' ? $trialEnd : null,
                'expires_at'    => $v['billing_cycle'] === 'trial' ? null :
                    ($v['billing_cycle'] === 'monthly' ? now()->addMonth() :
                    ($v['billing_cycle'] === 'yearly'  ? now()->addYear()  : null)),
            ]);
        });

        return redirect()->route('superadmin.tenants.index')->with('success', 'Tenant created successfully.');
    }

    public function edit(Company $company)
    {
        $company->load(['activeSubscription.plan']);
        return Inertia::render('SuperAdmin/Tenants/Form', [
            'tenant' => $company,
            'plans'  => Plan::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $v = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'nullable|email|max:255',
            'phone'      => 'nullable|string|max:30',
            'country'    => 'nullable|string|max:100',
            'status'     => 'required|in:active,suspended,pending,cancelled',
            'suspension_reason' => 'nullable|string|max:500',
        ]);

        $company->update($v);

        return back()->with('success', 'Tenant updated successfully.');
    }

    public function suspend(Request $request, Company $company)
    {
        $request->validate(['reason' => 'nullable|string|max:500']);
        $company->update([
            'status'            => 'suspended',
            'suspension_reason' => $request->reason,
        ]);
        return back()->with('success', 'Tenant suspended.');
    }

    public function activate(Company $company)
    {
        $company->update(['status' => 'active', 'suspension_reason' => null]);
        return back()->with('success', 'Tenant activated.');
    }

    public function destroy(Company $company)
    {
        // Soft delete or flag as cancelled
        $company->update(['status' => 'cancelled']);
        return redirect()->route('superadmin.tenants.index')->with('success', 'Tenant cancelled.');
    }

    /**
     * Assign / change subscription plan for a tenant.
     */
    public function assignPlan(Request $request, Company $company)
    {
        $v = $request->validate([
            'plan_id'       => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly,trial,lifetime',
            'expires_at'    => 'nullable|date',
        ]);

        $plan   = Plan::findOrFail($v['plan_id']);
        $status = $v['billing_cycle'] === 'trial' ? 'trial' : 'active';

        // Cancel previous active subscriptions
        $company->subscriptions()->whereIn('status', ['active', 'trial'])->update(['status' => 'cancelled']);

        Subscription::create([
            'company_id'    => $company->id,
            'plan_id'       => $plan->id,
            'billing_cycle' => $v['billing_cycle'],
            'status'        => $status,
            'starts_at'     => now(),
            'trial_ends_at' => $v['billing_cycle'] === 'trial' ? now()->addDays($plan->trial_days) : null,
            'expires_at'    => $v['expires_at'] ?? ($v['billing_cycle'] === 'monthly' ? now()->addMonth() :
                               ($v['billing_cycle'] === 'yearly' ? now()->addYear() : null)),
        ]);

        return back()->with('success', 'Plan assigned successfully.');
    }

    /**
     * Impersonate a tenant admin user to view their environment.
     */
    public function impersonate(Company $company)
    {
        $adminUser = $company->users()->where('role', 'admin')->first()
            ?? $company->users()->first();

        if (!$adminUser) {
            return back()->with('error', 'No user found for this tenant.');
        }

        session(['impersonated_user_id' => $adminUser->id, 'original_user_id' => auth()->id()]);
        auth()->login($adminUser);

        return redirect()->route('dashboard')->with('success', 'Now viewing as ' . $adminUser->name);
    }

    /**
     * Stop impersonating and return to super admin.
     */
    public function stopImpersonating()
    {
        $originalId = session('original_user_id');
        if ($originalId) {
            $originalUser = User::find($originalId);
            if ($originalUser) {
                auth()->login($originalUser);
                session()->forget(['impersonated_user_id', 'original_user_id']);
                return redirect()->route('superadmin.dashboard')->with('success', 'Returned to super admin.');
            }
        }
        return redirect()->route('login');
    }

    /**
     * Set the app layout for a tenant company.
     */
    public function setLayout(Request $request, Company $company)
    {
        $request->validate([
            'layout' => 'required|in:dark,light,tally',
        ]);

        $settings = $company->settings ?? [];
        $settings['layout'] = $request->layout;
        $company->update(['settings' => $settings]);

        return back()->with('success', "Layout changed to \"{$request->layout}\" for {$company->name}.");
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\PaymentMethod;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Affiliate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class TenantRegistrationController extends Controller
{
    /**
     * Show the tenant registration page with plan selection.
     */
    public function showForm(Request $request)
    {
        $plans = Plan::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $selectedPlan = null;
        if ($request->filled('plan')) {
            $selectedPlan = Plan::where('slug', $request->plan)->first();
        }

        return Inertia::render('Auth/TenantRegister', [
            'plans'         => $plans,
            'selectedPlan'  => $selectedPlan,
            'affiliateCode' => $request->query('ref'),
        ]);
    }

    /**
     * Process tenant registration: create company + admin user + start trial.
     */
    public function register(Request $request)
    {
        $v = $request->validate([
            'company_name'   => 'required|string|max:255',
            'company_email'  => 'required|email|max:255',
            'company_phone'  => 'nullable|string|max:30',
            'company_country'=> 'nullable|string|max:100',
            'admin_name'     => 'required|string|max:255',
            'admin_email'    => 'required|email|unique:users,email',
            'password'       => 'required|min:8|confirmed',
            'plan_id'        => 'required|exists:plans,id',
            'agreed'         => 'required|accepted',
            'affiliate_code' => 'nullable|string|exists:affiliates,affiliate_code',
        ]);

        $user = DB::transaction(function () use ($v) {
            $plan = Plan::findOrFail($v['plan_id']);

            // Resolve affiliate (if referred)
            $affiliate = !empty($v['affiliate_code'])
                ? Affiliate::where('affiliate_code', $v['affiliate_code'])->where('status', 'active')->first()
                : null;

            // Create company
            $company = Company::create([
                'name'          => $v['company_name'],
                'email'         => $v['company_email'],
                'phone'         => $v['company_phone'] ?? null,
                'country'       => $v['company_country'] ?? 'Bangladesh',
                'status'        => 'active',
                'currency_code' => 'BDT',
                'language'      => 'en',
                'timezone'      => 'Asia/Dhaka',
            ]);

            // Create admin user
            $user = User::create([
                'name'          => $v['admin_name'],
                'email'         => $v['admin_email'],
                'password'      => Hash::make($v['password']),
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

            // Start trial subscription
            $subscription = Subscription::create([
                'company_id'    => $company->id,
                'plan_id'       => $plan->id,
                'billing_cycle' => 'trial',
                'status'        => 'trial',
                'starts_at'     => now(),
                'trial_ends_at' => now()->addDays($plan->trial_days ?: 14),
            ]);

            // Record affiliate conversion (trial = $0, commission tracked on upgrade)
            if ($affiliate) {
                $affiliate->recordConversion(
                    $company->id,
                    $subscription->id,
                    $plan->id,
                    'trial',
                    0
                );
            }

            return $user;
        });

        Auth::login($user);

        return redirect()->route('dashboard')->with('success',
            'Welcome! Your ' . ($user->company->activeSubscription?->plan->name ?? '') .
            ' trial has started. Enjoy your free trial!'
        );
    }
}

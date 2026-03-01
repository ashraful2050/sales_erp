<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Mail\TenantApproved;
use App\Models\Company;
use App\Models\ContactRequest;
use App\Models\PaymentMethod;
use App\Models\Plan;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\User;
use App\Support\MailLogger;
use App\Support\Permissions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ContactRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactRequest::with('plan')
            ->orderByRaw("CASE status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END")
            ->orderByDesc('created_at');

        if ($request->filled('search')) {
            $q = '%' . $request->search . '%';
            $query->where(fn($qb) => $qb
                ->where('name',         'like', $q)
                ->orWhere('email',      'like', $q)
                ->orWhere('company_name','like', $q)
            );
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $contacts = $query->paginate(20)->withQueryString();

        $counts = [
            'pending'  => ContactRequest::where('status', 'pending')->count(),
            'approved' => ContactRequest::where('status', 'approved')->count(),
            'rejected' => ContactRequest::where('status', 'rejected')->count(),
        ];

        return Inertia::render('SuperAdmin/ContactRequests/Index', [
            'contacts' => $contacts,
            'counts'   => $counts,
            'filters'  => $request->only('search', 'status'),
            'plans'    => Plan::where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug', 'price_monthly', 'price_yearly']),
        ]);
    }

    public function approve(Request $request, ContactRequest $contactRequest)
    {
        if ($contactRequest->status !== 'pending') {
            return back()->with('error', 'This request has already been processed.');
        }

        $validated = $request->validate([
            'plan_id'       => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly,trial,lifetime',
            'admin_password'=> 'nullable|string|min:8',
            'admin_notes'   => 'nullable|string|max:1000',
        ]);

        $tempPassword = $validated['admin_password'] ?: Str::password(12, true, true, false);
        $plan         = Plan::findOrFail($validated['plan_id']);

        // Keep $company outside so we can use it after the transaction
        $company = null;

        DB::transaction(function () use ($contactRequest, $validated, $plan, $tempPassword, &$company) {
            // Create company
            $company = Company::create([
                'name'          => $contactRequest->company_name,
                'email'         => $contactRequest->email,
                'phone'         => $contactRequest->phone ?? null,
                'status'        => 'active',
                'currency_code' => 'BDT',
            ]);

            // Create admin user
            $user = User::create([
                'name'          => $contactRequest->name,
                'email'         => $contactRequest->email,
                'password'      => Hash::make($tempPassword),
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
            $status = $validated['billing_cycle'] === 'trial' ? 'trial' : 'active';
            Subscription::create([
                'company_id'    => $company->id,
                'plan_id'       => $plan->id,
                'billing_cycle' => $validated['billing_cycle'],
                'status'        => $status,
                'starts_at'     => now(),
                'trial_ends_at' => $validated['billing_cycle'] === 'trial' ? now()->addDays($plan->trial_days) : null,
                'expires_at'    => match($validated['billing_cycle']) {
                    'monthly'  => now()->addMonth(),
                    'yearly'   => now()->addYear(),
                    default    => null,
                },
            ]);

            // Update contact request
            $contactRequest->update([
                'status'             => 'approved',
                'plan_id'            => $plan->id,
                'admin_notes'        => $validated['admin_notes'] ?? null,
                'admin_password_set' => $tempPassword,
                'approved_at'        => now(),
            ]);
        });

        // Send email AFTER transaction commits — failures won't rollback tenant creation
        MailLogger::send(
            $contactRequest->email,
            new TenantApproved($contactRequest, $company, $tempPassword),
            ['company_id' => $company->id, 'contact_request_id' => $contactRequest->id],
            $contactRequest
        );

        return redirect()->route('superadmin.contact-requests.index')
            ->with('success', "Tenant account created for {$contactRequest->company_name}. Login credentials have been sent to {$contactRequest->email}.");
    }

    public function reject(Request $request, ContactRequest $contactRequest)
    {
        if ($contactRequest->status !== 'pending') {
            return back()->with('error', 'This request has already been processed.');
        }

        $validated = $request->validate([
            'admin_notes' => 'required|string|max:1000',
        ]);

        $contactRequest->update([
            'status'      => 'rejected',
            'admin_notes' => $validated['admin_notes'],
            'rejected_at' => now(),
        ]);

        return redirect()->route('superadmin.contact-requests.index')
            ->with('success', "Contact request from {$contactRequest->name} has been rejected.");
    }
}

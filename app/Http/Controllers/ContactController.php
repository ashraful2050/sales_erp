<?php

namespace App\Http\Controllers;

use App\Mail\ContactRequestReceived;
use App\Models\ContactRequest;
use App\Models\Plan;
use App\Models\User;
use App\Support\MailLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function showForm()
    {
        $plans = Plan::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'price_monthly', 'price_yearly', 'max_users', 'trial_days']);

        return Inertia::render('ContactUs', [
            'plans' => $plans,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|max:255',
            'phone'        => 'nullable|string|max:30',
            'company_name' => 'required|string|max:255',
            'company_size' => 'nullable|string|max:100',
            'industry'     => 'nullable|string|max:100',
            'plan_interest'=> 'nullable|string|max:100',
            'message'      => 'nullable|string|max:2000',
        ]);

        $contact = ContactRequest::create([
            ...$validated,
            'status'     => 'pending',
            'ip_address' => $request->ip(),
        ]);

        // Notify superadmin(s)
        $superadmin = User::where('is_superadmin', true)->first();
        if ($superadmin) {
            MailLogger::send(
                $superadmin->email,
                new ContactRequestReceived($contact),
                ['contact_request_id' => $contact->id],
                $contact
            );
        }

        return back()->with('success', 'Thank you for your interest! We have received your request and will get back to you shortly.');
    }
}

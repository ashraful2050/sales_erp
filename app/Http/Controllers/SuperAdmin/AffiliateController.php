<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Affiliate;
use App\Models\AffiliateConversion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AffiliateController extends Controller
{
    public function index(Request $request)
    {
        $affiliates = Affiliate::withCount('conversions')
            ->orderByDesc('created_at')
            ->get();

        $stats = [
            'total'        => Affiliate::count(),
            'active'       => Affiliate::where('status', 'active')->count(),
            'total_earned' => (float) Affiliate::sum('total_earned'),
            'pending'      => (float) Affiliate::sum('balance'),
        ];

        return Inertia::render('SuperAdmin/Affiliates/Index', [
            'affiliates' => $affiliates,
            'stats'      => $stats,
        ]);
    }

    public function show(Affiliate $affiliate)
    {
        $conversions = AffiliateConversion::with(['company:id,name', 'plan:id,name'])
            ->where('affiliate_id', $affiliate->id)
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('SuperAdmin/Affiliates/Show', [
            'affiliate'   => $affiliate,
            'conversions' => $conversions,
        ]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'name'            => 'required|string|max:100',
            'email'           => 'required|email|unique:affiliates,email',
            'phone'           => 'nullable|string|max:30',
            'commission_rate' => 'required|numeric|min:0|max:100',
            'status'          => 'required|in:active,inactive',
            'notes'           => 'nullable|string|max:500',
        ]);

        $v['affiliate_code'] = Affiliate::generateCode();

        Affiliate::create($v);

        return redirect()->route('superadmin.affiliates.index')
            ->with('success', 'Affiliate created successfully.');
    }

    public function update(Request $request, Affiliate $affiliate)
    {
        $v = $request->validate([
            'name'            => 'required|string|max:100',
            'email'           => 'required|email|unique:affiliates,email,' . $affiliate->id,
            'phone'           => 'nullable|string|max:30',
            'commission_rate' => 'required|numeric|min:0|max:100',
            'status'          => 'required|in:active,inactive',
            'notes'           => 'nullable|string|max:500',
        ]);

        $affiliate->update($v);

        return back()->with('success', 'Affiliate updated successfully.');
    }

    public function destroy(Affiliate $affiliate)
    {
        if ($affiliate->conversions()->exists()) {
            return back()->with('error', 'Cannot delete an affiliate with conversion records.');
        }

        $affiliate->delete();

        return redirect()->route('superadmin.affiliates.index')
            ->with('success', 'Affiliate deleted.');
    }

    /**
     * Mark all pending conversions for an affiliate as paid and reset balance.
     */
    public function markPaid(Affiliate $affiliate)
    {
        $affiliate->conversions()
            ->where('status', 'pending')
            ->update(['status' => 'paid', 'paid_at' => now()]);

        $affiliate->update(['balance' => 0]);

        return back()->with('success', 'All pending commissions marked as paid.');
    }

    /**
     * Regenerate affiliate code.
     */
    public function regenerateCode(Affiliate $affiliate)
    {
        $affiliate->update(['affiliate_code' => Affiliate::generateCode()]);

        return back()->with('success', 'Affiliate code regenerated.');
    }
}

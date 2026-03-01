<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ensures the authenticated user belongs to an active (non-suspended) company.
 * SuperAdmins bypass this check (they have no company context).
 */
class EnsureTenantActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        // Super admins have no company context — always pass through
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        $company = $user->company;

        if (!$company) {
            auth()->logout();
            return redirect()->route('login')->with('error', 'Your account is not linked to a company.');
        }

        if ($company->status === 'suspended') {
            auth()->logout();
            return redirect()->route('login')->with('error', 'Your company account has been suspended. Please contact support.');
        }

        if ($company->status === 'cancelled') {
            auth()->logout();
            return redirect()->route('login')->with('error', 'Your company account has been cancelled.');
        }

        // ── Subscription / Plan enforcement ─────────────────────────────────
        $sub = $company->activeSubscription;

        if (!$sub) {
            auth()->logout();
            return redirect()->route('login')
                ->with('error', 'Your account does not have an active subscription. Please contact support.');
        }

        if (!$sub->isActive()) {
            // Mark subscription as expired so it no longer clogs the active query
            $sub->updateQuietly(['status' => 'expired']);
            auth()->logout();
            return redirect()->route('login')
                ->with('error', 'Your subscription has expired. Please contact support to renew.');
        }

        // Update last active timestamp (every 15 min to avoid DB hammering)
        if (!$company->last_active_at || $company->last_active_at->diffInMinutes(now()) > 15) {
            $company->updateQuietly(['last_active_at' => now()]);
        }

        return $next($request);
    }
}

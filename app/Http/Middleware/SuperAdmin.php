<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Only allows globally flagged superadmins (is_superadmin = true) to proceed.
 * Used to protect the /superadmin/* route group.
 */
class SuperAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->isSuperAdmin()) {
            if ($request->header('X-Inertia') || $request->wantsJson()) {
                abort(403, 'Super admin access required.');
            }
            return redirect()->route('dashboard')->with('error', 'Access denied.');
        }

        return $next($request);
    }
}

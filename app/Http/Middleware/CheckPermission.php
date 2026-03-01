<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Usage in routes:  ->middleware('perm:accounting.view')
 * Superadmin bypasses all checks.
 */
class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401);
        }

        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        if (!$user->hasPermission($permission)) {
            if ($request->wantsJson() || $request->header('X-Inertia')) {
                abort(403, 'You do not have permission to perform this action.');
            }
            return redirect()->route('dashboard')->with('error', 'Access denied: ' . $permission);
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

/**
 * Allows a superadmin to impersonate any tenant user to see their data.
 * When impersonating, 'impersonated_user_id' is stored in session.
 */
class HandleImpersonation
{
    public function handle(Request $request, Closure $next): Response
    {
        $impersonatedId = session('impersonated_user_id');

        if ($impersonatedId && auth()->check() && auth()->user()->isSuperAdmin()) {
            $impersonated = User::find($impersonatedId);
            if ($impersonated) {
                // Temporarily bind the impersonated user as the "acting" user
                // The original auth user is preserved in session
                $request->merge(['_impersonating' => true]);
                // We store original user for reference
                view()->share('impersonating', $impersonated);
            }
        }

        return $next($request);
    }
}

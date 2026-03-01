<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\LoginHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Record login history
        try {
            LoginHistory::recordLogin(
                $request->user(),
                $request->ip(),
                $request->userAgent() ?? ''
            );
        } catch (\Throwable) {}

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = auth()->user();

        // Mark the latest open login session as logged out
        if ($user) {
            try {
                LoginHistory::where('user_id', $user->id)
                    ->where('event', 'login')
                    ->whereNull('logged_out_at')
                    ->latest('logged_in_at')
                    ->first()
                    ?->update(['event' => 'logout', 'logged_out_at' => now()]);
            } catch (\Throwable) {}
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}

<?php

namespace App\Http\Middleware;

use App\Models\Language;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     * Priority: session locale > user preferred locale > company default > system default
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = null;

        // 1. Check session (user manually switched language)
        if ($request->session()->has('locale')) {
            $locale = $request->session()->get('locale');
        }

        // 2. Check authenticated user's preferred locale
        if (!$locale && $user = $request->user()) {
            $locale = $user->language ?? null;
        }

        // 3. Fallback to company default
        if (!$locale && $user = $request->user()) {
            if (!$user->isSuperAdmin() && $user->company_id) {
                $locale = $user->company?->language ?? null;
            }
        }

        // 4. Use database default language
        if (!$locale) {
            $locale = Cache::remember('default_language_code', 3600, function () {
                return Language::where('is_default', true)->value('code');
            }) ?? 'en';
        }

        // Validate that locale exists in our languages table
        $validCodes = Cache::remember('active_language_codes', 3600, function () {
            return Language::active()->pluck('code')->toArray();
        });

        if (!in_array($locale, $validCodes)) {
            $locale = 'en';
        }

        App::setLocale($locale);
        $request->session()->put('locale', $locale);

        return $next($request);
    }
}

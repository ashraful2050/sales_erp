<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\ContactRequest;
use App\Models\Language;
use App\Models\Translation;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        // Build subscription / company context for tenant users
        $subscriptionInfo = null;
        $company          = null;

        if ($user && !$user->isSuperAdmin() && $user->company_id) {
            $company = $user->company;
            if ($company) {
                $activeSub = $company->activeSubscription;
                $subscriptionInfo = $activeSub ? [
                    'status'         => $activeSub->status,
                    'plan_name'      => $activeSub->plan?->name,
                    'plan_slug'      => $activeSub->plan?->slug,
                    'billing_cycle'  => $activeSub->billing_cycle,
                    'expires_at'     => $activeSub->expires_at?->toDateString(),
                    'trial_ends_at'  => $activeSub->trial_ends_at?->toDateString(),
                    'days_left'      => $activeSub->daysLeft(),
                    'is_trial'       => $activeSub->status === 'trial',
                    'features'       => $activeSub->plan?->features ?? [],
                    'limits'         => [
                        'max_users'              => $activeSub->plan?->max_users,
                        'max_invoices_per_month' => $activeSub->plan?->max_invoices_per_month,
                        'max_products'           => $activeSub->plan?->max_products,
                        'max_employees'          => $activeSub->plan?->max_employees,
                    ],
                ] : null;
            }
        }

        // Check impersonation
        $isImpersonating = session()->has('impersonated_user_id') && $user?->isSuperAdmin() === false
            && session()->has('original_user_id');

        return [
            ...parent::share($request),
            'auth' => [
                'user'    => $user,
                'company' => $company ? [
                    'id'           => $company->id,
                    'name'         => $company->name,
                    'slug'         => $company->slug,
                    'status'       => $company->status,
                    'logo'         => $company->logo,
                    'currency_code'=> $company->currency_code,
                    'language'     => $company->language,
                    'timezone'     => $company->timezone,
                    'date_format'  => $company->date_format,
                ] : null,
            ],
            'permissions'       => $user ? $user->allPermissions() : [],
            'isSuperAdmin'             => $user?->isSuperAdmin() ?? false,
            'isAdmin'                  => ($user?->isAdmin() && !$user?->isSuperAdmin()) ?? false,
            'appLayout'                => ($company ? ($company->settings['layout'] ?? 'odoo') : 'odoo'),
            'subscription'             => $subscriptionInfo,
            'isImpersonating'          => $isImpersonating,
            'pendingContactRequests'   => ($user?->isSuperAdmin() ? ContactRequest::where('status', 'pending')->count() : 0),
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
            ],
            'locale'       => App::getLocale(),
            'languages'    => Cache::remember('active_languages_list', 3600, fn() =>
                Language::active()->orderBy('sort_order')->orderBy('name')
                    ->get(['id', 'name', 'native_name', 'code', 'flag', 'is_rtl', 'is_default'])
                    ->toArray()
            ),
            'translations' => Cache::remember('translations_' . App::getLocale(), 3600, function () {
                $locale = App::getLocale();
                $rows = Translation::where('language_code', $locale)->get();
                if ($rows->isEmpty() && $locale !== 'en') {
                    $rows = Translation::where('language_code', 'en')->get();
                }
                return $rows->mapWithKeys(fn($t) => ["{$t->group}.{$t->key}" => $t->value])->toArray();
            }),
        ];
    }
}


<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Invoice;
use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalTenants       = Company::count();
        $activeTenants      = Company::where('status', 'active')->count();
        $suspendedTenants   = Company::where('status', 'suspended')->count();
        $totalUsers         = User::where('is_superadmin', false)->count();

        $activeSubscriptions = Subscription::whereIn('status', ['active', 'trial'])->count();
        $expiredSubscriptions = Subscription::where('status', 'expired')->count();

        $mrr = Subscription::where('status', 'active')
            ->where('billing_cycle', 'monthly')
            ->join('plans', 'subscriptions.plan_id', '=', 'plans.id')
            ->sum('plans.price_monthly');

        $arr = Subscription::where('status', 'active')
            ->where('billing_cycle', 'yearly')
            ->join('plans', 'subscriptions.plan_id', '=', 'plans.id')
            ->sum('plans.price_yearly');

        // Recent tenants
        $recentTenants = Company::with(['primaryUser', 'activeSubscription.plan'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get(['id', 'name', 'slug', 'email', 'status', 'created_at', 'primary_user_id', 'last_active_at']);

        // Tenants expiring soon (next 7 days)
        $expiringSoon = Subscription::with('company:id,name,slug,email')
            ->whereIn('status', ['active', 'trial'])
            ->whereNotNull('expires_at')
            ->whereBetween('expires_at', [now(), now()->addDays(7)])
            ->orderBy('expires_at')
            ->get();

        // Monthly signups (last 12 months)
        $monthlySignups = Company::where('created_at', '>=', now()->subMonths(12)->startOfMonth())
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')->orderBy('month')
            ->get()
            ->map(fn($r) => [
                'month' => date('M Y', mktime(0, 0, 0, $r->month, 1, $r->year)),
                'signups' => $r->total,
            ]);

        return Inertia::render('SuperAdmin/Dashboard', compact(
            'totalTenants', 'activeTenants', 'suspendedTenants', 'totalUsers',
            'activeSubscriptions', 'expiredSubscriptions',
            'mrr', 'arr',
            'recentTenants', 'expiringSoon', 'monthlySignups'
        ));
    }
}

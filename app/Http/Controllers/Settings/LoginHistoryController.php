<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\LoginHistory;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoginHistoryController extends Controller
{
    private function superAdminOnly(): void
    {
        abort_unless(auth()->user()->isSuperAdmin(), 403, 'Superadmin only.');
    }

    public function index(Request $request)
    {
        $this->superAdminOnly();
        $cid = auth()->user()->company_id;

        $q = LoginHistory::where('company_id', $cid);

        if ($s = $request->search) {
            $q->where(fn($x) =>
                $x->where('user_name', 'like', "%$s%")
                  ->orWhere('user_email', 'like', "%$s%")
                  ->orWhere('ip_address', 'like', "%$s%")
            );
        }
        if ($e = $request->event)  $q->where('event', $e);
        if ($u = $request->user_id) $q->where('user_id', $u);
        if ($from = $request->date_from) $q->whereDate('created_at', '>=', $from);
        if ($to   = $request->date_to)   $q->whereDate('created_at', '<=', $to);

        $histories = $q->orderByDesc('created_at')->paginate(50)->withQueryString();

        $stats = [
            'total'     => LoginHistory::where('company_id', $cid)->count(),
            'today'     => LoginHistory::where('company_id', $cid)->whereDate('created_at', today())->count(),
            'logins'    => LoginHistory::where('company_id', $cid)->where('event', 'login')->count(),
            'logouts'   => LoginHistory::where('company_id', $cid)->where('event', 'logout')->count(),
            'failed'    => LoginHistory::where('company_id', $cid)->where('event', 'failed')->count(),
            'unique_ips'=> LoginHistory::where('company_id', $cid)->whereNotNull('ip_address')->distinct('ip_address')->count(),
        ];

        $users = User::where('company_id', $cid)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('Settings/LoginHistory', [
            'histories' => $histories,
            'stats'     => $stats,
            'users'     => $users,
            'filters'   => $request->only(['search', 'event', 'user_id', 'date_from', 'date_to']),
        ]);
    }
}

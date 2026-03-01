<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    private function superAdminOnly(): void
    {
        abort_unless(auth()->user()->isSuperAdmin(), 403, 'Superadmin only.');
    }

    public function index(Request $request)
    {
        $this->superAdminOnly();
        $cid = auth()->user()->company_id;

        $q = AuditLog::where('company_id', $cid);

        if ($s = $request->search) {
            $q->where(fn($x) =>
                $x->where('user_name', 'like', "%$s%")
                  ->orWhere('user_email', 'like', "%$s%")
                  ->orWhere('auditable_type', 'like', "%$s%")
                  ->orWhere('auditable_label', 'like', "%$s%")
            );
        }
        if ($e = $request->event)  $q->where('event', $e);
        if ($m = $request->module) $q->where('module', $m);
        if ($u = $request->user_id) $q->where('user_id', $u);
        if ($from = $request->date_from) $q->whereDate('created_at', '>=', $from);
        if ($to   = $request->date_to)   $q->whereDate('created_at', '<=', $to);

        $logs = $q->orderByDesc('created_at')->paginate(50)->withQueryString();

        // Stats
        $stats = [
            'total'   => AuditLog::where('company_id', $cid)->count(),
            'today'   => AuditLog::where('company_id', $cid)->whereDate('created_at', today())->count(),
            'creates' => AuditLog::where('company_id', $cid)->where('event', 'created')->count(),
            'updates' => AuditLog::where('company_id', $cid)->where('event', 'updated')->count(),
            'deletes' => AuditLog::where('company_id', $cid)->where('event', 'deleted')->count(),
        ];

        // Distinct modules for filter
        $modules = AuditLog::where('company_id', $cid)
            ->whereNotNull('module')
            ->distinct()->pluck('module')->sort()->values();

        // Top users
        $topUsers = AuditLog::where('company_id', $cid)
            ->selectRaw('user_id, user_name, user_email, count(*) as actions')
            ->groupBy('user_id', 'user_name', 'user_email')
            ->orderByDesc('actions')
            ->limit(10)
            ->get();

        return Inertia::render('Settings/AuditLogs', [
            'logs'     => $logs,
            'stats'    => $stats,
            'modules'  => $modules,
            'topUsers' => $topUsers,
            'filters'  => $request->only(['search', 'event', 'module', 'user_id', 'date_from', 'date_to']),
        ]);
    }

    public function show(AuditLog $auditLog)
    {
        $this->superAdminOnly();
        abort_if($auditLog->company_id !== auth()->user()->company_id, 403);
        return response()->json($auditLog);
    }
}

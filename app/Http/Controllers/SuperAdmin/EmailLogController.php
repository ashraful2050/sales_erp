<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\EmailLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmailLogController extends Controller
{
    public function index(Request $request)
    {
        $query = EmailLog::orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $q = '%' . $request->search . '%';
            $query->where(fn($qb) => $qb
                ->where('subject',         'like', $q)
                ->orWhere('mailable_class','like', $q)
                ->orWhereJsonContains('to', ['address' => $request->search])
            );
        }

        if ($request->filled('mailable')) {
            $query->where('mailable_class', 'like', '%' . $request->mailable . '%');
        }

        $logs = $query->paginate(25)->withQueryString();

        $counts = [
            'total'  => EmailLog::count(),
            'sent'   => EmailLog::where('status', 'sent')->count(),
            'failed' => EmailLog::where('status', 'failed')->count(),
        ];

        return Inertia::render('SuperAdmin/EmailLogs/Index', [
            'logs'    => $logs,
            'counts'  => $counts,
            'filters' => $request->only('search', 'status', 'mailable'),
        ]);
    }
}

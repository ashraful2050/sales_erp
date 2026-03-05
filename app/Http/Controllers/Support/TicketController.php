<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\SupportTicket;
use App\Models\TicketReply;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $cid     = auth()->user()->company_id;
        $tickets = SupportTicket::where('company_id', $cid)
            ->with(['customer:id,name', 'assignedTo:id,name'])
            ->when($request->status,   fn($q, $s)  => $q->where('status', $s))
            ->when($request->priority, fn($q, $p)  => $q->where('priority', $p))
            ->when($request->channel,  fn($q, $c)  => $q->where('channel', $c))
            ->when($request->search,   fn($q, $s)  => $q->where('subject', 'like', "%{$s}%")
                ->orWhere('ticket_number', 'like', "%{$s}%"))
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        $stats = [
            'open'        => SupportTicket::where('company_id', $cid)->where('status', 'open')->count(),
            'in_progress' => SupportTicket::where('company_id', $cid)->where('status', 'in_progress')->count(),
            'waiting'     => SupportTicket::where('company_id', $cid)->where('status', 'waiting')->count(),
            'resolved'    => SupportTicket::where('company_id', $cid)->where('status', 'resolved')->count(),
            'avg_rating'  => round((float) SupportTicket::where('company_id', $cid)->whereNotNull('satisfaction_rating')->avg('satisfaction_rating'), 1),
        ];

        $users = \App\Models\User::where('company_id', $cid)->select('id', 'name')->get();

        return Inertia::render('Support/Tickets/Index', [
            'tickets' => $tickets,
            'stats'   => $stats,
            'users'   => $users,
            'filters' => $request->only('status', 'priority', 'channel', 'search'),
        ]);
    }

    public function create()
    {
        $cid       = auth()->user()->company_id;
        $customers = Customer::where('company_id', $cid)->where('is_active', true)->select('id', 'name', 'email')->get();
        $users     = \App\Models\User::where('company_id', $cid)->select('id', 'name')->get();
        return Inertia::render('Support/Tickets/Form', ['ticket' => null, 'customers' => $customers, 'users' => $users]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'subject'         => 'required|max:255',
            'description'     => 'required',
            'channel'         => 'required|in:web,email,phone,chat,social',
            'priority'        => 'required|in:low,medium,high,urgent',
            'category'        => 'nullable|in:billing,technical,general,sales',
            'customer_id'     => 'nullable|exists:customers,id',
            'assigned_to'     => 'nullable|exists:users,id',
            'requester_name'  => 'nullable|max:255',
            'requester_email' => 'nullable|email',
        ]);
        $v['company_id'] = auth()->user()->company_id;
        $v['created_by'] = auth()->id();
        $v['status']     = 'open';
        $newTicket = SupportTicket::create($v);
        if (!empty($v['assigned_to'])) {
            \App\Support\Notify::user($v['assigned_to'], 'Ticket Assigned to You', "#{$newTicket->ticket_number}: {$newTicket->subject}", "/support/tickets/{$newTicket->id}");
        } else {
            \App\Support\Notify::admins($v['company_id'], 'New Support Ticket', "#{$newTicket->ticket_number}: {$newTicket->subject}", "/support/tickets/{$newTicket->id}");
        }
        return redirect()->route('support.tickets.index')->with('success', 'Ticket created.');
    }

    public function show(SupportTicket $ticket)
    {
        abort_if($ticket->company_id !== auth()->user()->company_id, 403);
        $ticket->load(['customer:id,name,email', 'assignedTo:id,name', 'replies.user:id,name']);
        $users = \App\Models\User::where('company_id', auth()->user()->company_id)->select('id', 'name')->get();
        return Inertia::render('Support/Tickets/Show', ['ticket' => $ticket, 'users' => $users]);
    }

    public function update(Request $request, SupportTicket $ticket)
    {
        abort_if($ticket->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'status'      => 'required|in:open,in_progress,waiting,resolved,closed',
            'priority'    => 'required|in:low,medium,high,urgent',
            'assigned_to' => 'nullable|exists:users,id',
            'category'    => 'nullable|in:billing,technical,general,sales',
        ]);
        if (in_array($v['status'], ['resolved', 'closed']) && !$ticket->resolved_at) {
            $v['resolved_at'] = now();
        }
        $prevAssigned = $ticket->assigned_to;
        $ticket->update($v);
        // Notify newly assigned agent if assignment changed
        if (!empty($v['assigned_to']) && $v['assigned_to'] !== $prevAssigned) {
            \App\Support\Notify::user($v['assigned_to'], 'Ticket Assigned to You', "#{$ticket->ticket_number}: {$ticket->subject}", "/support/tickets/{$ticket->id}");
        }
        // Notify creator when ticket is resolved
        if (in_array($v['status'], ['resolved', 'closed']) && $ticket->created_by !== auth()->id()) {
            \App\Support\Notify::user($ticket->created_by, 'Ticket Resolved', "Your ticket #{$ticket->ticket_number} has been {$v['status']}.", "/support/tickets/{$ticket->id}");
        }
        return back()->with('success', 'Ticket updated.');
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        abort_if($ticket->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate(['message' => 'required', 'type' => 'required|in:reply,note']);
        if (!$ticket->first_response_at) {
            $ticket->update(['first_response_at' => now()]);
        }
        $ticket->replies()->create([
            'user_id' => auth()->id(),
            'message' => $v['message'],
            'type'    => $v['type'],
        ]);
        // Notify the other party (assignee or creator) about the new reply
        $notifyId = (auth()->id() === $ticket->assigned_to)
            ? $ticket->created_by
            : $ticket->assigned_to;
        \App\Support\Notify::user($notifyId, 'New Reply on Ticket', "#{$ticket->ticket_number}: {$ticket->subject}", "/support/tickets/{$ticket->id}");
        return back()->with('success', 'Reply sent.');
    }

    public function rate(Request $request, SupportTicket $ticket)
    {
        $v = $request->validate([
            'satisfaction_rating'   => 'required|numeric|min:1|max:5',
            'satisfaction_feedback' => 'nullable|max:1000',
        ]);
        $ticket->update($v);
        return back()->with('success', 'Thank you for your feedback!');
    }

    public function destroy(SupportTicket $ticket)
    {
        abort_if($ticket->company_id !== auth()->user()->company_id, 403);
        $ticket->delete();
        return redirect()->route('support.tickets.index')->with('success', 'Ticket deleted.');
    }
}

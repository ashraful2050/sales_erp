<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\LeadActivity;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $cid   = auth()->user()->company_id;
        $leads = Lead::where('company_id', $cid)
            ->with(['assignedTo:id,name'])
            ->when($request->search, fn($q, $s) => $q->where('title', 'like', "%{$s}%")
                ->orWhere('contact_name', 'like', "%{$s}%")
                ->orWhere('company_name', 'like', "%{$s}%"))
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->priority, fn($q, $p) => $q->where('priority', $p))
            ->orderByDesc('score')
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total'       => Lead::where('company_id', $cid)->count(),
            'new'         => Lead::where('company_id', $cid)->where('status', 'new')->count(),
            'qualified'   => Lead::where('company_id', $cid)->where('status', 'qualified')->count(),
            'won'         => Lead::where('company_id', $cid)->where('status', 'won')->count(),
            'totalValue'  => (float) Lead::where('company_id', $cid)->whereIn('status', ['qualified', 'proposal', 'negotiation', 'won'])->sum('estimated_value'),
        ];

        return Inertia::render('CRM/Leads/Index', [
            'leads'   => $leads,
            'stats'   => $stats,
            'filters' => $request->only('search', 'status', 'priority'),
        ]);
    }

    public function create()
    {
        $cid   = auth()->user()->company_id;
        $users = \App\Models\User::where('company_id', $cid)->select('id', 'name')->get();
        return Inertia::render('CRM/Leads/Form', ['lead' => null, 'users' => $users]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'title'               => 'required|max:255',
            'contact_name'        => 'nullable|max:255',
            'contact_email'       => 'nullable|email|max:255',
            'contact_phone'       => 'nullable|max:30',
            'company_name'        => 'nullable|max:255',
            'source'              => 'nullable|max:100',
            'status'              => 'required|in:new,contacted,qualified,proposal,negotiation,won,lost',
            'priority'            => 'required|in:low,medium,high',
            'estimated_value'     => 'nullable|numeric|min:0',
            'industry'            => 'nullable|max:100',
            'notes'               => 'nullable',
            'expected_close_date' => 'nullable|date',
            'assigned_to'         => 'nullable|exists:users,id',
        ]);
        $v['company_id'] = auth()->user()->company_id;
        $lead = Lead::create($v);
        $lead->recalculateScore();
        return redirect()->route('crm.leads.index')->with('success', 'Lead created.');
    }

    public function show(Lead $lead)
    {
        abort_if($lead->company_id !== auth()->user()->company_id, 403);
        $lead->load(['assignedTo:id,name', 'activities.user:id,name', 'customer']);
        return Inertia::render('CRM/Leads/Show', ['lead' => $lead]);
    }

    public function edit(Lead $lead)
    {
        abort_if($lead->company_id !== auth()->user()->company_id, 403);
        $cid   = auth()->user()->company_id;
        $users = \App\Models\User::where('company_id', $cid)->select('id', 'name')->get();
        return Inertia::render('CRM/Leads/Form', ['lead' => $lead, 'users' => $users]);
    }

    public function update(Request $request, Lead $lead)
    {
        abort_if($lead->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'title'               => 'required|max:255',
            'contact_name'        => 'nullable|max:255',
            'contact_email'       => 'nullable|email|max:255',
            'contact_phone'       => 'nullable|max:30',
            'company_name'        => 'nullable|max:255',
            'source'              => 'nullable|max:100',
            'status'              => 'required|in:new,contacted,qualified,proposal,negotiation,won,lost',
            'priority'            => 'required|in:low,medium,high',
            'estimated_value'     => 'nullable|numeric|min:0',
            'industry'            => 'nullable|max:100',
            'notes'               => 'nullable',
            'expected_close_date' => 'nullable|date',
            'assigned_to'         => 'nullable|exists:users,id',
        ]);
        $lead->update($v);
        $lead->recalculateScore();
        return redirect()->route('crm.leads.show', $lead)->with('success', 'Lead updated.');
    }

    public function destroy(Lead $lead)
    {
        abort_if($lead->company_id !== auth()->user()->company_id, 403);
        $lead->delete();
        return redirect()->route('crm.leads.index')->with('success', 'Lead deleted.');
    }

    public function storeActivity(Request $request, Lead $lead)
    {
        abort_if($lead->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'type'        => 'required|in:call,email,meeting,note,task',
            'subject'     => 'required|max:255',
            'description' => 'nullable',
            'activity_at' => 'required|date',
            'outcome'     => 'nullable|in:positive,neutral,negative',
        ]);
        $v['user_id'] = auth()->id();
        $lead->activities()->create($v);
        $lead->recalculateScore();
        return back()->with('success', 'Activity logged.');
    }

    public function convertToCustomer(Lead $lead)
    {
        abort_if($lead->company_id !== auth()->user()->company_id, 403);
        if ($lead->customer_id) {
            return redirect()->route('sales.customers.show', $lead->customer_id);
        }
        $customer = Customer::create([
            'company_id'     => $lead->company_id,
            'name'           => $lead->contact_name ?? $lead->title,
            'email'          => $lead->contact_email,
            'phone'          => $lead->contact_phone,
            'company_name'   => $lead->company_name,
            'is_active'      => true,
        ]);
        $lead->update(['customer_id' => $customer->id, 'status' => 'won']);
        return redirect()->route('sales.customers.show', $customer)->with('success', 'Lead converted to customer.');
    }
}

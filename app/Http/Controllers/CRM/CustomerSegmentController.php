<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Models\CustomerSegment;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerSegmentController extends Controller
{
    public function index()
    {
        $cid = auth()->user()->company_id;
        $segments = CustomerSegment::where('company_id', $cid)
            ->withCount('members')
            ->orderBy('name')
            ->get();
        return Inertia::render('CRM/Segments/Index', ['segments' => $segments]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'name'        => 'required|max:255',
            'description' => 'nullable',
            'type'        => 'required|in:manual,auto',
            'criteria'    => 'nullable|array',
        ]);
        $v['company_id'] = auth()->user()->company_id;
        $v['is_active']  = true;
        $segment = CustomerSegment::create($v);
        if ($segment->type === 'auto') $segment->syncMembers();
        return back()->with('success', 'Segment created.');
    }

    public function show(CustomerSegment $customerSegment)
    {
        abort_if($customerSegment->company_id !== auth()->user()->company_id, 403);
        $customerSegment->load('members');
        $allCustomers = Customer::where('company_id', auth()->user()->company_id)
            ->where('is_active', true)->select('id', 'name', 'email')->get();
        return Inertia::render('CRM/Segments/Show', [
            'segment'      => $customerSegment,
            'allCustomers' => $allCustomers,
        ]);
    }

    public function update(Request $request, CustomerSegment $customerSegment)
    {
        abort_if($customerSegment->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'name'        => 'required|max:255',
            'description' => 'nullable',
            'criteria'    => 'nullable|array',
        ]);
        $customerSegment->update($v);
        if ($customerSegment->type === 'auto') $customerSegment->syncMembers();
        return back()->with('success', 'Segment updated.');
    }

    public function destroy(CustomerSegment $customerSegment)
    {
        abort_if($customerSegment->company_id !== auth()->user()->company_id, 403);
        $customerSegment->delete();
        return back()->with('success', 'Segment deleted.');
    }

    public function addMember(Request $request, CustomerSegment $customerSegment)
    {
        abort_if($customerSegment->company_id !== auth()->user()->company_id, 403);
        $request->validate(['customer_id' => 'required|exists:customers,id']);
        $customerSegment->members()->syncWithoutDetaching([$request->customer_id]);
        return back()->with('success', 'Customer added to segment.');
    }

    public function removeMember(CustomerSegment $customerSegment, Customer $customer)
    {
        abort_if($customerSegment->company_id !== auth()->user()->company_id, 403);
        $customerSegment->members()->detach($customer->id);
        return back()->with('success', 'Customer removed from segment.');
    }
}

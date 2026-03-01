<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\CommissionStructure;
use App\Models\CommissionRecord;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommissionController extends Controller
{
    public function index()
    {
        $cid        = auth()->user()->company_id;
        $structures = CommissionStructure::where('company_id', $cid)->withCount('records')->get();
        $records    = CommissionRecord::where('company_id', $cid)
            ->with(['user:id,name', 'structure:id,name'])
            ->orderByDesc('period_date')
            ->paginate(20);

        $stats = [
            'total_pending'  => (float) CommissionRecord::where('company_id', $cid)->where('status', 'pending')->sum('commission_amount'),
            'total_approved' => (float) CommissionRecord::where('company_id', $cid)->where('status', 'approved')->sum('commission_amount'),
            'total_paid'     => (float) CommissionRecord::where('company_id', $cid)->where('status', 'paid')->sum('commission_amount'),
        ];

        return Inertia::render('Sales/Commissions/Index', [
            'structures' => $structures,
            'records'    => $records,
            'stats'      => $stats,
        ]);
    }

    public function storeStructure(Request $request)
    {
        $v = $request->validate([
            'name'         => 'required|max:255',
            'type'         => 'required|in:percentage,fixed,tiered',
            'rate'         => 'required|numeric|min:0',
            'tiers'        => 'nullable|array',
            'applies_to'   => 'required|in:all,product,category,customer',
            'applies_to_id'=> 'nullable|integer',
        ]);
        $v['company_id'] = auth()->user()->company_id;
        $v['is_active']  = true;
        CommissionStructure::create($v);
        return back()->with('success', 'Commission structure created.');
    }

    public function updateStructure(Request $request, CommissionStructure $commissionStructure)
    {
        abort_if($commissionStructure->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'name'      => 'required|max:255',
            'type'      => 'required|in:percentage,fixed,tiered',
            'rate'      => 'required|numeric|min:0',
            'tiers'     => 'nullable|array',
            'is_active' => 'boolean',
        ]);
        $commissionStructure->update($v);
        return back()->with('success', 'Commission structure updated.');
    }

    public function destroyStructure(CommissionStructure $commissionStructure)
    {
        abort_if($commissionStructure->company_id !== auth()->user()->company_id, 403);
        $commissionStructure->delete();
        return back()->with('success', 'Commission structure deleted.');
    }

    public function approveRecord(CommissionRecord $commissionRecord)
    {
        abort_if($commissionRecord->company_id !== auth()->user()->company_id, 403);
        $commissionRecord->update(['status' => 'approved', 'approved_by' => auth()->id()]);
        return back()->with('success', 'Commission approved.');
    }

    public function markPaid(CommissionRecord $commissionRecord)
    {
        abort_if($commissionRecord->company_id !== auth()->user()->company_id, 403);
        $commissionRecord->update(['status' => 'paid', 'paid_at' => now()]);
        return back()->with('success', 'Commission marked as paid.');
    }
}

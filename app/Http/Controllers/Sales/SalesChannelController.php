<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\SalesChannel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesChannelController extends Controller
{
    public function index()
    {
        $cid      = auth()->user()->company_id;
        $channels = SalesChannel::where('company_id', $cid)->orderBy('name')->paginate(20);
        return Inertia::render('Sales/Channels/Index', ['channels' => $channels]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'name'        => 'required|max:255',
            'type'        => 'required|in:ecommerce,retail,b2b,mobile,social_facebook,social_instagram,social_linkedin',
            'platform'    => 'nullable|max:100',
            'api_key'     => 'nullable|max:255',
            'api_secret'  => 'nullable|max:255',
            'webhook_url' => 'nullable|url|max:500',
            'auto_sync'   => 'boolean',
            'settings'    => 'nullable|array',
        ]);
        $v['company_id']  = auth()->user()->company_id;
        $v['is_active']   = true;
        $v['sync_status'] = 'idle';
        SalesChannel::create($v);
        return back()->with('success', 'Sales channel added.');
    }

    public function update(Request $request, SalesChannel $salesChannel)
    {
        abort_if($salesChannel->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'name'        => 'required|max:255',
            'platform'    => 'nullable|max:100',
            'api_key'     => 'nullable|max:255',
            'api_secret'  => 'nullable|max:255',
            'webhook_url' => 'nullable|url|max:500',
            'auto_sync'   => 'boolean',
            'is_active'   => 'boolean',
            'settings'    => 'nullable|array',
        ]);
        $salesChannel->update($v);
        return back()->with('success', 'Sales channel updated.');
    }

    public function destroy(SalesChannel $salesChannel)
    {
        abort_if($salesChannel->company_id !== auth()->user()->company_id, 403);
        $salesChannel->delete();
        return back()->with('success', 'Sales channel removed.');
    }

    public function sync(SalesChannel $salesChannel)
    {
        abort_if($salesChannel->company_id !== auth()->user()->company_id, 403);
        // Trigger sync - in a real implementation this would dispatch a job
        $salesChannel->update(['sync_status' => 'syncing', 'last_sync_at' => now()]);
        // Simulate sync completion
        $salesChannel->update(['sync_status' => 'idle']);
        return back()->with('success', 'Channel sync triggered.');
    }
}

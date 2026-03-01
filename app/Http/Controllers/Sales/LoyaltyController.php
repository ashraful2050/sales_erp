<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\LoyaltyProgram;
use App\Models\LoyaltyPoint;
use App\Models\LoyaltyRedemption;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoyaltyController extends Controller
{
    public function index()
    {
        $cid      = auth()->user()->company_id;
        $programs = LoyaltyProgram::where('company_id', $cid)->get();
        return Inertia::render('Sales/Loyalty/Index', ['programs' => $programs]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'name'                     => 'required|max:255',
            'description'              => 'nullable',
            'points_per_currency_unit' => 'required|numeric|min:0',
            'currency_per_point'       => 'required|numeric|min:0',
            'min_redeem_points'        => 'required|integer|min:1',
            'point_expiry_days'        => 'nullable|integer|min:1',
            'tier_rules'               => 'nullable|array',
        ]);
        $v['company_id'] = auth()->user()->company_id;
        $v['is_active']  = true;
        LoyaltyProgram::create($v);
        return back()->with('success', 'Loyalty program created.');
    }

    public function update(Request $request, LoyaltyProgram $loyaltyProgram)
    {
        abort_if($loyaltyProgram->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'name'                     => 'required|max:255',
            'description'              => 'nullable',
            'points_per_currency_unit' => 'required|numeric|min:0',
            'currency_per_point'       => 'required|numeric|min:0',
            'min_redeem_points'        => 'required|integer|min:1',
            'point_expiry_days'        => 'nullable|integer|min:1',
            'tier_rules'               => 'nullable|array',
            'is_active'                => 'boolean',
        ]);
        $loyaltyProgram->update($v);
        return back()->with('success', 'Loyalty program updated.');
    }

    public function destroy(LoyaltyProgram $loyaltyProgram)
    {
        abort_if($loyaltyProgram->company_id !== auth()->user()->company_id, 403);
        $loyaltyProgram->delete();
        return back()->with('success', 'Loyalty program deleted.');
    }

    public function customerPoints(Customer $customer)
    {
        abort_if($customer->company_id !== auth()->user()->company_id, 403);
        $cid     = auth()->user()->company_id;
        $program = LoyaltyProgram::where('company_id', $cid)->where('is_active', true)->first();
        if (!$program) return back()->with('error', 'No active loyalty program.');

        $balance = $program->getCustomerBalance($customer->id);
        $tier    = $program->getCustomerTier($customer->id);
        $history = LoyaltyPoint::where('customer_id', $customer->id)
            ->where('loyalty_program_id', $program->id)
            ->orderByDesc('created_at')->paginate(20);

        return Inertia::render('Sales/Loyalty/CustomerPoints', [
            'customer' => $customer,
            'program'  => $program,
            'balance'  => $balance,
            'tier'     => $tier,
            'history'  => $history,
        ]);
    }

    public function adjustPoints(Request $request, Customer $customer)
    {
        abort_if($customer->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'points'             => 'required|integer',
            'type'               => 'required|in:earned,adjusted',
            'notes'              => 'nullable|max:255',
            'loyalty_program_id' => 'required|exists:loyalty_programs,id',
        ]);
        $v['company_id']  = auth()->user()->company_id;
        $v['customer_id'] = $customer->id;
        LoyaltyPoint::create($v);
        return back()->with('success', 'Points adjusted.');
    }
}

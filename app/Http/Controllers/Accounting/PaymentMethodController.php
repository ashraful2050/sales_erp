<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    public function index(Request $request)
    {
        $cid = auth()->user()->company_id;
        $paymentMethods = PaymentMethod::where('company_id', $cid)
            ->with('account:id,name,code')
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->get();

        return Inertia::render('Accounting/PaymentMethods/Index', [
            'paymentMethods' => $paymentMethods,
            'filters'        => $request->only('search'),
        ]);
    }

    public function create()
    {
        $cid = auth()->user()->company_id;
        return Inertia::render('Accounting/PaymentMethods/Form', [
            'method'   => null,
            'accounts' => Account::where('company_id', $cid)
                ->where('is_active', true)
                ->whereIn('type', ['asset'])
                ->orderBy('name')
                ->get(['id', 'name', 'code']),
        ]);
    }

    public function store(Request $request)
    {
        $cid = auth()->user()->company_id;
        $v = $request->validate([
            'name'       => 'required|string|max:100',
            'type'       => 'required|in:cash,bank,mobile_banking,other',
            'account_id' => 'nullable|exists:accounts,id',
            'is_default' => 'boolean',
            'notes'      => 'nullable|string|max:255',
        ]);

        if (!empty($v['is_default'])) {
            PaymentMethod::where('company_id', $cid)->update(['is_default' => false]);
        }

        PaymentMethod::create(array_merge($v, [
            'company_id' => $cid,
            'is_active'  => true,
        ]));

        return redirect()->route('accounting.payment-methods.index')
            ->with('success', 'Payment method created.');
    }

    public function edit(PaymentMethod $paymentMethod)
    {
        abort_if($paymentMethod->company_id !== auth()->user()->company_id, 403);
        $cid = auth()->user()->company_id;
        return Inertia::render('Accounting/PaymentMethods/Form', [
            'method'   => $paymentMethod->load('account:id,name,code'),
            'accounts' => Account::where('company_id', $cid)
                ->where('is_active', true)
                ->whereIn('type', ['asset'])
                ->orderBy('name')
                ->get(['id', 'name', 'code']),
        ]);
    }

    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        abort_if($paymentMethod->company_id !== auth()->user()->company_id, 403);
        $cid = auth()->user()->company_id;
        $v = $request->validate([
            'name'       => 'required|string|max:100',
            'type'       => 'required|in:cash,bank,mobile_banking,other',
            'account_id' => 'nullable|exists:accounts,id',
            'is_default' => 'boolean',
            'is_active'  => 'boolean',
            'notes'      => 'nullable|string|max:255',
        ]);

        if (!empty($v['is_default'])) {
            PaymentMethod::where('company_id', $cid)
                ->where('id', '!=', $paymentMethod->id)
                ->update(['is_default' => false]);
        }

        $paymentMethod->update($v);
        return redirect()->route('accounting.payment-methods.index')
            ->with('success', 'Payment method updated.');
    }

    public function destroy(PaymentMethod $paymentMethod)
    {
        abort_if($paymentMethod->company_id !== auth()->user()->company_id, 403);
        $paymentMethod->delete();
        return back()->with('success', 'Payment method deleted.');
    }
}

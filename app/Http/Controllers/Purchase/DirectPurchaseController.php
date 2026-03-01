<?php
namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\PaymentAllocation;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\TaxRate;
use App\Models\Vendor;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DirectPurchaseController extends Controller
{
    public function index(Request $request)
    {
        $cid = auth()->user()->company_id;
        $purchases = PurchaseOrder::where('company_id', $cid)
            ->where('type', 'direct_purchase')
            ->with('vendor:id,name')
            ->when($request->search, fn($q, $s) =>
                $q->where('po_number', 'like', "%{$s}%")
                  ->orWhereHas('vendor', fn($q2) => $q2->where('name', 'like', "%{$s}%"))
            )
            ->when($request->date_from, fn($q, $d) => $q->whereDate('po_date', '>=', $d))
            ->when($request->date_to,   fn($q, $d) => $q->whereDate('po_date', '<=', $d))
            ->latest('po_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Purchase/DirectPurchases/Index', [
            'purchases' => $purchases,
            'filters'   => $request->only('search', 'date_from', 'date_to'),
        ]);
    }

    public function create()
    {
        $cid = auth()->user()->company_id;
        return Inertia::render('Purchase/DirectPurchases/Form', [
            'purchase'   => null,
            'vendors'    => Vendor::where('company_id', $cid)->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'products'   => Product::where('company_id', $cid)->where('is_active', true)->with('unit:id,abbreviation')->orderBy('name')->get(['id', 'name', 'code', 'cost_price', 'tax_rate_id']),
            'taxRates'   => TaxRate::where('company_id', $cid)->where('is_active', true)->get(['id', 'name', 'rate']),
            'warehouses' => Warehouse::where('company_id', $cid)->where('is_active', true)->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $cid = auth()->user()->company_id;
        $v = $request->validate([
            'vendor_id'         => 'nullable|exists:vendors,id',
            'purchase_date'     => 'required|date',
            'currency_code'     => 'required|max:3',
            'payment_method'    => 'required|string|max:50',
            'notes'             => 'nullable|string',
            'discount_amount'   => 'nullable|numeric|min:0',
            'items'             => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity'  => 'required|numeric|min:0.0001',
            'items.*.unit_price'=> 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($cid, $v, $request) {
            $num = 'DP-' . date('Ymd') . '-' . str_pad(
                PurchaseOrder::where('company_id', $cid)->where('type', 'direct_purchase')->count() + 1,
                4, '0', STR_PAD_LEFT
            );

            $order = PurchaseOrder::create([
                'company_id'      => $cid,
                'po_number'       => $num,
                'type'            => 'direct_purchase',
                'vendor_id'       => $v['vendor_id'] ?? null,
                'po_date'         => $v['purchase_date'],
                'due_date'        => $v['purchase_date'],
                'currency_code'   => $v['currency_code'],
                'status'          => 'received',
                'notes'           => $v['notes'] ?? null,
                'discount_amount' => $v['discount_amount'] ?? 0,
                'subtotal'        => 0,
                'tax_amount'      => 0,
                'total_amount'    => 0,
                'paid_amount'     => 0,
                'created_by'      => auth()->id(),
            ]);

            $subtotal = 0; $taxAmount = 0;
            foreach ($request->items as $i => $item) {
                $qty      = (float)($item['quantity'] ?? 0);
                $price    = (float)($item['unit_price'] ?? 0);
                $discPct  = (float)($item['discount_pct'] ?? 0);
                $discAmt  = round($qty * $price * $discPct / 100, 4);
                $lineTotal= round($qty * $price - $discAmt, 4);
                $taxRate2 = (float)($item['tax_rate'] ?? 0);
                $taxAmt   = round($lineTotal * $taxRate2 / 100, 4);
                $total    = $lineTotal + $taxAmt;

                PurchaseOrderItem::create([
                    'purchase_order_id' => $order->id,
                    'product_id'        => $item['product_id'] ?? null,
                    'warehouse_id'      => $item['warehouse_id'] ?? null,
                    'tax_rate_id'       => $item['tax_rate_id'] ?? null,
                    'description'       => $item['description'],
                    'quantity'          => $qty,
                    'unit_price'        => $price,
                    'discount_pct'      => $discPct,
                    'discount_amount'   => $discAmt,
                    'tax_rate'          => $taxRate2,
                    'tax_amount'        => $taxAmt,
                    'total'             => $total,
                    'received_qty'      => $qty,
                    'sort_order'        => $i,
                ]);
                $subtotal   += $lineTotal;
                $taxAmount  += $taxAmt;
            }

            $disc  = (float)($v['discount_amount'] ?? 0);
            $grand = $subtotal + $taxAmount - $disc;

            $order->update([
                'subtotal'     => $subtotal,
                'tax_amount'   => $taxAmount,
                'total_amount' => $grand,
                'paid_amount'  => $grand,
            ]);

            // Create payment record
            $payNum = 'PAY-' . date('Ymd') . '-' . str_pad(
                Payment::where('company_id', $cid)->count() + 1, 4, '0', STR_PAD_LEFT
            );
            $payment = Payment::create([
                'company_id'     => $cid,
                'payment_number' => $payNum,
                'type'           => 'payment',
                'vendor_id'      => $order->vendor_id,
                'payment_date'   => $v['purchase_date'],
                'amount'         => $grand,
                'currency_code'  => $v['currency_code'],
                'payment_method' => $v['payment_method'],
                'reference'      => $num,
                'status'         => 'completed',
                'created_by'     => auth()->id(),
            ]);

            PaymentAllocation::create([
                'payment_id'       => $payment->id,
                'reference_type'   => 'purchase_order',
                'reference_id'     => $order->id,
                'allocated_amount' => $grand,
            ]);
        });

        return redirect()->route('purchase.direct-purchases.index')->with('success', 'Direct purchase recorded successfully.');
    }

    public function show(PurchaseOrder $directPurchase)
    {
        abort_if($directPurchase->company_id !== auth()->user()->company_id || $directPurchase->type !== 'direct_purchase', 403);
        $company = \App\Models\Company::find(auth()->user()->company_id);
        return Inertia::render('Purchase/DirectPurchases/Show', [
            'purchase' => $directPurchase->load(['vendor', 'items.product']),
            'company'  => $company,
        ]);
    }

    public function destroy(PurchaseOrder $directPurchase)
    {
        abort_if($directPurchase->company_id !== auth()->user()->company_id || $directPurchase->type !== 'direct_purchase', 403);
        $directPurchase->items()->delete();
        $directPurchase->delete();
        return redirect()->route('purchase.direct-purchases.index')->with('success', 'Direct purchase deleted.');
    }
}

<?php
namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\PaymentAllocation;
use App\Models\Product;
use App\Models\TaxRate;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DirectSaleController extends Controller
{
    public function index(Request $request)
    {
        $cid = auth()->user()->company_id;
        $sales = Invoice::where('company_id', $cid)
            ->where('type', 'direct_sale')
            ->with('customer:id,name')
            ->when($request->search, fn($q, $s) =>
                $q->where('invoice_number', 'like', "%{$s}%")
                  ->orWhereHas('customer', fn($q2) => $q2->where('name', 'like', "%{$s}%"))
            )
            ->when($request->date_from, fn($q, $d) => $q->whereDate('invoice_date', '>=', $d))
            ->when($request->date_to,   fn($q, $d) => $q->whereDate('invoice_date', '<=', $d))
            ->latest('invoice_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Sales/DirectSales/Index', [
            'sales'   => $sales,
            'filters' => $request->only('search', 'date_from', 'date_to'),
        ]);
    }

    public function create()
    {
        $cid = auth()->user()->company_id;
        return Inertia::render('Sales/DirectSales/Form', [
            'sale'       => null,
            'customers'  => Customer::where('company_id', $cid)->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'products'   => Product::where('company_id', $cid)->where('is_active', true)->with('unit:id,abbreviation')->orderBy('name')->get(['id', 'name', 'code', 'sale_price', 'tax_rate_id']),
            'taxRates'   => TaxRate::where('company_id', $cid)->where('is_active', true)->get(['id', 'name', 'rate']),
            'warehouses' => Warehouse::where('company_id', $cid)->where('is_active', true)->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $cid = auth()->user()->company_id;
        $v = $request->validate([
            'customer_id'       => 'nullable|exists:customers,id',
            'sale_date'         => 'required|date',
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
            $num = 'DS-' . date('Ymd') . '-' . str_pad(
                Invoice::where('company_id', $cid)->where('type', 'direct_sale')->count() + 1,
                4, '0', STR_PAD_LEFT
            );

            $invoice = Invoice::create([
                'company_id'      => $cid,
                'invoice_number'  => $num,
                'type'            => 'direct_sale',
                'customer_id'     => $v['customer_id'] ?? null,
                'invoice_date'    => $v['sale_date'],
                'due_date'        => $v['sale_date'],
                'currency_code'   => $v['currency_code'],
                'status'          => 'paid',
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

                InvoiceItem::create([
                    'invoice_id'  => $invoice->id,
                    'product_id'  => $item['product_id'] ?? null,
                    'warehouse_id'=> $item['warehouse_id'] ?? null,
                    'tax_rate_id' => $item['tax_rate_id'] ?? null,
                    'description' => $item['description'],
                    'unit'        => $item['unit'] ?? null,
                    'quantity'    => $qty,
                    'unit_price'  => $price,
                    'discount_pct'=> $discPct,
                    'discount_amount' => $discAmt,
                    'tax_rate'    => $taxRate2,
                    'tax_amount'  => $taxAmt,
                    'total'       => $total,
                    'sort_order'  => $i,
                ]);
                $subtotal   += $lineTotal;
                $taxAmount  += $taxAmt;
            }

            $disc  = (float)($v['discount_amount'] ?? 0);
            $grand = $subtotal + $taxAmount - $disc;

            $invoice->update([
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
                'type'           => 'receipt',
                'customer_id'    => $invoice->customer_id,
                'payment_date'   => $v['sale_date'],
                'amount'         => $grand,
                'currency_code'  => $v['currency_code'],
                'payment_method' => $v['payment_method'],
                'reference'      => $num,
                'status'         => 'completed',
                'created_by'     => auth()->id(),
            ]);

            PaymentAllocation::create([
                'payment_id'       => $payment->id,
                'reference_type'   => 'invoice',
                'reference_id'     => $invoice->id,
                'allocated_amount' => $grand,
            ]);

            $this->invoice = $invoice;
        });

        return redirect()->route('sales.direct-sales.index')->with('success', 'Direct sale recorded successfully.');
    }

    public function show(Invoice $directSale)
    {
        abort_if($directSale->company_id !== auth()->user()->company_id || $directSale->type !== 'direct_sale', 403);
        $company = \App\Models\Company::find(auth()->user()->company_id);
        return Inertia::render('Sales/DirectSales/Show', [
            'sale'    => $directSale->load(['customer', 'items.product']),
            'company' => $company,
        ]);
    }

    public function destroy(Invoice $directSale)
    {
        abort_if($directSale->company_id !== auth()->user()->company_id || $directSale->type !== 'direct_sale', 403);
        $directSale->items()->delete();
        $directSale->delete();
        return redirect()->route('sales.direct-sales.index')->with('success', 'Direct sale deleted.');
    }
}

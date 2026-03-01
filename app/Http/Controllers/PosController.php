<?php
namespace App\Http\Controllers;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\PaymentAllocation;
use App\Models\ProductStock;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PosController extends Controller
{
    public function index()
    {
        $cid = auth()->user()->company_id;
        return Inertia::render('POS/Index', [
            'products'  => Product::where('company_id',$cid)
                ->where('is_active',true)
                ->with(['category:id,name','stocks:product_id,warehouse_id,quantity'])
                ->orderBy('name')
                ->get(['id','name','code','sale_price','cost_price','category_id','unit_id']),
            'customers' => Customer::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','phone']),
        ]);
    }

    public function sale(Request $request)
    {
        $cid = auth()->user()->company_id;
        $v = $request->validate([
            'customer_id'    => 'nullable|exists:customers,id',
            'items'          => 'required|array|min:1',
            'items.*.product_id'    => 'required|exists:products,id',
            'items.*.quantity'      => 'required|numeric|min:0.001',
            'items.*.unit_price'    => 'required|numeric|min:0',
            'items.*.subtotal'      => 'required|numeric|min:0',
            'discount_amount'=> 'nullable|numeric|min:0',
            'paid_amount'    => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,bank,bkash,nagad,rocket,upay,cheque,other',
            'notes'          => 'nullable',
        ]);

        DB::transaction(function() use ($v, $cid) {
            $subtotal      = collect($v['items'])->sum('subtotal');
            $discountAmt   = (float)($v['discount_amount'] ?? 0);
            $totalAmount   = max(0, $subtotal - $discountAmt);
            $paidAmount    = min((float)$v['paid_amount'], $totalAmount);
            $status        = $paidAmount >= $totalAmount ? 'paid' : ($paidAmount > 0 ? 'partial' : 'sent');

            $invNum = 'POS-'.date('Ymd').'-'.str_pad(Invoice::where('company_id',$cid)->count()+1,4,'0',STR_PAD_LEFT);
            $invoice = Invoice::create([
                'company_id'      => $cid,
                'customer_id'     => $v['customer_id'] ?? null,
                'invoice_number'  => $invNum,
                'invoice_date'    => today(),
                'due_date'        => today(),
                'status'          => $status,
                'total_amount'    => $totalAmount,
                'paid_amount'     => $paidAmount,
                'discount_amount' => $discountAmt,
                'notes'           => $v['notes'] ?? null,
                'created_by'      => auth()->id(),
                'payment_terms'   => 'Due on Receipt',
            ]);

            foreach ($v['items'] as $item) {
                $product = Product::find($item['product_id']);
                InvoiceItem::create([
                    'invoice_id'  => $invoice->id,
                    'product_id'  => $item['product_id'],
                    'description' => $product->name,
                    'quantity'    => $item['quantity'],
                    'unit_price'  => $item['unit_price'],
                    'total'       => $item['subtotal'],
                    'tax_amount'  => 0,
                ]);
                // Deduct stock
                $stock = ProductStock::where('product_id',$item['product_id'])->first();
                if ($stock) {
                    $stock->decrement('quantity', $item['quantity']);
                }
                StockMovement::create([
                    'company_id'    => $cid,
                    'product_id'    => $item['product_id'],
                    'warehouse_id'  => 1,
                    'movement_type' => 'out',
                    'quantity'      => $item['quantity'],
                    'unit_cost'     => $product->cost_price ?? 0,
                    'movement_date' => now()->toDateString(),
                    'reference'     => $invNum,
                    'notes'         => 'POS Sale',
                    'created_by'    => auth()->id(),
                ]);
            }

            // Record payment if paid
            if ($paidAmount > 0) {
                $payNum = 'POS-RV-'.date('Ymd').'-'.str_pad(Payment::where('company_id',$cid)->count()+1,4,'0',STR_PAD_LEFT);
                $payment = Payment::create([
                    'company_id'     => $cid,
                    'payment_number' => $payNum,
                    'type'           => 'received',
                    'customer_id'    => $v['customer_id'] ?? null,
                    'payment_date'   => today(),
                    'amount'         => $paidAmount,
                    'payment_method' => $v['payment_method'],
                    'status'         => 'confirmed',
                    'notes'          => 'POS Sale — '.$invNum,
                    'created_by'     => auth()->id(),
                ]);
                PaymentAllocation::create([
                    'payment_id'       => $payment->id,
                    'reference_type'   => 'invoice',
                    'reference_id'     => $invoice->id,
                    'allocated_amount' => $paidAmount,
                ]);
            }
        });

        return back()->with('success', 'Sale completed successfully!');
    }
}

<?php
namespace App\Http\Controllers\Sales;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\TaxRate;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CreditNoteController extends Controller {
    private function baseQuery() {
        return Invoice::where('company_id', auth()->user()->company_id)
            ->where('type', 'sales_return');
    }

    public function index(Request $request) {
        $notes = $this->baseQuery()
            ->with('customer:id,name')
            ->when($request->search, fn($q,$s) => $q->where('invoice_number','like',"%{$s}%"))
            ->when($request->status, fn($q,$s) => $q->where('status',$s))
            ->latest('invoice_date')->paginate(15)->withQueryString();
        return Inertia::render('Sales/CreditNotes/Index', [
            'notes' => $notes,
            'filters' => $request->only('search','status'),
        ]);
    }

    public function create() {
        $cid = auth()->user()->company_id;
        return Inertia::render('Sales/CreditNotes/Form', [
            'note' => null,
            'customers' => Customer::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','currency_code']),
            'products' => Product::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','code','sale_price','tax_rate_id']),
            'taxRates' => TaxRate::where('company_id',$cid)->where('is_active',true)->get(['id','name','rate']),
            'warehouses' => Warehouse::where('company_id',$cid)->where('is_active',true)->get(['id','name']),
        ]);
    }

    public function store(Request $request) {
        $v = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'invoice_date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'nullable|exists:products,id',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.0001',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax_rate' => 'nullable|numeric|min:0',
            'items.*.tax_amount' => 'nullable|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
        ]);
        $cid = auth()->user()->company_id;
        DB::transaction(function() use ($v, $cid) {
            $subtotal = collect($v['items'])->sum(fn($i) => $i['total']);
            $taxAmt = collect($v['items'])->sum(fn($i) => $i['tax_amount'] ?? 0);
            $prefix = 'CN-'; $year = now()->format('Y');
            $last = Invoice::where('company_id',$cid)->where('type','sales_return')
                ->where('invoice_number','like',"{$prefix}{$year}-%")->max('invoice_number');
            $seq = $last ? (intval(substr($last, -4)) + 1) : 1;
            $num = $prefix . $year . '-' . str_pad($seq,4,'0',STR_PAD_LEFT);
            $inv = Invoice::create([
                'company_id' => $cid,
                'customer_id' => $v['customer_id'],
                'invoice_number' => $num,
                'type' => 'sales_return',
                'invoice_date' => $v['invoice_date'],
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmt,
                'total_amount' => $subtotal + $taxAmt,
                'status' => 'draft',
                'notes' => $v['notes'] ?? null,
                'created_by' => auth()->id(),
            ]);
            foreach ($v['items'] as $i => $item) {
                $inv->items()->create([
                    'product_id' => $item['product_id'] ?? null,
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'tax_rate' => $item['tax_rate'] ?? 0,
                    'tax_amount' => $item['tax_amount'] ?? 0,
                    'total' => $item['total'],
                    'sort_order' => $i,
                ]);
            }
        });
        return redirect()->route('sales.credit-notes.index')->with('success', 'Credit note created.');
    }

    public function show(Invoice $creditNote) {
        abort_if($creditNote->company_id !== auth()->user()->company_id || $creditNote->type !== 'sales_return', 403);
        return Inertia::render('Sales/CreditNotes/Show', [
            'note' => $creditNote->load('customer','items.product'),
        ]);
    }

    public function edit(Invoice $creditNote) {
        abort_if($creditNote->company_id !== auth()->user()->company_id || $creditNote->type !== 'sales_return', 403);
        $cid = auth()->user()->company_id;
        return Inertia::render('Sales/CreditNotes/Form', [
            'note' => $creditNote->load('items'),
            'customers' => Customer::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','currency_code']),
            'products' => Product::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','code','sale_price','tax_rate_id']),
            'taxRates' => TaxRate::where('company_id',$cid)->where('is_active',true)->get(['id','name','rate']),
            'warehouses' => Warehouse::where('company_id',$cid)->where('is_active',true)->get(['id','name']),
        ]);
    }

    public function update(Request $request, Invoice $creditNote) {
        abort_if($creditNote->company_id !== auth()->user()->company_id || $creditNote->type !== 'sales_return', 403);
        $v = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'invoice_date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'nullable|exists:products,id',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.0001',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax_rate' => 'nullable|numeric|min:0',
            'items.*.tax_amount' => 'nullable|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
        ]);
        DB::transaction(function() use ($v, $creditNote) {
            $subtotal = collect($v['items'])->sum(fn($i) => $i['total']);
            $taxAmt = collect($v['items'])->sum(fn($i) => $i['tax_amount'] ?? 0);
            $creditNote->update([
                'customer_id' => $v['customer_id'],
                'invoice_date' => $v['invoice_date'],
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmt,
                'total_amount' => $subtotal + $taxAmt,
                'notes' => $v['notes'] ?? null,
            ]);
            $creditNote->items()->delete();
            foreach ($v['items'] as $i => $item) {
                $creditNote->items()->create([
                    'product_id' => $item['product_id'] ?? null,
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'tax_rate' => $item['tax_rate'] ?? 0,
                    'tax_amount' => $item['tax_amount'] ?? 0,
                    'total' => $item['total'],
                    'sort_order' => $i,
                ]);
            }
        });
        return redirect()->route('sales.credit-notes.index')->with('success', 'Credit note updated.');
    }

    public function destroy(Invoice $creditNote) {
        abort_if($creditNote->company_id !== auth()->user()->company_id || $creditNote->type !== 'sales_return', 403);
        $creditNote->items()->delete();
        $creditNote->delete();
        return redirect()->route('sales.credit-notes.index')->with('success', 'Credit note deleted.');
    }
}

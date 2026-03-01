<?php
namespace App\Http\Controllers\Sales;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\TaxRate;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QuotationController extends Controller {
    private function baseQuery() {
        return Invoice::where('company_id', auth()->user()->company_id)
            ->whereIn('type', ['quotation','proforma']);
    }

    public function index(Request $request) {
        $quotes = $this->baseQuery()
            ->with('customer:id,name')
            ->when($request->search, fn($q,$s) => $q->where('invoice_number','like',"%{$s}%"))
            ->when($request->type, fn($q,$s) => $q->where('type',$s))
            ->latest('invoice_date')->paginate(15)->withQueryString();
        return Inertia::render('Sales/Quotations/Index', [
            'quotes' => $quotes,
            'filters' => $request->only('search','type'),
        ]);
    }

    public function create() {
        $cid = auth()->user()->company_id;
        return Inertia::render('Sales/Quotations/Form', [
            'quote' => null,
            'customers' => Customer::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','currency_code','credit_days']),
            'products' => Product::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','code','sale_price','tax_rate_id']),
            'taxRates' => TaxRate::where('company_id',$cid)->where('is_active',true)->get(['id','name','rate']),
            'warehouses' => Warehouse::where('company_id',$cid)->where('is_active',true)->get(['id','name']),
        ]);
    }

    public function store(Request $request) {
        $v = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'type' => 'required|in:quotation,proforma',
            'invoice_date' => 'required|date',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'terms' => 'nullable|string',
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
            $prefix = $v['type'] === 'proforma' ? 'PI-' : 'QT-';
            $year = now()->format('Y');
            $last = Invoice::where('company_id',$cid)->whereIn('type',['quotation','proforma'])
                ->where('invoice_number','like',"{$prefix}{$year}-%")->max('invoice_number');
            $seq = $last ? (intval(substr($last, -4)) + 1) : 1;
            $num = $prefix . $year . '-' . str_pad($seq,4,'0',STR_PAD_LEFT);
            $inv = Invoice::create([
                'company_id' => $cid,
                'customer_id' => $v['customer_id'],
                'invoice_number' => $num,
                'type' => $v['type'],
                'invoice_date' => $v['invoice_date'],
                'due_date' => $v['due_date'] ?? null,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmt,
                'total_amount' => $subtotal + $taxAmt,
                'status' => 'draft',
                'notes' => $v['notes'] ?? null,
                'terms' => $v['terms'] ?? null,
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
        return redirect()->route('sales.quotations.index')->with('success', 'Quotation created.');
    }

    public function show(Invoice $quotation) {
        abort_if($quotation->company_id !== auth()->user()->company_id || !in_array($quotation->type,['quotation','proforma']), 403);
        return Inertia::render('Sales/Quotations/Show', [
            'quote' => $quotation->load('customer','items.product'),
        ]);
    }

    public function edit(Invoice $quotation) {
        abort_if($quotation->company_id !== auth()->user()->company_id || !in_array($quotation->type,['quotation','proforma']), 403);
        $cid = auth()->user()->company_id;
        return Inertia::render('Sales/Quotations/Form', [
            'quote' => $quotation->load('items'),
            'customers' => Customer::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','currency_code','credit_days']),
            'products' => Product::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','code','sale_price','tax_rate_id']),
            'taxRates' => TaxRate::where('company_id',$cid)->where('is_active',true)->get(['id','name','rate']),
            'warehouses' => Warehouse::where('company_id',$cid)->where('is_active',true)->get(['id','name']),
        ]);
    }

    public function update(Request $request, Invoice $quotation) {
        abort_if($quotation->company_id !== auth()->user()->company_id || !in_array($quotation->type,['quotation','proforma']), 403);
        $v = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'type' => 'required|in:quotation,proforma',
            'invoice_date' => 'required|date',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'terms' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'nullable|exists:products,id',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.0001',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax_rate' => 'nullable|numeric|min:0',
            'items.*.tax_amount' => 'nullable|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
        ]);
        DB::transaction(function() use ($v, $quotation) {
            $subtotal = collect($v['items'])->sum(fn($i) => $i['total']);
            $taxAmt = collect($v['items'])->sum(fn($i) => $i['tax_amount'] ?? 0);
            $quotation->update([
                'customer_id' => $v['customer_id'],
                'type' => $v['type'],
                'invoice_date' => $v['invoice_date'],
                'due_date' => $v['due_date'] ?? null,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmt,
                'total_amount' => $subtotal + $taxAmt,
                'notes' => $v['notes'] ?? null,
                'terms' => $v['terms'] ?? null,
            ]);
            $quotation->items()->delete();
            foreach ($v['items'] as $i => $item) {
                $quotation->items()->create([
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
        return redirect()->route('sales.quotations.index')->with('success', 'Quotation updated.');
    }

    public function destroy(Invoice $quotation) {
        abort_if($quotation->company_id !== auth()->user()->company_id || !in_array($quotation->type,['quotation','proforma']), 403);
        $quotation->items()->delete();
        $quotation->delete();
        return redirect()->route('sales.quotations.index')->with('success', 'Quotation deleted.');
    }

    public function convertToInvoice(Invoice $quotation) {
        abort_if($quotation->company_id !== auth()->user()->company_id || !in_array($quotation->type,['quotation','proforma']), 403);
        $cid = auth()->user()->company_id;
        $prefix = 'INV-'; $year = now()->format('Y');
        $last = Invoice::where('company_id',$cid)->where('type','sales')
            ->where('invoice_number','like',"{$prefix}{$year}-%")->max('invoice_number');
        $seq = $last ? (intval(substr($last, -4)) + 1) : 1;
        $num = $prefix . $year . '-' . str_pad($seq,4,'0',STR_PAD_LEFT);
        $quotation->update(['type' => 'sales', 'invoice_number' => $num, 'status' => 'draft']);
        return redirect()->route('sales.invoices.show', $quotation->id)->with('success', 'Converted to invoice.');
    }
}

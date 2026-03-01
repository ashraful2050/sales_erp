<?php
namespace App\Http\Controllers\Purchase;
use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Vendor;
use App\Models\Product;
use App\Models\TaxRate;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DebitNoteController extends Controller {
    private function baseQuery() {
        return PurchaseOrder::where('company_id', auth()->user()->company_id)
            ->where('type', 'purchase_return');
    }

    public function index(Request $request) {
        $notes = $this->baseQuery()
            ->with('vendor:id,name')
            ->when($request->search, fn($q,$s) => $q->where('po_number','like',"%{$s}%"))
            ->when($request->status, fn($q,$s) => $q->where('status',$s))
            ->latest('po_date')->paginate(15)->withQueryString();
        return Inertia::render('Purchase/DebitNotes/Index', [
            'debitNotes' => $notes,
            'filters' => $request->only('search','status'),
        ]);
    }

    public function create() {
        $cid = auth()->user()->company_id;
        return Inertia::render('Purchase/DebitNotes/Form', [
            'debitNote' => null,
            'vendors' => Vendor::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','currency_code']),
            'products' => Product::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','code','cost_price','tax_rate_id']),
            'taxRates' => TaxRate::where('company_id',$cid)->where('is_active',true)->get(['id','name','rate']),
            'warehouses' => Warehouse::where('company_id',$cid)->where('is_active',true)->get(['id','name']),
        ]);
    }

    public function store(Request $request) {
        $v = $request->validate([
            'vendor_id' => 'required|exists:vendors,id',
            'po_date' => 'required|date',
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
            $prefix = 'DN-'; $year = now()->format('Y');
            $last = PurchaseOrder::where('company_id',$cid)->where('type','purchase_return')
                ->where('po_number','like',"{$prefix}{$year}-%")->max('po_number');
            $seq = $last ? (intval(substr($last, -4)) + 1) : 1;
            $num = $prefix . $year . '-' . str_pad($seq,4,'0',STR_PAD_LEFT);
            $po = PurchaseOrder::create([
                'company_id' => $cid,
                'vendor_id' => $v['vendor_id'],
                'po_number' => $num,
                'type' => 'purchase_return',
                'po_date' => $v['po_date'],
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmt,
                'total_amount' => $subtotal + $taxAmt,
                'status' => 'draft',
                'notes' => $v['notes'] ?? null,
                'created_by' => auth()->id(),
            ]);
            foreach ($v['items'] as $i => $item) {
                $po->items()->create([
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
        return redirect()->route('purchase.debit-notes.index')->with('success', 'Debit note created.');
    }

    public function show(PurchaseOrder $debitNote) {
        abort_if($debitNote->company_id !== auth()->user()->company_id || $debitNote->type !== 'purchase_return', 403);
        return Inertia::render('Purchase/DebitNotes/Show', [
            'debitNote' => $debitNote->load('vendor','items.product'),
        ]);
    }

    public function edit(PurchaseOrder $debitNote) {
        abort_if($debitNote->company_id !== auth()->user()->company_id || $debitNote->type !== 'purchase_return', 403);
        $cid = auth()->user()->company_id;
        return Inertia::render('Purchase/DebitNotes/Form', [
            'debitNote' => $debitNote->load('items'),
            'vendors' => Vendor::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','currency_code']),
            'products' => Product::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','code','cost_price','tax_rate_id']),
            'taxRates' => TaxRate::where('company_id',$cid)->where('is_active',true)->get(['id','name','rate']),
            'warehouses' => Warehouse::where('company_id',$cid)->where('is_active',true)->get(['id','name']),
        ]);
    }

    public function update(Request $request, PurchaseOrder $debitNote) {
        abort_if($debitNote->company_id !== auth()->user()->company_id || $debitNote->type !== 'purchase_return', 403);
        $v = $request->validate([
            'vendor_id' => 'required|exists:vendors,id',
            'po_date' => 'required|date',
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
        DB::transaction(function() use ($v, $debitNote) {
            $subtotal = collect($v['items'])->sum(fn($i) => $i['total']);
            $taxAmt = collect($v['items'])->sum(fn($i) => $i['tax_amount'] ?? 0);
            $debitNote->update([
                'vendor_id' => $v['vendor_id'],
                'po_date' => $v['po_date'],
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmt,
                'total_amount' => $subtotal + $taxAmt,
                'notes' => $v['notes'] ?? null,
            ]);
            $debitNote->items()->delete();
            foreach ($v['items'] as $i => $item) {
                $debitNote->items()->create([
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
        return redirect()->route('purchase.debit-notes.index')->with('success', 'Debit note updated.');
    }

    public function destroy(PurchaseOrder $debitNote) {
        abort_if($debitNote->company_id !== auth()->user()->company_id || $debitNote->type !== 'purchase_return', 403);
        $debitNote->items()->delete();
        $debitNote->delete();
        return redirect()->route('purchase.debit-notes.index')->with('success', 'Debit note deleted.');
    }
}

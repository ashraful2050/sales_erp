<?php
namespace App\Http\Controllers\Sales;
use App\Http\Controllers\Controller;
use App\Models\DeliveryNote;
use App\Models\DeliveryNoteItem;
use App\Models\Invoice;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DeliveryNoteController extends Controller
{
    public function index(Request $request)
    {
        $cid = auth()->user()->company_id;
        $notes = DeliveryNote::where('company_id',$cid)
            ->with(['customer:id,name','invoice:id,invoice_number'])
            ->when($request->search, fn($q,$s)=>$q->where('note_number','like',"%{$s}%"))
            ->when($request->customer_id, fn($q,$v)=>$q->where('customer_id',$v))
            ->when($request->status, fn($q,$v)=>$q->where('status',$v))
            ->latest('dispatch_date')->paginate(15)->withQueryString();

        return Inertia::render('Sales/DeliveryNotes/Index', [
            'notes'     => $notes,
            'customers' => Customer::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name']),
            'filters'   => $request->only('search','customer_id','status'),
        ]);
    }

    public function create(Request $request)
    {
        $cid = auth()->user()->company_id;
        $invoice = $request->invoice_id
            ? Invoice::where('company_id',$cid)->with(['customer:id,name','items.product:id,name,code'])->findOrFail($request->invoice_id)
            : null;
        return Inertia::render('Sales/DeliveryNotes/Create', [
            'invoice'          => $invoice,
            'customers'        => Customer::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name']),
            'products'         => Product::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','code']),
            'pendingInvoices'  => Invoice::where('company_id',$cid)->whereIn('status',['sent','partial','overdue'])->with('customer:id,name')->orderBy('invoice_date')->get(['id','invoice_number','customer_id']),
        ]);
    }

    public function store(Request $request)
    {
        $cid = auth()->user()->company_id;
        $v = $request->validate([
            'invoice_id'       => 'nullable|exists:invoices,id',
            'customer_id'      => 'required|exists:customers,id',
            'dispatch_date'    => 'required|date',
            'delivery_address' => 'nullable',
            'vehicle_no'       => 'nullable|max:50',
            'driver_name'      => 'nullable|max:100',
            'notes'            => 'nullable',
            'items'            => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|numeric|min:0.001',
        ]);

        DB::transaction(function() use ($v, $cid) {
            $num = 'DN-'.date('Ymd').'-'.str_pad(DeliveryNote::where('company_id',$cid)->count()+1,4,'0',STR_PAD_LEFT);
            $items = $v['items'];
            unset($v['items']);
            $dn = DeliveryNote::create(array_merge($v,[
                'company_id'  => $cid,
                'note_number' => $num,
                'status'      => 'dispatched',
                'created_by'  => auth()->id(),
            ]));
            foreach ($items as $item) {
                DeliveryNoteItem::create([
                    'delivery_note_id' => $dn->id,
                    'product_id'       => $item['product_id'],
                    'quantity'         => $item['quantity'],
                    'notes'            => $item['notes'] ?? null,
                ]);
            }
        });

        return redirect()->route('sales.delivery-notes.index')->with('success','Delivery note created.');
    }

    public function show(DeliveryNote $deliveryNote)
    {
        abort_if($deliveryNote->company_id !== auth()->user()->company_id, 403);
        return Inertia::render('Sales/DeliveryNotes/Show', [
            'note' => $deliveryNote->load(['customer','invoice','items.product','creator']),
        ]);
    }

    public function update(Request $request, DeliveryNote $deliveryNote)
    {
        abort_if($deliveryNote->company_id !== auth()->user()->company_id, 403);
        $deliveryNote->update($request->validate(['status' => 'required|in:draft,dispatched,delivered']));
        return back()->with('success','Status updated.');
    }

    public function destroy(DeliveryNote $deliveryNote)
    {
        abort_if($deliveryNote->company_id !== auth()->user()->company_id, 403);
        $deliveryNote->delete();
        return redirect()->route('sales.delivery-notes.index')->with('success','Delivery note deleted.');
    }
}

<?php
namespace App\Http\Controllers\Purchase;
use App\Http\Controllers\Controller;
use App\Models\GoodsReceipt;
use App\Models\GoodsReceiptItem;
use App\Models\PurchaseOrder;
use App\Models\Product;
use App\Models\Vendor;
use App\Models\ProductStock;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GoodsReceiptController extends Controller
{
    public function index(Request $request)
    {
        $cid = auth()->user()->company_id;
        $grns = GoodsReceipt::where('company_id',$cid)
            ->with(['vendor:id,name','purchaseOrder:id,po_number'])
            ->when($request->search, fn($q,$s)=>$q->where('grn_number','like',"%{$s}%"))
            ->when($request->vendor_id, fn($q,$v)=>$q->where('vendor_id',$v))
            ->latest('receipt_date')->paginate(15)->withQueryString();

        return Inertia::render('Purchase/GoodsReceipts/Index', [
            'grns'    => $grns,
            'vendors' => Vendor::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name']),
            'filters' => $request->only('search','vendor_id'),
        ]);
    }

    public function create(Request $request)
    {
        $cid = auth()->user()->company_id;
        $po = $request->po_id ? PurchaseOrder::where('company_id',$cid)->with(['vendor:id,name','items.product:id,name,code'])->findOrFail($request->po_id) : null;
        return Inertia::render('Purchase/GoodsReceipts/Create', [
            'po'             => $po,
            'vendors'        => Vendor::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name']),
            'products'       => Product::where('company_id',$cid)->where('is_active',true)->orderBy('name')->get(['id','name','code','cost_price']),
            'pendingOrders'  => PurchaseOrder::where('company_id',$cid)->whereIn('status',['approved','partial'])->orderBy('po_number')->get(['id','po_number','vendor_id']),
        ]);
    }

    public function store(Request $request)
    {
        $cid = auth()->user()->company_id;
        $v = $request->validate([
            'purchase_order_id' => 'nullable|exists:purchase_orders,id',
            'vendor_id'         => 'required|exists:vendors,id',
            'receipt_date'      => 'required|date',
            'notes'             => 'nullable',
            'items'             => 'required|array|min:1',
            'items.*.product_id'        => 'required|exists:products,id',
            'items.*.quantity_received' => 'required|numeric|min:0.001',
            'items.*.unit_cost'         => 'required|numeric|min:0',
        ]);

        DB::transaction(function() use ($v, $cid) {
            $num = 'GRN-'.date('Ymd').'-'.str_pad(GoodsReceipt::where('company_id',$cid)->count()+1,4,'0',STR_PAD_LEFT);
            $grn = GoodsReceipt::create([
                'company_id'        => $cid,
                'purchase_order_id' => $v['purchase_order_id'] ?? null,
                'vendor_id'         => $v['vendor_id'],
                'grn_number'        => $num,
                'receipt_date'      => $v['receipt_date'],
                'notes'             => $v['notes'] ?? null,
                'status'            => 'received',
                'created_by'        => auth()->id(),
            ]);

            foreach ($v['items'] as $item) {
                $qty  = (float)$item['quantity_received'];
                $cost = (float)$item['unit_cost'];
                GoodsReceiptItem::create([
                    'goods_receipt_id'   => $grn->id,
                    'product_id'         => $item['product_id'],
                    'quantity_received'  => $qty,
                    'unit_cost'          => $cost,
                    'total_cost'         => $qty * $cost,
                ]);
                // Update stock
                $stock = ProductStock::firstOrCreate(
                    ['product_id' => $item['product_id']],
                    ['company_id' => $cid, 'warehouse_id' => 1, 'quantity' => 0]
                );
                $stock->increment('quantity', $qty);
                StockMovement::create([
                    'company_id'    => $cid,
                    'product_id'    => $item['product_id'],
                    'warehouse_id'  => 1,
                    'movement_type' => 'in',
                    'quantity'      => $qty,
                    'unit_cost'     => $cost,
                    'movement_date' => now()->toDateString(),
                    'reference'     => $num,
                    'notes'         => 'GRN Receipt',
                    'created_by'    => auth()->id(),
                ]);
            }
        });

        return redirect()->route('purchase.goods-receipts.index')->with('success','Goods receipt recorded and stock updated.');
    }

    public function show(GoodsReceipt $goodsReceipt)
    {
        abort_if($goodsReceipt->company_id !== auth()->user()->company_id, 403);
        return Inertia::render('Purchase/GoodsReceipts/Show', [
            'grn' => $goodsReceipt->load(['vendor','purchaseOrder','items.product','creator']),
        ]);
    }

    public function destroy(GoodsReceipt $goodsReceipt)
    {
        abort_if($goodsReceipt->company_id !== auth()->user()->company_id, 403);
        $goodsReceipt->delete();
        return redirect()->route('purchase.goods-receipts.index')->with('success','GRN deleted.');
    }
}

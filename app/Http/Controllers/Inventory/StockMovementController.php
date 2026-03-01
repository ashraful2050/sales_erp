<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\StockMovement;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        $cid = auth()->user()->company_id;

        $movements = StockMovement::where('company_id', $cid)
            ->with(['product:id,name,code', 'warehouse:id,name'])
            ->when($request->product_id, fn($q, $v) => $q->where('product_id', $v))
            ->when($request->warehouse_id, fn($q, $v) => $q->where('warehouse_id', $v))
            ->when($request->movement_type, fn($q, $v) => $q->where('movement_type', $v))
            ->when($request->date_from, fn($q, $v) => $q->whereDate('movement_date', '>=', $v))
            ->when($request->date_to, fn($q, $v) => $q->whereDate('movement_date', '<=', $v))
            ->latest('movement_date')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Inventory/StockMovements/Index', [
            'movements'  => $movements,
            'products'   => Product::where('company_id', $cid)->where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']),
            'warehouses' => Warehouse::where('company_id', $cid)->where('is_active', true)->get(['id', 'name']),
            'filters'    => $request->only('product_id', 'warehouse_id', 'movement_type', 'date_from', 'date_to'),
        ]);
    }

    public function create()
    {
        $cid = auth()->user()->company_id;

        return Inertia::render('Inventory/StockMovements/Create', [
            'products'   => Product::where('company_id', $cid)->where('is_active', true)->orderBy('name')->get(['id', 'name', 'code', 'cost_price', 'sale_price']),
            'warehouses' => Warehouse::where('company_id', $cid)->where('is_active', true)->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $cid = auth()->user()->company_id;

        $validated = $request->validate([
            'product_id'     => 'required|exists:products,id',
            'warehouse_id'   => 'required|exists:warehouses,id',
            'movement_type'  => 'required|in:in,out,adjustment',
            'quantity'       => 'required|numeric',
            'unit_cost'      => 'nullable|numeric|min:0',
            'movement_date'  => 'required|date',
            'reference_type' => 'nullable|string|max:100',
            'notes'          => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $cid, $request) {
            $qty = (float) $validated['quantity'];

            // For stock_out, store as negative
            $movementQty = in_array($validated['movement_type'], ['out']) ? -$qty : $qty;

            // For adjustment, user might enter negative quantity directly
            if ($validated['movement_type'] === 'adjustment') {
                $movementQty = $qty; // positive = add, use notes to explain
            }

            StockMovement::create([
                'company_id'     => $cid,
                'product_id'     => $validated['product_id'],
                'warehouse_id'   => $validated['warehouse_id'],
                'movement_type'  => $validated['movement_type'],
                'quantity'       => $movementQty,
                'unit_cost'      => $validated['unit_cost'] ?? 0,
                'movement_date'  => $validated['movement_date'],
                'reference_type' => $validated['reference_type'] ?? null,
                'notes'          => $validated['notes'] ?? null,
                'created_by'     => auth()->id(),
            ]);

            // Update ProductStock
            $stock = ProductStock::firstOrCreate(
                ['product_id' => $validated['product_id'], 'warehouse_id' => $validated['warehouse_id']],
                ['quantity' => 0, 'avg_cost' => $validated['unit_cost'] ?? 0]
            );

            if ($validated['movement_type'] === 'in') {
                // Recalculate weighted average cost
                $oldQty  = (float) $stock->quantity;
                $oldCost = (float) $stock->avg_cost;
                $newQty  = $oldQty + $qty;
                $unitCost = (float) ($validated['unit_cost'] ?? $oldCost);
                $newAvgCost = $newQty > 0 ? (($oldQty * $oldCost) + ($qty * $unitCost)) / $newQty : $unitCost;

                $stock->update([
                    'quantity' => $newQty,
                    'avg_cost' => round($newAvgCost, 4),
                ]);
            } elseif ($validated['movement_type'] === 'out') {
                $stock->update(['quantity' => max(0, (float) $stock->quantity - $qty)]);
            } elseif ($validated['movement_type'] === 'adjustment') {
                $stock->update(['quantity' => max(0, (float) $stock->quantity + $qty)]);
            }
        });

        return redirect()->route('inventory.stock-movements.index')
            ->with('success', 'Stock movement recorded successfully.');
    }
}

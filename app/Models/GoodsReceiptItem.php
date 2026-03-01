<?php
namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class GoodsReceiptItem extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        'goods_receipt_id', 'product_id', 'purchase_order_item_id',
        'quantity_received', 'unit_cost', 'total_cost', 'notes',
    ];

    protected $casts = [
        'quantity_received' => 'decimal:4',
        'unit_cost'         => 'decimal:4',
        'total_cost'        => 'decimal:4',
    ];

    public function goodsReceipt()     { return $this->belongsTo(GoodsReceipt::class); }
    public function product()          { return $this->belongsTo(Product::class); }
    public function purchaseOrderItem(){ return $this->belongsTo(PurchaseOrderItem::class); }
}

<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model {
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        "purchase_order_id","product_id","warehouse_id","tax_rate_id","description",
        "unit","quantity","unit_price","discount_pct","discount_amount",
        "tax_rate","tax_amount","total","received_qty","sort_order",
    ];
    public function purchaseOrder() { return $this->belongsTo(PurchaseOrder::class); }
    public function product() { return $this->belongsTo(Product::class); }
}

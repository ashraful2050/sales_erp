<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model {
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        "invoice_id","product_id","warehouse_id","tax_rate_id","description",
        "unit","quantity","unit_price","discount_pct","discount_amount",
        "tax_rate","tax_amount","total","sort_order",
    ];
    protected $casts = ["quantity" => "decimal:4", "unit_price" => "decimal:4", "total" => "decimal:4"];
    public function invoice() { return $this->belongsTo(Invoice::class); }
    public function product() { return $this->belongsTo(Product::class); }
    public function taxRate() { return $this->belongsTo(TaxRate::class, "tax_rate_id"); }
}

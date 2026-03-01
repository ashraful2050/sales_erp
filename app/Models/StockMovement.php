<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model {
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        "company_id","product_id","warehouse_id","batch_number","expiry_date",
        "movement_type","reference_type","reference_id","quantity","unit_cost",
        "movement_date","notes","created_by",
    ];
    protected $casts = ["movement_date" => "date", "expiry_date" => "date", "quantity" => "decimal:4"];
    public function product() { return $this->belongsTo(Product::class); }
    public function warehouse() { return $this->belongsTo(Warehouse::class); }
}

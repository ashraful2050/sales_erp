<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    use SoftDeletes;
    protected $fillable = [
        "company_id","category_id","unit_id","tax_rate_id","code","barcode",
        "name","name_bn","description","type","cost_price","sale_price",
        "min_sale_price","reorder_level","reorder_quantity","valuation_method",
        "track_inventory","has_batch","has_expiry","image","is_active",
    ];
    protected $casts = [
        "track_inventory" => "boolean", "has_batch" => "boolean",
        "has_expiry" => "boolean", "is_active" => "boolean",
        "cost_price" => "decimal:4", "sale_price" => "decimal:4",
    ];
    public function company() { return $this->belongsTo(Company::class); }
    public function category() { return $this->belongsTo(ProductCategory::class, "category_id"); }
    public function unit() { return $this->belongsTo(Unit::class); }
    public function taxRate() { return $this->belongsTo(TaxRate::class); }
    public function stocks() { return $this->hasMany(ProductStock::class); }
    public function stockMovements() { return $this->hasMany(StockMovement::class); }
    public function getTotalStockAttribute(): float { return (float)$this->stocks->sum("quantity"); }
}

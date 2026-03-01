<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FixedAsset extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    use SoftDeletes;
    protected $fillable = [
        "company_id","asset_category_id","account_id","asset_code","name","description",
        "serial_number","location","purchase_date","purchase_cost","salvage_value",
        "useful_life_years","depreciation_rate","depreciation_method",
        "accumulated_depreciation","book_value","disposal_date","disposal_value","status",
    ];
    protected $casts = ["purchase_date" => "date", "disposal_date" => "date", "purchase_cost" => "decimal:4", "book_value" => "decimal:4"];
    public function company() { return $this->belongsTo(Company::class); }
    public function category() { return $this->belongsTo(AssetCategory::class, "asset_category_id"); }
    public function depreciations() { return $this->hasMany(AssetDepreciation::class); }
}

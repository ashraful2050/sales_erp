<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class AssetCategory extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = ['company_id','name','useful_life_years','depreciation_rate','depreciation_method','is_active'];
    protected $casts = ['is_active'=>'boolean','useful_life_years'=>'float','depreciation_rate'=>'float'];
    public function fixedAssets() { return $this->hasMany(FixedAsset::class); }
}

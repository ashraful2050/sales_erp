<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = ["company_id","parent_id","name","code","description","is_active"];
    protected $casts = ["is_active" => "boolean"];
    public function products() { return $this->hasMany(Product::class, "category_id"); }
    public function parent() { return $this->belongsTo(ProductCategory::class, "parent_id"); }
}

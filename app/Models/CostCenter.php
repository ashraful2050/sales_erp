<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class CostCenter extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = ['company_id','parent_id','name','code','is_active'];
    protected $casts = ['is_active' => 'boolean'];
    public function parent() { return $this->belongsTo(CostCenter::class,'parent_id'); }
    public function children() { return $this->hasMany(CostCenter::class,'parent_id'); }
    public function budgets() { return $this->hasMany(Budget::class); }
}

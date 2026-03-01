<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class Budget extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = ["company_id","fiscal_year_id","cost_center_id","name","period","status"];
    public function company() { return $this->belongsTo(Company::class); }
    public function lines() { return $this->hasMany(BudgetLine::class); }
    public function fiscalYear() { return $this->belongsTo(FiscalYear::class); }
}

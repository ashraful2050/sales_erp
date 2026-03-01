<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class SalaryComponent extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = ['company_id','name','type','is_taxable','is_pf_applicable','is_active'];
    protected $casts = ['is_taxable'=>'boolean','is_pf_applicable'=>'boolean','is_active'=>'boolean'];
    public function salaryStructures() { return $this->hasMany(EmployeeSalaryStructure::class); }
}

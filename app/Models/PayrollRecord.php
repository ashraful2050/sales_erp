<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class PayrollRecord extends Model {
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        "company_id","payroll_period_id","employee_id","basic_salary",
        "total_earnings","total_deductions","tax_deduction","pf_employee",
        "pf_employer","net_salary","working_days","present_days",
        "absent_days","leave_days","overtime_hours","overtime_amount","status","components",
    ];
    protected $casts = ["components" => "array", "net_salary" => "decimal:4"];
    public function employee() { return $this->belongsTo(Employee::class); }
    public function payrollPeriod() { return $this->belongsTo(PayrollPeriod::class); }
}

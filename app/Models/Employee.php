<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    use SoftDeletes;
    protected $fillable = [
        "company_id","department_id","designation_id","user_id","employee_id",
        "name","name_bn","gender","date_of_birth","joining_date","leaving_date",
        "email","phone","mobile","address","nid_number","tin_number","basic_salary",
        "salary_type","payment_method","bank_account_number","bank_name","photo","status",
    ];
    protected $casts = [
        "date_of_birth" => "date", "joining_date" => "date",
        "leaving_date" => "date", "basic_salary" => "decimal:4",
    ];
    protected $hidden = ["nid_number", "tin_number"];
    public function company() { return $this->belongsTo(Company::class); }
    public function department() { return $this->belongsTo(Department::class); }
    public function designation() { return $this->belongsTo(Designation::class); }
    public function payrollRecords() { return $this->hasMany(PayrollRecord::class); }
    public function leaveRequests() { return $this->hasMany(LeaveRequest::class); }
}

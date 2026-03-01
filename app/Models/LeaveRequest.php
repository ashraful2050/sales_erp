<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        'company_id', 'employee_id', 'leave_type_id',
        'from_date', 'to_date', 'total_days',
        'reason', 'status', 'approved_by', 'approved_at',
    ];

    protected $casts = ['from_date' => 'date', 'to_date' => 'date', 'approved_at' => 'datetime'];

    public function employee()  { return $this->belongsTo(Employee::class); }
    public function leaveType() { return $this->belongsTo(LeaveType::class); }
    public function approvedBy(){ return $this->belongsTo(User::class, 'approved_by'); }
}

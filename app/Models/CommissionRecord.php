<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommissionRecord extends Model
{
    protected $fillable = [
        'company_id', 'user_id', 'commission_structure_id', 'reference_type',
        'reference_id', 'sale_amount', 'commission_amount', 'status',
        'period_date', 'approved_by', 'paid_at',
    ];
    protected $casts = [
        'sale_amount'       => 'decimal:4',
        'commission_amount' => 'decimal:4',
        'period_date'       => 'date',
        'paid_at'           => 'date',
    ];

    public function company()   { return $this->belongsTo(Company::class); }
    public function user()      { return $this->belongsTo(\App\Models\User::class); }
    public function structure() { return $this->belongsTo(CommissionStructure::class, 'commission_structure_id'); }
    public function approvedBy(){ return $this->belongsTo(\App\Models\User::class, 'approved_by'); }
}

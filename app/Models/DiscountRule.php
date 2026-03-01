<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountRule extends Model
{
    protected $fillable = [
        'company_id', 'name', 'code', 'type', 'value', 'max_discount_amount',
        'min_order_amount', 'applies_to', 'applies_to_id', 'usage_limit',
        'usage_count', 'start_date', 'end_date', 'requires_approval',
        'status', 'approved_by', 'is_active',
    ];

    protected $casts = [
        'value'               => 'decimal:4',
        'max_discount_amount' => 'decimal:4',
        'min_order_amount'    => 'decimal:4',
        'requires_approval'   => 'boolean',
        'is_active'           => 'boolean',
        'start_date'          => 'date',
        'end_date'            => 'date',
    ];

    public function company()   { return $this->belongsTo(Company::class); }
    public function approvedBy(){ return $this->belongsTo(\App\Models\User::class, 'approved_by'); }

    public function calculateDiscount(float $amount): float
    {
        if ($this->min_order_amount && $amount < $this->min_order_amount) return 0;
        $discount = $this->type === 'percentage'
            ? $amount * ($this->value / 100)
            : (float) $this->value;
        if ($this->max_discount_amount) $discount = min($discount, (float) $this->max_discount_amount);
        return round($discount, 4);
    }
}

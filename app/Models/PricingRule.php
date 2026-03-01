<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricingRule extends Model
{
    protected $fillable = [
        'company_id', 'name', 'type', 'applies_to', 'applies_to_id',
        'adjustment_value', 'adjustment_type', 'start_date', 'end_date',
        'priority', 'is_active', 'conditions',
    ];

    protected $casts = [
        'adjustment_value' => 'decimal:4',
        'start_date'       => 'date',
        'end_date'         => 'date',
        'is_active'        => 'boolean',
        'conditions'       => 'array',
    ];

    public function company() { return $this->belongsTo(Company::class); }

    public function isValid(): bool
    {
        $now = now()->toDateString();
        if ($this->start_date && $this->start_date > $now) return false;
        if ($this->end_date   && $this->end_date   < $now) return false;
        return $this->is_active;
    }
}

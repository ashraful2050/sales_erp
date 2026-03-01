<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommissionStructure extends Model
{
    protected $fillable = [
        'company_id', 'name', 'type', 'rate', 'tiers', 'applies_to', 'applies_to_id', 'is_active',
    ];
    protected $casts = ['rate' => 'decimal:4', 'tiers' => 'array', 'is_active' => 'boolean'];

    public function company() { return $this->belongsTo(Company::class); }
    public function records() { return $this->hasMany(CommissionRecord::class); }

    public function calculate(float $saleAmount): float
    {
        if ($this->type === 'fixed') return (float) $this->rate;
        if ($this->type === 'percentage') return round($saleAmount * ($this->rate / 100), 4);
        if ($this->type === 'tiered' && $this->tiers) {
            $rate = 0;
            foreach ($this->tiers as $tier) {
                if ($saleAmount >= $tier['min']) $rate = $tier['rate'];
            }
            return round($saleAmount * ($rate / 100), 4);
        }
        return 0;
    }
}

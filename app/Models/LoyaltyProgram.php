<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoyaltyProgram extends Model
{
    protected $fillable = [
        'company_id', 'name', 'description', 'points_per_currency_unit',
        'currency_per_point', 'min_redeem_points', 'point_expiry_days',
        'tier_rules', 'is_active',
    ];

    protected $casts = [
        'points_per_currency_unit' => 'decimal:4',
        'currency_per_point'       => 'decimal:4',
        'tier_rules'               => 'array',
        'is_active'                => 'boolean',
    ];

    public function company()    { return $this->belongsTo(Company::class); }
    public function points()     { return $this->hasMany(LoyaltyPoint::class); }
    public function redemptions(){ return $this->hasMany(LoyaltyRedemption::class); }

    public function getCustomerBalance(int $customerId): int
    {
        return (int) $this->points()
            ->where('customer_id', $customerId)
            ->where(fn($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->selectRaw('SUM(CASE WHEN type = "earned" THEN points WHEN type IN ("redeemed","expired") THEN -points ELSE points END) as balance')
            ->value('balance');
    }

    public function getCustomerTier(int $customerId): string
    {
        if (!$this->tier_rules) return 'standard';
        $totalEarned = (int) $this->points()
            ->where('customer_id', $customerId)
            ->where('type', 'earned')
            ->sum('points');
        $tier = 'standard';
        foreach ($this->tier_rules as $t) {
            if ($totalEarned >= $t['min_points']) $tier = $t['name'];
        }
        return $tier;
    }
}

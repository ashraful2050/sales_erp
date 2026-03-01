<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Affiliate extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'affiliate_code',
        'commission_rate', 'balance', 'total_earned', 'status', 'notes',
    ];

    protected $casts = [
        'commission_rate' => 'float',
        'balance'         => 'float',
        'total_earned'    => 'float',
    ];

    // ─── Relationships ───────────────────────────────────────────────────────

    public function conversions()
    {
        return $this->hasMany(AffiliateConversion::class);
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    public static function generateCode(): string
    {
        do {
            $code = strtoupper(Str::random(8));
        } while (self::where('affiliate_code', $code)->exists());

        return $code;
    }

    public function getAffiliateUrlAttribute(): string
    {
        return url('/register/tenant') . '?ref=' . $this->affiliate_code;
    }

    /**
     * Record a new conversion and update earnings.
     */
    public function recordConversion(
        int $companyId,
        int $subscriptionId,
        int $planId,
        string $billingCycle,
        float $amountPaid
    ): AffiliateConversion {
        $commission = round($amountPaid * $this->commission_rate / 100, 2);

        $conversion = $this->conversions()->create([
            'company_id'      => $companyId,
            'subscription_id' => $subscriptionId,
            'plan_id'         => $planId,
            'billing_cycle'   => $billingCycle,
            'amount_paid'     => $amountPaid,
            'commission_amount' => $commission,
            'status'          => 'pending',
        ]);

        // Update balances
        $this->increment('balance', $commission);
        $this->increment('total_earned', $commission);

        return $conversion;
    }
}

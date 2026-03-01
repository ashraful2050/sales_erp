<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AffiliateConversion extends Model
{
    protected $fillable = [
        'affiliate_id', 'company_id', 'subscription_id', 'plan_id',
        'billing_cycle', 'amount_paid', 'commission_amount', 'status', 'paid_at',
    ];

    protected $casts = [
        'amount_paid'       => 'float',
        'commission_amount' => 'float',
        'paid_at'           => 'datetime',
    ];

    // ─── Relationships ───────────────────────────────────────────────────────

    public function affiliate()
    {
        return $this->belongsTo(Affiliate::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}

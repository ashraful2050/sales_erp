<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        'company_id', 'plan_id', 'billing_cycle', 'status',
        'starts_at', 'expires_at', 'trial_ends_at',
        'payment_reference', 'amount_paid', 'currency', 'meta',
    ];

    protected $casts = [
        'starts_at'      => 'datetime',
        'expires_at'     => 'datetime',
        'trial_ends_at'  => 'datetime',
        'meta'           => 'array',
        'amount_paid'    => 'float',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function isActive(): bool
    {
        if ($this->status === 'active' && ($this->expires_at === null || $this->expires_at->isFuture())) {
            return true;
        }
        if ($this->status === 'trial' && $this->trial_ends_at && $this->trial_ends_at->isFuture()) {
            return true;
        }
        return false;
    }

    public function isExpired(): bool
    {
        return !$this->isActive();
    }

    public function daysLeft(): int
    {
        $end = $this->status === 'trial' ? $this->trial_ends_at : $this->expires_at;
        if (!$end) return 9999;
        return max(0, now()->diffInDays($end, false));
    }
}

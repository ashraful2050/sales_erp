<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactRequest extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        'name', 'email', 'phone', 'company_name', 'company_size',
        'industry', 'message', 'plan_interest', 'status',
        'admin_notes', 'plan_id', 'admin_password_set',
        'approved_at', 'rejected_at', 'ip_address',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    /* ── Relationships ─────────────────────────────────── */

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /* ── Helpers ───────────────────────────────────────── */

    public function isPending(): bool  { return $this->status === 'pending'; }
    public function isApproved(): bool { return $this->status === 'approved'; }
    public function isRejected(): bool { return $this->status === 'rejected'; }

    /* ── Scopes ────────────────────────────────────────── */

    public function scopePending($query)  { return $query->where('status', 'pending'); }
    public function scopeApproved($query) { return $query->where('status', 'approved'); }
}

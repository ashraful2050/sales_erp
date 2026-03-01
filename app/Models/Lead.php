<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use SoftDeletes, LogsActivity;

    public function auditLabel(): string { return $this->title ?? '#' . $this->getKey(); }

    protected $fillable = [
        'company_id', 'title', 'contact_name', 'contact_email', 'contact_phone',
        'company_name', 'source', 'status', 'priority', 'estimated_value',
        'score', 'industry', 'notes', 'expected_close_date', 'assigned_to', 'customer_id',
    ];

    protected $casts = [
        'estimated_value' => 'decimal:4',
        'score'           => 'decimal:2',
        'expected_close_date' => 'date',
    ];

    public function company()      { return $this->belongsTo(Company::class); }
    public function assignedTo()   { return $this->belongsTo(\App\Models\User::class, 'assigned_to'); }
    public function customer()     { return $this->belongsTo(Customer::class); }
    public function activities()   { return $this->hasMany(LeadActivity::class); }

    /** Recalculate AI lead score based on engagement & profile completeness */
    public function recalculateScore(): void
    {
        $score = 0;
        if ($this->contact_email)   $score += 10;
        if ($this->contact_phone)   $score += 10;
        if ($this->company_name)    $score += 10;
        if ($this->estimated_value > 0) $score += 15;
        if ($this->expected_close_date) $score += 5;

        $activityCount = $this->activities()->count();
        $score += min($activityCount * 5, 30); // max 30 from activities

        // Status bonus
        $statusBonus = ['new' => 0, 'contacted' => 5, 'qualified' => 15, 'proposal' => 20, 'negotiation' => 15, 'won' => 20, 'lost' => 0];
        $score += $statusBonus[$this->status] ?? 0;

        $this->score = min($score, 100);
        $this->saveQuietly();
    }
}

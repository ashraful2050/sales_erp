<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use SoftDeletes, LogsActivity;

    public function auditLabel(): string { return $this->title ?? '#' . $this->getKey(); }

    protected $fillable = [
        'company_id', 'title', 'description', 'type', 'status', 'priority',
        'assigned_to', 'created_by', 'related_type', 'related_id', 'due_date', 'completed_at',
    ];

    protected $casts = [
        'due_date'     => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function company()    { return $this->belongsTo(Company::class); }
    public function assignedTo() { return $this->belongsTo(\App\Models\User::class, 'assigned_to'); }
    public function createdBy()  { return $this->belongsTo(\App\Models\User::class, 'created_by'); }
    public function comments()   { return $this->hasMany(TaskComment::class); }

    public function related() { return $this->morphTo(); }

    public function markCompleted(): void
    {
        $this->update(['status' => 'completed', 'completed_at' => now()]);
    }
}

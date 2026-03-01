<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SupportTicket extends Model
{
    use SoftDeletes, LogsActivity;

    public function auditLabel(): string { return '#' . $this->ticket_number; }

    protected $fillable = [
        'company_id', 'ticket_number', 'subject', 'description', 'channel',
        'priority', 'status', 'category', 'customer_id', 'assigned_to',
        'created_by', 'requester_name', 'requester_email', 'satisfaction_rating',
        'satisfaction_feedback', 'first_response_at', 'resolved_at',
    ];

    protected $casts = [
        'satisfaction_rating' => 'decimal:1',
        'first_response_at'   => 'datetime',
        'resolved_at'         => 'datetime',
    ];

    public function company()    { return $this->belongsTo(Company::class); }
    public function customer()   { return $this->belongsTo(Customer::class); }
    public function assignedTo() { return $this->belongsTo(\App\Models\User::class, 'assigned_to'); }
    public function createdBy()  { return $this->belongsTo(\App\Models\User::class, 'created_by'); }
    public function replies()    { return $this->hasMany(TicketReply::class); }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($ticket) {
            $ticket->ticket_number = 'TKT-' . strtoupper(uniqid());
        });
    }
}

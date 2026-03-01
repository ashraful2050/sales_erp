<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class EmailLog extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        'mailable_class',
        'subject',
        'to',
        'cc',
        'bcc',
        'from_address',
        'from_name',
        'status',
        'error_message',
        'context',
        'loggable_id',
        'loggable_type',
        'sent_at',
    ];

    protected $casts = [
        'to'       => 'array',
        'cc'       => 'array',
        'bcc'      => 'array',
        'context'  => 'array',
        'sent_at'  => 'datetime',
    ];

    public function loggable()
    {
        return $this->morphTo();
    }

    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }
}

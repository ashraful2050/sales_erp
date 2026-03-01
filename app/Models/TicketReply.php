<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketReply extends Model
{
    protected $fillable = ['support_ticket_id', 'user_id', 'message', 'type', 'is_customer_reply'];
    protected $casts    = ['is_customer_reply' => 'boolean'];

    public function ticket() { return $this->belongsTo(SupportTicket::class, 'support_ticket_id'); }
    public function user()   { return $this->belongsTo(\App\Models\User::class); }
}

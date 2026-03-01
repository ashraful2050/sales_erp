<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentAllocation extends Model
{
    protected $fillable = [
        'payment_id',
        'reference_type',
        'reference_id',
        'allocated_amount',
    ];

    protected $casts = [
        'allocated_amount' => 'decimal:4',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'reference_id')
            ->where('reference_type', 'invoice');
    }
}

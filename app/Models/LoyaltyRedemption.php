<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoyaltyRedemption extends Model
{
    protected $fillable = [
        'company_id', 'customer_id', 'loyalty_program_id', 'points_redeemed',
        'discount_amount', 'reference_type', 'reference_id', 'status',
    ];
    protected $casts = ['discount_amount' => 'decimal:4'];

    public function program()  { return $this->belongsTo(LoyaltyProgram::class, 'loyalty_program_id'); }
    public function customer() { return $this->belongsTo(Customer::class); }
}

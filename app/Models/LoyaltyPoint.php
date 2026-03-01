<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoyaltyPoint extends Model
{
    protected $fillable = [
        'company_id', 'customer_id', 'loyalty_program_id', 'points',
        'type', 'reference_type', 'reference_id', 'notes', 'expires_at',
    ];
    protected $casts = ['expires_at' => 'date'];

    public function program()  { return $this->belongsTo(LoyaltyProgram::class, 'loyalty_program_id'); }
    public function customer() { return $this->belongsTo(Customer::class); }
}

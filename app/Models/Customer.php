<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    use SoftDeletes;
    protected $fillable = [
        "company_id","account_id","code","name","name_bn","contact_person",
        "email","phone","mobile","address","city","country",
        "tin_number","bin_number","currency_code","credit_limit",
        "credit_days","opening_balance","balance_type","is_active","notes",
    ];
    protected $casts = ["is_active" => "boolean", "credit_limit" => "decimal:4"];
    public function company() { return $this->belongsTo(Company::class); }
    public function invoices() { return $this->hasMany(Invoice::class); }
    public function payments() { return $this->hasMany(Payment::class); }
}

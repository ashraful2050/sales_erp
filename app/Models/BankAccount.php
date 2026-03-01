<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->account_name ?? '#' . $this->getKey(); }

    protected $fillable = [
        "company_id","account_id","bank_name","account_name","account_number",
        "branch_name","routing_number","swift_code","currency_code",
        "opening_balance","payment_method","is_active",
    ];
    public function company() { return $this->belongsTo(Company::class); }
    public function account() { return $this->belongsTo(Account::class); }
    public function transactions() { return $this->hasMany(BankTransaction::class); }
}

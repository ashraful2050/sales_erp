<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->reference ?? '#' . $this->getKey(); }

    use SoftDeletes;
    protected $fillable = [
        "company_id","journal_entry_id","payment_number","type","customer_id",
        "vendor_id","bank_account_id","payment_date","amount","currency_code",
        "exchange_rate","payment_method","reference","notes","status","created_by",
    ];
    protected $casts = ["payment_date" => "date", "amount" => "decimal:4"];
    public function company() { return $this->belongsTo(Company::class); }
    public function customer() { return $this->belongsTo(Customer::class); }
    public function vendor() { return $this->belongsTo(Vendor::class); }
    public function bankAccount() { return $this->belongsTo(BankAccount::class); }
    public function allocations() { return $this->hasMany(PaymentAllocation::class); }
}

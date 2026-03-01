<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class Account extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = [
        "company_id","account_group_id","code","name","name_bn","type",
        "sub_type","opening_balance","balance_type","currency_code",
        "is_active","is_system","description",
    ];
    protected $casts = ["is_active" => "boolean", "is_system" => "boolean"];
    public function company() { return $this->belongsTo(Company::class); }
    public function group() { return $this->belongsTo(AccountGroup::class, "account_group_id"); }
    public function journalLines() { return $this->hasMany(JournalEntryLine::class); }
}

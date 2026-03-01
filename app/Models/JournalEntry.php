<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class JournalEntry extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->reference ?? '#' . $this->getKey(); }

    protected $fillable = [
        "company_id","fiscal_year_id","voucher_number","type","date",
        "narration","reference","currency_code","exchange_rate",
        "status","created_by","approved_by","posted_at",
    ];
    protected $casts = ["date" => "date", "posted_at" => "datetime", "exchange_rate" => "decimal:6"];
    public function company() { return $this->belongsTo(Company::class); }
    public function lines() { return $this->hasMany(JournalEntryLine::class); }
    public function createdBy() { return $this->belongsTo(User::class, "created_by"); }
    public function getTotalDebitAttribute(): float { return (float)$this->lines->sum("debit"); }
    public function getTotalCreditAttribute(): float { return (float)$this->lines->sum("credit"); }
}

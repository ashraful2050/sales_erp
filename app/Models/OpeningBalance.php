<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class OpeningBalance extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        'company_id', 'account_id', 'fiscal_year_id',
        'debit', 'credit', 'notes', 'created_by',
    ];

    protected $casts = [
        'debit'  => 'decimal:2',
        'credit' => 'decimal:2',
    ];

    public function company()    { return $this->belongsTo(Company::class); }
    public function account()    { return $this->belongsTo(Account::class); }
    public function fiscalYear() { return $this->belongsTo(FiscalYear::class); }
    public function creator()    { return $this->belongsTo(User::class, 'created_by'); }
}

<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class BankTransaction extends Model {
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        'company_id','bank_account_id','transaction_date','description',
        'debit','credit','balance','reference','is_reconciled','reconciled_date','journal_entry_id'
    ];
    protected $casts = ['is_reconciled'=>'boolean','transaction_date'=>'date','reconciled_date'=>'date'];
    public function bankAccount() { return $this->belongsTo(BankAccount::class); }
    public function journalEntry() { return $this->belongsTo(JournalEntry::class); }
}

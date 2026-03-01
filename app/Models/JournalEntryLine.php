<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class JournalEntryLine extends Model {
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = ["journal_entry_id","account_id","debit","credit","description","reference","sort_order"];
    protected $casts = ["debit" => "decimal:4", "credit" => "decimal:4"];
    public function journalEntry() { return $this->belongsTo(JournalEntry::class); }
    public function account() { return $this->belongsTo(Account::class); }
}

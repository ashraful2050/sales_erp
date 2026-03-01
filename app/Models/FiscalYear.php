<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class FiscalYear extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = ["company_id","name","start_date","end_date","status"];
    protected $casts = ["start_date" => "date", "end_date" => "date"];
    public function company() { return $this->belongsTo(Company::class); }
    public function journalEntries() { return $this->hasMany(JournalEntry::class); }
}

<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class PayrollPeriod extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = ["company_id","name","start_date","end_date","payment_date","status","journal_entry_id"];
    protected $casts = ["start_date" => "date", "end_date" => "date", "payment_date" => "date"];
    public function company() { return $this->belongsTo(Company::class); }
    public function records() { return $this->hasMany(PayrollRecord::class); }
}

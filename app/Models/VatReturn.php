<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class VatReturn extends Model {
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        "company_id","return_period","period_start","period_end","output_vat",
        "input_vat","net_vat","total_sales","total_purchases","status",
        "submission_date","return_reference","created_by",
    ];
    protected $casts = [
        "period_start" => "date", "period_end" => "date", "submission_date" => "date",
        "output_vat" => "decimal:4", "net_vat" => "decimal:4",
    ];
    public function company() { return $this->belongsTo(Company::class); }
}

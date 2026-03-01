<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesForecast extends Model
{
    protected $fillable = [
        'company_id', 'period', 'type', 'forecasted_value', 'actual_value',
        'confidence_score', 'method', 'model_data',
    ];
    protected $casts = [
        'forecasted_value' => 'decimal:4',
        'actual_value'     => 'decimal:4',
        'confidence_score' => 'decimal:2',
        'model_data'       => 'array',
    ];

    public function company() { return $this->belongsTo(Company::class); }
}

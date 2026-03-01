<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class TaxRate extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = ["company_id","name","code","rate","type","description","is_active"];
    protected $casts = ["is_active" => "boolean", "rate" => "decimal:4"];
    public function company() { return $this->belongsTo(Company::class); }
}

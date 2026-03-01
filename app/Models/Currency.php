<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = ["code","name","symbol","exchange_rate","is_active"];
    protected $casts = ["is_active" => "boolean", "exchange_rate" => "decimal:6"];
}

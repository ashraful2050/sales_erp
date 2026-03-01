<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class BudgetLine extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        'budget_id', 'account_id', 'month', 'budgeted_amount',
    ];

    public function budget()  { return $this->belongsTo(Budget::class); }
    public function account() { return $this->belongsTo(Account::class); }
}

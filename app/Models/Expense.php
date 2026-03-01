<?php
namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return $this->reference ?? '#' . $this->getKey(); }

    use SoftDeletes;

    protected $fillable = [
        'company_id', 'expense_category_id', 'expense_number', 'expense_date',
        'title', 'amount', 'payment_method', 'bank_account_id',
        'reference', 'notes', 'status', 'created_by',
    ];

    protected $casts = ['amount' => 'decimal:4', 'expense_date' => 'date'];

    public function category()    { return $this->belongsTo(ExpenseCategory::class, 'expense_category_id'); }
    public function bankAccount() { return $this->belongsTo(BankAccount::class); }
    public function creator()     { return $this->belongsTo(User::class, 'created_by'); }
    public function company()     { return $this->belongsTo(Company::class); }
}

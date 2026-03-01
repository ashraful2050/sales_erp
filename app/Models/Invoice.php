<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use LogsActivity, SoftDeletes;

    public function auditLabel(): string { return $this->invoice_number ?? '#' . $this->getKey(); }

    protected $fillable = [
        'company_id','customer_id','journal_entry_id','invoice_number','type',
        'invoice_date','due_date','currency_code','exchange_rate','subtotal',
        'discount_amount','tax_amount','total_amount','paid_amount',
        'status','is_tax_inclusive','language','notes','terms','shipping_address','created_by',
    ];
    protected $casts = [
        'invoice_date' => 'date', 'due_date' => 'date',
        'is_tax_inclusive' => 'boolean',
        'subtotal' => 'decimal:4', 'total_amount' => 'decimal:4', 'paid_amount' => 'decimal:4',
    ];

    public function company() { return $this->belongsTo(Company::class); }
    public function customer() { return $this->belongsTo(Customer::class); }
    public function items() { return $this->hasMany(InvoiceItem::class); }
    public function journalEntry() { return $this->belongsTo(JournalEntry::class); }
    public function createdBy() { return $this->belongsTo(User::class, 'created_by'); }

    public function getDueAmountAttribute(): float {
        return (float)$this->total_amount - (float)$this->paid_amount;
    }

    public function scopeOverdue($query) {
        return $query->where('due_date', '<', now())->whereIn('status', ['sent','partial']);
    }
}

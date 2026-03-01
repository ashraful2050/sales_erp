<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return $this->voucher_number ?? '#' . $this->getKey(); }

    protected $fillable = [
        'company_id', 'voucher_number', 'voucher_type', 'voucher_date',
        'payment_method_id', 'from_payment_method_id', 'to_payment_method_id',
        'account_id', 'amount', 'narration', 'reference',
        'status', 'approved_by', 'approved_at', 'rejection_reason',
        'created_by', 'journal_entry_id',
    ];

    protected $casts = [
        'voucher_date' => 'date',
        'approved_at'  => 'datetime',
        'amount'       => 'decimal:2',
    ];

    public function company()           { return $this->belongsTo(Company::class); }
    public function paymentMethod()     { return $this->belongsTo(PaymentMethod::class, 'payment_method_id'); }
    public function fromMethod()        { return $this->belongsTo(PaymentMethod::class, 'from_payment_method_id'); }
    public function toMethod()          { return $this->belongsTo(PaymentMethod::class, 'to_payment_method_id'); }
    public function account()           { return $this->belongsTo(Account::class); }
    public function approvedBy()        { return $this->belongsTo(User::class, 'approved_by'); }
    public function creator()           { return $this->belongsTo(User::class, 'created_by'); }
    public function journalEntry()      { return $this->belongsTo(JournalEntry::class); }

    public function isPending()  { return $this->status === 'pending'; }
    public function isApproved() { return $this->status === 'approved'; }
    public function isDraft()    { return $this->status === 'draft'; }

    /** Generate next voucher number for a given type & company */
    public static function nextNumber(int $companyId, string $type): string
    {
        $prefix = match ($type) {
            'debit'          => 'DV',
            'credit'         => 'CV',
            'contra'         => 'CNV',
            'service'        => 'SV',
            'cash_adjustment'=> 'CAV',
            default          => 'VCH',
        };
        $year  = date('Y');
        $count = self::where('company_id', $companyId)
                     ->where('voucher_type', $type)
                     ->whereYear('created_at', $year)
                     ->count() + 1;
        return $prefix . '-' . $year . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}

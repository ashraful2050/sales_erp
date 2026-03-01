<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = [
        'company_id', 'name', 'type', 'account_id',
        'is_default', 'is_active', 'notes',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_active'  => 'boolean',
    ];

    public function company()  { return $this->belongsTo(Company::class); }
    public function account()  { return $this->belongsTo(Account::class); }
    public function vouchers() { return $this->hasMany(Voucher::class, 'payment_method_id'); }

    /** Seed default payment methods for a newly created company. */
    public static function seedDefaults(int $companyId): void
    {
        if (static::where('company_id', $companyId)->exists()) {
            return; // already has methods, skip
        }

        $defaults = [
            ['name' => 'Cash',          'type' => 'cash',           'is_default' => true],
            ['name' => 'Bank Transfer', 'type' => 'bank',           'is_default' => false],
            ['name' => 'bKash',         'type' => 'mobile_banking', 'is_default' => false],
            ['name' => 'Nagad',         'type' => 'mobile_banking', 'is_default' => false],
            ['name' => 'Cheque',        'type' => 'bank',           'is_default' => false],
        ];

        foreach ($defaults as $d) {
            static::create(array_merge($d, [
                'company_id' => $companyId,
                'is_active'  => true,
            ]));
        }
    }
}

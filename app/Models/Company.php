<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Company extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = [
        'name', 'slug', 'name_bn', 'trade_license', 'tin_number', 'bin_number',
        'address', 'city', 'country', 'phone', 'email', 'website',
        'logo', 'currency_code', 'fiscal_year_start', 'language', 'settings',
        'status', 'is_verified', 'timezone', 'date_format',
        'primary_user_id', 'last_active_at', 'suspension_reason',
    ];

    protected $casts = [
        'settings'       => 'array',
        'is_verified'    => 'boolean',
        'last_active_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($company) {
            if (empty($company->slug)) {
                $company->slug = Str::slug($company->name) . '-' . Str::random(6);
            }
        });
    }

    // --- Relationships ---
    public function users()        { return $this->hasMany(User::class); }
    public function primaryUser()  { return $this->belongsTo(User::class, 'primary_user_id'); }
    public function accounts()     { return $this->hasMany(Account::class); }
    public function customers()    { return $this->hasMany(Customer::class); }
    public function vendors()      { return $this->hasMany(Vendor::class); }
    public function invoices()     { return $this->hasMany(Invoice::class); }
    public function purchaseOrders() { return $this->hasMany(PurchaseOrder::class); }
    public function employees()    { return $this->hasMany(Employee::class); }
    public function fiscalYears()  { return $this->hasMany(FiscalYear::class); }
    public function taxRates()     { return $this->hasMany(TaxRate::class); }
    public function products()     { return $this->hasMany(Product::class); }
    public function warehouses()   { return $this->hasMany(Warehouse::class); }
    public function bankAccounts() { return $this->hasMany(BankAccount::class); }
    public function subscriptions(){ return $this->hasMany(Subscription::class)->orderByDesc('created_at'); }

    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)
            ->whereIn('status', ['active', 'trial'])
            ->latest();
    }

    // --- Helpers ---
    public function currentPlan(): ?Plan
    {
        $sub = $this->activeSubscription;
        return $sub?->plan;
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isSuspended(): bool
    {
        return $this->status === 'suspended';
    }

    public function usersCount(): int
    {
        return $this->users()->count();
    }
}

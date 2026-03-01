<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        'name', 'slug', 'description',
        'price_monthly', 'price_yearly',
        'max_users', 'max_invoices_per_month', 'max_products', 'max_employees',
        'trial_days', 'features', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'features'          => 'array',
        'is_active'         => 'boolean',
        'price_monthly'     => 'float',
        'price_yearly'      => 'float',
    ];

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeCompanies()
    {
        return $this->subscriptions()->where('status', 'active')->with('company');
    }

    public function hasFeature(string $key): bool
    {
        return in_array($key, $this->features ?? []);
    }
}

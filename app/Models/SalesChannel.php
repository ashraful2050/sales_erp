<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesChannel extends Model
{
    protected $fillable = [
        'company_id', 'name', 'type', 'platform', 'api_key', 'api_secret',
        'webhook_url', 'settings', 'auto_sync', 'last_sync_at', 'sync_status', 'is_active',
    ];
    protected $casts = [
        'settings'     => 'array',
        'auto_sync'    => 'boolean',
        'is_active'    => 'boolean',
        'last_sync_at' => 'datetime',
    ];
    protected $hidden = ['api_key', 'api_secret'];

    public function company() { return $this->belongsTo(Company::class); }
}

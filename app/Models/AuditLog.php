<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'company_id', 'user_id', 'user_name', 'user_email',
        'model_type', 'model_id', 'action',
        'module', 'auditable_label', 'url', 'event',
        'old_values', 'new_values',
        'ip_address', 'user_agent', 'description', 'created_at',
    ];

    protected $casts = [
        'old_values'  => 'array',
        'new_values'  => 'array',
        'created_at'  => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Record an audit entry. Uses the existing schema columns.
     */
    public static function record(
        string $action,
        ?Model  $auditable   = null,
        array  $oldValues    = [],
        array  $newValues    = [],
        ?string $module      = null,
        ?string $description = null,
    ): self {
        $user    = auth()->user();
        $request = request();

        return static::create([
            'company_id'     => $user?->company_id,
            'user_id'        => $user?->id,
            'user_name'      => $user?->name,
            'user_email'     => $user?->email,
            'model_type'     => $auditable ? get_class($auditable) : null,
            'model_id'       => $auditable?->getKey(),
            'action'         => $action,
            'module'         => $module,
            'auditable_label'=> $description ?? ($auditable && method_exists($auditable, 'auditLabel') ? $auditable->auditLabel() : null),
            'url'            => $request?->fullUrl(),
            'old_values'     => $oldValues ?: null,
            'new_values'     => $newValues ?: null,
            'ip_address'     => $request?->ip(),
            'user_agent'     => $request?->userAgent(),
            'description'    => $description,
            'created_at'     => now(),
        ]);
    }
}

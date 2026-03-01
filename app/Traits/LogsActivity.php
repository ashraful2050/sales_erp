<?php

namespace App\Traits;

use App\Models\AuditLog;

trait LogsActivity
{
    protected static function bootLogsActivity(): void
    {
        static::created(function ($model) {
            try {
                AuditLog::record(
                    'created',
                    $model,
                    [],
                    $model->getAttributes(),
                    static::$auditModule ?? static::getAuditModule($model),
                    static::getAuditDescription($model, 'created')
                );
            } catch (\Throwable $e) {
                // Silently skip audit logging if audit_logs table doesn't exist yet
                // (e.g. during migrate:fresh) or if any other error occurs
            }
        });

        static::updated(function ($model) {
            try {
                AuditLog::record(
                    'updated',
                    $model,
                    $model->getOriginal(),
                    $model->getChanges(),
                    static::$auditModule ?? static::getAuditModule($model),
                    static::getAuditDescription($model, 'updated')
                );
            } catch (\Throwable $e) {
                //
            }
        });

        static::deleted(function ($model) {
            try {
                AuditLog::record(
                    'deleted',
                    $model,
                    $model->getAttributes(),
                    [],
                    static::$auditModule ?? static::getAuditModule($model),
                    static::getAuditDescription($model, 'deleted')
                );
            } catch (\Throwable $e) {
                //
            }
        });
    }

    private static function getAuditModule($model): string
    {
        // Derive module from class name, e.g. App\Models\Invoice => Invoice
        $class = class_basename($model);
        return $class;
    }

    private static function getAuditDescription($model, string $action): string
    {
        $label = method_exists($model, 'auditLabel')
            ? $model->auditLabel()
            : ('#' . $model->getKey());

        return ucfirst($action) . ' ' . class_basename($model) . ' ' . $label;
    }
}

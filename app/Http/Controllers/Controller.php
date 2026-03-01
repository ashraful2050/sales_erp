<?php

namespace App\Http\Controllers;

abstract class Controller
{
    /**
     * Abort with 403 if the authenticated user lacks a specific permission.
     * SuperAdmin is always allowed.
     *
     * Usage: $this->requirePermission('sales.create');
     */
    protected function requirePermission(string $permission): void
    {
        $user = auth()->user();
        abort_unless($user && $user->hasPermission($permission), 403,
            'You do not have permission to perform this action.');
    }

    /**
     * Return true if the authenticated user has a permission (safe check, no abort).
     */
    protected function userCan(string $permission): bool
    {
        $user = auth()->user();
        return $user && $user->hasPermission($permission);
    }
}

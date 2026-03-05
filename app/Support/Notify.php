<?php

namespace App\Support;

use App\Http\Controllers\PushSubscriptionController;
use App\Models\User;

/**
 * Thin wrapper around PushSubscriptionController::sendToUsers.
 * All methods are fire-and-forget — they never throw exceptions.
 */
class Notify
{
    /**
     * Send a push notification to a list of user IDs.
     */
    public static function push(array $userIds, string $title, string $body, string $url = '/'): void
    {
        $userIds = array_values(array_unique(array_filter($userIds)));
        if (empty($userIds)) return;

        try {
            PushSubscriptionController::sendToUsers($userIds, [
                'title' => $title,
                'body'  => $body,
                'url'   => $url,
            ]);
        } catch (\Throwable) {
            // Never crash the request for a failed push notification
        }
    }

    /**
     * Send to a single user (skips if null or 0).
     */
    public static function user(?int $userId, string $title, string $body, string $url = '/'): void
    {
        if (!$userId) return;
        static::push([$userId], $title, $body, $url);
    }

    /**
     * Send to all admin users of a company who are subscribed.
     */
    public static function admins(int $companyId, string $title, string $body, string $url = '/'): void
    {
        $ids = User::where('company_id', $companyId)
            ->where('role', 'admin')
            ->where('is_active', true)
            ->pluck('id')
            ->toArray();

        static::push($ids, $title, $body, $url);
    }

    /**
     * Send to all admins + a specific user (e.g. notify admins AND the creator).
     */
    public static function adminsAndUser(int $companyId, ?int $userId, string $title, string $body, string $url = '/'): void
    {
        $ids = User::where('company_id', $companyId)
            ->where('role', 'admin')
            ->where('is_active', true)
            ->pluck('id')
            ->toArray();

        if ($userId) $ids[] = $userId;

        static::push($ids, $title, $body, $url);
    }
}

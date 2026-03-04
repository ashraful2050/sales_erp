<?php

namespace App\Http\Controllers;

use App\Models\PushSubscription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\VAPID;

class PushSubscriptionController extends Controller
{
    /**
     * Save (or update) a push subscription for the authenticated user.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'endpoint' => ['required', 'url'],
            'p256dh'   => ['required', 'string'],
            'auth'     => ['required', 'string'],
        ]);

        PushSubscription::updateOrCreate(
            ['endpoint'  => $data['endpoint']],
            [
                'user_id' => $request->user()->id,
                'p256dh'  => $data['p256dh'],
                'auth'    => $data['auth'],
            ]
        );

        return response()->json(['message' => 'Subscription saved.']);
    }

    /**
     * Remove a push subscription.
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->validate(['endpoint' => ['required', 'string']]);

        PushSubscription::where('endpoint', $request->endpoint)
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json(['message' => 'Subscription removed.']);
    }

    // ──────────────────────────────────────────────────────────────────────
    // Helper: send a push notification to a specific user (call from anywhere)
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Send a push notification to all subscriptions of the given user IDs.
     *
     * Usage:
     *   PushSubscriptionController::sendToUsers([1, 2], [
     *       'title' => 'Invoice Approved',
     *       'body'  => 'Invoice #INV-0042 has been approved.',
     *       'url'   => '/sales/invoices/42',
     *   ]);
     */
    public static function sendToUsers(array $userIds, array $payload): void
    {
        $vapidPublic  = config('services.vapid.public_key');
        $vapidPrivate = config('services.vapid.private_key');

        if (!$vapidPublic || !$vapidPrivate) {
            return; // VAPID keys not configured
        }

        $auth = [
            'VAPID' => [
                'subject'    => config('app.url'),
                'publicKey'  => $vapidPublic,
                'privateKey' => $vapidPrivate,
            ],
        ];

        $webPush = new WebPush($auth);

        $subscriptions = PushSubscription::whereIn('user_id', $userIds)->get();

        foreach ($subscriptions as $sub) {
            $webPush->queueNotification(
                Subscription::create([
                    'endpoint'        => $sub->endpoint,
                    'keys'            => [
                        'p256dh' => $sub->p256dh,
                        'auth'   => $sub->auth,
                    ],
                ]),
                json_encode($payload)
            );
        }

        foreach ($webPush->flush() as $report) {
            if ($report->isSubscriptionExpired()) {
                PushSubscription::where('endpoint', $report->getEndpoint())->delete();
            }
        }
    }
}

<?php

namespace App\Support;

use App\Models\EmailLog;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class MailLogger
{
    /**
     * Send a mailable and log the result to email_logs.
     *
     * @param  string|array  $to         Recipient email or ['email' => ..., 'name' => ...]
     * @param  Mailable      $mailable
     * @param  array         $context    Optional metadata to store (e.g. ['company_id' => 5])
     * @param  object|null   $loggable   Optional Eloquent model for morphic link
     * @return bool
     */
    public static function send(
        string|array $to,
        Mailable $mailable,
        array $context = [],
        ?object $loggable = null
    ): bool {
        $recipients = is_array($to) ? $to : [['address' => $to, 'name' => null]];
        if (isset($to['email'])) {
            $recipients = [['address' => $to['email'], 'name' => $to['name'] ?? null]];
        }

        // Resolve subject from the mailable's envelope
        $subject = null;
        try {
            $envelope = $mailable->envelope();
            $subject  = $envelope->subject ?? null;
        } catch (\Throwable) {}

        $toAddress = is_string($to) ? $to : ($to['email'] ?? ($to[0]['address'] ?? ''));

        try {
            Mail::to($toAddress)->send($mailable);

            EmailLog::create([
                'mailable_class' => get_class($mailable),
                'subject'        => $subject,
                'to'             => $recipients,
                'from_address'   => config('mail.from.address'),
                'from_name'      => config('mail.from.name'),
                'status'         => 'sent',
                'context'        => $context ?: null,
                'loggable_id'    => $loggable?->id,
                'loggable_type'  => $loggable ? get_class($loggable) : null,
                'sent_at'        => now(),
            ]);

            return true;

        } catch (\Throwable $e) {
            Log::error('Mail sending failed', [
                'mailable' => get_class($mailable),
                'to'       => $toAddress,
                'error'    => $e->getMessage(),
            ]);

            EmailLog::create([
                'mailable_class' => get_class($mailable),
                'subject'        => $subject,
                'to'             => $recipients,
                'from_address'   => config('mail.from.address'),
                'from_name'      => config('mail.from.name'),
                'status'         => 'failed',
                'error_message'  => $e->getMessage(),
                'context'        => $context ?: null,
                'loggable_id'    => $loggable?->id,
                'loggable_type'  => $loggable ? get_class($loggable) : null,
                'sent_at'        => now(),
            ]);

            return false;
        }
    }
}

<?php

namespace App\Listeners;

use App\Models\EmailLog;
use Illuminate\Mail\Events\MessageSent;

class LogSentEmail
{
    public function handle(MessageSent $event): void
    {
        $message = $event->message;

        $mapAddresses = function ($addresses): array {
            if (empty($addresses)) return [];
            $list = [];
            foreach ($addresses as $email => $name) {
                $list[] = ['address' => $email, 'name' => $name];
            }
            return $list;
        };

        // Extract mailable class from the sent message data if available
        $mailableClass = null;
        if (isset($event->data['__mailable'])) {
            $mailableClass = get_class($event->data['__mailable']);
        }

        // Grab subject from the message object
        $subject = method_exists($message, 'getSubject') ? $message->getSubject() : null;
        $from    = $message->getFrom();
        $fromAddr = !empty($from) ? array_key_first($from) : null;
        $fromName = !empty($from) ? $from[$fromAddr] : null;

        EmailLog::create([
            'mailable_class' => $mailableClass,
            'subject'        => $subject,
            'to'             => $mapAddresses($message->getTo()),
            'cc'             => $mapAddresses($message->getCc()),
            'bcc'            => $mapAddresses($message->getBcc()),
            'from_address'   => $fromAddr,
            'from_name'      => $fromName,
            'status'         => 'sent',
            'sent_at'        => now(),
        ]);
    }
}

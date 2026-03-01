<?php

namespace App\Mail;

use App\Models\ContactRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactRequestReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactRequest $contactRequest) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[AccounTech BD] New Contact Request from ' . $this->contactRequest->company_name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-request-received',
            with: [
                'contact'     => $this->contactRequest,
                'reviewUrl'   => route('superadmin.contact-requests.index'),
            ],
        );
    }
}

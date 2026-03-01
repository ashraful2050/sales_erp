<?php

namespace App\Mail;

use App\Models\ContactRequest;
use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TenantApproved extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ContactRequest $contactRequest,
        public Company $company,
        public string $tempPassword,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your AccounTech BD Account is Ready!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.tenant-approved',
            with: [
                'contact'      => $this->contactRequest,
                'company'      => $this->company,
                'tempPassword' => $this->tempPassword,
                'loginUrl'     => route('login'),
            ],
        );
    }
}

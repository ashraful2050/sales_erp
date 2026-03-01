<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
  .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
  .header { background: linear-gradient(135deg, #1e3a5f, #2563eb); color: #fff; padding: 32px 36px; }
  .header h1 { margin: 0; font-size: 22px; }
  .header p { margin: 4px 0 0; opacity: .8; font-size: 14px; }
  .body { padding: 32px 36px; color: #374151; }
  .field { margin-bottom: 16px; }
  .label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #6b7280; letter-spacing: .5px; }
  .value { font-size: 15px; color: #111827; margin-top: 3px; }
  .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
  .btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; margin-top: 8px; }
  .footer { background: #f9fafb; padding: 20px 36px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>🔔 New Contact Request</h1>
    <p>Someone has submitted a contact form on AccounTech BD</p>
  </div>
  <div class="body">
    <p>Hello Super Admin,</p>
    <p>A new contact request has been submitted. Please review the details below and take action.</p>
    <hr class="divider">
    <div class="field">
      <div class="label">Contact Name</div>
      <div class="value">{{ $contact->name }}</div>
    </div>
    <div class="field">
      <div class="label">Email Address</div>
      <div class="value"><a href="mailto:{{ $contact->email }}">{{ $contact->email }}</a></div>
    </div>
    @if($contact->phone)
    <div class="field">
      <div class="label">Phone</div>
      <div class="value">{{ $contact->phone }}</div>
    </div>
    @endif
    <div class="field">
      <div class="label">Company Name</div>
      <div class="value">{{ $contact->company_name }}</div>
    </div>
    @if($contact->company_size)
    <div class="field">
      <div class="label">Company Size</div>
      <div class="value">{{ $contact->company_size }} employees</div>
    </div>
    @endif
    @if($contact->industry)
    <div class="field">
      <div class="label">Industry</div>
      <div class="value">{{ $contact->industry }}</div>
    </div>
    @endif
    @if($contact->plan_interest)
    <div class="field">
      <div class="label">Plan Interest</div>
      <div class="value"><span class="badge">{{ $contact->plan_interest }}</span></div>
    </div>
    @endif
    @if($contact->message)
    <div class="field">
      <div class="label">Message</div>
      <div class="value" style="white-space: pre-wrap;">{{ $contact->message }}</div>
    </div>
    @endif
    <div class="field">
      <div class="label">Submitted At</div>
      <div class="value">{{ $contact->created_at->format('d M Y, h:i A') }}</div>
    </div>
    <div class="field">
      <div class="label">IP Address</div>
      <div class="value">{{ $contact->ip_address }}</div>
    </div>
    <hr class="divider">
    <p>Click the button below to review and approve/reject this request:</p>
    <a href="{{ $reviewUrl }}" class="btn">Review Request →</a>
  </div>
  <div class="footer">
    AccounTech BD &mdash; Multi-tenant ERP Platform &bull; This is an automated notification.
  </div>
</div>
</body>
</html>

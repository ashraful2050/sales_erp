<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
  .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
  .header { background: linear-gradient(135deg, #065f46, #059669); color: #fff; padding: 32px 36px; }
  .header h1 { margin: 0; font-size: 22px; }
  .header p { margin: 4px 0 0; opacity: .8; font-size: 14px; }
  .body { padding: 32px 36px; color: #374151; }
  .creds { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px 24px; margin: 20px 0; }
  .creds .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #d1fae5; }
  .creds .row:last-child { border: none; }
  .creds .key { font-weight: 700; color: #065f46; }
  .creds .val { font-family: monospace; font-size: 15px; color: #111827; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
  .btn { display: inline-block; background: #059669; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; margin-top: 8px; }
  .warning { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #9a3412; margin-top: 16px; }
  .footer { background: #f9fafb; padding: 20px 36px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>🎉 Your Account is Ready!</h1>
    <p>Welcome to AccounTech BD — Your ERP is set up and waiting</p>
  </div>
  <div class="body">
    <p>Hi <?php echo e($contact->name); ?>,</p>
    <p>Great news! Your request to join <strong>AccounTech BD</strong> has been approved. Your company account <strong><?php echo e($company->name); ?></strong> has been created and is ready to use.</p>
    <hr class="divider">
    <p><strong>Your Login Credentials:</strong></p>
    <div class="creds">
      <div class="row">
        <span class="key">Login URL</span>
        <span class="val"><a href="<?php echo e($loginUrl); ?>"><?php echo e($loginUrl); ?></a></span>
      </div>
      <div class="row">
        <span class="key">Email</span>
        <span class="val"><?php echo e($contact->email); ?></span>
      </div>
      <div class="row">
        <span class="key">Temporary Password</span>
        <span class="val"><?php echo e($tempPassword); ?></span>
      </div>
      <div class="row">
        <span class="key">Company</span>
        <span class="val"><?php echo e($company->name); ?></span>
      </div>
    </div>
    <div class="warning">
      ⚠️ <strong>Security Notice:</strong> Please log in and change your password immediately after your first login.
    </div>
    <hr class="divider">
    <p>You can now log in and start using all features of AccounTech BD:</p>
    <ul style="color: #374151; line-height: 1.8;">
      <li>Accounting &amp; Finance</li>
      <li>Sales, Purchase &amp; Inventory</li>
      <li>HR &amp; Payroll</li>
      <li>POS &amp; Fixed Assets</li>
      <li>Reports &amp; Analytics</li>
    </ul>
    <a href="<?php echo e($loginUrl); ?>" class="btn">Log In to Your Account →</a>
    <p style="margin-top: 20px; color: #6b7280; font-size: 13px;">If you have any questions, please contact our support team by replying to this email.</p>
  </div>
  <div class="footer">
    AccounTech BD &mdash; Multi-tenant ERP Platform &bull; This email was sent to <?php echo e($contact->email); ?>

  </div>
</div>
</body>
</html>
<?php /**PATH D:\xampp\htdocs\sales_erp\resources\views/emails/tenant-approved.blade.php ENDPATH**/ ?>
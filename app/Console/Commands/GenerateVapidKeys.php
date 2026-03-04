<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Minishlink\WebPush\VAPID;

class GenerateVapidKeys extends Command
{
    protected $signature   = 'pwa:vapid-keys {--show : Only display, do not write to .env}';
    protected $description = 'Generate VAPID key pair for Web Push notifications';

    public function handle(): int
    {
        $keys = VAPID::createVapidKeys();

        $this->info('VAPID keys generated successfully.');
        $this->newLine();
        $this->line('  <fg=yellow>Public key:</>  ' . $keys['publicKey']);
        $this->line('  <fg=yellow>Private key:</> ' . $keys['privateKey']);
        $this->newLine();

        if ($this->option('show')) {
            $this->line('Add these to your <fg=cyan>.env</> file:');
            $this->newLine();
            $this->line('VAPID_PUBLIC_KEY="'  . $keys['publicKey']  . '"');
            $this->line('VAPID_PRIVATE_KEY="' . $keys['privateKey'] . '"');
            $this->line('VITE_VAPID_PUBLIC_KEY="' . $keys['publicKey'] . '"');
            return self::SUCCESS;
        }

        // Write to .env
        $envPath = base_path('.env');
        $env     = file_get_contents($envPath);

        $replacements = [
            'VAPID_PUBLIC_KEY'       => $keys['publicKey'],
            'VAPID_PRIVATE_KEY'      => $keys['privateKey'],
            'VITE_VAPID_PUBLIC_KEY'  => $keys['publicKey'],
        ];

        foreach ($replacements as $key => $value) {
            if (str_contains($env, "{$key}=")) {
                // Replace existing value
                $env = preg_replace(
                    "/^{$key}=.*/m",
                    "{$key}=\"{$value}\"",
                    $env
                );
            } else {
                // Append
                $env .= "\n{$key}=\"{$value}\"";
            }
        }

        file_put_contents($envPath, $env);

        $this->info('.env updated with VAPID keys.');
        $this->warn('Run [php artisan config:clear] to reload the config.');

        return self::SUCCESS;
    }
}

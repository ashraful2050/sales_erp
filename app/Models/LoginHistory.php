<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoginHistory extends Model
{
    protected $fillable = [
        'company_id', 'user_id', 'user_name', 'user_email',
        'event', 'ip_address', 'country', 'city',
        'user_agent', 'browser', 'platform', 'device_type',
        'logged_in_at', 'logged_out_at',
    ];

    protected $casts = [
        'logged_in_at'  => 'datetime',
        'logged_out_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /** Parse a UA string into browser / platform / device_type */
    public static function parseAgent(string $ua): array
    {
        $browser  = 'Unknown';
        $platform = 'Unknown';
        $device   = 'Desktop';

        if (str_contains($ua, 'Firefox'))       $browser = 'Firefox';
        elseif (str_contains($ua, 'Edg'))       $browser = 'Edge';
        elseif (str_contains($ua, 'Chrome'))    $browser = 'Chrome';
        elseif (str_contains($ua, 'Safari'))    $browser = 'Safari';
        elseif (str_contains($ua, 'MSIE') || str_contains($ua, 'Trident')) $browser = 'Internet Explorer';
        elseif (str_contains($ua, 'Opera') || str_contains($ua, 'OPR'))    $browser = 'Opera';

        if (str_contains($ua, 'Windows'))       $platform = 'Windows';
        elseif (str_contains($ua, 'Mac'))       $platform = 'macOS';
        elseif (str_contains($ua, 'Linux'))     $platform = 'Linux';
        elseif (str_contains($ua, 'Android'))   $platform = 'Android';
        elseif (str_contains($ua, 'iPhone') || str_contains($ua, 'iPad')) $platform = 'iOS';

        if (str_contains($ua, 'Mobile') || str_contains($ua, 'Android') || str_contains($ua, 'iPhone'))
            $device = 'Mobile';
        elseif (str_contains($ua, 'iPad') || str_contains($ua, 'Tablet'))
            $device = 'Tablet';

        return compact('browser', 'platform', 'device');
    }

    /** Record a login event */
    public static function recordLogin(User $user, string $ip, string $ua): self
    {
        $parsed = static::parseAgent($ua);
        return static::create([
            'company_id'   => $user->company_id,
            'user_id'      => $user->id,
            'user_name'    => $user->name,
            'user_email'   => $user->email,
            'event'        => 'login',
            'ip_address'   => $ip,
            'user_agent'   => $ua,
            'browser'      => $parsed['browser'],
            'platform'     => $parsed['platform'],
            'device_type'  => $parsed['device'],
            'logged_in_at' => now(),
        ]);
    }

    /** Record a failed login attempt */
    public static function recordFailed(string $email, string $ip, string $ua): self
    {
        $parsed = static::parseAgent($ua);
        return static::create([
            'user_email'  => $email,
            'event'       => 'failed',
            'ip_address'  => $ip,
            'user_agent'  => $ua,
            'browser'     => $parsed['browser'],
            'platform'    => $parsed['platform'],
            'device_type' => $parsed['device'],
            'logged_in_at'=> now(),
        ]);
    }
}

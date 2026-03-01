<?php

namespace App\Models;

use App\Traits\LogsActivity;

use App\Support\Permissions;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = ['company_id', 'name', 'guard_name', 'permissions', 'is_system'];

    protected $casts = ['permissions' => 'array', 'is_system' => 'boolean'];

    // Relationships
    public function company() { return $this->belongsTo(Company::class); }
    public function users() { return $this->belongsToMany(User::class, 'user_roles')->withTimestamps(); }

    // Helpers
    public function hasPermission(string $key): bool
    {
        $perms = $this->permissions ?? [];
        return (bool) ($perms[$key] ?? false);
    }

    public function setPermissionsFromRequest(array $input): void
    {
        $all = Permissions::all();
        $perms = [];
        foreach ($all as $key) {
            $perms[$key] = isset($input[$key]) && (bool)$input[$key];
        }
        $this->permissions = $perms;
    }
}

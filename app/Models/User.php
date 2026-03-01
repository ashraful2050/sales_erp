<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password',
        'company_id', 'phone', 'language', 'avatar',
        'is_active', 'role', 'is_superadmin',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
            'is_superadmin'     => 'boolean',
        ];
    }

    // Relationships
    public function company() { return $this->belongsTo(Company::class); }
    public function roles() { return $this->belongsToMany(Role::class, 'user_roles')->withTimestamps(); }

    // Role helpers
    public function isSuperAdmin(): bool { return $this->is_superadmin || $this->role === 'superadmin'; }
    public function isAdmin(): bool      { return $this->role === 'admin'; }

    /**
     * Get this user's Role model (matched by role name within the same company).
     */
    public function getRoleModel(): ?Role
    {
        if ($this->isSuperAdmin()) return null;
        return Role::where('company_id', $this->company_id)
                   ->where('name', $this->role)
                   ->first();
    }

    /**
     * Check if the user has a specific permission key e.g. 'accounting.view'.
     * Superadmin always returns true.
     */
    public function hasPermission(string $permission): bool
    {
        if ($this->isSuperAdmin()) return true;
        $roleModel = $this->getRoleModel();
        if (!$roleModel) return false;
        return $roleModel->hasPermission($permission);
    }

    /**
     * Return all permissions as an associative array for the frontend.
     */
    public function allPermissions(): array
    {
        if ($this->isSuperAdmin()) {
            // superadmin has everything
            return array_fill_keys(\App\Support\Permissions::all(), true);
        }
        $roleModel = $this->getRoleModel();
        return $roleModel?->permissions ?? [];
    }
}


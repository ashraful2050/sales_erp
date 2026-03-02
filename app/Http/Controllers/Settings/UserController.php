<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Support\Permissions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /** Only superadmin OR admin may access user management. */
    private function checkAccess(): void
    {
        $user = auth()->user();
        abort_unless($user->isSuperAdmin() || $user->isAdmin(), 403, 'Access denied.');
    }

    /** Returns true when the current user is admin (but NOT superadmin). */
    private function isAdminMode(): bool
    {
        return auth()->user()->isAdmin() && !auth()->user()->isSuperAdmin();
    }

    public function index()
    {
        $this->checkAccess();
        $cid   = auth()->user()->company_id;
        $query = User::where('company_id', $cid)
            ->where('id', '!=', auth()->id())
            ->orderBy('name');

        // Admins may only see non-admin/superadmin accounts
        if ($this->isAdminMode()) {
            $query->whereNotIn('role', ['admin', 'superadmin']);
        }

        $users = $query->get(['id', 'name', 'email', 'role', 'is_active', 'created_at']);

        return Inertia::render('Settings/Users/Index', [
            'users'       => $users,
            'isAdminMode' => $this->isAdminMode(),
        ]);
    }

    public function create()
    {
        $this->checkAccess();
        $cid = auth()->user()->company_id;

        // Admins may only assign non-admin roles they themselves can delegate
        if ($this->isAdminMode()) {
            $roles = Role::where('company_id', $cid)
                ->where('name', '!=', 'admin')
                ->orderBy('name')
                ->get(['id', 'name']);
        } else {
            $roles = Role::where('company_id', $cid)->orderBy('name')->get(['id', 'name']);
        }

        return Inertia::render('Settings/Users/Form', [
            'editUser'         => null,
            'roles'            => $roles,
            'isAdminMode'      => $this->isAdminMode(),
        ]);
    }

    public function store(Request $request)
    {
        $this->checkAccess();

        $v = $request->validate([
            'name'     => 'required|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'role'     => 'required|string|max:50',
            'phone'    => 'nullable|max:20',
            'is_active'=> 'boolean',
        ]);

        // Admin may only create non-admin users (cannot create another admin or superadmin)
        if ($this->isAdminMode()) {
            abort_if(in_array(strtolower($v['role']), ['admin', 'superadmin']), 403, 'Admins cannot create admin or superadmin accounts.');
        }

        $v['company_id'] = auth()->user()->company_id;
        $v['password']   = Hash::make($v['password']);
        User::create($v);
        return redirect()->route('settings.users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $this->checkAccess();
        abort_if($user->company_id !== auth()->user()->company_id, 403);

        // Admin may only edit non-admin/superadmin users
        if ($this->isAdminMode()) {
            abort_if(in_array(strtolower($user->role), ['admin', 'superadmin']), 403, 'Admins cannot edit admin or superadmin accounts.');
        }

        $cid = auth()->user()->company_id;

        if ($this->isAdminMode()) {
            $roles = Role::where('company_id', $cid)
                ->where('name', '!=', 'admin')
                ->orderBy('name')
                ->get(['id', 'name']);
        } else {
            $roles = Role::where('company_id', $cid)->orderBy('name')->get(['id', 'name']);
        }

        return Inertia::render('Settings/Users/Form', [
            'editUser'    => $user,
            'roles'       => $roles,
            'isAdminMode' => $this->isAdminMode(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->checkAccess();
        abort_if($user->company_id !== auth()->user()->company_id, 403);

        // Admin may only edit non-admin/superadmin users
        if ($this->isAdminMode()) {
            abort_if(in_array(strtolower($user->role), ['admin', 'superadmin']), 403, 'Admins cannot edit admin or superadmin accounts.');
        }

        $v = $request->validate([
            'name'     => 'required|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:8|confirmed',
            'role'     => 'required|string|max:50',
            'phone'    => 'nullable|max:20',
            'is_active'=> 'boolean',
        ]);

        // Admin may not escalate to admin/superadmin
        if ($this->isAdminMode()) {
            abort_if(in_array(strtolower($v['role']), ['admin', 'superadmin']), 403, 'Admins cannot assign the admin or superadmin role.');
        }

        if (empty($v['password'])) unset($v['password']);
        else $v['password'] = Hash::make($v['password']);
        $user->update($v);
        return redirect()->route('settings.users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $this->checkAccess();
        abort_if($user->company_id !== auth()->user()->company_id, 403);
        abort_if($user->isSuperAdmin(), 403, 'Cannot delete a superadmin.');

        // Admin may only delete non-admin users
        if ($this->isAdminMode()) {
            abort_if(in_array(strtolower($user->role), ['admin', 'superadmin']), 403, 'Admins cannot delete admin or superadmin accounts.');
        }

        $user->delete();
        return redirect()->route('settings.users.index')->with('success', 'User deleted.');
    }
}

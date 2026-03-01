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
    private function superAdminOnly(): void
    {
        abort_unless(auth()->user()->isSuperAdmin(), 403, 'Superadmin only.');
    }

    public function index()
    {
        $this->superAdminOnly();
        $cid = auth()->user()->company_id;
        $users = User::where('company_id', $cid)
            ->where('id', '!=', auth()->id())
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role', 'is_active', 'created_at']);

        return Inertia::render('Settings/Users/Index', ['users' => $users]);
    }

    public function create()
    {
        $this->superAdminOnly();
        $cid = auth()->user()->company_id;
        $roles = Role::where('company_id', $cid)->orderBy('name')->get(['id', 'name']);
        return Inertia::render('Settings/Users/Form', ['editUser' => null, 'roles' => $roles]);
    }

    public function store(Request $request)
    {
        $this->superAdminOnly();
        $v = $request->validate([
            'name'     => 'required|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'role'     => 'required|string|max:50',
            'phone'    => 'nullable|max:20',
            'is_active'=> 'boolean',
        ]);
        $v['company_id'] = auth()->user()->company_id;
        $v['password']   = Hash::make($v['password']);
        User::create($v);
        return redirect()->route('settings.users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $this->superAdminOnly();
        abort_if($user->company_id !== auth()->user()->company_id, 403);
        $cid = auth()->user()->company_id;
        $roles = Role::where('company_id', $cid)->orderBy('name')->get(['id', 'name']);
        return Inertia::render('Settings/Users/Form', ['editUser' => $user, 'roles' => $roles]);
    }

    public function update(Request $request, User $user)
    {
        $this->superAdminOnly();
        abort_if($user->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'name'     => 'required|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:8|confirmed',
            'role'     => 'required|string|max:50',
            'phone'    => 'nullable|max:20',
            'is_active'=> 'boolean',
        ]);
        if (empty($v['password'])) unset($v['password']);
        else $v['password'] = Hash::make($v['password']);
        $user->update($v);
        return redirect()->route('settings.users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $this->superAdminOnly();
        abort_if($user->company_id !== auth()->user()->company_id, 403);
        abort_if($user->isSuperAdmin(), 403, 'Cannot delete a superadmin.');
        $user->delete();
        return redirect()->route('settings.users.index')->with('success', 'User deleted.');
    }
}

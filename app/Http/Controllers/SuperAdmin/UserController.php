<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('company:id,name,slug')
            ->where('is_superadmin', false);

        if ($request->filled('search')) {
            $q = '%' . $request->search . '%';
            $query->where(fn($qb) => $qb->where('name', 'like', $q)->orWhere('email', 'like', $q));
        }

        if ($request->filled('company_id')) {
            $query->where('company_id', $request->company_id);
        }

        $users = $query->orderByDesc('created_at')->paginate(25)->withQueryString();

        return Inertia::render('SuperAdmin/Users/Index', [
            'users'     => $users,
            'filters'   => $request->only('search', 'company_id'),
            'companies' => Company::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function destroy(User $user)
    {
        abort_if($user->isSuperAdmin(), 403, 'Cannot delete a super admin.');
        $user->update(['is_active' => false]);
        return back()->with('success', 'User deactivated.');
    }

    /**
     * List all super admin users.
     */
    public function superAdmins()
    {
        $admins = User::where('is_superadmin', true)->orderBy('name')->get();
        return Inertia::render('SuperAdmin/Users/SuperAdmins', ['admins' => $admins]);
    }

    /**
     * Create a new global super admin.
     */
    public function createSuperAdmin(Request $request)
    {
        $v = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        User::create([
            'name'          => $v['name'],
            'email'         => $v['email'],
            'password'      => Hash::make($v['password']),
            'role'          => 'superadmin',
            'is_superadmin' => true,
            'is_active'     => true,
        ]);

        return back()->with('success', 'Super admin created.');
    }
}

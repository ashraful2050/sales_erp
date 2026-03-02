<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Support\Permissions;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /** Only superadmin OR admin may access role management. */
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

    /**
     * Returns the admin's own granted permissions (all keys that are true).
     * Used to restrict what an admin can delegate to moderator roles.
     */
    private function adminAllowedPermissions(): array
    {
        $roleModel = auth()->user()->getRoleModel();
        if (!$roleModel) return [];
        return array_keys(array_filter($roleModel->permissions ?? []));
    }

    public function index()
    {
        $this->checkAccess();
        $cid = auth()->user()->company_id;
        $query = Role::where('company_id', $cid)->withCount('users')->orderBy('name');

        // Admin only sees non-admin/non-superadmin roles (i.e. moderator roles)
        if ($this->isAdminMode()) {
            $query->where('name', '!=', 'admin');
        }

        $roles = $query->get();
        return Inertia::render('Settings/Roles/Index', [
            'roles'       => $roles,
            'isAdminMode' => $this->isAdminMode(),
        ]);
    }

    public function create()
    {
        $this->checkAccess();

        $adminPermissions = $this->isAdminMode() ? $this->adminAllowedPermissions() : null;

        return Inertia::render('Settings/Roles/Form', [
            'editRole'         => null,
            'modules'          => Permissions::MODULES,
            'moduleLabels'     => Permissions::moduleLabels(),
            'features'         => Permissions::FEATURES,
            'featureLabels'    => Permissions::featureLabels(),
            'moduleIcons'      => Permissions::moduleIcons(),
            'isAdminMode'      => $this->isAdminMode(),
            'adminPermissions' => $adminPermissions,
        ]);
    }

    public function store(Request $request)
    {
        $this->checkAccess();
        $v = $request->validate([
            'name'        => 'required|max:100',
            'permissions' => 'required|array',
        ]);

        // Admin cannot create a role named 'admin'
        if ($this->isAdminMode()) {
            abort_if(strtolower($v['name']) === 'admin', 403, 'Cannot create a role named admin.');
            // Strip any permissions the admin doesn't have
            $allowed = $this->adminAllowedPermissions();
            foreach ($v['permissions'] as $key => $val) {
                if ($val && !in_array($key, $allowed)) {
                    $v['permissions'][$key] = false;
                }
            }
        }

        $role = new Role();
        $role->company_id = auth()->user()->company_id;
        $role->name       = $v['name'];
        $role->guard_name = 'web';
        $role->setPermissionsFromRequest($v['permissions']);
        $role->save();
        return redirect()->route('settings.roles.index')->with('success', 'Role created.');
    }

    public function edit(Role $role)
    {
        $this->checkAccess();
        abort_if($role->company_id !== auth()->user()->company_id, 403);

        // Admin cannot edit the admin role
        if ($this->isAdminMode()) {
            abort_if($role->name === 'admin', 403, 'Admins cannot edit the admin role.');
        }

        $adminPermissions = $this->isAdminMode() ? $this->adminAllowedPermissions() : null;

        return Inertia::render('Settings/Roles/Form', [
            'editRole'         => $role,
            'modules'          => Permissions::MODULES,
            'moduleLabels'     => Permissions::moduleLabels(),
            'features'         => Permissions::FEATURES,
            'featureLabels'    => Permissions::featureLabels(),
            'moduleIcons'      => Permissions::moduleIcons(),
            'isAdminMode'      => $this->isAdminMode(),
            'adminPermissions' => $adminPermissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $this->checkAccess();
        abort_if($role->company_id !== auth()->user()->company_id, 403);

        // Admin cannot edit the admin role
        if ($this->isAdminMode()) {
            abort_if($role->name === 'admin', 403, 'Admins cannot edit the admin role.');
        }

        $v = $request->validate([
            'name'        => 'required|max:100',
            'permissions' => 'required|array',
        ]);

        // Admin cannot rename the role to 'admin' or add permissions they don't have
        if ($this->isAdminMode()) {
            abort_if(strtolower($v['name']) === 'admin', 403, 'Cannot name a role admin.');
            $allowed = $this->adminAllowedPermissions();
            foreach ($v['permissions'] as $key => $val) {
                if ($val && !in_array($key, $allowed)) {
                    $v['permissions'][$key] = false;
                }
            }
        }

        $role->name = $v['name'];
        $role->setPermissionsFromRequest($v['permissions']);
        $role->save();
        return redirect()->route('settings.roles.index')->with('success', 'Role updated.');
    }

    public function destroy(Role $role)
    {
        $this->checkAccess();
        abort_if($role->company_id !== auth()->user()->company_id, 403);
        abort_if($role->is_system, 403, 'Cannot delete a system role.');

        // Admin cannot delete the admin role
        if ($this->isAdminMode()) {
            abort_if($role->name === 'admin', 403, 'Admins cannot delete the admin role.');
        }

        $role->delete();
        return redirect()->route('settings.roles.index')->with('success', 'Role deleted.');
    }
}

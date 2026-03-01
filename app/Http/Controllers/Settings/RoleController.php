<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Support\Permissions;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    private function superAdminOnly(): void
    {
        abort_unless(auth()->user()->isSuperAdmin(), 403, 'Superadmin only.');
    }

    public function index()
    {
        $this->superAdminOnly();
        $cid = auth()->user()->company_id;
        $roles = Role::where('company_id', $cid)
            ->withCount('users')
            ->orderBy('name')
            ->get();
        return Inertia::render('Settings/Roles/Index', ['roles' => $roles]);
    }

    public function create()
    {
        $this->superAdminOnly();
        return Inertia::render('Settings/Roles/Form', [
            'editRole'     => null,
            'modules'      => Permissions::MODULES,
            'moduleLabels' => Permissions::moduleLabels(),
            'features'     => Permissions::FEATURES,
            'featureLabels'=> Permissions::featureLabels(),
            'moduleIcons'  => Permissions::moduleIcons(),
        ]);
    }

    public function store(Request $request)
    {
        $this->superAdminOnly();
        $v = $request->validate([
            'name'        => 'required|max:100',
            'permissions' => 'required|array',
        ]);
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
        $this->superAdminOnly();
        abort_if($role->company_id !== auth()->user()->company_id, 403);
        return Inertia::render('Settings/Roles/Form', [
            'editRole'     => $role,
            'modules'      => Permissions::MODULES,
            'moduleLabels' => Permissions::moduleLabels(),
            'features'     => Permissions::FEATURES,
            'featureLabels'=> Permissions::featureLabels(),
            'moduleIcons'  => Permissions::moduleIcons(),
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $this->superAdminOnly();
        abort_if($role->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'name'        => 'required|max:100',
            'permissions' => 'required|array',
        ]);
        $role->name = $v['name'];
        $role->setPermissionsFromRequest($v['permissions']);
        $role->save();
        return redirect()->route('settings.roles.index')->with('success', 'Role updated.');
    }

    public function destroy(Role $role)
    {
        $this->superAdminOnly();
        abort_if($role->company_id !== auth()->user()->company_id, 403);
        abort_if($role->is_system, 403, 'Cannot delete a system role.');
        $role->delete();
        return redirect()->route('settings.roles.index')->with('success', 'Role deleted.');
    }
}

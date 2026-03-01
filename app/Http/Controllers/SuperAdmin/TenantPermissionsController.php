<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Role;
use App\Support\Permissions;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantPermissionsController extends Controller
{
    public function edit(Company $company)
    {
        // Get or build the admin Role for this tenant
        $adminRole = Role::where('company_id', $company->id)
            ->where('name', 'admin')
            ->first();

        // Build current permissions — default to adminDefaults if role not yet created
        $currentPermissions = $adminRole?->permissions ?? Permissions::adminDefaults();

        // Ensure all known keys exist (fill gaps with false)
        $allKeys = Permissions::all();
        foreach ($allKeys as $key) {
            if (!array_key_exists($key, $currentPermissions)) {
                $currentPermissions[$key] = false;
            }
        }

        $company->load(['primaryUser', 'activeSubscription.plan']);

        return Inertia::render('SuperAdmin/Tenants/Permissions', [
            'tenant'         => $company,
            'permissions'    => $currentPermissions,
            'modules'        => Permissions::MODULES,
            'moduleLabels'   => Permissions::moduleLabels(),
            'moduleIcons'    => Permissions::moduleIcons(),
            'features'       => Permissions::FEATURES,
            'featureLabels'  => Permissions::featureLabels(),
            'hasRole'        => $adminRole !== null,
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $request->validate([
            'permissions' => 'required|array',
        ]);

        // Upsert the admin role
        $role = Role::updateOrCreate(
            ['company_id' => $company->id, 'name' => 'admin'],
            ['guard_name' => 'web', 'is_system' => true]
        );

        $role->setPermissionsFromRequest($request->input('permissions', []));
        $role->save();

        return back()->with('success', "Permissions updated for {$company->name}'s admin role.");
    }
}

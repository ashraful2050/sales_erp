<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Role;
use App\Support\Permissions;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $companies = Company::all();

        foreach ($companies as $company) {
            // Admin role — full access except delete users
            Role::updateOrCreate(
                ['company_id' => $company->id, 'name' => 'admin'],
                [
                    'guard_name'  => 'web',
                    'permissions' => Permissions::adminDefaults(),
                    'is_system'   => true,
                ]
            );

            // Moderator role — view + create only, no settings/users
            Role::updateOrCreate(
                ['company_id' => $company->id, 'name' => 'moderator'],
                [
                    'guard_name'  => 'web',
                    'permissions' => Permissions::moderatorDefaults(),
                    'is_system'   => true,
                ]
            );
        }

        $this->command->info('Default roles seeded for ' . $companies->count() . ' company(ies).');
    }
}

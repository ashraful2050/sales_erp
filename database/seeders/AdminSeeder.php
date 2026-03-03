<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure a company exists
        $company = Company::first();
        if (! $company) {
            $company = Company::create([
                'name'          => 'My Company',
                'currency_code' => 'USD',
            ]);
        }

        // Create or update the superadmin
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name'              => 'Super Admin',
                'password'          => Hash::make('Admin@1234'),
                'company_id'        => $company->id,
                'role'              => 'superadmin',
                'is_superadmin'     => true,
                'is_active'         => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Superadmin created: admin@example.com / Admin@1234');
    }
}

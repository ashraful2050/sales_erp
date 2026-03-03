<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * DesignationSeeder
 * Seeds standard job designations for each company.
 */
class DesignationSeeder extends Seeder
{
    public function run(): void
    {
        $designations = [
            'Managing Director',
            'Chief Executive Officer',
            'Chief Financial Officer',
            'Chief Operating Officer',
            'General Manager',
            'Deputy General Manager',
            'Senior Manager',
            'Manager',
            'Deputy Manager',
            'Assistant Manager',
            'Senior Executive',
            'Executive',
            'Junior Executive',
            'Team Leader',
            'Senior Officer',
            'Officer',
            'Junior Officer',
            'Senior Accountant',
            'Accountant',
            'Assistant Accountant',
            'Sales Executive',
            'Senior Sales Executive',
            'Sales Representative',
            'Purchase Executive',
            'Purchase Officer',
            'HR Manager',
            'HR Executive',
            'HR Officer',
            'Store Keeper',
            'Store Manager',
            'IT Officer',
            'Software Developer',
            'System Administrator',
            'Customer Service Executive',
            'Logistics Officer',
            'Intern',
            'Trainee',
        ];

        $now    = now();
        $seeded = 0;
        $companies = Company::pluck('id');

        foreach ($companies as $companyId) {
            foreach ($designations as $desgName) {
                $exists = DB::table('designations')
                    ->where('company_id', $companyId)
                    ->where('name', $desgName)
                    ->exists();

                if (! $exists) {
                    DB::table('designations')->insert([
                        'company_id' => $companyId,
                        'name'       => $desgName,
                        'is_active'  => true,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                    $seeded++;
                }
            }
        }

        $this->command->info("DesignationSeeder: {$seeded} designations seeded.");
    }
}

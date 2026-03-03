<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * DepartmentSeeder
 * Seeds standard company departments for each company.
 */
class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Management',         'code' => 'MGMT', 'is_active' => true],
            ['name' => 'Finance & Accounts', 'code' => 'FIN',  'is_active' => true],
            ['name' => 'Sales & Marketing',  'code' => 'SALES','is_active' => true],
            ['name' => 'Purchase',           'code' => 'PUR',  'is_active' => true],
            ['name' => 'Inventory & Store',  'code' => 'STORE','is_active' => true],
            ['name' => 'Human Resources',    'code' => 'HR',   'is_active' => true],
            ['name' => 'Production',         'code' => 'PROD', 'is_active' => true],
            ['name' => 'Quality Assurance',  'code' => 'QA',   'is_active' => true],
            ['name' => 'Information Technology','code'=>'IT',  'is_active' => true],
            ['name' => 'Customer Support',   'code' => 'CS',   'is_active' => true],
            ['name' => 'Logistics',          'code' => 'LOG',  'is_active' => true],
            ['name' => 'Research & Development','code'=>'R&D', 'is_active' => true],
        ];

        $now    = now();
        $seeded = 0;
        $companies = Company::pluck('id');

        foreach ($companies as $companyId) {
            foreach ($departments as $dept) {
                $exists = DB::table('departments')
                    ->where('company_id', $companyId)
                    ->where('code', $dept['code'])
                    ->exists();

                if (! $exists) {
                    DB::table('departments')->insert(array_merge($dept, [
                        'company_id' => $companyId,
                        'parent_id'  => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]));
                    $seeded++;
                }
            }
        }

        $this->command->info("DepartmentSeeder: {$seeded} departments seeded.");
    }
}

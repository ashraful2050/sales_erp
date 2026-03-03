<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * CostCenterSeeder
 * Seeds standard cost centers for each company.
 */
class CostCenterSeeder extends Seeder
{
    public function run(): void
    {
        $costCenters = [
            ['code' => 'HQ',    'name' => 'Head Office / Administration', 'description' => 'General overhead and corporate expenses'],
            ['code' => 'SALES', 'name' => 'Sales & Marketing',            'description' => 'Sales, marketing and distribution costs'],
            ['code' => 'OPS',   'name' => 'Operations',                   'description' => 'Manufacturing and operational costs'],
            ['code' => 'IT',    'name' => 'Information Technology',       'description' => 'IT infrastructure and software costs'],
            ['code' => 'HR',    'name' => 'Human Resources',              'description' => 'HR and employee-related costs'],
            ['code' => 'FIN',   'name' => 'Finance & Accounts',           'description' => 'Finance, audit and accounting costs'],
            ['code' => 'PUR',   'name' => 'Purchase & Procurement',       'description' => 'Purchasing and vendor management costs'],
            ['code' => 'DEPO',  'name' => 'Depot / Warehouse',            'description' => 'Warehouse, logistics and storage costs'],
            ['code' => 'R&D',   'name' => 'Research & Development',       'description' => 'Product R&D and innovation costs'],
            ['code' => 'PROJ',  'name' => 'Projects',                     'description' => 'Project-specific cost tracking'],
        ];

        $now    = now();
        $seeded = 0;
        $companies = Company::pluck('id');

        foreach ($companies as $companyId) {
            foreach ($costCenters as $cc) {
                $exists = DB::table('cost_centers')
                    ->where('company_id', $companyId)
                    ->where('code', $cc['code'])
                    ->exists();

                if (! $exists) {
                    DB::table('cost_centers')->insert([
                        'company_id'  => $companyId,
                        'code'        => $cc['code'],
                        'name'        => $cc['name'],
                        'description' => $cc['description'],
                        'is_active'   => true,
                        'created_at'  => $now,
                        'updated_at'  => $now,
                    ]);
                    $seeded++;
                }
            }
        }

        $this->command->info("CostCenterSeeder: {$seeded} cost centers seeded.");
    }
}

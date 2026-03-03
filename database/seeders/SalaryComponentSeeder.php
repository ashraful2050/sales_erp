<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * SalaryComponentSeeder
 * Seeds standard pay-roll earning & deduction components for each company.
 */
class SalaryComponentSeeder extends Seeder
{
    public function run(): void
    {
        // [name, type, is_taxable, is_pf_applicable]
        $components = [
            // ── Earnings ──────────────────────────────────────────────────
            ['Basic Salary',              'earning',   true,  true],
            ['House Rent Allowance',      'earning',   true,  false],
            ['Medical Allowance',         'earning',   false, false],
            ['Transport Allowance',       'earning',   false, false],
            ['Conveyance Allowance',      'earning',   false, false],
            ['Dearness Allowance',        'earning',   true,  false],
            ['Special Allowance',         'earning',   true,  false],
            ['Overtime Pay',              'earning',   true,  false],
            ['Performance Bonus',         'earning',   true,  false],
            ['Festival Bonus',            'earning',   true,  false],
            ['Incentive',                 'earning',   true,  false],
            ['Leave Encashment',          'earning',   true,  false],
            ['Mobile Allowance',          'earning',   false, false],
            ['Internet Allowance',        'earning',   false, false],
            ['Lunch Allowance',           'earning',   false, false],
            ['Gratuity',                  'earning',   false, false],

            // ── Deductions ────────────────────────────────────────────────
            ['Provident Fund (Employee)', 'deduction', false, false],
            ['Income Tax',                'deduction', false, false],
            ['Salary Advance Recovery',   'deduction', false, false],
            ['Absent Deduction',          'deduction', false, false],
            ['Late Deduction',            'deduction', false, false],
            ['Loan Recovery',             'deduction', false, false],
            ['Insurance Premium',         'deduction', false, false],
        ];

        $now    = now();
        $seeded = 0;
        $companies = Company::pluck('id');

        foreach ($companies as $companyId) {
            foreach ($components as [$name, $type, $isTaxable, $isPf]) {
                $exists = DB::table('salary_components')
                    ->where('company_id', $companyId)
                    ->where('name', $name)
                    ->exists();

                if (! $exists) {
                    DB::table('salary_components')->insert([
                        'company_id'        => $companyId,
                        'name'              => $name,
                        'type'              => $type,
                        'is_taxable'        => $isTaxable,
                        'is_pf_applicable'  => $isPf,
                        'is_active'         => true,
                        'created_at'        => $now,
                        'updated_at'        => $now,
                    ]);
                    $seeded++;
                }
            }
        }

        $this->command->info("SalaryComponentSeeder: {$seeded} components seeded.");
    }
}

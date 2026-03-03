<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * FiscalYearSeeder
 * Creates the current and previous fiscal years for each company.
 * Bangladesh fiscal year: 1 July – 30 June.
 */
class FiscalYearSeeder extends Seeder
{
    public function run(): void
    {
        $now      = now();
        $seeded   = 0;
        $companies = Company::all();

        foreach ($companies as $company) {
            // Determine fiscal year boundary based on company setting
            [$fMonth, $fDay] = explode('-', $company->fiscal_year_start ?? '07-01');
            $fMonth = (int)$fMonth;
            $fDay   = (int)$fDay;

            // Generate previous, current, and next fiscal years
            $years = [
                ['label' => 'previous', 'offset' => -1, 'status' => 'closed'],
                ['label' => 'current',  'offset' =>  0, 'status' => 'active'],
                ['label' => 'next',     'offset' =>  1, 'status' => 'pending'],
            ];

            foreach ($years as $fy) {
                $startYear = now()->year + $fy['offset'];
                // Adjust: if today is before fiscal start month, current FY started last year
                if ($fMonth > now()->month || ($fMonth === now()->month && $fDay > now()->day)) {
                    $startYear--;
                }
                $startYear += $fy['offset'];

                $startDate = sprintf('%04d-%02d-%02d', $startYear, $fMonth, $fDay);
                $endDate   = date('Y-m-d', strtotime("+1 year -1 day", strtotime($startDate)));
                $name      = 'FY ' . $startYear . '-' . substr(($startYear + 1), 2);

                $exists = DB::table('fiscal_years')
                    ->where('company_id', $company->id)
                    ->where('name', $name)
                    ->exists();

                if (! $exists) {
                    DB::table('fiscal_years')->insert([
                        'company_id' => $company->id,
                        'name'       => $name,
                        'start_date' => $startDate,
                        'end_date'   => $endDate,
                        'status'     => $fy['status'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                    $seeded++;
                }
            }
        }

        $this->command->info("FiscalYearSeeder: {$seeded} fiscal years seeded.");
    }
}

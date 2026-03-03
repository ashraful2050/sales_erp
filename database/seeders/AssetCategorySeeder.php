<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * AssetCategorySeeder
 * Seeds standard fixed-asset categories with depreciation rules.
 */
class AssetCategorySeeder extends Seeder
{
    public function run(): void
    {
        // [name, useful_life_years, depreciation_rate (%), depreciation_method]
        // methods: straight_line | declining_balance | sum_of_years
        $categories = [
            ['Land & Building',         40, 2.5,  'straight_line'],
            ['Furniture & Fixtures',    10, 10.0, 'straight_line'],
            ['Machinery & Equipment',   7,  15.0, 'declining_balance'],
            ['Computer & IT Equipment', 4,  25.0, 'straight_line'],
            ['Vehicles & Transport',    5,  20.0, 'declining_balance'],
            ['Office Equipment',        5,  20.0, 'straight_line'],
            ['Tools & Instruments',     3,  33.33,'straight_line'],
            ['Electrical Equipment',    10, 10.0, 'straight_line'],
            ['Leasehold Improvements',  5,  20.0, 'straight_line'],
            ['Software & Licences',     3,  33.33,'straight_line'],
            ['Intangible Assets',       10, 10.0, 'straight_line'],
        ];

        $now    = now();
        $seeded = 0;
        $companies = Company::pluck('id');

        foreach ($companies as $companyId) {
            foreach ($categories as [$name, $life, $rate, $method]) {
                $exists = DB::table('asset_categories')
                    ->where('company_id', $companyId)
                    ->where('name', $name)
                    ->exists();

                if (! $exists) {
                    DB::table('asset_categories')->insert([
                        'company_id'           => $companyId,
                        'name'                 => $name,
                        'useful_life_years'    => $life,
                        'depreciation_rate'    => $rate,
                        'depreciation_method'  => $method,
                        'is_active'            => true,
                        'created_at'           => $now,
                        'updated_at'           => $now,
                    ]);
                    $seeded++;
                }
            }
        }

        $this->command->info("AssetCategorySeeder: {$seeded} asset categories seeded.");
    }
}

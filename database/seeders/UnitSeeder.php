<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * UnitSeeder
 * Seeds standard units of measurement for each company.
 */
class UnitSeeder extends Seeder
{
    public function run(): void
    {
        // [name, abbreviation]
        $units = [
            // Count / Quantity
            ['Piece',            'pcs'],
            ['Unit',             'unit'],
            ['Dozen',            'doz'],
            ['Gross',            'gro'],
            ['Pack',             'pack'],
            ['Box',              'box'],
            ['Carton',           'ctn'],
            ['Set',              'set'],
            ['Pair',             'pr'],
            ['Bundle',           'bndl'],
            ['Roll',             'roll'],
            ['Sheet',            'sht'],
            ['Plate',            'plt'],
            // Weight
            ['Kilogram',         'kg'],
            ['Gram',             'g'],
            ['Milligram',        'mg'],
            ['Ton (Metric)',     'MT'],
            ['Pound',            'lb'],
            // Volume
            ['Litre',            'ltr'],
            ['Millilitre',       'ml'],
            ['Gallon',           'gal'],
            ['Cubic Metre',      'm³'],
            // Length / Area
            ['Metre',            'm'],
            ['Centimetre',       'cm'],
            ['Millimetre',       'mm'],
            ['Kilometre',        'km'],
            ['Foot',             'ft'],
            ['Inch',             'in'],
            ['Square Metre',     'm²'],
            ['Square Foot',      'ft²'],
            // Time
            ['Hour',             'hr'],
            ['Day',              'day'],
            ['Month',            'month'],
            ['Year',             'year'],
            // Digital
            ['Megabyte',         'MB'],
            ['Gigabyte',         'GB'],
        ];

        $now    = now();
        $seeded = 0;
        $companies = Company::pluck('id');

        foreach ($companies as $companyId) {
            foreach ($units as [$name, $abbr]) {
                $exists = DB::table('units')
                    ->where('company_id', $companyId)
                    ->where('abbreviation', $abbr)
                    ->exists();

                if (! $exists) {
                    DB::table('units')->insert([
                        'company_id'   => $companyId,
                        'name'         => $name,
                        'abbreviation' => $abbr,
                        'is_active'    => true,
                        'created_at'   => $now,
                        'updated_at'   => $now,
                    ]);
                    $seeded++;
                }
            }
        }

        $this->command->info("UnitSeeder: {$seeded} units seeded.");
    }
}

<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * ProductCategorySeeder
 * Seeds a standard product category hierarchy for each company.
 */
class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        $now    = now();
        $seeded = 0;
        $companies = Company::pluck('id');

        // Top-level categories [code, name]
        $topLevel = [
            ['GEN',  'General'],
            ['ELEC', 'Electronics & Technology'],
            ['FURN', 'Furniture & Fixtures'],
            ['STAT', 'Stationery & Office Supplies'],
            ['SVC',  'Services'],
            ['RAW',  'Raw Materials'],
            ['FG',   'Finished Goods'],
            ['CONS', 'Consumables'],
            ['EQP',  'Equipment & Machinery'],
            ['FOOD', 'Food & Beverages'],
            ['MED',  'Medical & Pharmaceutical'],
            ['CLO',  'Clothing & Apparel'],
            ['PART', 'Spare Parts'],
        ];

        // Sub-categories [code, parent_code, name]
        $subLevel = [
            ['COMP', 'ELEC', 'Computers & Laptops'],
            ['MOB',  'ELEC', 'Mobile Phones & Tablets'],
            ['PRNT', 'ELEC', 'Printers & Scanners'],
            ['NET',  'ELEC', 'Networking Equipment'],
            ['SOFT', 'ELEC', 'Software & Licences'],
            ['OFURN','FURN', 'Office Furniture'],
            ['HFURN','FURN', 'Home Furniture'],
            ['PEN',  'STAT', 'Pens & Markers'],
            ['PAP',  'STAT', 'Paper & Notebooks'],
            ['INK',  'STAT', 'Ink & Toner Cartridges'],
            ['MSVC', 'SVC',  'Maintenance Services'],
            ['CSVC', 'SVC',  'Consulting Services'],
            ['TSVC', 'SVC',  'Transport Services'],
        ];

        foreach ($companies as $companyId) {
            $parentIds = [];

            foreach ($topLevel as [$code, $name]) {
                $existing = DB::table('product_categories')
                    ->where('company_id', $companyId)
                    ->where('code', $code)
                    ->first();

                if ($existing) {
                    $parentIds[$code] = $existing->id;
                    continue;
                }

                $id = DB::table('product_categories')->insertGetId([
                    'company_id'  => $companyId,
                    'parent_id'   => null,
                    'name'        => $name,
                    'code'        => $code,
                    'description' => null,
                    'is_active'   => true,
                    'created_at'  => $now,
                    'updated_at'  => $now,
                ]);
                $parentIds[$code] = $id;
                $seeded++;
            }

            foreach ($subLevel as [$code, $parentCode, $name]) {
                $exists = DB::table('product_categories')
                    ->where('company_id', $companyId)
                    ->where('code', $code)
                    ->exists();

                if (! $exists) {
                    DB::table('product_categories')->insert([
                        'company_id'  => $companyId,
                        'parent_id'   => $parentIds[$parentCode] ?? null,
                        'name'        => $name,
                        'code'        => $code,
                        'description' => null,
                        'is_active'   => true,
                        'created_at'  => $now,
                        'updated_at'  => $now,
                    ]);
                    $seeded++;
                }
            }
        }

        $this->command->info("ProductCategorySeeder: {$seeded} categories seeded.");
    }
}

<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * WarehouseSeeder
 * Creates a default "Main Warehouse" for each company if none exists.
 */
class WarehouseSeeder extends Seeder
{
    public function run(): void
    {
        $now    = now();
        $seeded = 0;
        $companies = Company::all(['id', 'address', 'phone']);

        $defaults = [
            ['code' => 'WH-001', 'name' => 'Main Warehouse'],
            ['code' => 'WH-002', 'name' => 'Secondary Warehouse'],
            ['code' => 'WH-003', 'name' => 'Transit Warehouse'],
            ['code' => 'RET-001','name' => 'Return / Damaged Goods'],
        ];

        foreach ($companies as $company) {
            foreach ($defaults as $wh) {
                $exists = DB::table('warehouses')
                    ->where('company_id', $company->id)
                    ->where('code', $wh['code'])
                    ->exists();

                if (! $exists) {
                    DB::table('warehouses')->insert([
                        'company_id' => $company->id,
                        'name'       => $wh['name'],
                        'code'       => $wh['code'],
                        'address'    => $company->address ?? null,
                        'phone'      => $company->phone   ?? null,
                        'is_active'  => true,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                    $seeded++;
                }
            }
        }

        $this->command->info("WarehouseSeeder: {$seeded} warehouses seeded.");
    }
}

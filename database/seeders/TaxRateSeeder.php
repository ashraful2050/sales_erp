<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * TaxRateSeeder
 * Seeds standard tax / VAT rates for each company.
 * Based on Bangladesh revenue authority (NBR) standard rates.
 */
class TaxRateSeeder extends Seeder
{
    public function run(): void
    {
        $rates = [
            // VAT rates (Bangladesh NBR standard)
            ['name' => 'VAT 15%',      'code' => 'VAT15',  'rate' => 15.0000, 'type' => 'vat',    'description' => 'Standard VAT rate (NBR Bangladesh)'],
            ['name' => 'VAT 10%',      'code' => 'VAT10',  'rate' => 10.0000, 'type' => 'vat',    'description' => 'Reduced VAT rate'],
            ['name' => 'VAT 7.5%',     'code' => 'VAT75',  'rate' => 7.5000,  'type' => 'vat',    'description' => 'Truncated VAT rate'],
            ['name' => 'VAT 5%',       'code' => 'VAT5',   'rate' => 5.0000,  'type' => 'vat',    'description' => 'Reduced VAT – specific goods'],
            ['name' => 'VAT 2%',       'code' => 'VAT2',   'rate' => 2.0000,  'type' => 'vat',    'description' => 'Reduced VAT rate'],
            ['name' => 'Zero-Rated',   'code' => 'ZERO',   'rate' => 0.0000,  'type' => 'vat',    'description' => 'Zero-rated VAT (exports, exempt goods)'],
            // TDS (Tax Deducted at Source)
            ['name' => 'TDS 10%',      'code' => 'TDS10',  'rate' => 10.0000, 'type' => 'tds',    'description' => 'TDS on service payments'],
            ['name' => 'TDS 5%',       'code' => 'TDS5',   'rate' => 5.0000,  'type' => 'tds',    'description' => 'TDS on rent, commission'],
            ['name' => 'TDS 3%',       'code' => 'TDS3',   'rate' => 3.0000,  'type' => 'tds',    'description' => 'TDS on import payments'],
            ['name' => 'TDS 2%',       'code' => 'TDS2',   'rate' => 2.0000,  'type' => 'tds',    'description' => 'TDS on advertising agency'],
            ['name' => 'TDS 1.5%',     'code' => 'TDS15',  'rate' => 1.5000,  'type' => 'tds',    'description' => 'TDS on construction'],
            // GST
            ['name' => 'GST 5%',       'code' => 'GST5',   'rate' => 5.0000,  'type' => 'gst',    'description' => 'GST rate'],
            ['name' => 'GST 12%',      'code' => 'GST12',  'rate' => 12.0000, 'type' => 'gst',    'description' => 'GST standard rate'],
            // Custom
            ['name' => 'Withholding 15%','code'=>'WHT15',  'rate' => 15.0000, 'type' => 'custom', 'description' => 'Withholding tax on dividends'],
            ['name' => 'Excise Duty 5%', 'code'=>'EXC5',   'rate' => 5.0000,  'type' => 'custom', 'description' => 'Excise duty on specified goods'],
        ];

        $now      = now();
        $seeded   = 0;
        $companies = Company::pluck('id');

        foreach ($companies as $companyId) {
            foreach ($rates as $rate) {
                $exists = DB::table('tax_rates')
                    ->where('company_id', $companyId)
                    ->where('code', $rate['code'])
                    ->exists();

                if (! $exists) {
                    DB::table('tax_rates')->insert(array_merge($rate, [
                        'company_id' => $companyId,
                        'is_active'  => true,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]));
                    $seeded++;
                }
            }
        }

        $this->command->info("TaxRateSeeder: {$seeded} rates seeded across {$companies->count()} company(ies).");
    }
}

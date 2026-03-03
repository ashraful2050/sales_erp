<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * CompanySeeder
 * Creates a demo company if no company exists.
 * All subsequent company-specific seeders depend on at least one company.
 */
class CompanySeeder extends Seeder
{
    public function run(): void
    {
        if (Company::exists()) {
            $this->command->info('CompanySeeder: Company already exists, skipping.');
            return;
        }

        $company = Company::create([
            'name'               => 'AccounTech BD',
            'name_bn'            => 'অ্যাকাউন্টেক বিডি',
            'trade_license'      => 'TL-2024-001',
            'tin_number'         => '123456789',
            'bin_number'         => 'BIN-001',
            'address'            => 'House 12, Road 5, Dhanmondi',
            'city'               => 'Dhaka',
            'country'            => 'Bangladesh',
            'phone'              => '+8801700000000',
            'email'              => 'info@accountech.bd',
            'website'            => 'https://accountech.bd',
            'currency_code'      => 'BDT',
            'fiscal_year_start'  => '07-01',
            'language'           => 'en',
            'settings'           => [
                'layout'         => 'dark',
                'date_format'    => 'd/m/Y',
                'timezone'       => 'Asia/Dhaka',
            ],
        ]);

        $this->command->info("CompanySeeder: Demo company '{$company->name}' created (ID: {$company->id}).");
    }
}

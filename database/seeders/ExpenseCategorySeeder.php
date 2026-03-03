<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * ExpenseCategorySeeder
 * Seeds standard expense categories for each company.
 */
class ExpenseCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Office Supplies',           'description' => 'Pens, paper, toner, stationery items'],
            ['name' => 'Travel & Accommodation',    'description' => 'Business travel, hotel stays, airfare'],
            ['name' => 'Transport & Fuel',          'description' => 'Vehicle fuel, local transport, cab fare'],
            ['name' => 'Utilities',                 'description' => 'Electricity, water, gas bills'],
            ['name' => 'Internet & Communication',  'description' => 'Internet, phone, mobile bills'],
            ['name' => 'Rent & Lease',              'description' => 'Office rent, equipment leases'],
            ['name' => 'Repairs & Maintenance',     'description' => 'Equipment repair, building maintenance'],
            ['name' => 'Marketing & Advertising',   'description' => 'Ads, promotions, branding costs'],
            ['name' => 'Printing & Publications',   'description' => 'Printing, publications, books'],
            ['name' => 'Food & Entertainment',      'description' => 'Client entertainment, team meals'],
            ['name' => 'Professional Fees',         'description' => 'Legal, audit, consulting fees'],
            ['name' => 'Training & Development',    'description' => 'Employee training, workshops, courses'],
            ['name' => 'IT & Software',             'description' => 'Software licenses, cloud subscriptions'],
            ['name' => 'Medical & Health',          'description' => 'Employee medical, health insurance'],
            ['name' => 'Insurance',                 'description' => 'General business insurance premiums'],
            ['name' => 'Bank Charges',              'description' => 'Bank fees, transaction charges'],
            ['name' => 'Charitable Donations',      'description' => 'CSR donations and contributions'],
            ['name' => 'Miscellaneous',             'description' => 'Other uncategorised business expenses'],
        ];

        $now    = now();
        $seeded = 0;
        $companies = Company::pluck('id');

        foreach ($companies as $companyId) {
            foreach ($categories as $cat) {
                $exists = DB::table('expense_categories')
                    ->where('company_id', $companyId)
                    ->where('name', $cat['name'])
                    ->exists();

                if (! $exists) {
                    DB::table('expense_categories')->insert([
                        'company_id'  => $companyId,
                        'name'        => $cat['name'],
                        'description' => $cat['description'],
                        'is_active'   => true,
                        'created_at'  => $now,
                        'updated_at'  => $now,
                    ]);
                    $seeded++;
                }
            }
        }

        $this->command->info("ExpenseCategorySeeder: {$seeded} categories seeded.");
    }
}

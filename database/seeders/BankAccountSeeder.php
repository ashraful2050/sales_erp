<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * BankAccountSeeder
 * Creates a sample bank account for each company that has none yet.
 * Links to GL account code 1020 (Bank Accounts) when available.
 */
class BankAccountSeeder extends Seeder
{
    public function run(): void
    {
        $now    = now();
        $seeded = 0;
        $companies = Company::all(['id', 'currency_id']);

        foreach ($companies as $company) {
            $existing = DB::table('bank_accounts')
                ->where('company_id', $company->id)
                ->count();

            if ($existing > 0) {
                continue;
            }

            // Resolve GL account (Bank Accounts group, code 1020)
            $glAccountId = DB::table('accounts')
                ->where('company_id', $company->id)
                ->where('code', '1020')
                ->value('id');

            // Determine default currency for the company
            $currencyCode = DB::table('currencies')
                ->where('id', $company->currency_id ?? 0)
                ->value('code') ?? 'BDT';

            DB::table('bank_accounts')->insert([
                'company_id'      => $company->id,
                'account_id'      => $glAccountId,
                'bank_name'       => 'Sample Bank Ltd.',
                'account_name'    => 'Company Current Account',
                'account_number'  => '0000000000000',
                'branch_name'     => 'Head Office Branch',
                'routing_number'  => null,
                'swift_code'      => null,
                'currency_code'   => $currencyCode,
                'opening_balance' => 0,
                'payment_method'  => 'bank_transfer',
                'is_active'       => true,
                'created_at'      => $now,
                'updated_at'      => $now,
            ]);
            $seeded++;
        }

        $this->command->info("BankAccountSeeder: {$seeded} bank account(s) seeded.");
    }
}

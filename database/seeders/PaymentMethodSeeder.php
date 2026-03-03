<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * PaymentMethodSeeder
 * Seeds standard payment methods for each company.
 * Cash is the default; others link to the appropriate GL account when available.
 */
class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        // [name, type, is_default]
        $methods = [
            ['Cash',            'cash',           true],
            ['Bank Transfer',   'bank',           false],
            ['Cheque',          'cheque',         false],
            ['bKash',           'mobile_banking', false],
            ['Nagad',           'mobile_banking', false],
            ['Rocket',          'mobile_banking', false],
            ['Credit Card',     'card',           false],
            ['Debit Card',      'card',           false],
            ['Online Payment',  'online',         false],
            ['Letter of Credit','lc',             false],
        ];

        $now    = now();
        $seeded = 0;
        $companies = Company::pluck('id');

        foreach ($companies as $companyId) {
            // Resolve GL account IDs for common types
            $cashAccountId = DB::table('accounts')
                ->where('company_id', $companyId)
                ->where('code', '1010')
                ->value('id');

            $bankAccountId = DB::table('accounts')
                ->where('company_id', $companyId)
                ->where('code', '1020')
                ->value('id');

            foreach ($methods as [$name, $type, $isDefault]) {
                $exists = DB::table('payment_methods')
                    ->where('company_id', $companyId)
                    ->where('name', $name)
                    ->exists();

                if (! $exists) {
                    $accountId = match ($type) {
                        'cash'   => $cashAccountId,
                        'bank', 'cheque', 'lc' => $bankAccountId,
                        default  => null,
                    };

                    DB::table('payment_methods')->insert([
                        'company_id' => $companyId,
                        'name'       => $name,
                        'type'       => $type,
                        'account_id' => $accountId,
                        'is_default' => $isDefault,
                        'is_active'  => true,
                        'notes'      => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                    $seeded++;
                }
            }
        }

        $this->command->info("PaymentMethodSeeder: {$seeded} payment methods seeded.");
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $companies = DB::table('companies')->pluck('id');

        foreach ($companies as $companyId) {
            $existing = DB::table('payment_methods')
                ->where('company_id', $companyId)
                ->count();

            if ($existing === 0) {
                $now = now();
                DB::table('payment_methods')->insert([
                    [
                        'company_id' => $companyId,
                        'name'       => 'Cash',
                        'type'       => 'cash',
                        'account_id' => null,
                        'is_default' => true,
                        'is_active'  => true,
                        'notes'      => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                    [
                        'company_id' => $companyId,
                        'name'       => 'Bank Transfer',
                        'type'       => 'bank',
                        'account_id' => null,
                        'is_default' => false,
                        'is_active'  => true,
                        'notes'      => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                    [
                        'company_id' => $companyId,
                        'name'       => 'bKash',
                        'type'       => 'mobile_banking',
                        'account_id' => null,
                        'is_default' => false,
                        'is_active'  => true,
                        'notes'      => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                    [
                        'company_id' => $companyId,
                        'name'       => 'Nagad',
                        'type'       => 'mobile_banking',
                        'account_id' => null,
                        'is_default' => false,
                        'is_active'  => true,
                        'notes'      => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                    [
                        'company_id' => $companyId,
                        'name'       => 'Cheque',
                        'type'       => 'bank',
                        'account_id' => null,
                        'is_default' => false,
                        'is_active'  => true,
                        'notes'      => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                ]);
            }
        }
    }

    public function down(): void
    {
        // Remove only the default seeded methods (by name) if they have no GL account linked
        DB::table('payment_methods')
            ->whereNull('account_id')
            ->whereIn('name', ['Cash', 'Bank Transfer', 'bKash', 'Nagad', 'Cheque'])
            ->delete();
    }
};

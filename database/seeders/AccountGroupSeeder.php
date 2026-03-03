<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * AccountGroupSeeder
 * Seeds a standard Chart of Account Groups (5-hierarchy system) for each company.
 * Groups follow the standard accounting structure:
 *   Assets | Liabilities | Equity | Revenue | Expenses
 */
class AccountGroupSeeder extends Seeder
{
    public function run(): void
    {
        $companies = Company::pluck('id');
        $seeded    = 0;
        $now       = now();

        // Top-level groups [code-prefix, name, type, nature, sort]
        $topGroups = [
            ['1000', 'Assets',      'asset',     'debit',  1],
            ['2000', 'Liabilities', 'liability', 'credit', 2],
            ['3000', 'Equity',      'equity',    'credit', 3],
            ['4000', 'Revenue',     'revenue',   'credit', 4],
            ['5000', 'Expenses',    'expense',   'debit',  5],
        ];

        // Sub-groups [code-prefix, parent-code-prefix, name, type, nature, sort]
        $subGroups = [
            // Assets
            ['1100', '1000', 'Current Assets',          'asset',     'debit',  1],
            ['1200', '1000', 'Fixed & Long-Term Assets', 'asset',     'debit',  2],
            ['1300', '1000', 'Other Assets',             'asset',     'debit',  3],
            // Liabilities
            ['2100', '2000', 'Current Liabilities',      'liability', 'credit', 1],
            ['2200', '2000', 'Long-Term Liabilities',    'liability', 'credit', 2],
            ['2300', '2000', 'Tax & Statutory Liabilities','liability','credit', 3],
            // Equity
            ['3100', '3000', "Owner's Capital",          'equity',    'credit', 1],
            ['3200', '3000', 'Retained Earnings',        'equity',    'credit', 2],
            ['3300', '3000', 'Reserves & Surplus',       'equity',    'credit', 3],
            // Revenue
            ['4100', '4000', 'Operating Revenue',        'revenue',   'credit', 1],
            ['4200', '4000', 'Non-Operating Revenue',    'revenue',   'credit', 2],
            // Expenses
            ['5100', '5000', 'Cost of Goods Sold',       'expense',   'debit',  1],
            ['5200', '5000', 'Operating Expenses',       'expense',   'debit',  2],
            ['5300', '5000', 'Administrative Expenses',  'expense',   'debit',  3],
            ['5400', '5000', 'Financial Expenses',       'expense',   'debit',  4],
            ['5500', '5000', 'Other Expenses',           'expense',   'debit',  5],
        ];

        foreach ($companies as $companyId) {
            $existing = DB::table('account_groups')
                ->where('company_id', $companyId)
                ->count();

            if ($existing > 0) {
                continue;
            }

            $parentIds = [];

            // Insert top-level groups
            foreach ($topGroups as [$code, $name, $type, $nature, $sort]) {
                $id = DB::table('account_groups')->insertGetId([
                    'company_id'  => $companyId,
                    'parent_id'   => null,
                    'name'        => $name,
                    'type'        => $type,
                    'nature'      => $nature,
                    'sort_order'  => $sort,
                    'created_at'  => $now,
                    'updated_at'  => $now,
                ]);
                $parentIds[$code] = $id;
                $seeded++;
            }

            // Insert sub-groups
            foreach ($subGroups as [$code, $parentCode, $name, $type, $nature, $sort]) {
                $id = DB::table('account_groups')->insertGetId([
                    'company_id'  => $companyId,
                    'parent_id'   => $parentIds[$parentCode] ?? null,
                    'name'        => $name,
                    'type'        => $type,
                    'nature'      => $nature,
                    'sort_order'  => $sort,
                    'created_at'  => $now,
                    'updated_at'  => $now,
                ]);
                $parentIds[$code] = $id;
                $seeded++;
            }
        }

        $this->command->info("AccountGroupSeeder: {$seeded} groups seeded for {$companies->count()} company(ies).");
    }
}

<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * AccountSeeder
 * Seeds a full standard Chart of Accounts for each company.
 * Requires AccountGroupSeeder to have run first.
 * Groups are matched by name within the company.
 */
class AccountSeeder extends Seeder
{
    public function run(): void
    {
        $companies = Company::pluck('id');
        $seeded    = 0;
        $now       = now();

        // [code, name, type, balance_type, sub_type, is_system, group_name]
        $accounts = [
            // ── Current Assets ─────────────────────────────────────────────
            ['1010', 'Cash in Hand',              'asset',     'debit',  'cash',       true,  'Current Assets'],
            ['1011', 'Petty Cash',                'asset',     'debit',  'cash',       true,  'Current Assets'],
            ['1020', 'Bank Accounts',             'asset',     'debit',  'bank',       true,  'Current Assets'],
            ['1021', 'Current Account',           'asset',     'debit',  'bank',       false, 'Current Assets'],
            ['1022', 'Savings Account',           'asset',     'debit',  'bank',       false, 'Current Assets'],
            ['1030', 'Accounts Receivable',       'asset',     'debit',  'receivable', true,  'Current Assets'],
            ['1031', 'Other Receivables',         'asset',     'debit',  'receivable', false, 'Current Assets'],
            ['1040', 'Inventory / Stock',         'asset',     'debit',  'inventory',  true,  'Current Assets'],
            ['1050', 'Advance & Deposits',        'asset',     'debit',  'advance',    false, 'Current Assets'],
            ['1051', 'Advance to Suppliers',      'asset',     'debit',  'advance',    false, 'Current Assets'],
            ['1052', 'Advance to Employees',      'asset',     'debit',  'advance',    false, 'Current Assets'],
            ['1060', 'Input VAT / Tax Receivable','asset',     'debit',  'tax',        false, 'Current Assets'],
            ['1070', 'Short-Term Investments',    'asset',     'debit',  'investment', false, 'Current Assets'],
            ['1080', 'Prepaid Expenses',          'asset',     'debit',  'prepaid',    false, 'Current Assets'],

            // ── Fixed & Long-Term Assets ───────────────────────────────────
            ['1210', 'Land & Building',           'asset',     'debit',  'fixed_asset',  false, 'Fixed & Long-Term Assets'],
            ['1220', 'Furniture & Fixtures',      'asset',     'debit',  'fixed_asset',  false, 'Fixed & Long-Term Assets'],
            ['1230', 'Machinery & Equipment',     'asset',     'debit',  'fixed_asset',  false, 'Fixed & Long-Term Assets'],
            ['1240', 'Computer & IT Equipment',   'asset',     'debit',  'fixed_asset',  false, 'Fixed & Long-Term Assets'],
            ['1250', 'Vehicles',                  'asset',     'debit',  'fixed_asset',  false, 'Fixed & Long-Term Assets'],
            ['1260', 'Office Equipment',          'asset',     'debit',  'fixed_asset',  false, 'Fixed & Long-Term Assets'],
            ['1290', 'Accumulated Depreciation',  'asset',     'credit', 'contra',       false, 'Fixed & Long-Term Assets'],
            // Other Assets
            ['1310', 'Long-Term Investments',     'asset',     'debit',  'investment',   false, 'Other Assets'],
            ['1320', 'Intangible Assets',         'asset',     'debit',  'intangible',   false, 'Other Assets'],
            ['1330', 'Security Deposits',         'asset',     'debit',  'deposit',      false, 'Other Assets'],

            // ── Current Liabilities ───────────────────────────────────────
            ['2110', 'Accounts Payable',          'liability', 'credit', 'payable',      true,  'Current Liabilities'],
            ['2111', 'Other Payables',            'liability', 'credit', 'payable',      false, 'Current Liabilities'],
            ['2120', 'Advance from Customers',    'liability', 'credit', 'advance',      false, 'Current Liabilities'],
            ['2130', 'Accrued Expenses',          'liability', 'credit', 'accrued',      false, 'Current Liabilities'],
            ['2140', 'Short-Term Loans',          'liability', 'credit', 'loan',         false, 'Current Liabilities'],
            // Tax & Statutory Liabilities
            ['2310', 'Output VAT / Tax Payable',  'liability', 'credit', 'tax',          false, 'Tax & Statutory Liabilities'],
            ['2320', 'Income Tax Payable',        'liability', 'credit', 'tax',          false, 'Tax & Statutory Liabilities'],
            ['2330', 'TDS Payable',               'liability', 'credit', 'tax',          false, 'Tax & Statutory Liabilities'],
            ['2340', 'Salaries Payable',          'liability', 'credit', 'payable',      false, 'Tax & Statutory Liabilities'],
            ['2350', 'Provident Fund Payable',    'liability', 'credit', 'payable',      false, 'Tax & Statutory Liabilities'],
            // Long-Term Liabilities
            ['2210', 'Long-Term Loans',           'liability', 'credit', 'loan',         false, 'Long-Term Liabilities'],
            ['2220', 'Debentures & Bonds',        'liability', 'credit', 'debt',         false, 'Long-Term Liabilities'],

            // ── Equity ────────────────────────────────────────────────────
            ["3110", "Capital Account",           'equity',    'credit', 'capital',      true,  "Owner's Capital"],
            ['3120', 'Drawings',                  'equity',    'debit',  'drawings',     false, "Owner's Capital"],
            ['3210', 'Retained Earnings',         'equity',    'credit', 'retained',     true,  'Retained Earnings'],
            ['3220', 'Current Year Profit / Loss','equity',    'credit', 'profit_loss',  false, 'Retained Earnings'],
            ['3310', 'General Reserve',           'equity',    'credit', 'reserve',      false, 'Reserves & Surplus'],

            // ── Operating Revenue ─────────────────────────────────────────
            ['4110', 'Product Sales',             'revenue',   'credit', 'sales',        true,  'Operating Revenue'],
            ['4120', 'Service Revenue',           'revenue',   'credit', 'sales',        false, 'Operating Revenue'],
            ['4130', 'Sales Returns & Allowances','revenue',   'debit',  'contra_sales', false, 'Operating Revenue'],
            ['4140', 'Sales Discount',            'revenue',   'debit',  'contra_sales', false, 'Operating Revenue'],
            // Non-Operating Revenue
            ['4210', 'Interest Income',           'revenue',   'credit', 'interest',     false, 'Non-Operating Revenue'],
            ['4220', 'Dividend Income',           'revenue',   'credit', 'dividend',     false, 'Non-Operating Revenue'],
            ['4230', 'Gain on Asset Disposal',    'revenue',   'credit', 'gain',         false, 'Non-Operating Revenue'],
            ['4240', 'Other Income',              'revenue',   'credit', 'other',        false, 'Non-Operating Revenue'],

            // ── Cost of Goods Sold ────────────────────────────────────────
            ['5110', 'Cost of Goods Sold',        'expense',   'debit',  'cogs',         true,  'Cost of Goods Sold'],
            ['5120', 'Purchase Returns',          'expense',   'credit', 'contra_cogs',  false, 'Cost of Goods Sold'],
            ['5130', 'Purchase Discount',         'expense',   'credit', 'contra_cogs',  false, 'Cost of Goods Sold'],
            ['5140', 'Direct Labour',             'expense',   'debit',  'labour',       false, 'Cost of Goods Sold'],
            ['5150', 'Direct Overheads',          'expense',   'debit',  'overhead',     false, 'Cost of Goods Sold'],

            // ── Operating Expenses ────────────────────────────────────────
            ['5210', 'Salaries & Wages',          'expense',   'debit',  'payroll',      false, 'Operating Expenses'],
            ['5211', 'Overtime Pay',              'expense',   'debit',  'payroll',      false, 'Operating Expenses'],
            ['5212', 'Bonus & Incentives',        'expense',   'debit',  'payroll',      false, 'Operating Expenses'],
            ['5220', 'Rent Expense',              'expense',   'debit',  'rent',         false, 'Operating Expenses'],
            ['5230', 'Utilities (Electricity, Water, Gas)', 'expense', 'debit', 'utilities', false, 'Operating Expenses'],
            ['5240', 'Transport & Conveyance',    'expense',   'debit',  'transport',    false, 'Operating Expenses'],
            ['5250', 'Marketing & Advertising',   'expense',   'debit',  'marketing',    false, 'Operating Expenses'],
            ['5260', 'Communication (Phone, Internet)', 'expense', 'debit', 'communication', false, 'Operating Expenses'],
            ['5270', 'Repairs & Maintenance',     'expense',   'debit',  'maintenance',  false, 'Operating Expenses'],
            ['5280', 'Travel Expense',            'expense',   'debit',  'travel',       false, 'Operating Expenses'],

            // ── Administrative Expenses ───────────────────────────────────
            ['5310', 'Office Supplies',           'expense',   'debit',  'supplies',     false, 'Administrative Expenses'],
            ['5320', 'Printing & Stationery',     'expense',   'debit',  'printing',     false, 'Administrative Expenses'],
            ['5330', 'Professional Fees (Legal, Audit)', 'expense', 'debit', 'professional', false, 'Administrative Expenses'],
            ['5340', 'Hardware & Software Expenses', 'expense', 'debit', 'it_expense',  false, 'Administrative Expenses'],
            ['5350', 'Depreciation Expense',      'expense',   'debit',  'depreciation', false, 'Administrative Expenses'],
            ['5360', 'Amortisation',              'expense',   'debit',  'amortisation', false, 'Administrative Expenses'],
            ['5370', 'Insurance',                 'expense',   'debit',  'insurance',    false, 'Administrative Expenses'],

            // ── Financial Expenses ────────────────────────────────────────
            ['5410', 'Bank Charges & Commission', 'expense',   'debit',  'bank_charge',  false, 'Financial Expenses'],
            ['5420', 'Interest Expense',          'expense',   'debit',  'interest',     false, 'Financial Expenses'],
            ['5430', 'Exchange Loss',             'expense',   'debit',  'forex',        false, 'Financial Expenses'],

            // ── Other Expenses ─────────────────────────────────────────────
            ['5510', 'Charitable Donations',      'expense',   'debit',  'donation',     false, 'Other Expenses'],
            ['5520', 'Penalty & Fine',            'expense',   'debit',  'penalty',      false, 'Other Expenses'],
            ['5530', 'Miscellaneous Expense',     'expense',   'debit',  'misc',         false, 'Other Expenses'],
            ['5540', 'Loss on Asset Disposal',    'expense',   'debit',  'loss',         false, 'Other Expenses'],
        ];

        foreach ($companies as $companyId) {
            $existingAccounts = DB::table('accounts')
                ->where('company_id', $companyId)
                ->count();

            if ($existingAccounts > 0) {
                continue;
            }

            // Map group_name → group_id for this company
            $groupMap = DB::table('account_groups')
                ->where('company_id', $companyId)
                ->pluck('id', 'name')
                ->toArray();

            foreach ($accounts as [$code, $name, $type, $balanceType, $subType, $isSystem, $groupName]) {
                $groupId = $groupMap[$groupName] ?? null;

                if (! $groupId) {
                    continue; // skip if group not found
                }

                $exists = DB::table('accounts')
                    ->where('company_id', $companyId)
                    ->where('code', $code)
                    ->exists();

                if (! $exists) {
                    DB::table('accounts')->insert([
                        'company_id'       => $companyId,
                        'account_group_id' => $groupId,
                        'code'             => $code,
                        'name'             => $name,
                        'type'             => $type,
                        'balance_type'     => $balanceType,
                        'sub_type'         => $subType,
                        'opening_balance'  => 0,
                        'is_active'        => true,
                        'is_system'        => $isSystem,
                        'currency_code'    => 'BDT',
                        'created_at'       => $now,
                        'updated_at'       => $now,
                    ]);
                    $seeded++;
                }
            }
        }

        $this->command->info("AccountSeeder: {$seeded} accounts seeded for {$companies->count()} company(ies).");
    }
}

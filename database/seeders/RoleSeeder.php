<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Role;
use App\Support\Permissions;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $companies = Company::all();

        foreach ($companies as $company) {
            Role::updateOrCreate(
                ['company_id' => $company->id, 'name' => 'admin'],
                ['guard_name' => 'web', 'permissions' => Permissions::adminDefaults(), 'is_system' => true]
            );
            Role::updateOrCreate(
                ['company_id' => $company->id, 'name' => 'moderator'],
                ['guard_name' => 'web', 'permissions' => Permissions::moderatorDefaults(), 'is_system' => true]
            );
            Role::updateOrCreate(
                ['company_id' => $company->id, 'name' => 'accountant'],
                ['guard_name' => 'web', 'permissions' => $this->accountantPermissions(), 'is_system' => true]
            );
            Role::updateOrCreate(
                ['company_id' => $company->id, 'name' => 'sales_executive'],
                ['guard_name' => 'web', 'permissions' => $this->salesExecutivePermissions(), 'is_system' => true]
            );
            Role::updateOrCreate(
                ['company_id' => $company->id, 'name' => 'purchase_officer'],
                ['guard_name' => 'web', 'permissions' => $this->purchaseOfficerPermissions(), 'is_system' => true]
            );
            Role::updateOrCreate(
                ['company_id' => $company->id, 'name' => 'hr_officer'],
                ['guard_name' => 'web', 'permissions' => $this->hrOfficerPermissions(), 'is_system' => true]
            );
            Role::updateOrCreate(
                ['company_id' => $company->id, 'name' => 'store_keeper'],
                ['guard_name' => 'web', 'permissions' => $this->storeKeeperPermissions(), 'is_system' => true]
            );
            Role::updateOrCreate(
                ['company_id' => $company->id, 'name' => 'cashier'],
                ['guard_name' => 'web', 'permissions' => $this->cashierPermissions(), 'is_system' => true]
            );
            Role::updateOrCreate(
                ['company_id' => $company->id, 'name' => 'viewer'],
                ['guard_name' => 'web', 'permissions' => $this->viewerPermissions(), 'is_system' => true]
            );
        }

        $this->command->info('Roles seeded: 9 role types for ' . $companies->count() . ' company(ies).');
    }

    private function bld(array $allow): array
    {
        $perms = [];
        foreach (Permissions::MODULES as $module => $actions) {
            foreach ($actions as $action) { $perms["{$module}.{$action}"] = false; }
        }
        foreach (Permissions::FEATURES as $module => $features) {
            foreach ($features as $feature => $label) { $perms["{$module}.{$feature}"] = false; }
        }
        foreach ($allow as $key => $val) { $perms[$key] = (bool)$val; }
        return $perms;
    }

    private function accountantPermissions(): array
    {
        return $this->bld([
            'accounting.view' => 1, 'accounting.create' => 1, 'accounting.edit' => 1,
            'accounting.chart_of_accounts' => 1, 'accounting.account_groups' => 1,
            'accounting.journal_entries' => 1, 'accounting.opening_balance' => 1,
            'accounting.payment_methods' => 1, 'accounting.debit_vouchers' => 1,
            'accounting.credit_vouchers' => 1, 'accounting.contra_vouchers' => 1,
            'sales.view' => 1, 'sales.invoices' => 1,
            'purchase.view' => 1,
            'finance.view' => 1, 'finance.create' => 1, 'finance.edit' => 1,
            'finance.payments' => 1, 'finance.bank_accounts' => 1, 'finance.expenses' => 1,
            'reports.view' => 1, 'reports.trial_balance' => 1, 'reports.profit_loss' => 1,
            'reports.balance_sheet' => 1, 'reports.cash_flow' => 1, 'reports.general_ledger' => 1,
            'reports.aged_receivables' => 1, 'reports.aged_payables' => 1,
            'reports.expense_report' => 1, 'reports.tax_report' => 1,
            'settings.view' => 1, 'inventory.view' => 1,
        ]);
    }

    private function salesExecutivePermissions(): array
    {
        return $this->bld([
            'sales.view' => 1, 'sales.create' => 1, 'sales.edit' => 1,
            'sales.invoices' => 1, 'sales.quotations' => 1, 'sales.delivery_notes' => 1,
            'sales.customers' => 1, 'sales.pricing_rules' => 1, 'sales.discount_rules' => 1,
            'sales.loyalty_programs' => 1, 'sales.commissions' => 1,
            'inventory.view' => 1, 'inventory.products' => 1,
            'pos.view' => 1, 'pos.create' => 1, 'pos.pos_terminal' => 1,
            'crm.view' => 1, 'crm.create' => 1, 'crm.edit' => 1,
            'crm.leads' => 1, 'crm.segments' => 1,
            'tasks.view' => 1, 'tasks.create' => 1,
            'support.view' => 1, 'analytics.view' => 1, 'analytics.sales_dashboard' => 1,
            'reports.view' => 1, 'reports.sales_report' => 1, 'reports.customer_statement' => 1,
        ]);
    }

    private function purchaseOfficerPermissions(): array
    {
        return $this->bld([
            'purchase.view' => 1, 'purchase.create' => 1, 'purchase.edit' => 1,
            'purchase.purchase_orders' => 1, 'purchase.vendors' => 1,
            'purchase.debit_notes' => 1, 'purchase.goods_receipts' => 1,
            'inventory.view' => 1, 'inventory.create' => 1, 'inventory.edit' => 1,
            'inventory.products' => 1, 'inventory.warehouses' => 1, 'inventory.stock_movements' => 1,
            'finance.view' => 1, 'finance.payments' => 1,
            'reports.view' => 1, 'reports.purchase_report' => 1,
            'reports.stock_report' => 1, 'reports.vendor_statement' => 1,
        ]);
    }

    private function hrOfficerPermissions(): array
    {
        return $this->bld([
            'hr.view' => 1, 'hr.create' => 1, 'hr.edit' => 1,
            'hr.employees' => 1, 'hr.payroll' => 1, 'hr.leaves' => 1,
            'reports.view' => 1, 'reports.payroll_summary' => 1,
            'settings.view' => 1,
        ]);
    }

    private function storeKeeperPermissions(): array
    {
        return $this->bld([
            'inventory.view' => 1, 'inventory.create' => 1, 'inventory.edit' => 1,
            'inventory.products' => 1, 'inventory.warehouses' => 1,
            'inventory.categories' => 1, 'inventory.stock_movements' => 1,
            'purchase.view' => 1, 'purchase.goods_receipts' => 1,
            'sales.view' => 1, 'sales.delivery_notes' => 1,
            'reports.view' => 1, 'reports.stock_report' => 1,
        ]);
    }

    private function cashierPermissions(): array
    {
        return $this->bld([
            'pos.view' => 1, 'pos.create' => 1, 'pos.pos_terminal' => 1,
            'sales.view' => 1, 'sales.create' => 1, 'sales.invoices' => 1, 'sales.customers' => 1,
            'finance.view' => 1, 'inventory.view' => 1,
        ]);
    }

    private function viewerPermissions(): array
    {
        return $this->bld([
            'accounting.view' => 1, 'sales.view' => 1, 'purchase.view' => 1,
            'finance.view' => 1, 'inventory.view' => 1, 'hr.view' => 1,
            'assets.view' => 1, 'pos.view' => 1, 'reports.view' => 1,
            'settings.view' => 1, 'crm.view' => 1, 'tasks.view' => 1,
            'support.view' => 1, 'analytics.view' => 1, 'ie.view' => 1,
        ]);
    }
}

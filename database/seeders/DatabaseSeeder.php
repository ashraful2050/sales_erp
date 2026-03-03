<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Execution order respects FK dependencies:
     *   1. Global / system tables (no company_id)
     *   2. Company must exist before company-scoped tables
     *   3. CoA groups before accounts; accounts before payment methods / bank accounts
     *   4. Departments before designations
     *   5. Demo / sample data last (Admin, FAQ, Products, ERP demo)
     */
    public function run(): void
    {
        $this->call([
            // ── 1. SaaS Plans ────────────────────────────────────────────
            PlanSeeder::class,

            // ── 2. Global reference data ──────────────────────────────────
            CurrencySeeder::class,
            LanguageSeeder::class,

            // ── 3. First company + super-admin user ───────────────────────
            CompanySeeder::class,
            AdminSeeder::class,

            // ── 4. Company-scoped roles ───────────────────────────────────
            RoleSeeder::class,

            // ── 5. Fiscal & tax configuration ────────────────────────────
            TaxRateSeeder::class,
            FiscalYearSeeder::class,

            // ── 6. Chart of Accounts (groups must precede accounts) ───────
            AccountGroupSeeder::class,
            AccountSeeder::class,

            // ── 7. HR master data ─────────────────────────────────────────
            DepartmentSeeder::class,
            DesignationSeeder::class,
            SalaryComponentSeeder::class,
            LeaveTypeSeeder::class,

            // ── 8. Expense management ─────────────────────────────────────
            ExpenseCategorySeeder::class,

            // ── 9. Inventory & warehouse ──────────────────────────────────
            UnitSeeder::class,
            AssetCategorySeeder::class,
            WarehouseSeeder::class,
            ProductCategorySeeder::class,

            // ── 10. Payment & banking ─────────────────────────────────────
            //        (needs GL accounts from AccountSeeder)
            PaymentMethodSeeder::class,
            BankAccountSeeder::class,

            // ── 11. Reporting / cost structure ────────────────────────────
            CostCenterSeeder::class,

            // ── 12. Demo / sample content ─────────────────────────────────
            FaqSeeder::class,
            ProductSeeder::class,
        ]);
    }
}

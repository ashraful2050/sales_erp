<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\Accounting\AccountGroupController;
use App\Http\Controllers\Accounting\AccountController;
use App\Http\Controllers\Accounting\JournalEntryController;
use App\Http\Controllers\Accounting\CostCenterController;
use App\Http\Controllers\Accounting\BudgetController;
use App\Http\Controllers\Sales\CustomerController;
use App\Http\Controllers\Sales\InvoiceController;
use App\Http\Controllers\Sales\CreditNoteController;
use App\Http\Controllers\Sales\QuotationController;
use App\Http\Controllers\Purchase\VendorController;
use App\Http\Controllers\Purchase\PurchaseOrderController;
use App\Http\Controllers\Purchase\DebitNoteController;
use App\Http\Controllers\Finance\PaymentController;
use App\Http\Controllers\Finance\BankAccountController;
use App\Http\Controllers\Finance\BankReconciliationController;
use App\Http\Controllers\Finance\ExpenseController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\Purchase\GoodsReceiptController;
use App\Http\Controllers\Sales\DeliveryNoteController;
use App\Http\Controllers\Inventory\ProductController;
use App\Http\Controllers\Inventory\WarehouseController;
use App\Http\Controllers\Inventory\ProductCategoryController;
use App\Http\Controllers\Inventory\StockMovementController;
use App\Http\Controllers\HR\EmployeeController;
use App\Http\Controllers\HR\PayrollController;
use App\Http\Controllers\HR\LeaveController;
use App\Http\Controllers\HR\LeaveTypeController;
use App\Http\Controllers\HR\DepartmentController;
use App\Http\Controllers\HR\DesignationController;
use App\Http\Controllers\HR\SalaryComponentController;
use App\Http\Controllers\Assets\FixedAssetController;
use App\Http\Controllers\Assets\AssetCategoryController;
use App\Http\Controllers\Reports\ReportController;
use App\Http\Controllers\Settings\CompanyController;
use App\Http\Controllers\Settings\TaxRateController;
use App\Http\Controllers\Settings\CurrencyController;
use App\Http\Controllers\Settings\FiscalYearController;
use App\Http\Controllers\Settings\UserController;
use App\Http\Controllers\Settings\RoleController;
use App\Http\Controllers\Settings\UnitController;
use App\Http\Controllers\Settings\AuditLogController;
use App\Http\Controllers\Settings\LoginHistoryController;
use App\Http\Controllers\Auth\TenantRegistrationController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\SuperAdmin\ContactRequestController;
use App\Http\Controllers\Accounting\PaymentMethodController;
use App\Http\Controllers\Accounting\VoucherController;
use App\Http\Controllers\Accounting\OpeningBalanceController;
use App\Http\Controllers\SuperAdmin\EmailLogController;
use App\Http\Controllers\SuperAdmin\TenantPermissionsController;
use App\Http\Controllers\SuperAdmin\DashboardController as SuperAdminDashboardController;
use App\Http\Controllers\SuperAdmin\TenantController;
use App\Http\Controllers\SuperAdmin\PlanController;
use App\Http\Controllers\SuperAdmin\AffiliateController;
use App\Http\Controllers\SuperAdmin\UserController as SuperAdminUserController;
use App\Http\Controllers\CRM\LeadController;
use App\Http\Controllers\CRM\CustomerSegmentController;
use App\Http\Controllers\Sales\PricingRuleController;
use App\Http\Controllers\Sales\DiscountRuleController;
use App\Http\Controllers\Sales\LoyaltyController;
use App\Http\Controllers\Sales\CommissionController;
use App\Http\Controllers\Sales\SalesChannelController;
use App\Http\Controllers\Sales\DirectSaleController;
use App\Http\Controllers\Purchase\DirectPurchaseController;
use App\Http\Controllers\Support\TicketController;
use App\Http\Controllers\Analytics\SalesAnalyticsController;
use App\Http\Controllers\TaskController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Public / Welcome ───────────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,        'plans'          => \App\Models\Plan::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id','name','slug','description','price_monthly','price_yearly',
                   'max_users','max_invoices_per_month','max_products','max_employees',
                   'trial_days','features']),    ]);
});

// ─── Tenant Self-Registration (public) ──────────────────────────────────────
Route::get('/register/tenant',  [TenantRegistrationController::class, 'showForm'])->name('tenant.register');
Route::post('/register/tenant', [TenantRegistrationController::class, 'register'])->name('tenant.register.submit');

// ─── Contact Us (public) ─────────────────────────────────────────────────────
Route::get('/contact',  [ContactController::class, 'showForm'])->name('contact.show');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.submit');

// ─── Super Admin Panel ───────────────────────────────────────────────────────
Route::middleware(['auth', 'superadmin'])
    ->prefix('superadmin')
    ->name('superadmin.')
    ->group(function () {

    // Dashboard
    Route::get('/', [SuperAdminDashboardController::class, 'index'])->name('dashboard');

    // Tenant Management
    Route::get('tenants',                     [TenantController::class, 'index'])->name('tenants.index');
    Route::get('tenants/create',              [TenantController::class, 'create'])->name('tenants.create');
    Route::post('tenants',                    [TenantController::class, 'store'])->name('tenants.store');
    Route::get('tenants/{company}',           [TenantController::class, 'show'])->name('tenants.show');
    Route::get('tenants/{company}/edit',      [TenantController::class, 'edit'])->name('tenants.edit');
    Route::put('tenants/{company}',           [TenantController::class, 'update'])->name('tenants.update');
    Route::delete('tenants/{company}',        [TenantController::class, 'destroy'])->name('tenants.destroy');
    Route::post('tenants/{company}/suspend',  [TenantController::class, 'suspend'])->name('tenants.suspend');
    Route::post('tenants/{company}/activate', [TenantController::class, 'activate'])->name('tenants.activate');
    Route::post('tenants/{company}/assign-plan', [TenantController::class, 'assignPlan'])->name('tenants.assign-plan');
    Route::post('tenants/{company}/impersonate', [TenantController::class, 'impersonate'])->name('tenants.impersonate');
    Route::post('stop-impersonating',        [TenantController::class, 'stopImpersonating'])->name('stop-impersonating');
    Route::post('tenants/{company}/set-layout', [TenantController::class, 'setLayout'])->name('tenants.set-layout');

    // Tenant Admin Permissions (set/view/update by superadmin)
    Route::get('tenants/{company}/permissions',  [TenantPermissionsController::class, 'edit'])->name('tenants.permissions.edit');
    Route::post('tenants/{company}/permissions', [TenantPermissionsController::class, 'update'])->name('tenants.permissions.update');

    // Contact Requests
    Route::get('contact-requests',                           [ContactRequestController::class, 'index'])->name('contact-requests.index');
    Route::post('contact-requests/{contactRequest}/approve', [ContactRequestController::class, 'approve'])->name('contact-requests.approve');
    Route::post('contact-requests/{contactRequest}/reject',  [ContactRequestController::class, 'reject'])->name('contact-requests.reject');

    // Email Logs
    Route::get('email-logs', [EmailLogController::class, 'index'])->name('email-logs.index');

    // Plan Management
    Route::resource('plans', PlanController::class)->except(['create', 'edit', 'show']);

    // Affiliate Management
    Route::resource('affiliates', AffiliateController::class)->except(['create', 'edit']);
    Route::post('affiliates/{affiliate}/mark-paid',       [AffiliateController::class, 'markPaid'])->name('affiliates.mark-paid');
    Route::post('affiliates/{affiliate}/regenerate-code', [AffiliateController::class, 'regenerateCode'])->name('affiliates.regenerate-code');

    // User Management
    Route::get('users',           [SuperAdminUserController::class, 'index'])->name('users.index');
    Route::delete('users/{user}', [SuperAdminUserController::class, 'destroy'])->name('users.destroy');
    Route::get('super-admins',    [SuperAdminUserController::class, 'superAdmins'])->name('super-admins');
    Route::post('super-admins',   [SuperAdminUserController::class, 'createSuperAdmin'])->name('super-admins.store');
});

// ─── Authenticated Tenant Routes ─────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'tenant.active'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Accounting
    Route::prefix('accounting')->name('accounting.')->middleware('perm:accounting.view')->group(function () {
        Route::resource('account-groups', AccountGroupController::class);
        Route::resource('accounts', AccountController::class);
        Route::resource('journal-entries', JournalEntryController::class);
        Route::post('journal-entries/{journalEntry}/post', [JournalEntryController::class, 'post'])->name('journal-entries.post')->middleware('perm:accounting.create');
        Route::resource('cost-centers', CostCenterController::class);
        Route::resource('budgets', BudgetController::class);

        // Payment Methods
        Route::resource('payment-methods', PaymentMethodController::class);

        // Opening Balance
        Route::get('opening-balance',  [OpeningBalanceController::class, 'index'])->name('opening-balance.index');
        Route::post('opening-balance', [OpeningBalanceController::class, 'upsert'])->name('opening-balance.upsert');

        // Vouchers
        Route::prefix('vouchers')->name('vouchers.')->group(function () {
            Route::get('debit',           [VoucherController::class, 'debitIndex'])->name('debit');
            Route::get('credit',          [VoucherController::class, 'creditIndex'])->name('credit');
            Route::get('contra',          [VoucherController::class, 'contraIndex'])->name('contra');
            Route::get('service',         [VoucherController::class, 'serviceIndex'])->name('service');
            Route::get('cash-adjustment', [VoucherController::class, 'adjustIndex'])->name('adjustment');
            Route::get('approval',        [VoucherController::class, 'approvalIndex'])->name('approval');
            Route::get('create',          [VoucherController::class, 'create'])->name('create');
            Route::post('/',              [VoucherController::class, 'store'])->name('store');
            Route::get('{voucher}',       [VoucherController::class, 'show'])->name('show');
            Route::get('{voucher}/edit',  [VoucherController::class, 'edit'])->name('edit');
            Route::put('{voucher}',       [VoucherController::class, 'update'])->name('update');
            Route::delete('{voucher}',    [VoucherController::class, 'destroy'])->name('destroy');
            Route::post('{voucher}/approve', [VoucherController::class, 'approve'])->name('approve');
            Route::post('{voucher}/reject',  [VoucherController::class, 'reject'])->name('reject');
        });
    });

    // Sales
    Route::prefix('sales')->name('sales.')->middleware('perm:sales.view')->group(function () {
        Route::resource('customers', CustomerController::class);
        Route::resource('invoices', InvoiceController::class);
        Route::post('invoices/{invoice}/send', [InvoiceController::class, 'send'])->name('invoices.send')->middleware('perm:sales.edit');
        Route::post('invoices/{invoice}/cancel', [InvoiceController::class, 'cancel'])->name('invoices.cancel')->middleware('perm:sales.edit');
        Route::resource('credit-notes', CreditNoteController::class);
        Route::resource('quotations', QuotationController::class);
        Route::post('quotations/{quotation}/convert', [QuotationController::class, 'convertToInvoice'])->name('quotations.convert')->middleware('perm:sales.create');
        Route::resource('delivery-notes', DeliveryNoteController::class)->only(['index','create','store','show','update','destroy']);
        Route::resource('direct-sales', DirectSaleController::class)->only(['index','create','store','show','destroy']);
    });

    // Purchase
    Route::prefix('purchase')->name('purchase.')->middleware('perm:purchase.view')->group(function () {
        Route::resource('vendors', VendorController::class);
        Route::resource('purchase-orders', PurchaseOrderController::class);
        Route::resource('debit-notes', DebitNoteController::class);
        Route::resource('goods-receipts', GoodsReceiptController::class)->only(['index','create','store','show','destroy']);
        Route::resource('direct-purchases', DirectPurchaseController::class)->only(['index','create','store','show','destroy']);
    });

    // Finance
    Route::prefix('finance')->name('finance.')->middleware('perm:finance.view')->group(function () {
        Route::resource('payments', PaymentController::class);
        Route::resource('bank-accounts', BankAccountController::class);
        Route::resource('expenses', ExpenseController::class)->except(['show']);
        Route::get('expense-categories', [ExpenseController::class, 'categories'])->name('expense-categories.index');
        Route::post('expense-categories', [ExpenseController::class, 'storeCategory'])->name('expense-categories.store');
        Route::put('expense-categories/{expenseCategory}', [ExpenseController::class, 'updateCategory'])->name('expense-categories.update');
        Route::delete('expense-categories/{expenseCategory}', [ExpenseController::class, 'destroyCategory'])->name('expense-categories.destroy');
        Route::get('bank-reconciliation', [BankReconciliationController::class, 'index'])->name('bank-reconciliation');
        Route::post('bank-reconciliation/reconcile', [BankReconciliationController::class, 'reconcile'])->name('bank-reconciliation.reconcile');
        Route::post('bank-reconciliation/{bankTransaction}/unreconcile', [BankReconciliationController::class, 'unreoncile'])->name('bank-reconciliation.unreconcile');
    });

    // POS
    Route::middleware('perm:pos.view')->group(function () {
        Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
        Route::post('/pos/sale', [PosController::class, 'sale'])->middleware('perm:pos.create')->name('pos.sale');
    });

    // Inventory
    Route::prefix('inventory')->name('inventory.')->middleware('perm:inventory.view')->group(function () {
        Route::resource('products', ProductController::class);
        Route::resource('warehouses', WarehouseController::class);
        Route::resource('categories', ProductCategoryController::class);
        Route::resource('stock-movements', StockMovementController::class)->only(['index', 'create', 'store']);
    });

    // HR & Payroll
    Route::prefix('hr')->name('hr.')->middleware('perm:hr.view')->group(function () {
        Route::resource('employees', EmployeeController::class);
        Route::resource('payroll', PayrollController::class);
        Route::resource('leaves', LeaveController::class);
        Route::resource('leave-types', LeaveTypeController::class)->only(['index','store','update','destroy']);
        Route::resource('departments', DepartmentController::class)->only(['index','store','update','destroy']);
        Route::resource('designations', DesignationController::class)->only(['index','store','update','destroy']);
        Route::resource('salary-components', SalaryComponentController::class)->only(['index','store','update','destroy']);
    });

    // Fixed Assets
    Route::prefix('assets')->name('assets.')->middleware('perm:assets.view')->group(function () {
        Route::resource('fixed-assets', FixedAssetController::class);
        Route::resource('asset-categories', AssetCategoryController::class)->only(['index','store','update','destroy']);
    });

    // Reports
    Route::prefix('reports')->name('reports.')->middleware('perm:reports.view')->group(function () {
        Route::get('trial-balance',      [ReportController::class, 'trialBalance'])->name('trial-balance');
        Route::get('profit-loss',        [ReportController::class, 'profitLoss'])->name('profit-loss');
        Route::get('balance-sheet',      [ReportController::class, 'balanceSheet'])->name('balance-sheet');
        Route::get('cash-flow',          [ReportController::class, 'cashFlow'])->name('cash-flow');
        Route::get('aged-receivables',   [ReportController::class, 'agedReceivables'])->name('aged-receivables');
        Route::get('aged-payables',      [ReportController::class, 'agedPayables'])->name('aged-payables');
        Route::get('vat-return',         [ReportController::class, 'vatReturn'])->name('vat-return');
        Route::get('stock',              [ReportController::class, 'stock'])->name('stock');
        Route::get('payroll-summary',    [ReportController::class, 'payrollSummary'])->name('payroll-summary');
        Route::get('day-book',           [ReportController::class, 'dayBook'])->name('day-book');
        Route::get('ledger',             [ReportController::class, 'ledger'])->name('ledger');
        Route::get('sales-register',     [ReportController::class, 'salesRegister'])->name('sales-register');
        Route::get('purchase-register',  [ReportController::class, 'purchaseRegister'])->name('purchase-register');
        Route::get('cash-book',          [ReportController::class, 'cashBook'])->name('cash-book');
        Route::get('expense-report',     [ReportController::class, 'expenseReport'])->name('expense-report');
        Route::get('customer-statement', [ReportController::class, 'customerStatement'])->name('customer-statement');
        Route::get('vendor-statement',   [ReportController::class, 'vendorStatement'])->name('vendor-statement');
    });

    // Settings
    Route::prefix('settings')->name('settings.')->middleware('perm:settings.view')->group(function () {
        Route::get('company',    [CompanyController::class, 'edit'])->name('company');
        Route::patch('company',  [CompanyController::class, 'update'])->name('company.update')->middleware('perm:settings.edit');
        Route::resource('tax-rates',    TaxRateController::class);
        Route::resource('currencies',   CurrencyController::class);
        Route::resource('fiscal-years', FiscalYearController::class);
        Route::resource('units',        UnitController::class)->only(['index','store','update','destroy']);
        Route::resource('users',        UserController::class)->middleware('perm:users.view');
        Route::resource('roles',        RoleController::class)->middleware('perm:users.view');
        Route::get('audit-logs',           [AuditLogController::class, 'index'])->name('audit-logs.index');
        Route::get('audit-logs/{auditLog}', [AuditLogController::class, 'show'])->name('audit-logs.show');
        Route::get('login-history',        [LoginHistoryController::class, 'index'])->name('login-history.index');
    });

    // Knowledge Base / FAQ
    Route::prefix('faq')->name('faq.')->group(function () {
        Route::get('/',                          [FaqController::class, 'index'])->name('index');
        Route::get('/article/{faq}',             [FaqController::class, 'show'])->name('show');
        Route::post('/article/{faq}/helpful',    [FaqController::class, 'helpful'])->name('helpful');

        Route::prefix('admin')->name('admin.')->middleware('perm:settings.edit')->group(function () {
            Route::get('/',            [FaqController::class, 'adminIndex'])->name('index');
            Route::get('/create',      [FaqController::class, 'create'])->name('create');
            Route::post('/',           [FaqController::class, 'store'])->name('store');
            Route::get('/{faq}/edit',  [FaqController::class, 'edit'])->name('edit');
            Route::put('/{faq}',       [FaqController::class, 'update'])->name('update');
            Route::delete('/{faq}',    [FaqController::class, 'destroy'])->name('destroy');
        });

        Route::middleware('perm:settings.edit')->group(function () {
            Route::get('/categories',                  [FaqController::class, 'categoriesIndex'])->name('categories.index');
            Route::post('/categories',                 [FaqController::class, 'storeCategory'])->name('categories.store');
            Route::put('/categories/{faqCategory}',    [FaqController::class, 'updateCategory'])->name('categories.update');
            Route::delete('/categories/{faqCategory}', [FaqController::class, 'destroyCategory'])->name('categories.destroy');
        });
    });

    // ── CRM ──────────────────────────────────────────────────────────────────
    Route::prefix('crm')->name('crm.')->middleware('perm:crm.view')->group(function () {
        // Leads
        Route::resource('leads', LeadController::class);
        Route::post('leads/{lead}/activities', [LeadController::class, 'storeActivity'])->name('leads.activities.store');
        Route::post('leads/{lead}/convert',    [LeadController::class, 'convertToCustomer'])->name('leads.convert')->middleware('perm:crm.edit');

        // Customer Segments
        Route::get('segments',                                            [CustomerSegmentController::class, 'index'])->name('segments.index');
        Route::post('segments',                                           [CustomerSegmentController::class, 'store'])->name('segments.store')->middleware('perm:crm.create');
        Route::get('segments/{customerSegment}',                          [CustomerSegmentController::class, 'show'])->name('segments.show');
        Route::put('segments/{customerSegment}',                          [CustomerSegmentController::class, 'update'])->name('segments.update')->middleware('perm:crm.edit');
        Route::delete('segments/{customerSegment}',                       [CustomerSegmentController::class, 'destroy'])->name('segments.destroy')->middleware('perm:crm.delete');
        Route::post('segments/{customerSegment}/members',                 [CustomerSegmentController::class, 'addMember'])->name('segments.members.add')->middleware('perm:crm.edit');
        Route::delete('segments/{customerSegment}/members/{customer}',    [CustomerSegmentController::class, 'removeMember'])->name('segments.members.remove')->middleware('perm:crm.edit');
    });

    // ── Tasks ─────────────────────────────────────────────────────────────────
    Route::prefix('tasks')->name('tasks.')->middleware('perm:tasks.view')->group(function () {
        Route::get('/',                           [TaskController::class, 'index'])->name('index');
        Route::post('/',                          [TaskController::class, 'store'])->name('store')->middleware('perm:tasks.create');
        Route::put('{task}',                      [TaskController::class, 'update'])->name('update')->middleware('perm:tasks.edit');
        Route::delete('{task}',                   [TaskController::class, 'destroy'])->name('destroy')->middleware('perm:tasks.delete');
        Route::post('{task}/comments',            [TaskController::class, 'addComment'])->name('comments.store');
        Route::post('{task}/complete',             [TaskController::class, 'markComplete'])->name('complete')->middleware('perm:tasks.edit');
    });

    // ── Pricing, Discounts, Loyalty, Commissions, Channels ───────────────────
    Route::prefix('sales')->name('sales.')->middleware('perm:sales.view')->group(function () {
        // Pricing Rules
        Route::resource('pricing-rules', PricingRuleController::class)->except(['show']);

        // Discount Rules
        Route::resource('discount-rules', DiscountRuleController::class)->except(['show']);
        Route::post('discount-rules/{discountRule}/approve', [DiscountRuleController::class, 'approve'])->name('discount-rules.approve')->middleware('perm:sales.edit');

        // Loyalty Programs
        Route::get('loyalty',                             [LoyaltyController::class, 'index'])->name('loyalty.index');
        Route::post('loyalty',                            [LoyaltyController::class, 'store'])->name('loyalty.store')->middleware('perm:sales.create');
        Route::put('loyalty/{loyaltyProgram}',            [LoyaltyController::class, 'update'])->name('loyalty.update')->middleware('perm:sales.edit');
        Route::delete('loyalty/{loyaltyProgram}',         [LoyaltyController::class, 'destroy'])->name('loyalty.destroy')->middleware('perm:sales.delete');
        Route::get('loyalty/customer/{customer}',         [LoyaltyController::class, 'customerPoints'])->name('loyalty.customer');
        Route::post('loyalty/customer/{customer}/adjust', [LoyaltyController::class, 'adjustPoints'])->name('loyalty.adjust')->middleware('perm:sales.edit');

        // Commissions
        Route::get('commissions',                                        [CommissionController::class, 'index'])->name('commissions.index');
        Route::post('commissions/structures',                            [CommissionController::class, 'storeStructure'])->name('commissions.structures.store')->middleware('perm:sales.create');
        Route::put('commissions/structures/{commissionStructure}',       [CommissionController::class, 'updateStructure'])->name('commissions.structures.update')->middleware('perm:sales.edit');
        Route::delete('commissions/structures/{commissionStructure}',    [CommissionController::class, 'destroyStructure'])->name('commissions.structures.destroy')->middleware('perm:sales.delete');
        Route::post('commissions/records/{commissionRecord}/approve',    [CommissionController::class, 'approveRecord'])->name('commissions.records.approve')->middleware('perm:sales.edit');
        Route::post('commissions/records/{commissionRecord}/paid',       [CommissionController::class, 'markPaid'])->name('commissions.records.paid')->middleware('perm:sales.edit');

        // Sales Channels
        Route::get('channels',                 [SalesChannelController::class, 'index'])->name('channels.index');
        Route::post('channels',                [SalesChannelController::class, 'store'])->name('channels.store')->middleware('perm:sales.create');
        Route::put('channels/{salesChannel}',  [SalesChannelController::class, 'update'])->name('channels.update')->middleware('perm:sales.edit');
        Route::delete('channels/{salesChannel}',[SalesChannelController::class, 'destroy'])->name('channels.destroy')->middleware('perm:sales.delete');
        Route::post('channels/{salesChannel}/sync', [SalesChannelController::class, 'sync'])->name('channels.sync')->middleware('perm:sales.edit');
    });

    // ── Support ───────────────────────────────────────────────────────────────
    Route::prefix('support')->name('support.')->middleware('perm:support.view')->group(function () {
        Route::get('tickets',                    [TicketController::class, 'index'])->name('tickets.index');
        Route::get('tickets/create',             [TicketController::class, 'create'])->name('tickets.create')->middleware('perm:support.create');
        Route::post('tickets',                   [TicketController::class, 'store'])->name('tickets.store')->middleware('perm:support.create');
        Route::get('tickets/{ticket}',           [TicketController::class, 'show'])->name('tickets.show');
        Route::put('tickets/{ticket}',           [TicketController::class, 'update'])->name('tickets.update')->middleware('perm:support.edit');
        Route::post('tickets/{ticket}/reply',    [TicketController::class, 'reply'])->name('tickets.reply')->middleware('perm:support.edit');
        Route::post('tickets/{ticket}/rate',     [TicketController::class, 'rate'])->name('tickets.rate');
        Route::delete('tickets/{ticket}',        [TicketController::class, 'destroy'])->name('tickets.destroy')->middleware('perm:support.delete');
    });

    // ── Analytics ─────────────────────────────────────────────────────────────
    Route::prefix('analytics')->name('analytics.')->middleware('perm:analytics.view')->group(function () {
        Route::get('sales',                      [SalesAnalyticsController::class, 'index'])->name('sales');
        Route::get('feedback',                   [SalesAnalyticsController::class, 'customerFeedback'])->name('feedback');
        Route::post('feedback',                  [SalesAnalyticsController::class, 'storeFeedback'])->name('feedback.store');
    });
});

require __DIR__.'/auth.php';

import {
    LayoutDashboard,
    BookOpen,
    ShoppingCart,
    Truck,
    Landmark,
    Package,
    Users,
    Factory,
    BarChart2,
    Settings,
    ShoppingBag,
    HelpCircle,
    Brain,
    Headphones,
    CheckSquare,
    UserCheck,
    Cpu,
} from "lucide-react";

/**
 * getNav(t) - returns the sidebar navigation array with all labels translated.
 * Pass the t function from useTranslation(). Falls back to English default.
 */
export function getNav(t) {
    return [
        {
            label: t("nav.dashboard", { default: "Dashboard" }),
            icon: LayoutDashboard,
            href: "dashboard",
            route: "dashboard",
        },
        {
            label: t("nav.pos", { default: "POS" }),
            icon: ShoppingBag,
            href: "pos.index",
            route: "pos.index",
            perm: "pos.view",
        },
        {
            label: t("nav.accounting", { default: "Accounting" }),
            icon: BookOpen,
            perm: "accounting.view",
            children: [
                {
                    label: t("nav.chart_of_accounts", {
                        default: "Chart of Accounts",
                    }),
                    href: "accounting.accounts.index",
                    route: "accounting.accounts.index",
                },
                {
                    label: t("nav.account_groups", {
                        default: "Account Groups",
                    }),
                    href: "accounting.account-groups.index",
                    route: "accounting.account-groups.index",
                },
                {
                    label: t("nav.journal_entries", {
                        default: "Journal Entries",
                    }),
                    href: "accounting.journal-entries.index",
                    route: "accounting.journal-entries.index",
                },
                {
                    label: t("nav.cost_centers", { default: "Cost Centers" }),
                    href: "accounting.cost-centers.index",
                    route: "accounting.cost-centers.index",
                },
                {
                    label: t("nav.budgets", { default: "Budgets" }),
                    href: "accounting.budgets.index",
                    route: "accounting.budgets.index",
                },
                {
                    label: t("nav.opening_balance", {
                        default: "Opening Balance",
                    }),
                    href: "accounting.opening-balance.index",
                    route: "accounting.opening-balance.index",
                },
                {
                    label: t("nav.debit_voucher", { default: "Debit Voucher" }),
                    href: "accounting.vouchers.debit",
                    route: "accounting.vouchers.debit",
                },
                {
                    label: t("nav.credit_voucher", {
                        default: "Credit Voucher",
                    }),
                    href: "accounting.vouchers.credit",
                    route: "accounting.vouchers.credit",
                },
                {
                    label: t("nav.contra_voucher", {
                        default: "Contra Voucher",
                    }),
                    href: "accounting.vouchers.contra",
                    route: "accounting.vouchers.contra",
                },
                {
                    label: t("nav.service_payment", {
                        default: "Service Payment",
                    }),
                    href: "accounting.vouchers.service",
                    route: "accounting.vouchers.service",
                },
                {
                    label: t("nav.cash_adjustment", {
                        default: "Cash Adjustment",
                    }),
                    href: "accounting.vouchers.adjustment",
                    route: "accounting.vouchers.adjustment",
                },
                {
                    label: t("nav.voucher_approval", {
                        default: "Voucher Approval",
                    }),
                    href: "accounting.vouchers.approval",
                    route: "accounting.vouchers.approval",
                },
                {
                    label: t("nav.payment_methods", {
                        default: "Payment Methods",
                    }),
                    href: "accounting.payment-methods.index",
                    route: "accounting.payment-methods.index",
                },
            ],
        },
        {
            label: t("nav.sales", { default: "Sales" }),
            icon: ShoppingCart,
            perm: "sales.view",
            children: [
                {
                    label: t("nav.customers", { default: "Customers" }),
                    href: "sales.customers.index",
                    route: "sales.customers.index",
                },
                {
                    label: t("nav.invoices", { default: "Invoices" }),
                    href: "sales.invoices.index",
                    route: "sales.invoices.index",
                },
                {
                    label: t("nav.direct_sales", { default: "Direct Sales" }),
                    href: "sales.direct-sales.index",
                    route: "sales.direct-sales.index",
                },
                {
                    label: t("nav.quotations", { default: "Quotations" }),
                    href: "sales.quotations.index",
                    route: "sales.quotations.index",
                },
                {
                    label: t("nav.credit_notes", { default: "Credit Notes" }),
                    href: "sales.credit-notes.index",
                    route: "sales.credit-notes.index",
                },
                {
                    label: t("nav.delivery_notes", {
                        default: "Delivery Notes",
                    }),
                    href: "sales.delivery-notes.index",
                    route: "sales.delivery-notes.index",
                },
                {
                    label: t("nav.pricing_rules", { default: "Pricing Rules" }),
                    href: "sales.pricing-rules.index",
                    route: "sales.pricing-rules.index",
                },
                {
                    label: t("nav.discounts", { default: "Discounts" }),
                    href: "sales.discount-rules.index",
                    route: "sales.discount-rules.index",
                },
                {
                    label: t("nav.loyalty_programs", {
                        default: "Loyalty Programs",
                    }),
                    href: "sales.loyalty.index",
                    route: "sales.loyalty.index",
                },
                {
                    label: t("nav.commissions", { default: "Commissions" }),
                    href: "sales.commissions.index",
                    route: "sales.commissions.index",
                },
                {
                    label: t("nav.sales_channels", {
                        default: "Sales Channels",
                    }),
                    href: "sales.channels.index",
                    route: "sales.channels.index",
                },
            ],
        },
        {
            label: t("nav.purchase", { default: "Purchase" }),
            icon: Truck,
            perm: "purchase.view",
            children: [
                {
                    label: t("nav.vendors", { default: "Vendors" }),
                    href: "purchase.vendors.index",
                    route: "purchase.vendors.index",
                },
                {
                    label: t("nav.purchase_orders", {
                        default: "Purchase Orders",
                    }),
                    href: "purchase.purchase-orders.index",
                    route: "purchase.purchase-orders.index",
                },
                {
                    label: t("nav.direct_purchases", {
                        default: "Direct Purchases",
                    }),
                    href: "purchase.direct-purchases.index",
                    route: "purchase.direct-purchases.index",
                },
                {
                    label: t("nav.debit_notes", { default: "Debit Notes" }),
                    href: "purchase.debit-notes.index",
                    route: "purchase.debit-notes.index",
                },
                {
                    label: t("nav.goods_receipts", {
                        default: "Goods Receipts (GRN)",
                    }),
                    href: "purchase.goods-receipts.index",
                    route: "purchase.goods-receipts.index",
                },
            ],
        },
        {
            label: t("nav.finance", { default: "Finance" }),
            icon: Landmark,
            perm: "finance.view",
            children: [
                {
                    label: t("nav.payments", { default: "Payments" }),
                    href: "finance.payments.index",
                    route: "finance.payments.index",
                },
                {
                    label: t("nav.bank_accounts", { default: "Bank Accounts" }),
                    href: "finance.bank-accounts.index",
                    route: "finance.bank-accounts.index",
                },
                {
                    label: t("nav.bank_reconciliation", {
                        default: "Bank Reconciliation",
                    }),
                    href: "finance.bank-reconciliation",
                    route: "finance.bank-reconciliation",
                },
                {
                    label: t("nav.expenses", { default: "Expenses" }),
                    href: "finance.expenses.index",
                    route: "finance.expenses.index",
                },
                {
                    label: t("nav.expense_categories", {
                        default: "Expense Categories",
                    }),
                    href: "finance.expense-categories.index",
                    route: "finance.expense-categories.index",
                },
            ],
        },
        {
            label: t("nav.inventory", { default: "Inventory" }),
            icon: Package,
            perm: "inventory.view",
            children: [
                {
                    label: t("nav.products", { default: "Products" }),
                    href: "inventory.products.index",
                    route: "inventory.products.index",
                },
                {
                    label: t("nav.stock_entry", { default: "Stock Entry" }),
                    href: "inventory.stock-movements.index",
                    route: "inventory.stock-movements.index",
                },
                {
                    label: t("nav.warehouses", { default: "Warehouses" }),
                    href: "inventory.warehouses.index",
                    route: "inventory.warehouses.index",
                },
                {
                    label: t("nav.categories", { default: "Categories" }),
                    href: "inventory.categories.index",
                    route: "inventory.categories.index",
                },
            ],
        },
        {
            label: t("nav.hr", { default: "HR & Payroll" }),
            icon: Users,
            perm: "hr.view",
            children: [
                {
                    label: t("nav.employees", { default: "Employees" }),
                    href: "hr.employees.index",
                    route: "hr.employees.index",
                },
                {
                    label: t("nav.payroll", { default: "Payroll" }),
                    href: "hr.payroll.index",
                    route: "hr.payroll.index",
                },
                {
                    label: t("nav.leave_requests", {
                        default: "Leave Requests",
                    }),
                    href: "hr.leaves.index",
                    route: "hr.leaves.index",
                },
                {
                    label: t("nav.departments", { default: "Departments" }),
                    href: "hr.departments.index",
                    route: "hr.departments.index",
                },
                {
                    label: t("nav.designations", { default: "Designations" }),
                    href: "hr.designations.index",
                    route: "hr.designations.index",
                },
                {
                    label: t("nav.leave_types", { default: "Leave Types" }),
                    href: "hr.leave-types.index",
                    route: "hr.leave-types.index",
                },
                {
                    label: t("nav.salary_components", {
                        default: "Salary Components",
                    }),
                    href: "hr.salary-components.index",
                    route: "hr.salary-components.index",
                },
            ],
        },
        {
            label: t("nav.assets", { default: "Fixed Assets" }),
            icon: Factory,
            perm: "assets.view",
            children: [
                {
                    label: t("nav.asset_list", { default: "Assets" }),
                    href: "assets.fixed-assets.index",
                    route: "assets.fixed-assets.index",
                },
                {
                    label: t("nav.asset_categories", {
                        default: "Asset Categories",
                    }),
                    href: "assets.asset-categories.index",
                    route: "assets.asset-categories.index",
                },
            ],
        },
        {
            label: t("nav.reports", { default: "Reports" }),
            icon: BarChart2,
            perm: "reports.view",
            children: [
                {
                    label: t("nav.trial_balance", { default: "Trial Balance" }),
                    href: "reports.trial-balance",
                    route: "reports.trial-balance",
                },
                {
                    label: t("nav.profit_loss", { default: "Profit & Loss" }),
                    href: "reports.profit-loss",
                    route: "reports.profit-loss",
                },
                {
                    label: t("nav.balance_sheet", { default: "Balance Sheet" }),
                    href: "reports.balance-sheet",
                    route: "reports.balance-sheet",
                },
                {
                    label: t("nav.vat_return", { default: "VAT Return" }),
                    href: "reports.vat-return",
                    route: "reports.vat-return",
                },
                {
                    label: t("nav.aged_receivables", {
                        default: "Aged Receivables",
                    }),
                    href: "reports.aged-receivables",
                    route: "reports.aged-receivables",
                },
                {
                    label: t("nav.aged_payables", { default: "Aged Payables" }),
                    href: "reports.aged-payables",
                    route: "reports.aged-payables",
                },
                {
                    label: t("nav.stock_report", { default: "Stock Report" }),
                    href: "reports.stock",
                    route: "reports.stock",
                },
                {
                    label: t("nav.day_book", { default: "Day Book" }),
                    href: "reports.day-book",
                    route: "reports.day-book",
                },
                {
                    label: t("nav.ledger", { default: "Ledger" }),
                    href: "reports.ledger",
                    route: "reports.ledger",
                },
                {
                    label: t("nav.sales_register", {
                        default: "Sales Register",
                    }),
                    href: "reports.sales-register",
                    route: "reports.sales-register",
                },
                {
                    label: t("nav.purchase_register", {
                        default: "Purchase Register",
                    }),
                    href: "reports.purchase-register",
                    route: "reports.purchase-register",
                },
                {
                    label: t("nav.cash_book", { default: "Cash Book" }),
                    href: "reports.cash-book",
                    route: "reports.cash-book",
                },
                {
                    label: t("nav.cash_flow", { default: "Cash Flow" }),
                    href: "reports.cash-flow",
                    route: "reports.cash-flow",
                },
                {
                    label: t("nav.payroll_summary", {
                        default: "Payroll Summary",
                    }),
                    href: "reports.payroll-summary",
                    route: "reports.payroll-summary",
                },
                {
                    label: t("nav.expense_report", {
                        default: "Expense Report",
                    }),
                    href: "reports.expense-report",
                    route: "reports.expense-report",
                },
                {
                    label: t("nav.customer_statement", {
                        default: "Customer Statement",
                    }),
                    href: "reports.customer-statement",
                    route: "reports.customer-statement",
                },
                {
                    label: t("nav.vendor_statement", {
                        default: "Vendor Statement",
                    }),
                    href: "reports.vendor-statement",
                    route: "reports.vendor-statement",
                },
            ],
        },
        {
            label: t("nav.settings", { default: "Settings" }),
            icon: Settings,
            perm: "settings.view",
            children: [
                {
                    label: t("nav.company", { default: "Company" }),
                    href: "settings.company",
                    route: "settings.company",
                },
                {
                    label: t("nav.tax_rates", { default: "Tax Rates" }),
                    href: "settings.tax-rates.index",
                    route: "settings.tax-rates.index",
                },
                {
                    label: t("nav.currencies", { default: "Currencies" }),
                    href: "settings.currencies.index",
                    route: "settings.currencies.index",
                },
                {
                    label: t("nav.fiscal_years", { default: "Fiscal Years" }),
                    href: "settings.fiscal-years.index",
                    route: "settings.fiscal-years.index",
                },
                {
                    label: t("nav.users", { default: "Users" }),
                    href: "settings.users.index",
                    route: "settings.users.index",
                    adminOrSuperAdmin: true,
                },
                {
                    label: t("nav.roles_permissions", {
                        default: "Roles & Permissions",
                    }),
                    href: "settings.roles.index",
                    route: "settings.roles.index",
                    adminOrSuperAdmin: true,
                },
                {
                    label: t("nav.audit_logs", { default: "Audit Logs" }),
                    href: "settings.audit-logs.index",
                    route: "settings.audit-logs.index",
                    superAdminOnly: true,
                },
                {
                    label: t("nav.login_history", { default: "Login History" }),
                    href: "settings.login-history.index",
                    route: "settings.login-history.index",
                    superAdminOnly: true,
                },
                {
                    label: t("nav.units", { default: "Units" }),
                    href: "settings.units.index",
                    route: "settings.units.index",
                },
                {
                    label: t("nav.languages", { default: "Languages" }),
                    href: "settings.languages.index",
                    route: "settings.languages.index",
                },
            ],
        },
        {
            label: t("nav.knowledge_base", { default: "Knowledge Base" }),
            icon: HelpCircle,
            children: [
                {
                    label: t("nav.browse_articles", {
                        default: "Browse Articles",
                    }),
                    href: "faq.index",
                    route: "faq.index",
                },
                {
                    label: t("nav.manage_articles", {
                        default: "Manage Articles",
                    }),
                    href: "faq.admin.index",
                    route: "faq.admin.index",
                    perm: "settings.edit",
                },
                {
                    label: t("nav.faq_categories", { default: "Categories" }),
                    href: "faq.categories.index",
                    route: "faq.categories.index",
                    perm: "settings.edit",
                },
            ],
        },
        {
            label: t("nav.crm", { default: "CRM" }),
            icon: UserCheck,
            perm: "crm.view",
            children: [
                {
                    label: t("nav.leads", { default: "Leads" }),
                    href: "crm.leads.index",
                    route: "crm.leads.index",
                },
                {
                    label: t("nav.customer_segments", {
                        default: "Customer Segments",
                    }),
                    href: "crm.segments.index",
                    route: "crm.segments.index",
                },
            ],
        },
        {
            label: t("nav.tasks", { default: "Tasks" }),
            icon: CheckSquare,
            href: "tasks.index",
            route: "tasks.index",
            perm: "tasks.view",
        },
        {
            label: t("nav.support", { default: "Support" }),
            icon: Headphones,
            perm: "support.view",
            children: [
                {
                    label: t("nav.tickets", { default: "Tickets" }),
                    href: "support.tickets.index",
                    route: "support.tickets.index",
                },
            ],
        },
        {
            label: t("nav.analytics", { default: "Analytics" }),
            icon: Brain,
            perm: "analytics.view",
            children: [
                {
                    label: t("nav.sales_dashboard", {
                        default: "Sales Dashboard",
                    }),
                    href: "analytics.sales",
                    route: "analytics.sales",
                },
                {
                    label: t("nav.customer_feedback", {
                        default: "Customer Feedback",
                    }),
                    href: "analytics.feedback",
                    route: "analytics.feedback",
                },
            ],
        },
        {
            label: t("nav.ie", { default: "Industrial Engineering" }),
            icon: Cpu,
            perm: "ie.view",
            children: [
                {
                    label: t("nav.process_optimization", {
                        default: "Process Optimization",
                    }),
                    href: "ie.process-optimization",
                    route: "ie.process-optimization",
                },
                {
                    label: t("nav.workload_balancing", {
                        default: "Workload Balancing",
                    }),
                    href: "ie.workload-balancing",
                    route: "ie.workload-balancing",
                },
                {
                    label: t("nav.kpi_analytics", {
                        default: "KPI & Performance Analytics",
                    }),
                    href: "ie.kpi-analytics",
                    route: "ie.kpi-analytics",
                },
                {
                    label: t("nav.demand_forecasting", {
                        default: "Demand Forecasting",
                    }),
                    href: "ie.demand-forecasting",
                    route: "ie.demand-forecasting",
                },
                {
                    label: t("nav.order_fulfillment", {
                        default: "Order Fulfillment",
                    }),
                    href: "ie.order-fulfillment",
                    route: "ie.order-fulfillment",
                },
                {
                    label: t("nav.standardization", {
                        default: "Standardization & Automation",
                    }),
                    href: "ie.standardization",
                    route: "ie.standardization",
                },
                {
                    label: t("nav.waste_dashboard", {
                        default: "Waste Dashboard (Lean)",
                    }),
                    href: "ie.waste-dashboard",
                    route: "ie.waste-dashboard",
                },
                {
                    label: t("nav.cost_to_serve", {
                        default: "Cost-to-Serve Analysis",
                    }),
                    href: "ie.cost-to-serve",
                    route: "ie.cost-to-serve",
                },
                {
                    label: t("nav.simulation", {
                        default: "Simulation & What-If",
                    }),
                    href: "ie.simulation",
                    route: "ie.simulation",
                },
                {
                    label: t("nav.continuous_improvement", {
                        default: "Continuous Improvement",
                    }),
                    href: "ie.continuous-improvement",
                    route: "ie.continuous-improvement",
                },
            ],
        },
    ];
}

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

export const nav = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "dashboard",
        route: "dashboard",
    },
    {
        label: "POS",
        icon: ShoppingBag,
        href: "pos.index",
        route: "pos.index",
        perm: "pos.view",
    },
    {
        label: "Accounting",
        icon: BookOpen,
        perm: "accounting.view",
        children: [
            {
                label: "Chart of Accounts",
                href: "accounting.accounts.index",
                route: "accounting.accounts.index",
            },
            {
                label: "Account Groups",
                href: "accounting.account-groups.index",
                route: "accounting.account-groups.index",
            },
            {
                label: "Journal Entries",
                href: "accounting.journal-entries.index",
                route: "accounting.journal-entries.index",
            },
            {
                label: "Cost Centers",
                href: "accounting.cost-centers.index",
                route: "accounting.cost-centers.index",
            },
            {
                label: "Budgets",
                href: "accounting.budgets.index",
                route: "accounting.budgets.index",
            },
            {
                label: "Opening Balance",
                href: "accounting.opening-balance.index",
                route: "accounting.opening-balance.index",
            },
            {
                label: "Debit Voucher",
                href: "accounting.vouchers.debit",
                route: "accounting.vouchers.debit",
            },
            {
                label: "Credit Voucher",
                href: "accounting.vouchers.credit",
                route: "accounting.vouchers.credit",
            },
            {
                label: "Contra Voucher",
                href: "accounting.vouchers.contra",
                route: "accounting.vouchers.contra",
            },
            {
                label: "Service Payment",
                href: "accounting.vouchers.service",
                route: "accounting.vouchers.service",
            },
            {
                label: "Cash Adjustment",
                href: "accounting.vouchers.adjustment",
                route: "accounting.vouchers.adjustment",
            },
            {
                label: "Voucher Approval",
                href: "accounting.vouchers.approval",
                route: "accounting.vouchers.approval",
            },
            {
                label: "Payment Methods",
                href: "accounting.payment-methods.index",
                route: "accounting.payment-methods.index",
            },
        ],
    },
    {
        label: "Sales",
        icon: ShoppingCart,
        perm: "sales.view",
        children: [
            {
                label: "Customers",
                href: "sales.customers.index",
                route: "sales.customers.index",
            },
            {
                label: "Invoices",
                href: "sales.invoices.index",
                route: "sales.invoices.index",
            },
            {
                label: "Direct Sales",
                href: "sales.direct-sales.index",
                route: "sales.direct-sales.index",
            },
            {
                label: "Quotations",
                href: "sales.quotations.index",
                route: "sales.quotations.index",
            },
            {
                label: "Credit Notes",
                href: "sales.credit-notes.index",
                route: "sales.credit-notes.index",
            },
            {
                label: "Delivery Notes",
                href: "sales.delivery-notes.index",
                route: "sales.delivery-notes.index",
            },
            {
                label: "Pricing Rules",
                href: "sales.pricing-rules.index",
                route: "sales.pricing-rules.index",
            },
            {
                label: "Discounts",
                href: "sales.discount-rules.index",
                route: "sales.discount-rules.index",
            },
            {
                label: "Loyalty Programs",
                href: "sales.loyalty.index",
                route: "sales.loyalty.index",
            },
            {
                label: "Commissions",
                href: "sales.commissions.index",
                route: "sales.commissions.index",
            },
            {
                label: "Sales Channels",
                href: "sales.channels.index",
                route: "sales.channels.index",
            },
        ],
    },
    {
        label: "Purchase",
        icon: Truck,
        perm: "purchase.view",
        children: [
            {
                label: "Vendors",
                href: "purchase.vendors.index",
                route: "purchase.vendors.index",
            },
            {
                label: "Purchase Orders",
                href: "purchase.purchase-orders.index",
                route: "purchase.purchase-orders.index",
            },
            {
                label: "Direct Purchases",
                href: "purchase.direct-purchases.index",
                route: "purchase.direct-purchases.index",
            },
            {
                label: "Debit Notes",
                href: "purchase.debit-notes.index",
                route: "purchase.debit-notes.index",
            },
            {
                label: "Goods Receipts (GRN)",
                href: "purchase.goods-receipts.index",
                route: "purchase.goods-receipts.index",
            },
        ],
    },
    {
        label: "Finance",
        icon: Landmark,
        perm: "finance.view",
        children: [
            {
                label: "Payments",
                href: "finance.payments.index",
                route: "finance.payments.index",
            },
            {
                label: "Bank Accounts",
                href: "finance.bank-accounts.index",
                route: "finance.bank-accounts.index",
            },
            {
                label: "Bank Reconciliation",
                href: "finance.bank-reconciliation",
                route: "finance.bank-reconciliation",
            },
            {
                label: "Expenses",
                href: "finance.expenses.index",
                route: "finance.expenses.index",
            },
            {
                label: "Expense Categories",
                href: "finance.expense-categories.index",
                route: "finance.expense-categories.index",
            },
        ],
    },
    {
        label: "Inventory",
        icon: Package,
        perm: "inventory.view",
        children: [
            {
                label: "Products",
                href: "inventory.products.index",
                route: "inventory.products.index",
            },
            {
                label: "Stock Entry",
                href: "inventory.stock-movements.index",
                route: "inventory.stock-movements.index",
            },
            {
                label: "Warehouses",
                href: "inventory.warehouses.index",
                route: "inventory.warehouses.index",
            },
            {
                label: "Categories",
                href: "inventory.categories.index",
                route: "inventory.categories.index",
            },
        ],
    },
    {
        label: "HR & Payroll",
        icon: Users,
        perm: "hr.view",
        children: [
            {
                label: "Employees",
                href: "hr.employees.index",
                route: "hr.employees.index",
            },
            {
                label: "Payroll",
                href: "hr.payroll.index",
                route: "hr.payroll.index",
            },
            {
                label: "Leave Requests",
                href: "hr.leaves.index",
                route: "hr.leaves.index",
            },
            {
                label: "Departments",
                href: "hr.departments.index",
                route: "hr.departments.index",
            },
            {
                label: "Designations",
                href: "hr.designations.index",
                route: "hr.designations.index",
            },
            {
                label: "Leave Types",
                href: "hr.leave-types.index",
                route: "hr.leave-types.index",
            },
            {
                label: "Salary Components",
                href: "hr.salary-components.index",
                route: "hr.salary-components.index",
            },
        ],
    },
    {
        label: "Fixed Assets",
        icon: Factory,
        perm: "assets.view",
        children: [
            {
                label: "Assets",
                href: "assets.fixed-assets.index",
                route: "assets.fixed-assets.index",
            },
            {
                label: "Asset Categories",
                href: "assets.asset-categories.index",
                route: "assets.asset-categories.index",
            },
        ],
    },
    {
        label: "Reports",
        icon: BarChart2,
        perm: "reports.view",
        children: [
            {
                label: "Trial Balance",
                href: "reports.trial-balance",
                route: "reports.trial-balance",
            },
            {
                label: "Profit & Loss",
                href: "reports.profit-loss",
                route: "reports.profit-loss",
            },
            {
                label: "Balance Sheet",
                href: "reports.balance-sheet",
                route: "reports.balance-sheet",
            },
            {
                label: "VAT Return",
                href: "reports.vat-return",
                route: "reports.vat-return",
            },
            {
                label: "Aged Receivables",
                href: "reports.aged-receivables",
                route: "reports.aged-receivables",
            },
            {
                label: "Aged Payables",
                href: "reports.aged-payables",
                route: "reports.aged-payables",
            },
            {
                label: "Stock Report",
                href: "reports.stock",
                route: "reports.stock",
            },
            {
                label: "Day Book",
                href: "reports.day-book",
                route: "reports.day-book",
            },
            {
                label: "Ledger",
                href: "reports.ledger",
                route: "reports.ledger",
            },
            {
                label: "Sales Register",
                href: "reports.sales-register",
                route: "reports.sales-register",
            },
            {
                label: "Purchase Register",
                href: "reports.purchase-register",
                route: "reports.purchase-register",
            },
            {
                label: "Cash Book",
                href: "reports.cash-book",
                route: "reports.cash-book",
            },
            {
                label: "Cash Flow",
                href: "reports.cash-flow",
                route: "reports.cash-flow",
            },
            {
                label: "Payroll Summary",
                href: "reports.payroll-summary",
                route: "reports.payroll-summary",
            },
            {
                label: "Expense Report",
                href: "reports.expense-report",
                route: "reports.expense-report",
            },
            {
                label: "Customer Statement",
                href: "reports.customer-statement",
                route: "reports.customer-statement",
            },
            {
                label: "Vendor Statement",
                href: "reports.vendor-statement",
                route: "reports.vendor-statement",
            },
        ],
    },
    {
        label: "Settings",
        icon: Settings,
        perm: "settings.view",
        children: [
            {
                label: "Company",
                href: "settings.company",
                route: "settings.company",
            },
            {
                label: "Tax Rates",
                href: "settings.tax-rates.index",
                route: "settings.tax-rates.index",
            },
            {
                label: "Currencies",
                href: "settings.currencies.index",
                route: "settings.currencies.index",
            },
            {
                label: "Fiscal Years",
                href: "settings.fiscal-years.index",
                route: "settings.fiscal-years.index",
            },
            {
                label: "Users",
                href: "settings.users.index",
                route: "settings.users.index",
                adminOrSuperAdmin: true,
            },
            {
                label: "Roles & Permissions",
                href: "settings.roles.index",
                route: "settings.roles.index",
                adminOrSuperAdmin: true,
            },
            {
                label: "Audit Logs",
                href: "settings.audit-logs.index",
                route: "settings.audit-logs.index",
                superAdminOnly: true,
            },
            {
                label: "Login History",
                href: "settings.login-history.index",
                route: "settings.login-history.index",
                superAdminOnly: true,
            },
            {
                label: "Units",
                href: "settings.units.index",
                route: "settings.units.index",
            },
        ],
    },
    {
        label: "Knowledge Base",
        icon: HelpCircle,
        children: [
            { label: "Browse Articles", href: "faq.index", route: "faq.index" },
            {
                label: "Manage Articles",
                href: "faq.admin.index",
                route: "faq.admin.index",
                perm: "settings.edit",
            },
            {
                label: "Categories",
                href: "faq.categories.index",
                route: "faq.categories.index",
                perm: "settings.edit",
            },
        ],
    },
    {
        label: "CRM",
        icon: UserCheck,
        perm: "crm.view",
        children: [
            {
                label: "Leads",
                href: "crm.leads.index",
                route: "crm.leads.index",
            },
            {
                label: "Customer Segments",
                href: "crm.segments.index",
                route: "crm.segments.index",
            },
        ],
    },
    {
        label: "Tasks",
        icon: CheckSquare,
        href: "tasks.index",
        route: "tasks.index",
        perm: "tasks.view",
    },
    {
        label: "Support",
        icon: Headphones,
        perm: "support.view",
        children: [
            {
                label: "Tickets",
                href: "support.tickets.index",
                route: "support.tickets.index",
            },
        ],
    },
    {
        label: "Analytics",
        icon: Brain,
        perm: "analytics.view",
        children: [
            {
                label: "Sales Dashboard",
                href: "analytics.sales",
                route: "analytics.sales",
            },
            {
                label: "Customer Feedback",
                href: "analytics.feedback",
                route: "analytics.feedback",
            },
        ],
    },
    {
        label: "Industrial Engineering",
        icon: Cpu,
        perm: "ie.view",
        children: [
            {
                label: "Process Optimization",
                href: "ie.process-optimization",
                route: "ie.process-optimization",
            },
            {
                label: "Workload Balancing",
                href: "ie.workload-balancing",
                route: "ie.workload-balancing",
            },
            {
                label: "KPI & Performance Analytics",
                href: "ie.kpi-analytics",
                route: "ie.kpi-analytics",
            },
            {
                label: "Demand Forecasting",
                href: "ie.demand-forecasting",
                route: "ie.demand-forecasting",
            },
            {
                label: "Order Fulfillment",
                href: "ie.order-fulfillment",
                route: "ie.order-fulfillment",
            },
            {
                label: "Standardization & Automation",
                href: "ie.standardization",
                route: "ie.standardization",
            },
            {
                label: "Waste Dashboard (Lean)",
                href: "ie.waste-dashboard",
                route: "ie.waste-dashboard",
            },
            {
                label: "Cost-to-Serve Analysis",
                href: "ie.cost-to-serve",
                route: "ie.cost-to-serve",
            },
            {
                label: "Simulation & What-If",
                href: "ie.simulation",
                route: "ie.simulation",
            },
            {
                label: "Continuous Improvement",
                href: "ie.continuous-improvement",
                route: "ie.continuous-improvement",
            },
        ],
    },
];

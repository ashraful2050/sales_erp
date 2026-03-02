import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import SubscriptionBanner from "@/Components/SubscriptionBanner";
import AppLayoutLight from "./AppLayoutLight";
import AppLayoutTally from "./AppLayoutTally";
import {
    LayoutDashboard,
    BookOpen,
    ShoppingCart,
    Truck,
    Landmark,
    Package,
    Users,
    Briefcase,
    BarChart2,
    Settings,
    ChevronDown,
    ChevronRight,
    LogOut,
    User,
    Bell,
    Menu,
    X,
    Building2,
    Factory,
    CreditCard,
    FileText,
    Boxes,
    UserSquare,
    ClipboardList,
    PieChart,
    Home,
    ShoppingBag,
    Shield,
    HelpCircle,
    Brain,
    Headphones,
    CheckSquare,
    Globe,
    Percent,
    Gift,
    TrendingUp,
    UserCheck,
    Tag,
    Award,
    DollarSign,
    Cpu,
} from "lucide-react";

const nav = [
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
        href: "faq.index",
        route: "faq.index",
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

function NavItem({ item, collapsed }) {
    const { url, props } = usePage();
    const permissions = props.permissions ?? {};

    // Permission gate — hide section if user lacks the required permission.
    // (SuperAdmin has all permissions set to true via allPermissions())
    if (item.perm && !permissions[item.perm]) return null;

    const isActive = (r) => {
        try {
            // Strip trailing Laravel resource action words so that route name
            // "accounting.cost-centers.index" matches URL "/accounting/cost-centers"
            const resourceActions = [
                "index",
                "create",
                "edit",
                "show",
                "store",
                "update",
                "destroy",
            ];
            const parts = r.split(".");
            const trimmed = resourceActions.includes(parts[parts.length - 1])
                ? parts.slice(0, -1)
                : parts;
            const basePath = "/" + trimmed.join("/");
            return url === basePath || url.startsWith(basePath + "/");
        } catch {
            return false;
        }
    };
    const active = item.route
        ? isActive(item.route)
        : item.children?.some((c) => isActive(c.route));
    const [open, setOpen] = useState(active);

    useEffect(() => {
        if (active) setOpen(true);
    }, [active]);

    if (!item.children) {
        const href = (() => {
            try {
                return route(item.route);
            } catch {
                return "#";
            }
        })();
        return (
            <Link
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`}
            >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
            </Link>
        );
    }

    return (
        <div>
            <button
                onClick={() => setOpen((o) => !o)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${active ? "text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`}
            >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && (
                    <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {open ? (
                            <ChevronDown size={14} />
                        ) : (
                            <ChevronRight size={14} />
                        )}
                    </>
                )}
            </button>
            {open && !collapsed && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-slate-700 pl-3">
                    {item.children.map((child) => {
                        const href = (() => {
                            try {
                                return route(child.route);
                            } catch {
                                return "#";
                            }
                        })();
                        const ca = isActive(child.route);
                        return (
                            <Link
                                key={child.label}
                                href={href}
                                className={`block px-2 py-1.5 rounded text-sm transition-colors
                                    ${ca ? "text-blue-400 font-medium" : "text-slate-400 hover:text-white"}`}
                            >
                                {child.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function AppLayoutDark({ children, title }) {
    const { auth, isSuperAdmin, isAdmin, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [flashMsg, setFlashMsg] = useState(null);

    // Show flash messages (success / error / warning) and auto-dismiss after 4 s
    useEffect(() => {
        const msg = flash?.error
            ? { type: "error", text: flash.error }
            : flash?.success
              ? { type: "success", text: flash.success }
              : flash?.warning
                ? { type: "warning", text: flash.warning }
                : null;
        if (msg) {
            setFlashMsg(msg);
            const t = setTimeout(() => setFlashMsg(null), 4000);
            return () => clearTimeout(t);
        }
    }, [flash?.error, flash?.success, flash?.warning]);

    const logoutHref = (() => {
        try {
            return route("logout");
        } catch {
            return "/logout";
        }
    })();

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                fixed lg:static inset-y-0 left-0 z-30 flex flex-col bg-slate-900
                transition-all duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                ${collapsed ? "w-16" : "w-64"}
            `}
            >
                {/* Logo */}
                <div
                    className={`flex items-center h-16 px-4 border-b border-slate-800 shrink-0 ${collapsed ? "justify-center" : "justify-between"}`}
                >
                    {!collapsed && (
                        <Link
                            href={(() => {
                                try {
                                    return route("dashboard");
                                } catch {
                                    return "/dashboard";
                                }
                            })()}
                            className="flex items-center gap-2"
                        >
                            <img
                                src="/logo.svg"
                                alt="AccounTech BD"
                                className="w-8 h-8 rounded-lg shadow"
                            />
                            <div className="leading-tight">
                                <div className="text-white font-bold text-sm">
                                    AccounTech
                                </div>
                                <div className="text-blue-400 text-xs">
                                    BD ERP
                                </div>
                            </div>
                        </Link>
                    )}
                    <button
                        onClick={() => setCollapsed((c) => !c)}
                        className="text-slate-400 hover:text-white p-1 rounded"
                    >
                        {collapsed ? (
                            <ChevronRight size={18} />
                        ) : (
                            <ChevronDown size={18} className="rotate-90" />
                        )}
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
                    {nav.map((item) => {
                        // Filter superAdminOnly children
                        const filtered = item.children
                            ? {
                                  ...item,
                                  children: item.children.filter(
                                      (c) =>
                                          (!c.superAdminOnly || isSuperAdmin) &&
                                          (!c.adminOrSuperAdmin ||
                                              isSuperAdmin ||
                                              isAdmin),
                                  ),
                              }
                            : item;
                        return (
                            <NavItem
                                key={item.label}
                                item={filtered}
                                collapsed={collapsed}
                            />
                        );
                    })}
                </nav>

                {/* User info */}
                {!collapsed && (
                    <div className="border-t border-slate-800 p-3">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <div className="w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center">
                                <User size={14} className="text-slate-300" />
                            </div>
                            <span className="truncate text-slate-300">
                                {auth?.user?.name}
                            </span>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden text-slate-500 hover:text-slate-700"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={22} />
                        </button>
                        {title && (
                            <h1 className="text-lg font-semibold text-slate-700 hidden sm:block">
                                {title}
                            </h1>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative text-slate-500 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100">
                            <Bell size={20} />
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen((o) => !o)}
                                className="flex items-center gap-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg px-2 py-1.5"
                            >
                                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {auth?.user?.name?.[0]?.toUpperCase()}
                                </div>
                                <span className="hidden sm:block font-medium">
                                    {auth?.user?.name}
                                </span>
                                <ChevronDown size={14} />
                            </button>
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        <User size={14} /> Profile
                                    </Link>
                                    {isSuperAdmin && (
                                        <Link
                                            href={route("superadmin.dashboard")}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-violet-700 hover:bg-violet-50"
                                        >
                                            <Shield size={14} /> Super Admin
                                            Panel
                                        </Link>
                                    )}
                                    <hr className="my-1 border-slate-100" />
                                    <Link
                                        href={logoutHref}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={14} /> Log out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Subscription Banner */}
                <SubscriptionBanner />

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {/* Flash notification banner */}
                    {flashMsg && (
                        <div
                            className={`mb-4 flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-sm
                            ${
                                flashMsg.type === "error"
                                    ? "bg-red-50 border border-red-200 text-red-700"
                                    : flashMsg.type === "warning"
                                      ? "bg-amber-50 border border-amber-200 text-amber-700"
                                      : "bg-green-50 border border-green-200 text-green-700"
                            }`}
                        >
                            <span>{flashMsg.text}</span>
                            <button
                                onClick={() => setFlashMsg(null)}
                                className="shrink-0 opacity-60 hover:opacity-100 text-lg leading-none"
                            >
                                &times;
                            </button>
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
// ── Smart wrapper: picks the right layout based on shared `appLayout` prop ──
export default function AppLayout({ children, title }) {
    const { appLayout } = usePage().props;
    if (appLayout === "light")
        return <AppLayoutLight title={title}>{children}</AppLayoutLight>;
    if (appLayout === "tally")
        return <AppLayoutTally title={title}>{children}</AppLayoutTally>;
    return <AppLayoutDark title={title}>{children}</AppLayoutDark>;
}

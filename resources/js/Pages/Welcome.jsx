import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

/* ── tiny helpers ─────────────────────────────────────────── */
function Badge({ children, color = "blue" }) {
    const map = {
        blue: "bg-blue-100 text-blue-700 border-blue-200",
        green: "bg-green-100 text-green-700 border-green-200",
        purple: "bg-purple-100 text-purple-700 border-purple-200",
        amber: "bg-amber-100 text-amber-700 border-amber-200",
        teal: "bg-teal-100 text-teal-700 border-teal-200",
        indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
        rose: "bg-rose-100 text-rose-700 border-rose-200",
        slate: "bg-slate-100 text-slate-600 border-slate-200",
        cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
        orange: "bg-orange-100 text-orange-700 border-orange-200",
    };
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${map[color] ?? map.blue}`}
        >
            {children}
        </span>
    );
}

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-6 py-4 text-left text-slate-800 font-semibold hover:bg-slate-50 transition-colors"
            >
                <span>{q}</span>
                <span
                    className={`text-slate-400 transition-transform duration-200 text-xl ${open ? "rotate-45" : ""}`}
                >
                    +
                </span>
            </button>
            {open && (
                <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                    {a}
                </div>
            )}
        </div>
    );
}

/* ── data ─────────────────────────────────────────────────── */
const MODULES = [
    {
        icon: "📊",
        label: "Dashboard",
        color: "blue",
        desc: "Real-time KPIs, charts and daily summaries at a glance.",
    },
    {
        icon: "🛒",
        label: "Sales",
        color: "green",
        desc: "Invoices, quotations, delivery notes, credit notes and CRM.",
    },
    {
        icon: "🚚",
        label: "Purchase",
        color: "amber",
        desc: "Vendors, purchase orders, debit notes and goods receipts (GRN).",
    },
    {
        icon: "📒",
        label: "Accounting",
        color: "purple",
        desc: "Chart of accounts, journal entries, cost centers and budgets.",
    },
    {
        icon: "💳",
        label: "Finance",
        color: "teal",
        desc: "Payments, receipts and bank accounts management.",
    },
    {
        icon: "📦",
        label: "Inventory",
        color: "orange",
        desc: "Products, warehouses, categories and stock movement.",
    },
    {
        icon: "👥",
        label: "HR & Payroll",
        color: "rose",
        desc: "Employees, payroll, leave requests and departments.",
    },
    {
        icon: "🏪",
        label: "POS",
        color: "indigo",
        desc: "Point-of-sale terminal with barcode support and quick checkout.",
    },
    {
        icon: "🏢",
        label: "Fixed Assets",
        color: "cyan",
        desc: "Asset register, depreciation schedules and disposal.",
    },
    {
        icon: "📈",
        label: "Reports",
        color: "blue",
        desc: "Profit & loss, balance sheet, customer statements and more.",
    },
    {
        icon: "⚙️",
        label: "Settings",
        color: "slate",
        desc: "Company, tax rates, currencies, fiscal years and units.",
    },
    {
        icon: "🔐",
        label: "Roles & Perms",
        color: "purple",
        desc: "Granular role-based permissions for every module action.",
    },
    {
        icon: "💡",
        label: "Knowledge Base",
        color: "green",
        desc: "Internal FAQ / knowledgebase for teams and support.",
    },
    {
        icon: "🏦",
        label: "Bank Accounts",
        color: "teal",
        desc: "Multi-bank account tracking with reconciliation tools.",
    },
    {
        icon: "📝",
        label: "Quotations",
        color: "amber",
        desc: "Professional quotations with one-click invoice conversion.",
    },
    {
        icon: "🔄",
        label: "Returns",
        color: "rose",
        desc: "Customer credit notes and supplier debit note returns.",
    },
];

const WHY = [
    {
        icon: "⚡",
        title: "Real-Time Dashboard",
        body: "All critical business metrics—sales, collections, payables, stock levels—visible on a single screen the moment data changes.",
        bullets: [
            "Live KPI cards",
            "Interactive charts",
            "Daily & monthly summaries",
        ],
        bg: "from-blue-50 to-indigo-50",
        accent: "bg-blue-600",
    },
    {
        icon: "🔐",
        title: "Granular Role Permissions",
        body: "Build custom roles with per-module, per-action access control. Every feature can be individually toggled for any user.",
        bullets: [
            "Module-level gates",
            "Action-level control (view/create/edit/delete)",
            "Super-admin bypass",
        ],
        bg: "from-purple-50 to-rose-50",
        accent: "bg-purple-600",
    },
    {
        icon: "📤",
        title: "Export Everything",
        body: "Every table, report and statement in AccounTech BD can be exported to PDF or Excel with a single click.",
        bullets: [
            "PDF & Excel export",
            "Printable invoice templates",
            "Bulk export support",
        ],
        bg: "from-green-50 to-teal-50",
        accent: "bg-green-600",
    },
    {
        icon: "🌍",
        title: "Multi-Currency & Multi-Tax",
        body: "Run operations in BDT and foreign currencies. Apply VAT, SD and custom tax rates per product or transaction.",
        bullets: [
            "Live exchange rates",
            "Multiple tax rate support",
            "Per-invoice currency",
        ],
        bg: "from-amber-50 to-orange-50",
        accent: "bg-amber-500",
    },
];

const MODULE_DETAILS = [
    {
        icon: "🛒",
        title: "Sales Management",
        body: "The Sales module handles the complete sales lifecycle — from quotation to delivery. Manage customers, issue professional invoices, track payments due, apply tax and discounts, and generate credit notes for returns. Every transaction syncs to accounting automatically.",
        tag: "Sales",
        tagColor: "green",
        points: [
            "Customer & contact management",
            "Invoices with template printing",
            "Quotation → Invoice conversion",
            "Credit notes & delivery notes",
            "Real-time receivables tracking",
        ],
        side: "left",
    },
    {
        icon: "🚚",
        title: "Purchase Management",
        body: "Streamline your procurement—create purchase orders, receive goods against GRN, and manage vendor relationships and payables. Debit notes handle returns to suppliers, keeping your books accurate.",
        tag: "Purchase",
        tagColor: "amber",
        points: [
            "Vendor profiles & ledgers",
            "Purchase orders (PO)",
            "Goods receipt notes (GRN)",
            "Debit notes for returns",
            "Payable aging reports",
        ],
        side: "right",
    },
    {
        icon: "📒",
        title: "Accounting & Finance",
        body: "A complete double-entry accounting engine. Maintain your chart of accounts, post journal entries, assign cost centers, manage budgets, and produce trial balance, P&L and balance sheet at any time.",
        tag: "Accounting",
        tagColor: "purple",
        points: [
            "Chart of accounts",
            "Journal entries (debit/credit)",
            "Cost centers & budgets",
            "Bank account reconciliation",
            "Trial balance & financial statements",
        ],
        side: "left",
    },
    {
        icon: "👥",
        title: "HR & Payroll",
        body: "Manage your entire workforce — from employee onboarding and department assignment to monthly payroll processing, leave approvals, and salary slip generation. All linked to your chart of accounts.",
        tag: "HR",
        tagColor: "rose",
        points: [
            "Employee master with designations",
            "Payroll processing & slips",
            "Leave request & approval",
            "Departments & designations",
            "Payroll expense to accounting",
        ],
        side: "right",
    },
];

const STATS = [
    { n: "13+", label: "Modules" },
    { n: "50+", label: "Features" },
    { n: "100%", label: "Role-based Access" },
    { n: "∞", label: "Transactions" },
    { n: "PDF/XLSX", label: "Export Formats" },
    { n: "Multi", label: "Currency & Tax" },
];

const FEATURE_LABELS = {
    accounting: "Accounting / GL",
    sales: "Sales & Invoicing",
    purchase: "Purchase Orders",
    inventory: "Inventory Management",
    hr: "HR & Payroll",
    finance: "Finance & Banking",
    assets: "Fixed Assets",
    pos: "Point of Sale (POS)",
    reports: "Advanced Reports",
    multi_warehouse: "Multi Warehouse",
    api_access: "API Access",
};

const FAQS = [
    {
        q: "What is AccounTech BD?",
        a: "AccounTech BD is a comprehensive ERP (Enterprise Resource Planning) web application built with Laravel 12 and React 18 via Inertia.js. It covers accounting, sales, purchase, inventory, HR, POS, fixed assets, and more in a single system.",
    },
    {
        q: "What technologies power this software?",
        a: "The backend is Laravel 12 (PHP 8.2+) and the frontend is React 18 with Inertia.js and Tailwind CSS, bundled by Vite. The database is MySQL/SQLite.",
    },
    {
        q: "Can I control what each user can see or do?",
        a: "Yes. AccounTech BD has a granular role-permission system. You can create unlimited custom roles and toggle individual actions (view, create, edit, delete) per module and per feature for each role.",
    },
    {
        q: "Does it support multiple currencies and tax rates?",
        a: "Yes. You can configure multiple currencies and apply different tax rates (VAT, SD, custom) per transaction or per product.",
    },
    {
        q: "Can I print invoices and export reports?",
        a: "Yes. Every invoice supports printable PDF templates. All tables and reports have one-click PDF and Excel export buttons.",
    },
    {
        q: "Is the POS module integrated with inventory?",
        a: "Yes. The POS terminal deducts stock in real time from the selected warehouse and posts the sale to the accounting module automatically.",
    },
];

export default function Welcome({ auth, plans = [] }) {
    const { t } = useTranslation();
    const [pricingCycle, setPricingCycle] = useState("monthly");

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden">
            <Head title={t("AccounTech BD — Complete ERP Software")} />

            {/* ············ NAVBAR ············ */}
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo.svg"
                            alt="AccounTech BD"
                            className="w-9 h-9 rounded-xl shadow-md"
                        />
                        <div className="leading-tight">
                            <div className="font-black text-slate-900 text-base tracking-tight">
                                AccounTech
                            </div>
                            <div className="text-blue-600 text-[10px] font-semibold tracking-widest uppercase -mt-0.5">
                                BD ERP
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-7 text-sm text-slate-600 font-medium">
                        <a
                            href="#features"
                            className="hover:text-blue-600 transition-colors"
                        >
                            {t("Features")}
                        </a>
                        <a
                            href="#modules"
                            className="hover:text-blue-600 transition-colors"
                        >
                            {t("Modules")}
                        </a>
                        <a
                            href="#why"
                            className="hover:text-blue-600 transition-colors"
                        >
                            {t("Why Us")}
                        </a>
                        <a
                            href="#pricing"
                            className="hover:text-blue-600 transition-colors"
                        >
                            {t("Pricing")}
                        </a>
                        <a
                            href="#faq"
                            className="hover:text-blue-600 transition-colors"
                        >
                            {t("FAQ")}
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        {auth?.user ? (
                            <Link
                                href={route("dashboard")}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow transition-colors"
                            >
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route("contact.show")}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow transition-colors"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ············ HERO ············ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 py-24 lg:py-32">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                        Complete Business ERP — Accounting · Sales · HR · POS &
                        More
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6">
                        The Complete ERP for
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            {t("Bangladesh Businesses")}
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-300 text-lg leading-relaxed mb-10">
                        AccounTech BD unifies accounting, sales, purchase,
                        inventory, HR, payroll, POS, fixed assets and reports
                        into one seamless, role-permission-controlled platform.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        {auth?.user ? (
                            <Link
                                href={route("dashboard")}
                                className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-3.5 rounded-2xl text-base shadow-xl transition-colors"
                            >
                                Open Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("contact.show")}
                                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-3.5 rounded-2xl text-base shadow-xl transition-colors"
                                >
                                    Get Started Free →
                                </Link>
                                <Link
                                    href={route("login")}
                                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-2xl text-base transition-colors"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Stats strip */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 max-w-4xl mx-auto">
                        {STATS.map((s) => (
                            <div
                                key={s.label}
                                className="bg-white/5 border border-white/10 rounded-2xl p-4"
                            >
                                <div className="text-2xl font-black text-white">
                                    {s.n}
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech stack badges */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-wrap items-center justify-center gap-3">
                    {[
                        {
                            label: "Laravel 12",
                            bg: "bg-red-500/10 border-red-500/20 text-red-300",
                        },
                        {
                            label: "PHP 8.2+",
                            bg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-300",
                        },
                        {
                            label: "React 18",
                            bg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
                        },
                        {
                            label: "Inertia.js",
                            bg: "bg-purple-500/10 border-purple-500/20 text-purple-300",
                        },
                        {
                            label: "Tailwind CSS",
                            bg: "bg-sky-500/10 border-sky-500/20 text-sky-300",
                        },
                        {
                            label: "Vite",
                            bg: "bg-amber-500/10 border-amber-500/20 text-amber-300",
                        },
                        {
                            label: "MySQL",
                            bg: "bg-orange-500/10 border-orange-500/20 text-orange-300",
                        },
                    ].map((t) => (
                        <span
                            key={t.label}
                            className={`border text-xs font-semibold px-3 py-1.5 rounded-full ${t.bg}`}
                        >
                            {t.label}
                        </span>
                    ))}
                </div>
            </section>

            {/* ············ FEATURES GRID (pill icons) ············ */}
            <section id="features" className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Badge color="blue">
                            All-In-One Business Operating System
                        </Badge>
                        <h2 className="text-3xl font-black text-slate-900 mt-4 mb-3">
                            Every Module Your Business Needs
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Manage everything from a single platform. No
                            juggling multiple tools.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
                        {MODULES.map((m) => (
                            <div
                                key={m.label}
                                className="flex flex-col items-center gap-2 bg-white border border-slate-200 rounded-2xl p-4 hover:border-blue-300 hover:shadow-md transition-all group text-center"
                            >
                                <span className="text-3xl group-hover:scale-110 transition-transform">
                                    {m.icon}
                                </span>
                                <span className="text-xs font-semibold text-slate-700 leading-tight">
                                    {m.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ············ WHY CHOOSE ············ */}
            <section id="why" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <Badge color="green">Why AccounTech BD</Badge>
                        <h2 className="text-3xl font-black text-slate-900 mt-4 mb-3">
                            Built for Real Business Needs
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Thoughtfully designed for companies that need
                            reliable, fast and controllable ERP software.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {WHY.map((w) => (
                            <div
                                key={w.title}
                                className={`bg-gradient-to-br ${w.bg} border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow`}
                            >
                                <div
                                    className={`w-12 h-12 ${w.accent} rounded-2xl flex items-center justify-center text-2xl shadow-md`}
                                >
                                    {w.icon}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-base mb-1">
                                        {w.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {w.body}
                                    </p>
                                </div>
                                <ul className="space-y-1.5 mt-auto">
                                    {w.bullets.map((b) => (
                                        <li
                                            key={b}
                                            className="flex items-start gap-2 text-xs text-slate-600"
                                        >
                                            <span className="text-green-500 font-bold mt-0.5">
                                                ✓
                                            </span>{" "}
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ············ MODULE DETAIL SECTIONS (alternating) ············ */}
            <section id="modules" className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge color="purple">Module Deep Dive</Badge>
                        <h2 className="text-3xl font-black text-slate-900 mt-4 mb-3">
                            Explore Core Modules
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Each module is a fully integrated piece of the
                            AccounTech BD ecosystem.
                        </p>
                    </div>

                    <div className="space-y-20">
                        {MODULE_DETAILS.map((m, i) => (
                            <div
                                key={m.title}
                                className={`flex flex-col ${m.side === "right" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-10 items-center`}
                            >
                                {/* Visual card */}
                                <div className="lg:w-1/2">
                                    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden p-8 shadow-2xl">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                                        <div className="relative z-10">
                                            <div className="text-6xl mb-6">
                                                {m.icon}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {m.points.map((p) => (
                                                    <div
                                                        key={p}
                                                        className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-300 font-medium flex items-start gap-2"
                                                    >
                                                        <span className="text-blue-400 text-xs font-bold">
                                                            →
                                                        </span>{" "}
                                                        {p}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Text */}
                                <div className="lg:w-1/2 space-y-5">
                                    <Badge color={m.tagColor}>{m.tag}</Badge>
                                    <h3 className="text-2xl lg:text-3xl font-black text-slate-900">
                                        {m.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {m.body}
                                    </p>
                                    <ul className="space-y-2">
                                        {m.points.map((p) => (
                                            <li
                                                key={p}
                                                className="flex items-start gap-3 text-sm text-slate-700"
                                            >
                                                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                                    ✓
                                                </span>
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                    {auth?.user ? (
                                        <Link
                                            href={route("dashboard")}
                                            className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all"
                                        >
                                            Open Module →
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route("contact.show")}
                                            className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all"
                                        >
                                            Get Started →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ············ FULL MODULES GRID CARDS ············ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <Badge color="indigo">All Modules</Badge>
                        <h2 className="text-3xl font-black text-slate-900 mt-4 mb-3">
                            Everything in One Platform
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            AccounTech BD covers the complete end-to-end ERP
                            solution requirements for modern businesses.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {MODULES.map((m) => {
                            const colors = {
                                blue: "border-blue-200 bg-blue-50/50",
                                green: "border-green-200 bg-green-50/50",
                                purple: "border-purple-200 bg-purple-50/50",
                                amber: "border-amber-200 bg-amber-50/50",
                                teal: "border-teal-200 bg-teal-50/50",
                                indigo: "border-indigo-200 bg-indigo-50/50",
                                rose: "border-rose-200 bg-rose-50/50",
                                cyan: "border-cyan-200 bg-cyan-50/50",
                                orange: "border-orange-200 bg-orange-50/50",
                                slate: "border-slate-200 bg-slate-50",
                            };
                            return (
                                <div
                                    key={m.label}
                                    className={`border-2 rounded-2xl p-5 hover:shadow-md transition-all group cursor-pointer ${colors[m.color] ?? colors.slate}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-3xl group-hover:scale-110 transition-transform shrink-0">
                                            {m.icon}
                                        </span>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-sm">
                                                {m.label}
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                {m.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ············ STATS BANNER ············ */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                        {STATS.map((s) => (
                            <div key={s.label}>
                                <div className="text-3xl font-black text-white">
                                    {s.n}
                                </div>
                                <div className="text-blue-200 text-xs font-medium mt-1">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ············ FEATURE HIGHLIGHTS (visual cards) ············ */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <Badge color="teal">Platform Capabilities</Badge>
                        <h2 className="text-3xl font-black text-slate-900 mt-4 mb-3">
                            Gear Up Your Organisation
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Tackle accounting, inventory, payroll and sales
                            challenges with a single elegant platform.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            {
                                icon: "🔐",
                                title: t("Role-Based Access Control"),
                                desc: "Fine-grained permissions per module and action. Create unlimited custom roles for any team structure.",
                                color: "purple",
                            },
                            {
                                icon: "📤",
                                title: t("One-Click Export"),
                                desc: "Every report, invoice and table exports to PDF or Excel. Printable invoice templates included.",
                                color: "green",
                            },
                            {
                                icon: "💱",
                                title: t("Multi-Currency Support"),
                                desc: "Transact in BDT and foreign currencies with configurable exchange rates per entry.",
                                color: "amber",
                            },
                            {
                                icon: "🔗",
                                title: t("Fully Integrated"),
                                desc: "POS sales hit inventory and accounting automatically. Payroll flows to chart of accounts. Everything connected.",
                                color: "blue",
                            },
                            {
                                icon: "📊",
                                title: t("Rich Reports & Analytics"),
                                desc: "P&L, balance sheet, trial balance, customer statements, vendor statements, payroll summaries and more.",
                                color: "indigo",
                            },
                            {
                                icon: "🌍",
                                title: t("Web-Based & Responsive"),
                                desc: "Runs in any modern browser. No desktop installation needed. Access securely from anywhere.",
                                color: "teal",
                            },
                        ].map((f) => {
                            const cardColors = {
                                purple: "bg-purple-50 border-purple-200",
                                green: "bg-green-50 border-green-200",
                                amber: "bg-amber-50 border-amber-200",
                                blue: "bg-blue-50 border-blue-200",
                                indigo: "bg-indigo-50 border-indigo-200",
                                teal: "bg-teal-50 border-teal-200",
                            };
                            const iconColors = {
                                purple: "bg-purple-500",
                                green: "bg-green-500",
                                amber: "bg-amber-500",
                                blue: "bg-blue-500",
                                indigo: "bg-indigo-500",
                                teal: "bg-teal-500",
                            };
                            return (
                                <div
                                    key={f.title}
                                    className={`border rounded-2xl p-6 hover:shadow-lg transition-shadow ${cardColors[f.color]}`}
                                >
                                    <div
                                        className={`w-12 h-12 ${iconColors[f.color]} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow`}
                                    >
                                        {f.icon}
                                    </div>
                                    <h3 className="font-black text-slate-900 text-base mb-2">
                                        {f.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {f.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ············ FAQ ············ */}
            <section id="pricing" className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Badge color="green">Transparent Pricing</Badge>
                        <h2 className="text-3xl font-black text-slate-900 mt-4 mb-3">
                            Simple, Honest Pricing
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Start with a free 24-hour demo. No credit card
                            required.
                        </p>
                        <div className="inline-flex items-center mt-6 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                            <button
                                onClick={() => setPricingCycle("monthly")}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    pricingCycle === "monthly"
                                        ? "bg-blue-600 text-white shadow"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                {t("Monthly")}
                            </button>
                            <button
                                onClick={() => setPricingCycle("yearly")}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                                    pricingCycle === "yearly"
                                        ? "bg-blue-600 text-white shadow"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                Yearly
                                <span
                                    className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                                        pricingCycle === "yearly"
                                            ? "bg-green-400 text-green-900"
                                            : "bg-green-100 text-green-700"
                                    }`}
                                >
                                    Save ~17%
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
                        {plans.map((plan) => {
                            const isDemo =
                                plan.price_monthly === 0 &&
                                plan.price_yearly === 0;
                            const isPopular = plan.slug === "business";
                            const yearlyPrice =
                                plan.price_yearly > 0
                                    ? plan.price_yearly
                                    : plan.price_monthly * 12;
                            const savings =
                                plan.price_monthly * 12 - yearlyPrice;

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative border-2 rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-xl ${
                                        isPopular
                                            ? "border-blue-500 bg-blue-50 shadow-lg"
                                            : isDemo
                                              ? "border-green-400 bg-green-50"
                                              : "border-slate-200 bg-white"
                                    }`}
                                >
                                    {isPopular && (
                                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black px-4 py-1 rounded-full whitespace-nowrap">
                                            ⭐ Most Popular
                                        </span>
                                    )}
                                    {isDemo && (
                                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-black px-4 py-1 rounded-full whitespace-nowrap">
                                            🆓 Free Demo
                                        </span>
                                    )}

                                    <div className="mt-1">
                                        <h3 className="text-lg font-black text-slate-900">
                                            {plan.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div>
                                        {isDemo ? (
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-green-600">
                                                    {t("FREE")}
                                                </span>
                                                <span className="text-slate-500 text-sm">
                                                    / 24 hours
                                                </span>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-black text-slate-900">
                                                        $
                                                        {pricingCycle ===
                                                        "yearly"
                                                            ? yearlyPrice
                                                            : plan.price_monthly}
                                                    </span>
                                                    <span className="text-slate-500 text-sm">
                                                        /{" "}
                                                        {pricingCycle ===
                                                        "yearly"
                                                            ? "year"
                                                            : "month"}
                                                    </span>
                                                </div>
                                                {pricingCycle === "yearly" &&
                                                    savings > 0 && (
                                                        <p className="text-green-600 text-xs mt-0.5 font-semibold">
                                                            Save ${savings}
                                                            /yr vs monthly
                                                        </p>
                                                    )}
                                                {pricingCycle === "yearly" && (
                                                    <p className="text-slate-400 text-xs mt-0.5">
                                                        ($
                                                        {plan.price_monthly}
                                                        /mo × 12)
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <ul className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
                                        <li className="flex items-center gap-2">
                                            <span className="text-blue-500">
                                                👥
                                            </span>
                                            Up to {plan.max_users} users
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-blue-500">
                                                📄
                                            </span>
                                            {plan.max_invoices_per_month >=
                                            99999
                                                ? "Unlimited"
                                                : plan.max_invoices_per_month}{" "}
                                            invoices/mo
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-blue-500">
                                                📦
                                            </span>
                                            {plan.max_products >= 99999
                                                ? "Unlimited"
                                                : plan.max_products}{" "}
                                            products
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-blue-500">
                                                👤
                                            </span>
                                            {plan.max_employees >= 999
                                                ? "Unlimited"
                                                : plan.max_employees}{" "}
                                            employees
                                        </li>
                                    </ul>

                                    {plan.features &&
                                        plan.features.length > 0 && (
                                            <ul className="space-y-1.5 text-xs border-t border-slate-200 pt-3 flex-1">
                                                {plan.features.map((f) => (
                                                    <li
                                                        key={f}
                                                        className="flex items-start gap-2 text-slate-700"
                                                    >
                                                        <span className="text-green-500 font-bold mt-0.5 shrink-0">
                                                            ✓
                                                        </span>
                                                        {FEATURE_LABELS[f] ?? f}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                    <Link
                                        href={
                                            isDemo
                                                ? route("tenant.register") +
                                                  "?plan=" +
                                                  plan.slug
                                                : route("contact.show")
                                        }
                                        className={`mt-auto text-center py-2.5 px-4 rounded-xl text-sm font-bold transition-colors ${
                                            isPopular
                                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                : isDemo
                                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                                  : "bg-slate-800 hover:bg-slate-900 text-white"
                                        }`}
                                    >
                                        {isDemo
                                            ? "Start Free Demo →"
                                            : "Get Started →"}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    <p className="text-center text-slate-400 text-xs mt-8">
                        Contact us to get started.
                    </p>
                </div>
            </section>

            <section id="faq" className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Badge color="amber">Frequently Asked Questions</Badge>
                        <h2 className="text-3xl font-black text-slate-900 mt-4 mb-3">
                            Have Questions? We Have Answers
                        </h2>
                        <p className="text-slate-500">
                            Everything you need to know about AccounTech BD ERP.
                        </p>
                    </div>
                    <div className="space-y-3">
                        {FAQS.map((f) => (
                            <FaqItem key={f.q} q={f.q} a={f.a} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ············ CTA ············ */}
            <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full" />
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full" />
                </div>
                <div className="relative max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <div className="text-5xl mb-5">🚀</div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                        Get started with AccounTech BD today — the complete ERP
                        that grows with your business.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {auth?.user ? (
                            <Link
                                href={route("dashboard")}
                                className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-10 py-4 rounded-2xl text-base shadow-xl transition-colors"
                            >
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("contact.show")}
                                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-10 py-4 rounded-2xl text-base shadow-xl transition-colors"
                                >
                                    Get Started Free →
                                </Link>
                                <Link
                                    href={route("login")}
                                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-colors"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ············ FOOTER ············ */}
            <footer className="bg-slate-950 text-slate-400 py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <img
                                    src="/logo.svg"
                                    alt="AccounTech BD"
                                    className="w-9 h-9 rounded-xl"
                                />
                                <div className="leading-tight">
                                    <div className="font-black text-white text-base">
                                        AccounTech
                                    </div>
                                    <div className="text-blue-400 text-[10px] font-semibold tracking-widest uppercase -mt-0.5">
                                        BD ERP
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed">
                                Complete ERP software for Bangladesh businesses
                                — built with Laravel 12 &amp; React 18.
                            </p>
                        </div>

                        {/* Modules */}
                        <div>
                            <h4 className="text-white font-bold text-sm mb-4">
                                Modules
                            </h4>
                            <ul className="space-y-2 text-sm">
                                {[
                                    "Sales",
                                    "Purchase",
                                    "Accounting",
                                    "Finance",
                                    "Inventory",
                                    "HR & Payroll",
                                ].map((m) => (
                                    <li key={m}>
                                        <span className="hover:text-blue-400 cursor-pointer transition-colors">
                                            {m}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* More */}
                        <div>
                            <h4 className="text-white font-bold text-sm mb-4">
                                More
                            </h4>
                            <ul className="space-y-2 text-sm">
                                {[
                                    "POS",
                                    "Fixed Assets",
                                    "Reports",
                                    "Settings",
                                    "Knowledge Base",
                                    "Roles & Permissions",
                                ].map((m) => (
                                    <li key={m}>
                                        <span className="hover:text-blue-400 cursor-pointer transition-colors">
                                            {m}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Stack */}
                        <div>
                            <h4 className="text-white font-bold text-sm mb-4">
                                Tech Stack
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    "Laravel 12",
                                    "PHP 8.2+",
                                    "React 18",
                                    "Inertia.js",
                                    "Tailwind CSS",
                                    "Vite",
                                    "MySQL",
                                ].map((t) => (
                                    <span
                                        key={t}
                                        className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-full"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <p>
                            © {new Date().getFullYear()} AccounTech BD — All
                            rights reserved.
                        </p>
                        <div className="flex gap-5">
                            {auth?.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="hover:text-blue-400 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route("contact.show")}
                                        className="hover:text-blue-400 transition-colors"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

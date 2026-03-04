import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Users,
    Package,
    ShoppingCart,
    AlertTriangle,
    UserCheck,
    ArrowRight,
    CalendarClock,
    Receipt,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const fmt = (n) =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 0,
    }).format(n ?? 0);
const fmtNum = (n) => new Intl.NumberFormat("en-BD").format(n ?? 0);
const statusBadge = {
    draft: "bg-slate-100 text-slate-600",
    sent: "bg-blue-100 text-blue-700",
    partial: "bg-amber-100 text-amber-700",
    paid: "bg-emerald-100 text-emerald-700",
    overdue: "bg-red-100 text-red-700",
    cancelled: "bg-slate-100 text-slate-400",
};

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-slate-500 text-sm">{label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                    {value}
                </p>
                {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
            </div>
            <div
                className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}
            >
                <Icon size={20} className="text-white" />
            </div>
        </div>
    </div>
);

export default function Dashboard({
    stats,
    monthlyRevenue,
    monthlyPurchases,
    recentInvoices,
    lowStockProducts,
    todaySaleDue,
    todayPurchaseDue,
    expenseStatement,
}) {
    const { t } = useTranslation();
    const [expenseMonth, setExpenseMonth] = useState(
        expenseStatement?.month ?? new Date().toISOString().slice(0, 7),
    );

    const handleExpenseFilter = () => {
        router.get(
            route("dashboard"),
            { expense_month: expenseMonth },
            { preserveScroll: true, preserveState: true },
        );
    };

    const EXPENSE_COLORS = [
        "#FF6B8A",
        "#4DA9F8",
        "#FFD166",
        "#2ECC71",
        "#2EC4B6",
    ];
    const EXPENSE_KEYS = [
        { key: "totalSale", label: "Total Sale" },
        { key: "totalPurchase", label: "Total Purchase" },
        { key: "totalExpense", label: "Total Expense" },
        { key: "employeeSalary", label: "Employee Salary" },
        { key: "service", label: "Service" },
    ];
    const pieData = EXPENSE_KEYS.map(({ key, label }) => ({
        name: label,
        value: expenseStatement?.[key] ?? 0,
    })).filter((d) => d.value > 0);
    const hasPieData = pieData.length > 0;
    const chartData = (monthlyRevenue ?? []).map((r, i) => ({
        ...r,
        purchase: (monthlyPurchases ?? [])[i]?.total ?? 0,
    }));
    return (
        <AppLayout header="Dashboard">
            <Head title={t("dashboard.title")} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label={t("dashboard.revenue_this_month")}
                    value={fmt(stats?.totalRevenue)}
                    icon={DollarSign}
                    color="bg-indigo-500"
                    sub={`${fmtNum(stats?.totalInvoices)} ${t("sales.invoices")}`}
                />
                <StatCard
                    label={t("dashboard.total_receivable")}
                    value={fmt(stats?.totalReceivable)}
                    icon={TrendingUp}
                    color="bg-blue-500"
                    sub={`${stats?.overdueCount} ${t("sales.overdue")}`}
                />
                <StatCard
                    label={t("dashboard.total_payable")}
                    value={fmt(stats?.totalPayable)}
                    icon={TrendingDown}
                    color="bg-amber-500"
                />
                <StatCard
                    label={t("sales.customers")}
                    value={fmtNum(stats?.totalCustomers)}
                    icon={Users}
                    color="bg-emerald-500"
                    sub={`${fmtNum(stats?.totalVendors)} ${t("purchase.vendors")}`}
                />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label={t("inventory.products")}
                    value={fmtNum(stats?.totalProducts)}
                    icon={Package}
                    color="bg-violet-500"
                    sub={`${stats?.lowStockCount ?? 0} ${t("dashboard.low_stock")}`}
                />
                <StatCard
                    label={t("hr.employees")}
                    value={fmtNum(stats?.totalEmployees)}
                    icon={UserCheck}
                    color="bg-pink-500"
                />
                <StatCard
                    label={t("dashboard.overdue_invoices")}
                    value={fmtNum(stats?.overdueCount)}
                    icon={AlertTriangle}
                    color="bg-red-500"
                />
                <StatCard
                    label={t("dashboard.active_pos")}
                    value={fmtNum(stats?.activePOs ?? 0)}
                    icon={ShoppingCart}
                    color="bg-orange-500"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="font-semibold text-slate-800 mb-4">
                        {t("dashboard.revenue_vs_purchase")}
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={chartData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f1f5f9"
                            />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis
                                tick={{ fontSize: 11 }}
                                tickFormatter={(v) =>
                                    `৳${(v / 1000).toFixed(0)}k`
                                }
                            />
                            <Tooltip formatter={(v) => fmt(v)} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="total"
                                name="Revenue"
                                stroke="#6366f1"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="purchase"
                                name="Purchase"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="font-semibold text-slate-800 mb-4">
                        {t("dashboard.monthly_revenue")}
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={monthlyRevenue ?? []}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f1f5f9"
                            />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis
                                tick={{ fontSize: 11 }}
                                tickFormatter={(v) =>
                                    `৳${(v / 1000).toFixed(0)}k`
                                }
                            />
                            <Tooltip formatter={(v) => fmt(v)} />
                            <Bar
                                dataKey="total"
                                name="Revenue"
                                fill="#6366f1"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Today's Sale Due & Purchase Due ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Today's Sale Due */}
                <div className="bg-white rounded-xl border border-rose-200 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 bg-rose-50 border-b border-rose-100">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-rose-100 rounded-lg">
                                <CalendarClock
                                    size={16}
                                    className="text-rose-600"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-rose-800 text-sm">
                                    {t("dashboard.todays_sale_due")}
                                </h3>
                                <p className="text-xs text-rose-500">
                                    {(todaySaleDue ?? []).length}{" "}
                                    {t("dashboard.invoices_due_today")}
                                </p>
                            </div>
                        </div>
                        <Link
                            href={route("sales.invoices.index")}
                            className="text-rose-600 text-xs flex items-center gap-1 hover:underline font-medium"
                        >
                            {t("dashboard.view_all")} <ArrowRight size={13} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {(todaySaleDue ?? []).length ? (
                            (todaySaleDue ?? []).map((inv) => (
                                <Link
                                    key={inv.id}
                                    href={route("sales.invoices.show", inv.id)}
                                    className="flex items-center justify-between px-5 py-3 hover:bg-rose-50/40 transition-colors"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {inv.invoice_number}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {inv.customer?.name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-rose-600">
                                            {fmt(
                                                Number(inv.total_amount) -
                                                    Number(
                                                        inv.paid_amount ?? 0,
                                                    ),
                                            )}
                                        </p>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[inv.status] ?? "bg-slate-100 text-slate-600"}`}
                                        >
                                            {inv.status}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="px-5 py-8 text-center text-emerald-600 text-sm">
                                {t("dashboard.no_sale_dues_today")} ✓
                            </div>
                        )}
                    </div>
                    {(todaySaleDue ?? []).length > 0 && (
                        <div className="px-5 py-3 bg-rose-50 border-t border-rose-100 flex justify-between text-xs text-rose-700">
                            <span>{t("dashboard.total_due_today")}</span>
                            <span className="font-bold">
                                {fmt(
                                    (todaySaleDue ?? []).reduce(
                                        (s, i) =>
                                            s +
                                            Number(i.total_amount) -
                                            Number(i.paid_amount ?? 0),
                                        0,
                                    ),
                                )}
                            </span>
                        </div>
                    )}
                </div>

                {/* Today's Purchase Due */}
                <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 bg-amber-50 border-b border-amber-100">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-amber-100 rounded-lg">
                                <Receipt size={16} className="text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-amber-800 text-sm">
                                    {t("dashboard.todays_purchase_due")}
                                </h3>
                                <p className="text-xs text-amber-500">
                                    {(todayPurchaseDue ?? []).length}{" "}
                                    {t("dashboard.pos_due_today")}
                                </p>
                            </div>
                        </div>
                        <Link
                            href={route("purchase.purchase-orders.index")}
                            className="text-amber-600 text-xs flex items-center gap-1 hover:underline font-medium"
                        >
                            {t("dashboard.view_all")} <ArrowRight size={13} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {(todayPurchaseDue ?? []).length ? (
                            (todayPurchaseDue ?? []).map((po) => (
                                <Link
                                    key={po.id}
                                    href={route(
                                        "purchase.purchase-orders.show",
                                        po.id,
                                    )}
                                    className="flex items-center justify-between px-5 py-3 hover:bg-amber-50/40 transition-colors"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {po.po_number}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {po.vendor?.name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-amber-600">
                                            {fmt(
                                                Number(po.total_amount) -
                                                    Number(po.paid_amount ?? 0),
                                            )}
                                        </p>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 capitalize">
                                            {po.status}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="px-5 py-8 text-center text-emerald-600 text-sm">
                                {t("dashboard.no_purchase_dues_today")} ✓
                            </div>
                        )}
                    </div>
                    {(todayPurchaseDue ?? []).length > 0 && (
                        <div className="px-5 py-3 bg-amber-50 border-t border-amber-100 flex justify-between text-xs text-amber-700">
                            <span>{t("dashboard.total_due_today")}</span>
                            <span className="font-bold">
                                {fmt(
                                    (todayPurchaseDue ?? []).reduce(
                                        (s, p) =>
                                            s +
                                            Number(p.total_amount) -
                                            Number(p.paid_amount ?? 0),
                                        0,
                                    ),
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-800">
                            {t("dashboard.recent_invoices")}
                        </h3>
                        <Link
                            href="/sales/invoices"
                            className="text-indigo-600 text-sm flex items-center gap-1 hover:underline"
                        >
                            {t("dashboard.view_all")} <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {(recentInvoices ?? []).length ? (
                            (recentInvoices ?? []).map((inv) => (
                                <div
                                    key={inv.id}
                                    className="flex items-center justify-between px-5 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">
                                            {inv.invoice_number}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {inv.customer?.name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold">
                                            {fmt(inv.total_amount)}
                                        </p>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[inv.status] ?? "bg-slate-100 text-slate-600"}`}
                                        >
                                            {inv.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-8 text-center text-slate-400 text-sm">
                                {t("dashboard.no_invoices_yet")}
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-800">
                            {t("dashboard.low_stock_alerts")}
                        </h3>
                        <Link
                            href="/inventory/products"
                            className="text-indigo-600 text-sm flex items-center gap-1 hover:underline"
                        >
                            {t("ui.Manage")} <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {(lowStockProducts ?? []).length ? (
                            (lowStockProducts ?? []).map((p) => (
                                <div
                                    key={p.id}
                                    className="flex items-center justify-between px-5 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">
                                            {p.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {p.code}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`text-sm font-semibold ${(p.total_stock ?? 0) <= 0 ? "text-red-600" : "text-amber-600"}`}
                                        >
                                            {p.total_stock ?? 0}{" "}
                                            {p.unit?.abbreviation}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {t("dashboard.reorder")}:{" "}
                                            {p.reorder_level}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-8 text-center text-emerald-600 text-sm">
                                {t("dashboard.all_stock_ok")} ✓
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Expense Statement ── */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    {/* Month filter */}
                    <div className="flex gap-2 mb-5">
                        <input
                            type="month"
                            value={expenseMonth}
                            onChange={(e) => setExpenseMonth(e.target.value)}
                            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            onClick={handleExpenseFilter}
                            className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            {t("ui.filter")}
                        </button>
                    </div>

                    {/* Chart title */}
                    <h3 className="text-sm font-semibold text-slate-700 text-center mb-3">
                        {t("dashboard.expense_statement")}
                    </h3>

                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-4">
                        {EXPENSE_KEYS.map(({ label }, i) => (
                            <span
                                key={label}
                                className="flex items-center gap-1.5 text-xs text-slate-600"
                            >
                                <span
                                    className="inline-block w-3 h-3 rounded-sm"
                                    style={{ background: EXPENSE_COLORS[i] }}
                                />
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* Donut chart */}
                    {hasPieData ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={130}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => {
                                        const colorIdx = EXPENSE_KEYS.findIndex(
                                            (k) => k.label === entry.name,
                                        );
                                        return (
                                            <Cell
                                                key={entry.name}
                                                fill={
                                                    EXPENSE_COLORS[
                                                        colorIdx >= 0
                                                            ? colorIdx
                                                            : index
                                                    ]
                                                }
                                            />
                                        );
                                    })}
                                </Pie>
                                <Tooltip
                                    formatter={(v, name) => [fmt(v), name]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[280px] text-slate-400 text-sm">
                            {t("dashboard.no_data_month")}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
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
}) {
    const chartData = (monthlyRevenue ?? []).map((r, i) => ({
        ...r,
        purchase: (monthlyPurchases ?? [])[i]?.total ?? 0,
    }));
    return (
        <AppLayout header="Dashboard">
            <Head title="Dashboard" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Revenue (This Month)"
                    value={fmt(stats?.totalRevenue)}
                    icon={DollarSign}
                    color="bg-indigo-500"
                    sub={`${fmtNum(stats?.totalInvoices)} invoices`}
                />
                <StatCard
                    label="Total Receivable"
                    value={fmt(stats?.totalReceivable)}
                    icon={TrendingUp}
                    color="bg-blue-500"
                    sub={`${stats?.overdueCount} overdue`}
                />
                <StatCard
                    label="Total Payable"
                    value={fmt(stats?.totalPayable)}
                    icon={TrendingDown}
                    color="bg-amber-500"
                />
                <StatCard
                    label="Customers"
                    value={fmtNum(stats?.totalCustomers)}
                    icon={Users}
                    color="bg-emerald-500"
                    sub={`${fmtNum(stats?.totalVendors)} vendors`}
                />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Products"
                    value={fmtNum(stats?.totalProducts)}
                    icon={Package}
                    color="bg-violet-500"
                    sub={`${stats?.lowStockCount ?? 0} low stock`}
                />
                <StatCard
                    label="Employees"
                    value={fmtNum(stats?.totalEmployees)}
                    icon={UserCheck}
                    color="bg-pink-500"
                />
                <StatCard
                    label="Overdue Invoices"
                    value={fmtNum(stats?.overdueCount)}
                    icon={AlertTriangle}
                    color="bg-red-500"
                />
                <StatCard
                    label="Active POs"
                    value={fmtNum(stats?.activePOs ?? 0)}
                    icon={ShoppingCart}
                    color="bg-orange-500"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="font-semibold text-slate-800 mb-4">
                        Revenue vs Purchase (6 Months)
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
                        Monthly Revenue (৳)
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
                                <CalendarClock size={16} className="text-rose-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-rose-800 text-sm">Today's Sale Due</h3>
                                <p className="text-xs text-rose-500">{(todaySaleDue ?? []).length} invoice(s) due today</p>
                            </div>
                        </div>
                        <Link href={route('sales.invoices.index')}
                            className="text-rose-600 text-xs flex items-center gap-1 hover:underline font-medium">
                            View all <ArrowRight size={13} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {(todaySaleDue ?? []).length ? (
                            (todaySaleDue ?? []).map(inv => (
                                <Link key={inv.id} href={route('sales.invoices.show', inv.id)}
                                    className="flex items-center justify-between px-5 py-3 hover:bg-rose-50/40 transition-colors">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{inv.invoice_number}</p>
                                        <p className="text-xs text-slate-500">{inv.customer?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-rose-600">
                                            {fmt(Number(inv.total_amount) - Number(inv.paid_amount ?? 0))}
                                        </p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[inv.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                            {inv.status}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="px-5 py-8 text-center text-emerald-600 text-sm">
                                No sale dues today ✓
                            </div>
                        )}
                    </div>
                    {(todaySaleDue ?? []).length > 0 && (
                        <div className="px-5 py-3 bg-rose-50 border-t border-rose-100 flex justify-between text-xs text-rose-700">
                            <span>Total Due Today</span>
                            <span className="font-bold">
                                {fmt((todaySaleDue ?? []).reduce((s, i) => s + Number(i.total_amount) - Number(i.paid_amount ?? 0), 0))}
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
                                <h3 className="font-semibold text-amber-800 text-sm">Today's Purchase Due</h3>
                                <p className="text-xs text-amber-500">{(todayPurchaseDue ?? []).length} PO(s) due today</p>
                            </div>
                        </div>
                        <Link href={route('purchase.purchase-orders.index')}
                            className="text-amber-600 text-xs flex items-center gap-1 hover:underline font-medium">
                            View all <ArrowRight size={13} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {(todayPurchaseDue ?? []).length ? (
                            (todayPurchaseDue ?? []).map(po => (
                                <Link key={po.id} href={route('purchase.purchase-orders.show', po.id)}
                                    className="flex items-center justify-between px-5 py-3 hover:bg-amber-50/40 transition-colors">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{po.po_number}</p>
                                        <p className="text-xs text-slate-500">{po.vendor?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-amber-600">
                                            {fmt(Number(po.total_amount) - Number(po.paid_amount ?? 0))}
                                        </p>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 capitalize">
                                            {po.status}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="px-5 py-8 text-center text-emerald-600 text-sm">
                                No purchase dues today ✓
                            </div>
                        )}
                    </div>
                    {(todayPurchaseDue ?? []).length > 0 && (
                        <div className="px-5 py-3 bg-amber-50 border-t border-amber-100 flex justify-between text-xs text-amber-700">
                            <span>Total Due Today</span>
                            <span className="font-bold">
                                {fmt((todayPurchaseDue ?? []).reduce((s, p) => s + Number(p.total_amount) - Number(p.paid_amount ?? 0), 0))}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-800">
                            Recent Invoices
                        </h3>
                        <Link
                            href="/sales/invoices"
                            className="text-indigo-600 text-sm flex items-center gap-1 hover:underline"
                        >
                            View all <ArrowRight size={14} />
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
                                No invoices yet
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-800">
                            Low Stock Alerts
                        </h3>
                        <Link
                            href="/inventory/products"
                            className="text-indigo-600 text-sm flex items-center gap-1 hover:underline"
                        >
                            Manage <ArrowRight size={14} />
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
                                            Reorder: {p.reorder_level}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-8 text-center text-emerald-600 text-sm">
                                All stock levels OK ✓
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import {
    DollarSign,
    TrendingUp,
    ShoppingCart,
    Users,
    Target,
    BarChart2,
    Package,
    Percent,
} from "lucide-react";

function KPICard({ label, value, sub, icon: Icon, color = "blue" }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div
                className={`w-10 h-10 rounded-lg bg-${color}-50 flex items-center justify-center mb-3`}
            >
                <Icon size={18} className={`text-${color}-600`} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm font-medium text-slate-600 mt-0.5">{label}</p>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
    );
}

function LineChart({ data, keyField, valueField, color = "blue", label }) {
    if (!data?.length)
        return <p className="text-slate-400 text-sm">No data.</p>;
    const vals = data.map((d) => d[valueField] ?? 0);
    const max = Math.max(...vals) || 1;
    const min = Math.min(...vals);
    const h = 100;
    const w = 100;
    const pts = data
        .map((d, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - ((d[valueField] - min) / (max - min || 1)) * h;
            return `${x},${y}`;
        })
        .join(" ");
    return (
        <div>
            <svg
                viewBox={`0 0 100 ${h}`}
                className="w-full"
                style={{ height: 100 }}
            >
                <polyline
                    points={pts}
                    fill="none"
                    stroke={`var(--tw-color-${color})`}
                    strokeWidth="2"
                    className={`stroke-${color}-500`}
                />
            </svg>
            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                <span>{data[0]?.[keyField]}</span>
                <span>{data[data.length - 1]?.[keyField]}</span>
            </div>
        </div>
    );
}

function BarRow({ label, value, max, color = "blue" }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="flex items-center gap-3 mb-2.5">
            <span className="text-xs text-slate-500 w-32 truncate">
                {label}
            </span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full">
                <div
                    className={`h-2 bg-${color}-500 rounded-full`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs font-medium text-slate-600 w-20 text-right">
                ${Number(value).toLocaleString()}
            </span>
        </div>
    );
}

export default function KPIAnalytics({ kpis, monthlyTrend, topProducts }) {
    const fmt = (n) => Number(n ?? 0).toLocaleString();

    return (
        <AppLayout>
            <Head title="KPI & Performance Analytics" />
            <div className="p-6 space-y-6">
                <PageHeader
                    title="Sales KPI & Performance Analytics"
                    subtitle="Data-driven decision making with real-time dashboards and variance analysis"
                />

                <div className="flex flex-wrap gap-2">
                    {[
                        "Real-time KPIs",
                        "Variance Analysis",
                        "Predictive Trends",
                        "Root Cause Analysis",
                    ].map((c) => (
                        <span
                            key={c}
                            className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700"
                        >
                            {c}
                        </span>
                    ))}
                </div>

                {/* Core KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <KPICard
                        label="Total Revenue"
                        value={`$${fmt(kpis?.totalRevenue)}`}
                        icon={DollarSign}
                        color="green"
                        sub="Paid invoices"
                    />
                    <KPICard
                        label="Avg Order Value"
                        value={`$${fmt(kpis?.avgOrderValue)}`}
                        icon={ShoppingCart}
                        color="blue"
                        sub="Per invoice"
                    />
                    <KPICard
                        label="Gross Margin"
                        value={`${kpis?.grossMargin ?? 0}%`}
                        icon={Percent}
                        color="purple"
                        sub="Revenue – Cost"
                    />
                    <KPICard
                        label="Conversion Rate"
                        value={`${kpis?.conversionRate ?? 0}%`}
                        icon={Target}
                        color="orange"
                        sub={`${kpis?.wonLeads} won of ${kpis?.totalCustomers} leads`}
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <KPICard
                        label="Total Invoices"
                        value={fmt(kpis?.totalInvoices)}
                        icon={BarChart2}
                        color="slate"
                    />
                    <KPICard
                        label="Total Customers"
                        value={fmt(kpis?.totalCustomers)}
                        icon={Users}
                        color="blue"
                    />
                    <KPICard
                        label="Revenue / Customer"
                        value={`$${fmt(kpis?.revenuePerCustomer)}`}
                        icon={TrendingUp}
                        color="green"
                    />
                    <KPICard
                        label="Won Leads"
                        value={fmt(kpis?.wonLeads)}
                        icon={Target}
                        color="purple"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Revenue Trend */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <TrendingUp size={16} className="text-green-500" />{" "}
                            Monthly Revenue & Profit Trend (12 mo)
                        </h3>
                        {monthlyTrend?.length ? (
                            <>
                                <div
                                    className="flex items-end gap-1"
                                    style={{ height: 120 }}
                                >
                                    {monthlyTrend.map((r, i) => {
                                        const max = Math.max(
                                            ...monthlyTrend.map(
                                                (x) => x.revenue,
                                            ),
                                        );
                                        const pct =
                                            max > 0
                                                ? (r.revenue / max) * 100
                                                : 0;
                                        return (
                                            <div
                                                key={i}
                                                className="flex-1 flex flex-col items-center gap-0.5"
                                            >
                                                <div
                                                    className="w-full bg-green-400 rounded-sm"
                                                    style={{
                                                        height: `${pct}%`,
                                                    }}
                                                    title={`${r.month}: $${r.revenue}`}
                                                />
                                                <span className="text-[8px] text-slate-400 truncate w-full text-center">
                                                    {r.month.split(" ")[0]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <p className="text-slate-400 text-sm">
                                No trend data available.
                            </p>
                        )}
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <Package size={16} className="text-blue-500" /> Top
                            Products by Revenue
                        </h3>
                        {topProducts?.length ? (
                            <>
                                {topProducts.map((p, i) => (
                                    <BarRow
                                        key={i}
                                        label={p.product}
                                        value={p.revenue}
                                        max={topProducts[0]?.revenue ?? 1}
                                        color="blue"
                                    />
                                ))}
                            </>
                        ) : (
                            <p className="text-slate-400 text-sm">
                                No product data available.
                            </p>
                        )}
                    </div>
                </div>

                {/* KPI Summary Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-700">
                            KPI Summary Table
                        </h3>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left px-4 py-2 text-slate-500 font-medium text-xs">
                                    KPI
                                </th>
                                <th className="text-right px-4 py-2 text-slate-500 font-medium text-xs">
                                    Value
                                </th>
                                <th className="text-right px-4 py-2 text-slate-500 font-medium text-xs">
                                    Target
                                </th>
                                <th className="text-right px-4 py-2 text-slate-500 font-medium text-xs">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                {
                                    kpi: "Gross Margin",
                                    val: `${kpis?.grossMargin}%`,
                                    target: "≥ 30%",
                                    ok: (kpis?.grossMargin ?? 0) >= 30,
                                },
                                {
                                    kpi: "Conversion Rate",
                                    val: `${kpis?.conversionRate}%`,
                                    target: "≥ 25%",
                                    ok: (kpis?.conversionRate ?? 0) >= 25,
                                },
                                {
                                    kpi: "Avg Order Value",
                                    val: `$${fmt(kpis?.avgOrderValue)}`,
                                    target: "Monitor",
                                    ok: true,
                                },
                                {
                                    kpi: "Revenue / Customer",
                                    val: `$${fmt(kpis?.revenuePerCustomer)}`,
                                    target: "Monitor",
                                    ok: true,
                                },
                            ].map((r, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-4 py-2.5 font-medium text-slate-700">
                                        {r.kpi}
                                    </td>
                                    <td className="px-4 py-2.5 text-right text-slate-600">
                                        {r.val}
                                    </td>
                                    <td className="px-4 py-2.5 text-right text-slate-400 text-xs">
                                        {r.target}
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
                                        >
                                            {r.ok
                                                ? "✓ On Track"
                                                : "✗ Below Target"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import {
    TrendingUp,
    Users,
    ShoppingCart,
    DollarSign,
    Brain,
    AlertTriangle,
} from "lucide-react";

const kpiIcons = {
    revenue: DollarSign,
    orders: ShoppingCart,
    customers: Users,
    growth: TrendingUp,
};

function KPICard({ label, value, change, icon: Icon, color }) {
    const isPositive = parseFloat(change) >= 0;
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <div
                    className={`w-10 h-10 rounded-lg bg-${color}-50 flex items-center justify-center`}
                >
                    <Icon size={18} className={`text-${color}-600`} />
                </div>
                <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}
                >
                    {isPositive ? "↑" : "↓"}{" "}
                    {Math.abs(parseFloat(change) || 0).toFixed(1)}%
                </span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
        </div>
    );
}

function SimpleBarChart({ data, label, height = 120, color = "blue" }) {
    if (!data?.length)
        return (
            <div className="h-24 flex items-center justify-center text-slate-300 text-sm">
                No data
            </div>
        );
    const max = Math.max(...data.map((d) => d.value || 0)) || 1;
    return (
        <div className="flex items-end gap-1" style={{ height }}>
            {data.map((d, i) => (
                <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-0.5"
                >
                    <div
                        className={`w-full bg-${color}-500 rounded-sm`}
                        style={{ height: `${(d.value / max) * 100}%` }}
                        title={`${d.label}: ${d.value}`}
                    />
                    <span className="text-[9px] text-slate-400 truncate w-full text-center">
                        {d.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function SalesDashboard({
    kpis,
    revenueChart,
    forecastChart,
    topProducts,
    topCustomers,
    leadFunnel,
    sentimentSummary,
    channelPerformance,
    churnRisk,
}) {
    const fmt = (n) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(n || 0);

    const funnelStages = [
        { key: "new", label: "New", color: "blue" },
        { key: "contacted", label: "Contacted", color: "indigo" },
        { key: "qualified", label: "Qualified", color: "purple" },
        { key: "proposal", label: "Proposal", color: "yellow" },
        { key: "negotiation", label: "Negotiation", color: "orange" },
        { key: "won", label: "Won", color: "green" },
        { key: "lost", label: "Lost", color: "red" },
    ];
    const funnelMax =
        Math.max(...funnelStages.map((s) => leadFunnel?.[s.key] || 0)) || 1;

    return (
        <AppLayout title="Sales Analytics">
            <Head title="Sales Analytics" />
            <PageHeader
                title="Sales Analytics"
                subtitle="AI-powered insights and revenue forecasting"
                actions={
                    <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-lg border border-indigo-200">
                        <Brain size={13} /> AI Forecasting Active
                    </div>
                }
            />

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <KPICard
                    label="Total Revenue (30d)"
                    value={fmt(kpis?.revenue)}
                    change={kpis?.revenue_change || 0}
                    icon={DollarSign}
                    color="blue"
                />
                <KPICard
                    label="Total Orders"
                    value={kpis?.orders || 0}
                    change={kpis?.orders_change || 0}
                    icon={ShoppingCart}
                    color="green"
                />
                <KPICard
                    label="Active Customers"
                    value={kpis?.customers || 0}
                    change={kpis?.customers_change || 0}
                    icon={Users}
                    color="purple"
                />
                <KPICard
                    label="Avg Order Value"
                    value={fmt(kpis?.avg_order_value)}
                    change={kpis?.aov_change || 0}
                    icon={TrendingUp}
                    color="amber"
                />
            </div>

            {/* Revenue + Forecast */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">
                        Monthly Revenue (12 months)
                    </h3>
                    <SimpleBarChart
                        data={revenueChart?.map((r) => ({
                            label: r.month?.slice(0, 7) || r.label,
                            value: parseFloat(r.revenue || 0),
                        }))}
                        color="blue"
                        height={140}
                    />
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-700">
                            AI Revenue Forecast (6 months)
                        </h3>
                        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            Moving Average
                        </span>
                    </div>
                    <SimpleBarChart
                        data={forecastChart?.map((f) => ({
                            label: f.period?.slice(0, 7) || f.label,
                            value: parseFloat(f.predicted_revenue || 0),
                        }))}
                        color="indigo"
                        height={140}
                    />
                </div>
            </div>

            {/* Top Products, Top Customers, Lead Funnel */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Top Products */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">
                        Top Products
                    </h3>
                    {topProducts?.length ? (
                        topProducts.slice(0, 5).map((p, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 w-4">
                                        {i + 1}.
                                    </span>
                                    <span className="text-sm text-slate-700 truncate max-w-[120px]">
                                        {p.name}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-slate-700">
                                    {fmt(p.revenue)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-300 text-sm">No data</p>
                    )}
                </div>

                {/* Top Customers */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">
                        Top Customers
                    </h3>
                    {topCustomers?.length ? (
                        topCustomers.slice(0, 5).map((c, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 w-4">
                                        {i + 1}.
                                    </span>
                                    <span className="text-sm text-slate-700 truncate max-w-[120px]">
                                        {c.name}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-slate-700">
                                    {fmt(c.revenue)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-300 text-sm">No data</p>
                    )}
                </div>

                {/* Lead Funnel */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">
                        Lead Funnel
                    </h3>
                    <div className="space-y-1.5">
                        {funnelStages.map((s) => (
                            <div key={s.key}>
                                <div className="flex justify-between text-xs mb-0.5">
                                    <span className="text-slate-500">
                                        {s.label}
                                    </span>
                                    <span className="font-medium text-slate-700">
                                        {leadFunnel?.[s.key] || 0}
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-${s.color}-500 rounded-full`}
                                        style={{
                                            width: `${((leadFunnel?.[s.key] || 0) / funnelMax) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sentiment + Channel + Churn */}
            <div className="grid grid-cols-3 gap-4">
                {/* Sentiment */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">
                        Customer Sentiment
                    </h3>
                    {sentimentSummary ? (
                        <div className="space-y-2">
                            {[
                                {
                                    label: "Positive",
                                    value: sentimentSummary.positive || 0,
                                    color: "green",
                                },
                                {
                                    label: "Neutral",
                                    value: sentimentSummary.neutral || 0,
                                    color: "slate",
                                },
                                {
                                    label: "Negative",
                                    value: sentimentSummary.negative || 0,
                                    color: "red",
                                },
                            ].map((s) => {
                                const total =
                                    (sentimentSummary.positive || 0) +
                                        (sentimentSummary.neutral || 0) +
                                        (sentimentSummary.negative || 0) || 1;
                                return (
                                    <div key={s.label}>
                                        <div className="flex justify-between text-xs mb-0.5">
                                            <span
                                                className={`text-${s.color}-600`}
                                            >
                                                {s.label}
                                            </span>
                                            <span className="text-slate-500">
                                                {s.value} (
                                                {Math.round(
                                                    (s.value / total) * 100,
                                                )}
                                                %)
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-${s.color}-400 rounded-full`}
                                                style={{
                                                    width: `${(s.value / total) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            <p className="text-xs text-slate-400 pt-1">
                                Avg rating:{" "}
                                {Number(
                                    sentimentSummary.avg_rating || 0,
                                ).toFixed(1)}{" "}
                                ★
                            </p>
                        </div>
                    ) : (
                        <p className="text-slate-300 text-sm">
                            No feedback data
                        </p>
                    )}
                </div>

                {/* Channel Performance */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">
                        Channel Performance
                    </h3>
                    {channelPerformance?.length ? (
                        channelPerformance.slice(0, 5).map((c, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                            >
                                <span className="text-sm text-slate-600">
                                    {c.channel}
                                </span>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-slate-700">
                                        {fmt(c.revenue)}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {c.count} orders
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-300 text-sm">
                            No channel data
                        </p>
                    )}
                </div>

                {/* Churn Risk */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={14} className="text-amber-500" />
                        <h3 className="text-sm font-semibold text-slate-700">
                            Churn Risk Customers
                        </h3>
                    </div>
                    {churnRisk?.length ? (
                        churnRisk.slice(0, 5).map((c, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                            >
                                <span className="text-sm text-slate-600 truncate max-w-[120px]">
                                    {c.name}
                                </span>
                                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                    {c.days_since_order}d ago
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-300 text-sm">
                            No at-risk customers
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import {
    Clock,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    BarChart2,
    Activity,
    Zap,
    Shield,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

function StatCard({ label, value, sub, icon: Icon, color = "blue" }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
                <div
                    className={`w-10 h-10 rounded-lg bg-${color}-50 flex items-center justify-center`}
                >
                    <Icon size={18} className={`text-${color}-600`} />
                </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm font-medium text-slate-600 mt-0.5">{label}</p>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
    );
}

function HBar({ label, value, max, color = "blue" }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="mb-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{label}</span>
                <span className="font-medium">{value}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full">
                <div
                    className={`h-2 bg-${color}-500 rounded-full`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

function Badge({ label, type = "info" }) {
    const map = {
        info: "bg-blue-50 text-blue-700",
        success: "bg-green-50 text-green-700",
        warning: "bg-yellow-50 text-yellow-700",
        danger: "bg-red-50 text-red-700",
    };
    return (
        <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[type]}`}
        >
            {label}
        </span>
    );
}

export default function ProcessOptimization({
    cycleData,
    cycleTrend,
    statusDist,
    slaBreaches,
    slaCompliance,
    totalOpen,
    quoteConversion,
    totalQuotes,
}) {
    const { t } = useTranslation();
    return (
        <AppLayout>
            <Head title={t("Process Optimization")} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={t("Sales Process Optimization Engine")}
                    subtitle={t("Reduce cycle time and eliminate bottlenecks using Time Study & Lean principles")}
                />

                {/* IE Concept Badges */}
                <div className="flex flex-wrap gap-2">
                    {[
                        "Time Study",
                        "Process Mapping",
                        "Lean Principles",
                        "SLA Monitoring",
                    ].map((c) => (
                        <Badge key={c} label={c} type="info" />
                    ))}
                </div>

                {/* KPI Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        label="Avg Cycle Time"
                        value={`${cycleData?.avg_days ?? 0} days`}
                        sub="Quote → Invoice → Paid"
                        icon={Clock}
                        color="blue"
                    />
                    <StatCard
                        label="Min Cycle Time"
                        value={`${cycleData?.min_days ?? 0} days`}
                        sub="Best case"
                        icon={Zap}
                        color="green"
                    />
                    <StatCard
                        label="SLA Compliance"
                        value={`${slaCompliance}%`}
                        sub={`${slaBreaches} breaches of ${totalOpen} open`}
                        icon={Shield}
                        color={slaCompliance >= 80 ? "green" : "red"}
                    />
                    <StatCard
                        label="Quote Conversion"
                        value={`${quoteConversion}%`}
                        sub={`${totalQuotes} total quotes`}
                        icon={TrendingUp}
                        color="purple"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Cycle Time Trend */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <Activity size={16} className="text-blue-500" />{" "}
                            Order Cycle Time Trend (6 Months)
                        </h3>
                        {cycleTrend?.length ? (
                            <div className="space-y-1">
                                {cycleTrend.map((r, i) => (
                                    <HBar
                                        key={i}
                                        label={r.month}
                                        value={`${r.avg_days} days`}
                                        max={Math.max(
                                            ...cycleTrend.map(
                                                (x) => x.avg_days,
                                            ),
                                        )}
                                        color="blue"
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm">
                                {t("No cycle time data available yet.")}
                            </p>
                        )}
                    </div>

                    {/* Process Stage Distribution */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <BarChart2 size={16} className="text-purple-500" />{" "}
                            Process Stage Distribution
                        </h3>
                        {statusDist?.length ? (
                            <div className="space-y-1">
                                {statusDist.map((s, i) => {
                                    const total = statusDist.reduce(
                                        (a, b) => a + b.count,
                                        0,
                                    );
                                    const colors = {
                                        paid: "green",
                                        sent: "blue",
                                        partial: "yellow",
                                        draft: "slate",
                                        cancelled: "red",
                                    };
                                    return (
                                        <HBar
                                            key={i}
                                            label={
                                                s.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                s.status.slice(1)
                                            }
                                            value={s.count}
                                            max={total}
                                            color={colors[s.status] ?? "blue"}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm">
                                {t("No data available.")}
                            </p>
                        )}
                    </div>
                </div>

                {/* SLA & Bottleneck Panel */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-yellow-500" />{" "}
                        Bottleneck Detection & SLA Monitoring
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-red-600">
                                {slaBreaches}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                {t("SLA Breaches (Overdue Invoices)")}
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 text-center">
                            <p
                                className={`text-3xl font-bold ${slaCompliance >= 80 ? "text-green-600" : "text-orange-600"}`}
                            >
                                {slaCompliance}%
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                {t("SLA Compliance Rate")}
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-blue-600">
                                {cycleData?.max_days ?? 0}d
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                {t("Max Cycle Time (Bottleneck)")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Process Flow */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />{" "}
                        Process Flow Visualization
                    </h3>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        {[
                            "Quote",
                            "→",
                            "Order",
                            "→",
                            "Delivery",
                            "→",
                            "Invoice",
                            "→",
                            "Payment",
                        ].map((step, i) =>
                            step === "→" ? (
                                <span
                                    key={i}
                                    className="text-slate-400 font-bold text-lg"
                                >
                                    →
                                </span>
                            ) : (
                                <div
                                    key={i}
                                    className="flex-1 min-w-[80px] bg-blue-50 border border-blue-200 rounded-lg p-3 text-center"
                                >
                                    <p className="text-xs font-semibold text-blue-700">
                                        {step}
                                    </p>
                                </div>
                            ),
                        )}
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                        Avg total cycle:{" "}
                        <strong>{cycleData?.avg_days ?? "N/A"} days</strong> ·
                        Optimum target: <strong>≤ 7 days</strong>
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

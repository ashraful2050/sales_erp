import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import {
    TrendingUp,
    TrendingDown,
    BarChart2,
    Target,
    Award,
    RefreshCw,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

function ImprovementCard({ label, current, previous, isGood }) {
    const change =
        previous > 0
            ? (((current - previous) / previous) * 100).toFixed(1)
            : current > 0
              ? 100
              : 0;
    const isPositive = parseFloat(change) >= 0;
    const isGoodChange = isGood ? isPositive : !isPositive;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
                <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${isGoodChange ? "bg-green-50" : "bg-red-50"}`}
                >
                    {isGoodChange ? (
                        <TrendingUp size={18} className="text-green-600" />
                    ) : (
                        <TrendingDown size={18} className="text-red-500" />
                    )}
                </div>
                <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${isGoodChange ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
                >
                    {isPositive ? "↑" : "↓"} {Math.abs(parseFloat(change))}%
                </span>
            </div>
            <p className="text-2xl font-bold text-slate-800">
                {typeof current === "number" && current > 1000
                    ? `$${Number(current).toLocaleString()}`
                    : current}
            </p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            <p className="text-xs text-slate-400 mt-1">
                Prev:{" "}
                {typeof previous === "number" && previous > 1000
                    ? `$${Number(previous).toLocaleString()}`
                    : previous}
            </p>
        </div>
    );
}

export default function ContinuousImprovement({
    monthlyOrders,
    convTrend,
    improvement,
}) {
    const { t } = useTranslation();
    const maxOrders = monthlyOrders?.length
        ? Math.max(...monthlyOrders.map((r) => r.orders))
        : 1;
    const maxRev = monthlyOrders?.length
        ? Math.max(...monthlyOrders.map((r) => r.revenue))
        : 1;
    const maxConv = convTrend?.length
        ? Math.max(...convTrend.map((r) => r.rate))
        : 1;

    return (
        <AppLayout>
            <Head title={t("Continuous Improvement")} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={t("Continuous Improvement Module")}
                    subtitle={t("Kaizen-based improvement tracking with A/B analysis and monthly efficiency reports")}
                />

                <div className="flex flex-wrap gap-2">
                    {[
                        "Kaizen",
                        "Monthly Reports",
                        "A/B Testing",
                        "Performance Tracking",
                        "PDCA Cycle",
                    ].map((c) => (
                        <span
                            key={c}
                            className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700"
                        >
                            {c}
                        </span>
                    ))}
                </div>

                {/* Month-over-Month Improvement */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ImprovementCard
                        label="Orders This Month"
                        current={improvement?.currentOrders ?? 0}
                        previous={improvement?.prevOrders ?? 0}
                        isGood={true}
                    />
                    <ImprovementCard
                        label="Revenue This Month"
                        current={improvement?.currentRevenue ?? 0}
                        previous={improvement?.prevRevenue ?? 0}
                        isGood={true}
                    />
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                            <BarChart2 size={18} className="text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-slate-800">
                            {monthlyOrders?.length ?? 0}
                        </p>
                        <p className="text-sm text-slate-500">{t("Months Tracked")}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
                            <Target size={18} className="text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-slate-800">
                            {convTrend?.length
                                ? (convTrend[convTrend.length - 1]?.rate ?? 0)
                                : 0}
                            %
                        </p>
                        <p className="text-sm text-slate-500">
                            {t("Latest Conversion Rate")}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Orders & Revenue */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <BarChart2 size={16} className="text-blue-500" />{" "}
                            Monthly Order Volume (12 Months)
                        </h3>
                        {monthlyOrders?.length ? (
                            <>
                                <div
                                    className="flex items-end gap-1"
                                    style={{ height: 100 }}
                                >
                                    {monthlyOrders.map((r, i) => {
                                        const pct =
                                            maxOrders > 0
                                                ? (r.orders / maxOrders) * 100
                                                : 0;
                                        const isLast =
                                            i === monthlyOrders.length - 1;
                                        return (
                                            <div
                                                key={i}
                                                className="flex-1 flex flex-col items-center gap-0.5"
                                            >
                                                <div
                                                    className={`w-full rounded-sm ${isLast ? "bg-green-500" : "bg-blue-400"}`}
                                                    style={{
                                                        height: `${pct}%`,
                                                    }}
                                                    title={`${r.month}: ${r.orders} orders`}
                                                />
                                                <span className="text-[8px] text-slate-400 truncate">
                                                    {r.month?.split(" ")[0]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-3 overflow-x-auto">
                                    <table className="w-full text-xs text-slate-500">
                                        <thead>
                                            <tr className="border-b border-slate-100">
                                                <th className="text-left py-1 pr-3">
                                                    {t("Month")}
                                                </th>
                                                <th className="text-right py-1 pr-3">
                                                    {t("Orders")}
                                                </th>
                                                <th className="text-right py-1 pr-3">
                                                    {t("Revenue")}
                                                </th>
                                                <th className="text-right py-1">
                                                    {t("Avg Order")}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...monthlyOrders]
                                                .reverse()
                                                .slice(0, 6)
                                                .map((r, i) => (
                                                    <tr
                                                        key={i}
                                                        className="border-b border-slate-50"
                                                    >
                                                        <td className="py-1 pr-3">
                                                            {r.month}
                                                        </td>
                                                        <td className="py-1 pr-3 text-right font-medium text-slate-700">
                                                            {r.orders}
                                                        </td>
                                                        <td className="py-1 pr-3 text-right">
                                                            $
                                                            {Number(
                                                                r.revenue,
                                                            ).toLocaleString()}
                                                        </td>
                                                        <td className="py-1 text-right">
                                                            $
                                                            {Number(
                                                                r.avg_order,
                                                            ).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <p className="text-slate-400 text-sm">
                                {t("No order history available.")}
                            </p>
                        )}
                    </div>

                    {/* Conversion Rate Trend */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <Target size={16} className="text-purple-500" />{" "}
                            Lead Conversion Rate Trend
                        </h3>
                        {convTrend?.length ? (
                            <>
                                <div
                                    className="flex items-end gap-1"
                                    style={{ height: 100 }}
                                >
                                    {convTrend.map((r, i) => {
                                        const pct =
                                            maxConv > 0
                                                ? (r.rate / maxConv) * 100
                                                : 0;
                                        return (
                                            <div
                                                key={i}
                                                className="flex-1 flex flex-col items-center gap-0.5"
                                            >
                                                <div
                                                    className="w-full bg-purple-400 rounded-sm"
                                                    style={{
                                                        height: `${pct}%`,
                                                    }}
                                                    title={`${r.month}: ${r.rate}%`}
                                                />
                                                <span className="text-[8px] text-slate-400 truncate">
                                                    {r.month?.split(" ")[0]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-3">
                                    <table className="w-full text-xs text-slate-500">
                                        <thead>
                                            <tr className="border-b border-slate-100">
                                                <th className="text-left py-1 pr-3">
                                                    {t("Month")}
                                                </th>
                                                <th className="text-right py-1 pr-3">
                                                    {t("Total Leads")}
                                                </th>
                                                <th className="text-right py-1 pr-3">
                                                    {t("Won")}
                                                </th>
                                                <th className="text-right py-1">
                                                    {t("Rate")}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...convTrend]
                                                .reverse()
                                                .slice(0, 6)
                                                .map((r, i) => (
                                                    <tr
                                                        key={i}
                                                        className="border-b border-slate-50"
                                                    >
                                                        <td className="py-1 pr-3">
                                                            {r.month}
                                                        </td>
                                                        <td className="py-1 pr-3 text-right">
                                                            {r.total}
                                                        </td>
                                                        <td className="py-1 pr-3 text-right">
                                                            {r.won}
                                                        </td>
                                                        <td className="py-1 text-right font-medium text-purple-600">
                                                            {r.rate}%
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <p className="text-slate-400 text-sm">
                                {t("No conversion trend data.")}
                            </p>
                        )}
                    </div>
                </div>

                {/* Kaizen Principles Panel */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <RefreshCw size={16} className="text-emerald-500" />{" "}
                        PDCA / Kaizen Improvement Cycle
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            {
                                phase: "Plan",
                                desc: "Identify improvement areas using KPIs & waste dashboard. Set targets.",
                                color: "blue",
                                icon: Target,
                            },
                            {
                                phase: "Do",
                                desc: "Implement changes: adjust team, pricing, or conversion strategies.",
                                color: "green",
                                icon: TrendingUp,
                            },
                            {
                                phase: "Check",
                                desc: "Monitor results on this page — track orders, revenue, conversion.",
                                color: "yellow",
                                icon: BarChart2,
                            },
                            {
                                phase: "Act",
                                desc: "Standardize what works. Escalate improvements. Repeat monthly.",
                                color: "purple",
                                icon: Award,
                            },
                        ].map((p, i) => (
                            <div
                                key={i}
                                className={`bg-${p.color}-50 border border-${p.color}-200 rounded-xl p-4`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-lg bg-${p.color}-100 flex items-center justify-center mb-2`}
                                >
                                    <p.icon
                                        size={16}
                                        className={`text-${p.color}-600`}
                                    />
                                </div>
                                <p
                                    className={`text-sm font-bold text-${p.color}-700 mb-1`}
                                >
                                    {p.phase}
                                </p>
                                <p className={`text-xs text-${p.color}-600`}>
                                    {p.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

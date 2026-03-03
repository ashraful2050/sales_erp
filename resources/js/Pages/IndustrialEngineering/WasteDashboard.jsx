import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import {
    AlertTriangle,
    Clock,
    RefreshCw,
    XCircle,
    Pause,
    RotateCcw,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

function WasteCard({ type, value, unit, description, icon: Icon, level }) {
    const colors = {
        low: {
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-700",
            val: "text-green-600",
        },
        medium: {
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            text: "text-yellow-700",
            val: "text-yellow-600",
        },
        high: {
            bg: "bg-red-50",
            border: "border-red-200",
            text: "text-red-700",
            val: "text-red-600",
        },
    };
    const c = colors[level] ?? colors.low;
    return (
        <div className={`rounded-xl border p-5 ${c.bg} ${c.border}`}>
            <div className="flex items-start justify-between mb-3">
                <Icon size={20} className={c.val} />
                <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}
                >
                    {level === "high"
                        ? "High Waste"
                        : level === "medium"
                          ? "Moderate"
                          : "Low Waste"}
                </span>
            </div>
            <p className={`text-3xl font-bold ${c.val}`}>
                {value}
                <span className="text-sm font-normal ml-1">{unit}</span>
            </p>
            <p className={`text-sm font-medium ${c.text} mt-1`}>{type}</p>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>
    );
}

export default function WasteDashboard({ wastes, wasteTrend, lostTrend }) {
    const { t } = useTranslation();
    const maxWaste = wasteTrend?.length
        ? Math.max(...wasteTrend.map((r) => r.rework))
        : 1;
    const maxLost = lostTrend?.length
        ? Math.max(...lostTrend.map((r) => r.count))
        : 1;

    const getWasteLevel = (val, thresholds) => {
        if (val >= thresholds.high) return "high";
        if (val >= thresholds.medium) return "medium";
        return "low";
    };

    return (
        <AppLayout>
            <Head title={t("Waste Dashboard (Lean)")} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={t("Waste Identification Dashboard (Lean Sales)")}
                    subtitle={t("Identify inefficiencies in the sales process using the 7 Lean Wastes")}
                />

                <div className="flex flex-wrap gap-2">
                    {[
                        "Waiting",
                        "Rework / Errors",
                        "Overprocessing",
                        "Lost Opportunities",
                        "Underutilized Talent",
                    ].map((c) => (
                        <span
                            key={c}
                            className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700"
                        >
                            {c}
                        </span>
                    ))}
                </div>

                {/* 7 Wastes Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <WasteCard
                        type="Waiting (Approval Stages)"
                        value={wastes?.waiting ?? 0}
                        unit="days avg"
                        description="Avg days invoices sit unpaid in 'sent' status"
                        icon={Clock}
                        level={getWasteLevel(wastes?.waiting ?? 0, {
                            medium: 7,
                            high: 14,
                        })}
                    />
                    <WasteCard
                        type="Rework (Order Errors)"
                        value={wastes?.rework ?? 0}
                        unit="credit notes"
                        description="Credit notes issued due to incorrect orders"
                        icon={RefreshCw}
                        level={getWasteLevel(wastes?.rework ?? 0, {
                            medium: 3,
                            high: 10,
                        })}
                    />
                    <WasteCard
                        type="Lost Opportunities"
                        value={wastes?.lostLeads ?? 0}
                        unit={`leads (${wastes?.lostRate ?? 0}%)`}
                        description="Leads that were lost — revenue left on table"
                        icon={XCircle}
                        level={getWasteLevel(wastes?.lostRate ?? 0, {
                            medium: 20,
                            high: 40,
                        })}
                    />
                    <WasteCard
                        type="Idle Sales Capacity"
                        value={wastes?.overdueInvoices ?? 0}
                        unit="overdue invoices"
                        description="Open invoices where payment is overdue"
                        icon={Pause}
                        level={getWasteLevel(wastes?.overdueInvoices ?? 0, {
                            medium: 5,
                            high: 15,
                        })}
                    />
                    <WasteCard
                        type="Overprocessing (Unconverted Quotes)"
                        value={wastes?.unconvertedQuotes ?? 0}
                        unit="stale quotes (>30d)"
                        description="Quotations older than 30 days without conversion"
                        icon={RotateCcw}
                        level={getWasteLevel(wastes?.unconvertedQuotes ?? 0, {
                            medium: 5,
                            high: 15,
                        })}
                    />
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">
                            Lean Waste Score
                        </h4>
                        {(() => {
                            const scores = [
                                getWasteLevel(wastes?.waiting ?? 0, {
                                    medium: 7,
                                    high: 14,
                                }),
                                getWasteLevel(wastes?.rework ?? 0, {
                                    medium: 3,
                                    high: 10,
                                }),
                                getWasteLevel(wastes?.lostRate ?? 0, {
                                    medium: 20,
                                    high: 40,
                                }),
                                getWasteLevel(wastes?.overdueInvoices ?? 0, {
                                    medium: 5,
                                    high: 15,
                                }),
                                getWasteLevel(wastes?.unconvertedQuotes ?? 0, {
                                    medium: 5,
                                    high: 15,
                                }),
                            ];
                            const highCount = scores.filter(
                                (s) => s === "high",
                            ).length;
                            const score =
                                highCount === 0
                                    ? "Excellent"
                                    : highCount <= 1
                                      ? "Good"
                                      : highCount <= 3
                                        ? "Needs Improvement"
                                        : "Critical";
                            const scoreColor =
                                highCount === 0
                                    ? "text-green-600"
                                    : highCount <= 1
                                      ? "text-blue-600"
                                      : highCount <= 3
                                        ? "text-yellow-600"
                                        : "text-red-600";
                            return (
                                <p
                                    className={`text-3xl font-bold ${scoreColor}`}
                                >
                                    {score}
                                </p>
                            );
                        })()}
                        <p className="text-xs text-slate-400 mt-2">
                            Based on 5 lean waste categories
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Rework Trend */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <RefreshCw size={16} className="text-red-500" />{" "}
                            Rework Trend (Credit Notes per Month)
                        </h3>
                        {wasteTrend?.length ? (
                            <div
                                className="flex items-end gap-2 mt-2"
                                style={{ height: 100 }}
                            >
                                {wasteTrend.map((r, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 flex flex-col items-center gap-0.5"
                                    >
                                        <div
                                            className="w-full bg-red-400 rounded-sm"
                                            style={{
                                                height: `${maxWaste > 0 ? (r.rework / maxWaste) * 100 : 0}%`,
                                            }}
                                            title={`${r.month}: ${r.rework}`}
                                        />
                                        <span className="text-[9px] text-slate-400">
                                            {r.month?.split(" ")[0]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm">
                                No rework data available. ✅ Great news!
                            </p>
                        )}
                    </div>

                    {/* Lost Leads Trend */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <XCircle size={16} className="text-orange-500" />{" "}
                            Lost Opportunities Trend (per Month)
                        </h3>
                        {lostTrend?.length ? (
                            <div
                                className="flex items-end gap-2 mt-2"
                                style={{ height: 100 }}
                            >
                                {lostTrend.map((r, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 flex flex-col items-center gap-0.5"
                                    >
                                        <div
                                            className="w-full bg-orange-400 rounded-sm"
                                            style={{
                                                height: `${maxLost > 0 ? (r.count / maxLost) * 100 : 0}%`,
                                            }}
                                            title={`${r.month}: ${r.count}`}
                                        />
                                        <span className="text-[9px] text-slate-400">
                                            {r.month?.split(" ")[0]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm">
                                {t("No lost lead data available.")}
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                        ♻️ Lean Principles Applied
                    </h4>
                    <p className="text-sm text-yellow-700">
                        Use this dashboard to identify and eliminate the 7
                        wastes:{" "}
                        <strong>
                            Waiting, Overproduction, Overprocessing, Errors,
                            Excess Inventory, Motion, and Underutilized Talent
                        </strong>
                        . Target is zero credit notes, zero overdue invoices,
                        and &lt;10% lost lead rate.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import {
    Settings,
    Tag,
    FileText,
    CheckCircle,
    AlertTriangle,
    Zap,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

function StatCard({ label, value, sub, icon: Icon, color = "blue" }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div
                className={`w-10 h-10 rounded-lg bg-${color}-50 flex items-center justify-center mb-3`}
            >
                <Icon size={18} className={`text-${color}-600`} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
    );
}

export default function Standardization({
    pricingRules,
    discountRules,
    workflowStats,
}) {
    const { t } = useTranslation();
    const autoRate =
        (workflowStats?.autoInvoices ?? 0) +
            (workflowStats?.manualInvoices ?? 0) >
        0
            ? Math.round(
                  (workflowStats.autoInvoices /
                      (workflowStats.autoInvoices +
                          workflowStats.manualInvoices)) *
                      100,
              )
            : 0;

    return (
        <AppLayout>
            <Head title={t("Standardization & Automation")} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={t("Standardization & Automation Tools")}
                    subtitle={t("Reduce human error and variability using SOPs, Process Control & Automation Engineering")}
                />

                <div className="flex flex-wrap gap-2">
                    {[
                        "Standard Operating Procedures",
                        "Process Control",
                        "Automation Engineering",
                        "Error Reduction",
                    ].map((c) => (
                        <span
                            key={c}
                            className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700"
                        >
                            {c}
                        </span>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        label="Pricing Rules"
                        value={workflowStats?.pricingRules ?? 0}
                        sub="Active automation rules"
                        icon={Tag}
                        color="blue"
                    />
                    <StatCard
                        label="Discount Rules"
                        value={workflowStats?.discountRules ?? 0}
                        sub="Rule-based discounts"
                        icon={Tag}
                        color="purple"
                    />
                    <StatCard
                        label="Auto-Invoice Rate"
                        value={`${autoRate}%`}
                        sub={`${workflowStats?.autoInvoices ?? 0} auto vs ${workflowStats?.manualInvoices ?? 0} manual`}
                        icon={Zap}
                        color={autoRate >= 60 ? "green" : "orange"}
                    />
                    <StatCard
                        label="Error Rate"
                        value={`${workflowStats?.errorRate ?? 0}%`}
                        sub={`${workflowStats?.creditNotes ?? 0} credit notes issued`}
                        icon={AlertTriangle}
                        color={
                            (workflowStats?.errorRate ?? 0) <= 5
                                ? "green"
                                : "red"
                        }
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pricing Rules Breakdown */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <Tag size={16} className="text-blue-500" /> Pricing
                            Rules by Type
                        </h3>
                        {pricingRules?.length ? (
                            <div className="space-y-3">
                                {pricingRules.map((r, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between bg-slate-50 rounded-lg p-3"
                                    >
                                        <span className="text-sm font-medium text-slate-700 capitalize">
                                            {r.type ?? "Standard"}
                                        </span>
                                        <span className="text-sm font-bold text-blue-600">
                                            {r.count} rules
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <Tag
                                    size={24}
                                    className="text-slate-300 mx-auto mb-2"
                                />
                                <p className="text-slate-400 text-sm">
                                    {t("No pricing rules configured.")}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Add pricing rules in Sales → Pricing Rules
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Discount Rules */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <Tag size={16} className="text-purple-500" />{" "}
                            Discount Rules by Type
                        </h3>
                        {discountRules?.length ? (
                            <div className="space-y-3">
                                {discountRules.map((r, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between bg-slate-50 rounded-lg p-3"
                                    >
                                        <span className="text-sm font-medium text-slate-700 capitalize">
                                            {r.type ?? "Standard"}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                {r.active} active
                                            </span>
                                            <span className="text-sm font-bold text-purple-600">
                                                {r.count} total
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <Tag
                                    size={24}
                                    className="text-slate-300 mx-auto mb-2"
                                />
                                <p className="text-slate-400 text-sm">
                                    {t("No discount rules configured.")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Automation Checklist */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Settings size={16} className="text-slate-500" />{" "}
                        Automation Checklist (SOP Status)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            {
                                label: "Standard Quotation Templates",
                                done: true,
                            },
                            {
                                label: "Automated Pricing Rules",
                                done: (workflowStats?.pricingRules ?? 0) > 0,
                            },
                            {
                                label: "Auto-Generated Invoices from Quotes",
                                done: autoRate > 0,
                            },
                            {
                                label: "Rule-Based Discount Control",
                                done: (workflowStats?.discountRules ?? 0) > 0,
                            },
                            {
                                label: "Error Rate ≤ 5%",
                                done: (workflowStats?.errorRate ?? 100) <= 5,
                            },
                            {
                                label: "Auto Invoice Rate ≥ 60%",
                                done: autoRate >= 60,
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-3 p-3 rounded-lg border ${item.done ? "border-green-200 bg-green-50" : "border-slate-200 bg-slate-50"}`}
                            >
                                <CheckCircle
                                    size={16}
                                    className={
                                        item.done
                                            ? "text-green-500"
                                            : "text-slate-300"
                                    }
                                />
                                <span
                                    className={`text-sm ${item.done ? "text-green-700" : "text-slate-500"}`}
                                >
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Invoice Automation Panel */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <FileText size={16} className="text-indigo-500" />{" "}
                        Invoice Automation Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-green-600">
                                {workflowStats?.autoInvoices ?? 0}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                {t("Auto-Generated (from Quotes)")}
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-blue-600">
                                {workflowStats?.manualInvoices ?? 0}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                {t("Manually Created")}
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 text-center">
                            <p
                                className={`text-3xl font-bold ${autoRate >= 60 ? "text-green-600" : "text-orange-600"}`}
                            >
                                {autoRate}%
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                {t("Automation Rate")}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 h-3 bg-slate-100 rounded-full">
                        <div
                            className={`h-3 rounded-full ${autoRate >= 60 ? "bg-green-500" : "bg-orange-400"}`}
                            style={{ width: `${autoRate}%` }}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

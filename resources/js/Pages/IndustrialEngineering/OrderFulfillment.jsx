import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import {
    Truck,
    CheckCircle,
    Clock,
    AlertTriangle,
    TrendingUp,
    BarChart2,
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

export default function OrderFulfillment({
    deliveryStats,
    onTimeData,
    deliveryTrend,
    priorityOrders,
}) {
    const { t } = useTranslation();
    const delivered = deliveryStats?.delivered ?? 0;
    const total = deliveryStats?.total ?? 0;
    const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) : 0;
    const onTimePct =
        (onTimeData?.on_time ?? 0) + (onTimeData?.late ?? 0) > 0
            ? Math.round(
                  ((onTimeData?.on_time ?? 0) /
                      ((onTimeData?.on_time ?? 0) + (onTimeData?.late ?? 0))) *
                      100,
              )
            : 0;

    const maxTrend = deliveryTrend?.length
        ? Math.max(...deliveryTrend.map((r) => r.total))
        : 1;

    return (
        <AppLayout>
            <Head title={t("Order Fulfillment Optimization")} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={t("Order Fulfillment Optimization")}
                    subtitle={t("Improve delivery speed and reduce cost using Operations Research & Scheduling Algorithms")}
                />

                <div className="flex flex-wrap gap-2">
                    {[
                        "Order Priority Matrix",
                        "Lead Time Estimation",
                        "Delivery Tracking",
                        "Cost Minimization",
                    ].map((c) => (
                        <span
                            key={c}
                            className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700"
                        >
                            {c}
                        </span>
                    ))}
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        label="Total Deliveries"
                        value={total}
                        icon={Truck}
                        color="blue"
                    />
                    <StatCard
                        label="Delivery Rate"
                        value={`${deliveryRate}%`}
                        sub={`${delivered} of ${total} delivered`}
                        icon={CheckCircle}
                        color={deliveryRate >= 90 ? "green" : "orange"}
                    />
                    <StatCard
                        label="On-Time Rate"
                        value={`${onTimePct}%`}
                        sub={`${onTimeData?.on_time ?? 0} on-time, ${onTimeData?.late ?? 0} late`}
                        icon={Clock}
                        color={onTimePct >= 85 ? "green" : "red"}
                    />
                    <StatCard
                        label="Avg Lead Time"
                        value={`${onTimeData?.avg_lead_time ?? "N/A"} days`}
                        sub="Creation to delivery"
                        icon={TrendingUp}
                        color="purple"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Delivery Trend */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <BarChart2 size={16} className="text-blue-500" />{" "}
                            Delivery Trend (6 Months)
                        </h3>
                        {deliveryTrend?.length ? (
                            <div
                                className="flex items-end gap-2"
                                style={{ height: 120 }}
                            >
                                {deliveryTrend.map((r, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 flex flex-col items-end gap-0.5"
                                    >
                                        <div
                                            className="w-full relative"
                                            style={{ height: 100 }}
                                        >
                                            <div
                                                className="absolute bottom-0 w-full bg-blue-200 rounded-sm"
                                                style={{
                                                    height: `${(r.total / maxTrend) * 100}%`,
                                                }}
                                            />
                                            <div
                                                className="absolute bottom-0 w-full bg-green-500 rounded-sm"
                                                style={{
                                                    height: `${(r.delivered / maxTrend) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-[9px] text-slate-400 text-center">
                                            {r.month?.split(" ")[0]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm">
                                {t("No delivery trend data.")}
                            </p>
                        )}
                        <div className="flex gap-4 mt-2 text-xs text-slate-400">
                            <span>
                                <span className="inline-block w-3 h-2 rounded bg-blue-200 mr-1" /> {t("Total")}
                            </span>
                            <span>
                                <span className="inline-block w-3 h-2 rounded bg-green-500 mr-1" /> {t("Delivered")}
                            </span>
                        </div>
                    </div>

                    {/* Delivery Status Breakdown */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <AlertTriangle
                                size={16}
                                className="text-yellow-500"
                            />{" "}
                            Delivery Status Breakdown
                        </h3>
                        {[
                            {
                                status: "Delivered",
                                count: deliveryStats?.delivered ?? 0,
                                color: "green",
                            },
                            {
                                status: "Dispatched",
                                count: deliveryStats?.pending ?? 0,
                                color: "yellow",
                            },
                            {
                                status: "Draft",
                                count: deliveryStats?.cancelled ?? 0,
                                color: "slate",
                            },
                        ].map((s, i) => {
                            const pct =
                                total > 0
                                    ? Math.round((s.count / total) * 100)
                                    : 0;
                            return (
                                <div key={i} className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700">
                                            {s.status}
                                        </span>
                                        <span className="text-slate-500">
                                            {s.count} ({pct}%)
                                        </span>
                                    </div>
                                    <div className="h-2.5 bg-slate-100 rounded-full">
                                        <div
                                            className={`h-2.5 bg-${s.color}-500 rounded-full`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Priority Order Matrix */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-400" />
                        <h3 className="text-sm font-semibold text-slate-700">
                            High-Priority Pending Orders
                        </h3>
                    </div>
                    {priorityOrders?.length ? (
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-xs text-slate-500">
                                <tr>
                                    <th className="text-left px-4 py-2">#</th>
                                    <th className="text-left px-4 py-2">
                                        {t("Customer")}
                                    </th>
                                    <th className="text-right px-4 py-2">
                                        {t("Amount")}
                                    </th>
                                    <th className="text-right px-4 py-2">
                                        {t("Due Date")}
                                    </th>
                                    <th className="text-right px-4 py-2">
                                        {t("Status")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {priorityOrders.map((o, i) => {
                                    const isOverdue =
                                        o.due_date &&
                                        new Date(o.due_date) < new Date();
                                    return (
                                        <tr
                                            key={i}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-2.5 text-slate-400 text-xs">
                                                {o.invoice_number}
                                            </td>
                                            <td className="px-4 py-2.5 font-medium text-slate-700">
                                                {o.customer?.name ?? "—"}
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-slate-600">
                                                $
                                                {Number(
                                                    o.total_amount,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-slate-500 text-xs">
                                                {o.due_date ?? "—"}
                                            </td>
                                            <td className="px-4 py-2.5 text-right">
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${isOverdue ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-700"}`}
                                                >
                                                    {isOverdue
                                                        ? "⚠ Overdue"
                                                        : o.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-slate-400 text-sm p-4">
                            No pending high-priority orders.
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

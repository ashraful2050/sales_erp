import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import {
    DollarSign,
    AlertTriangle,
    TrendingDown,
    BarChart2,
    Percent,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

function MarginBadge({ margin }) {
    if (margin >= 30)
        return (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
                ✓ Healthy
            </span>
        );
    if (margin >= 15)
        return (
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 font-medium">
                ⚠ Moderate
            </span>
        );
    return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">
            ✗ Low Margin
        </span>
    );
}

export default function CostToServe({
    customerCost,
    categoryCost,
    lowMarginCount,
}) {
    const { t } = useTranslation();
    const maxRev = customerCost?.length
        ? Math.max(...customerCost.map((c) => c.revenue))
        : 1;

    return (
        <AppLayout>
            <Head title={t("Cost-to-Serve Analysis")} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={t("Cost-to-Serve Analysis")}
                    subtitle={t("Improve profitability using Activity-Based Costing (ABC) and Cost Engineering")}
                />

                <div className="flex flex-wrap gap-2">
                    {[
                        "Activity-Based Costing",
                        "Cost Engineering",
                        "Margin Analysis",
                        "Profitability by Customer",
                    ].map((c) => (
                        <span
                            key={c}
                            className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-700"
                        >
                            {c}
                        </span>
                    ))}
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                            <DollarSign size={18} className="text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-slate-800">
                            {customerCost?.length ?? 0}
                        </p>
                        <p className="text-sm text-slate-500">
                            {t("Customers Analyzed")}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-3">
                            <AlertTriangle size={18} className="text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-red-600">
                            {lowMarginCount}
                        </p>
                        <p className="text-sm text-slate-500">
                            {t("Low-Margin Customers")}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Margin &lt; 20%
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-3">
                            <Percent size={18} className="text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-slate-800">
                            {customerCost?.length
                                ? Math.round(
                                      customerCost.reduce(
                                          (a, b) => a + b.margin,
                                          0,
                                      ) / customerCost.length,
                                  )
                                : 0}
                            %
                        </p>
                        <p className="text-sm text-slate-500">
                            {t("Avg Customer Margin")}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
                            <BarChart2 size={18} className="text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-slate-800">
                            {categoryCost?.length ?? 0}
                        </p>
                        <p className="text-sm text-slate-500">
                            {t("Product Categories")}
                        </p>
                    </div>
                </div>

                {/* Customer Cost Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <DollarSign size={16} className="text-green-500" />{" "}
                            Cost-to-Serve per Customer (Top 15)
                        </h3>
                        {lowMarginCount > 0 && (
                            <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                {lowMarginCount} low-margin customers need
                                attention
                            </span>
                        )}
                    </div>
                    {customerCost?.length ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-xs text-slate-500">
                                    <tr>
                                        <th className="text-left px-4 py-2">
                                            {t("Customer")}
                                        </th>
                                        <th className="text-right px-4 py-2">
                                            {t("Revenue")}
                                        </th>
                                        <th className="text-right px-4 py-2">
                                            {t("Cost")}
                                        </th>
                                        <th className="text-right px-4 py-2">
                                            {t("Margin")}
                                        </th>
                                        <th className="text-right px-4 py-2">
                                            {t("Orders")}
                                        </th>
                                        <th className="text-right px-4 py-2">
                                            {t("Status")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {customerCost.map((c, i) => (
                                        <tr
                                            key={i}
                                            className={`hover:bg-slate-50 ${c.margin < 20 ? "bg-red-50/30" : ""}`}
                                        >
                                            <td className="px-4 py-2.5 font-medium text-slate-700">
                                                {c.customer}
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-slate-600">
                                                $
                                                {Number(
                                                    c.revenue,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-slate-500">
                                                $
                                                {Number(
                                                    c.cost,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-semibold">
                                                <span
                                                    className={
                                                        c.margin >= 30
                                                            ? "text-green-600"
                                                            : c.margin >= 15
                                                              ? "text-yellow-600"
                                                              : "text-red-600"
                                                    }
                                                >
                                                    {c.margin}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-slate-500">
                                                {c.orders}
                                            </td>
                                            <td className="px-4 py-2.5 text-right">
                                                <MarginBadge
                                                    margin={c.margin}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm p-4">
                            No customer cost data available. Ensure invoices
                            have cost amounts recorded.
                        </p>
                    )}
                </div>

                {/* Category Profitability */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <TrendingDown size={16} className="text-purple-500" />{" "}
                        Margin per Product Category
                    </h3>
                    {categoryCost?.length ? (
                        <div className="space-y-3">
                            {[...categoryCost]
                                .sort((a, b) => b.margin - a.margin)
                                .map((c, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="text-xs text-slate-500 w-32 truncate">
                                            {c.category}
                                        </span>
                                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full">
                                            <div
                                                className={`h-2.5 rounded-full ${c.margin >= 30 ? "bg-green-500" : c.margin >= 15 ? "bg-yellow-400" : "bg-red-400"}`}
                                                style={{
                                                    width: `${Math.min(c.margin, 100)}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold w-12 text-right text-slate-600">
                                            {c.margin}%
                                        </span>
                                        <span className="text-xs text-slate-400 w-28 text-right">
                                            $
                                            {Number(c.revenue).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm">
                            {t("No category data available.")}
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

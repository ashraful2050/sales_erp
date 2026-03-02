import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import {
    TrendingUp,
    Package,
    BarChart2,
    Activity,
    Calendar,
} from "lucide-react";

function BarItem({ label, value, forecast, max }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-slate-500 w-16 text-right shrink-0">
                {label}
            </span>
            <div className="flex-1 h-4 bg-slate-100 rounded-sm overflow-hidden">
                <div
                    className={`h-4 rounded-sm ${forecast ? "bg-orange-400 opacity-70" : "bg-blue-500"}`}
                    style={{ width: `${pct}%` }}
                    title={`${label}: $${Number(value).toLocaleString()}`}
                />
            </div>
            <span className="text-xs text-slate-600 w-24 text-right shrink-0">
                ${Number(value).toLocaleString()}
            </span>
        </div>
    );
}

export default function DemandForecasting({ historical, forecast, topDemand }) {
    const allRevenues = [
        ...(historical?.map((h) => h.revenue) ?? []),
        ...(forecast?.map((f) => f.revenue) ?? []),
    ];
    const maxRev = allRevenues.length ? Math.max(...allRevenues) : 1;
    const maxDemand = topDemand?.length
        ? Math.max(...topDemand.map((p) => p.total_qty))
        : 1;

    const lastMonths = historical?.slice(-3) ?? [];
    const avg3m = lastMonths.length
        ? lastMonths.reduce((a, b) => a + b.revenue, 0) / lastMonths.length
        : 0;
    const forecastNext = forecast?.[0]?.revenue ?? 0;
    const forecastAccuracy =
        avg3m > 0
            ? Math.min(
                  100,
                  Math.round(
                      (1 - Math.abs(forecastNext - avg3m) / avg3m) * 100,
                  ),
              )
            : 0;

    return (
        <AppLayout>
            <Head title="Demand Forecasting" />
            <div className="p-6 space-y-6">
                <PageHeader
                    title="Demand Forecasting & Planning Module"
                    subtitle="Reduce overstock and stockouts using statistical forecasting models"
                />

                <div className="flex flex-wrap gap-2">
                    {[
                        "Moving Average Forecast",
                        "Seasonal Patterns",
                        "Inventory Optimization",
                        "Statistical Analysis",
                    ].map((c) => (
                        <span
                            key={c}
                            className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-700"
                        >
                            {c}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                            <BarChart2 size={18} className="text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-slate-800">
                            {historical?.length ?? 0}
                        </p>
                        <p className="text-sm text-slate-500">
                            Historical Months
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-3">
                            <TrendingUp size={18} className="text-orange-600" />
                        </div>
                        <p className="text-2xl font-bold text-slate-800">
                            ${Number(forecastNext).toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-500">
                            Next Month Forecast
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-3">
                            <Activity size={18} className="text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-slate-800">
                            {forecastAccuracy}%
                        </p>
                        <p className="text-sm text-slate-500">
                            Forecast Accuracy
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
                            <Package size={18} className="text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-slate-800">
                            {topDemand?.length ?? 0}
                        </p>
                        <p className="text-sm text-slate-500">
                            High-demand Products
                        </p>
                    </div>
                </div>

                {/* Historical + Forecast Chart */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Calendar size={16} className="text-blue-500" />{" "}
                        Historical Revenue & 3-Month Forecast
                    </h3>
                    <div className="mb-3 text-xs text-slate-400 flex gap-4">
                        <span>
                            <span className="inline-block w-3 h-3 rounded-sm bg-blue-500 mr-1" />
                            Historical
                        </span>
                        <span>
                            <span className="inline-block w-3 h-3 rounded-sm bg-orange-400 opacity-70 mr-1" />
                            Forecast
                        </span>
                    </div>
                    {historical?.length ? (
                        <>
                            {historical.map((r, i) => (
                                <BarItem
                                    key={i}
                                    label={r.label?.split(" ")[0] ?? r.period}
                                    value={r.revenue}
                                    max={maxRev}
                                    forecast={false}
                                />
                            ))}
                            {forecast?.map((r, i) => (
                                <BarItem
                                    key={`f${i}`}
                                    label={r.label?.split(" ")[0]}
                                    value={r.revenue}
                                    max={maxRev}
                                    forecast={true}
                                />
                            ))}
                        </>
                    ) : (
                        <p className="text-slate-400 text-sm">
                            No historical data available.
                        </p>
                    )}
                </div>

                {/* Top Demand Products */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Package size={16} className="text-purple-500" /> Top
                        Products by Demand Frequency
                    </h3>
                    {topDemand?.length ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-xs text-slate-500">
                                    <tr>
                                        <th className="text-left px-4 py-2">
                                            Product
                                        </th>
                                        <th className="text-right px-4 py-2">
                                            Total Qty Sold
                                        </th>
                                        <th className="text-right px-4 py-2">
                                            Order Frequency
                                        </th>
                                        <th className="text-right px-4 py-2">
                                            Demand Bar
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {topDemand.map((p, i) => (
                                        <tr
                                            key={i}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-2.5 font-medium text-slate-700">
                                                {p.product}
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-slate-600">
                                                {Number(
                                                    p.total_qty,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-slate-600">
                                                {p.frequency} orders
                                            </td>
                                            <td className="px-4 py-2.5 text-right">
                                                <div className="w-24 h-2 bg-slate-100 rounded-full ml-auto">
                                                    <div
                                                        className="h-2 bg-purple-500 rounded-full"
                                                        style={{
                                                            width: `${(p.total_qty / maxDemand) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm">
                            No demand data available.
                        </p>
                    )}
                </div>

                {/* Safety Stock Recommendation */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-orange-800 mb-1">
                        📦 Safety Stock Recommendation
                    </h4>
                    <p className="text-sm text-orange-700">
                        Based on 3-month moving average, maintain{" "}
                        <strong>~15% buffer stock</strong> for top-demand
                        products to prevent stockouts during demand spikes.
                        Review seasonality every quarter.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

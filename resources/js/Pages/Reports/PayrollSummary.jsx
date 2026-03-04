import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { useState } from "react";
import { Filter } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function PayrollSummary({ month }) {
    const { t } = useTranslation();
    const [selectedMonth, setSelectedMonth] = useState(month);

    const handleFilter = () => {
        router.get(
            route("reports.payroll-summary"),
            { month: selectedMonth },
            { preserveState: true },
        );
    };

    // Placeholder summary rows
    const summaryRows = [
        { label: "Total Employees Processed", value: 0, currency: false },
        { label: "Total Gross Salary", value: 0, currency: true },
        { label: "Total Basic Salary", value: 0, currency: true },
        { label: "Total Allowances", value: 0, currency: true },
        { label: "Total Deductions", value: 0, currency: true },
        { label: "Total Tax Deducted", value: 0, currency: true },
        { label: "Total Net Pay", value: 0, currency: true },
    ];

    const [year, mon] = month.split("-");
    const monthName = new Date(`${year}-${mon}-01`).toLocaleString("default", {
        month: "long",
    });

    return (
        <AppLayout>
            <Head title={t("Payroll Summary Report")} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={t("Payroll Summary Report")}
                    subtitle={`${monthName} ${year}`}
                />

                {/* Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t("Month")}
                        </label>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        onClick={handleFilter}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                    >
                        <Filter className="w-4 h-4" /> {t("Apply Filter")}
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {
                            label: "Employees",
                            value: "—",
                            icon: "👥",
                            bg: "bg-blue-50 text-blue-700",
                        },
                        {
                            label: "Gross Payroll",
                            value: "৳0",
                            icon: "💰",
                            bg: "bg-indigo-50 text-indigo-700",
                        },
                        {
                            label: "Deductions",
                            value: "৳0",
                            icon: "📉",
                            bg: "bg-red-50 text-red-700",
                        },
                        {
                            label: "Net Payroll",
                            value: "৳0",
                            icon: "✅",
                            bg: "bg-green-50 text-green-700",
                        },
                    ].map((c) => (
                        <div key={c.label} className={`rounded-xl p-4 ${c.bg}`}>
                            <p className="text-lg">{c.icon}</p>
                            <p className="text-xs font-medium uppercase tracking-wide opacity-70 mt-1">
                                {c.label}
                            </p>
                            <p className="text-2xl font-bold mt-1">{c.value}</p>
                        </div>
                    ))}
                </div>

                {/* Summary Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Payroll Summary — {monthName} {year}
                        </h3>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                {["Description", "Amount"].map((h) => (
                                    <th
                                        key={h}
                                        className={`px-6 py-3 ${h === "Amount" ? "text-right" : "text-left"}`}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {summaryRows.map((row) => (
                                <tr
                                    key={row.label}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-3 text-gray-700">
                                        {row.label}
                                    </td>
                                    <td className="px-6 py-3 text-right font-medium">
                                        {row.currency
                                            ? `৳${row.value.toLocaleString()}`
                                            : row.value || "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Department Breakdown placeholder */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">
                            {t("By Department")}
                        </h3>
                    </div>
                    <div className="px-6 py-12 text-center text-gray-400 text-sm">
                        <p>
                            No payroll data found for {monthName} {year}.
                        </p>
                        <p className="mt-1 text-xs">
                            Process payroll for this period to see the
                            department breakdown.
                        </p>
                    </div>
                </div>

                <p className="text-xs text-gray-400 text-center">
                    This report summarises all processed payroll records for the
                    selected month.
                </p>
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { useState } from "react";
import { Filter } from "lucide-react";

export default function CashFlow({ year }) {
    const [selectedYear, setSelectedYear] = useState(year);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

    const handleFilter = () => {
        router.get(route("reports.cash-flow"), { year: selectedYear }, { preserveState: true });
    };

    // Placeholder data structure for cash flow categories
    const categories = [
        { label: "Operating Activities", items: [
            { name: "Net Income", amount: 0 },
            { name: "Depreciation", amount: 0 },
            { name: "Changes in Accounts Receivable", amount: 0 },
            { name: "Changes in Accounts Payable", amount: 0 },
        ]},
        { label: "Investing Activities", items: [
            { name: "Purchase of Fixed Assets", amount: 0 },
            { name: "Disposal of Fixed Assets", amount: 0 },
        ]},
        { label: "Financing Activities", items: [
            { name: "Loan Proceeds", amount: 0 },
            { name: "Loan Repayments", amount: 0 },
        ]},
    ];

    return (
        <AppLayout>
            <Head title="Cash Flow Statement" />
            <div className="p-6 space-y-6">
                <PageHeader
                    title="Cash Flow Statement"
                    subtitle={`Year: ${year}`}
                />

                {/* Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleFilter}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                    >
                        <Filter className="w-4 h-4" /> Apply Filter
                    </button>
                </div>

                {/* Cash Flow Statement */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-base font-semibold text-gray-800">
                            Cash Flow Statement — {year}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">For the fiscal year ending December 31, {year}</p>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {categories.map((section) => {
                            const sectionTotal = section.items.reduce((s, i) => s + i.amount, 0);
                            return (
                                <div key={section.label} className="px-6 py-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">{section.label}</h4>
                                    <table className="w-full text-sm">
                                        <tbody>
                                            {section.items.map((item) => (
                                                <tr key={item.name}>
                                                    <td className="py-1.5 pl-4 text-gray-600">{item.name}</td>
                                                    <td className="py-1.5 text-right font-medium w-40">
                                                        {item.amount !== 0 ? (
                                                            <span className={item.amount > 0 ? "text-green-700" : "text-red-700"}>
                                                                {item.amount > 0 ? "+" : ""}৳{item.amount.toLocaleString()}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="border-t border-gray-200 font-semibold">
                                                <td className="py-2 pl-4 text-gray-800">Net Cash from {section.label}</td>
                                                <td className={`py-2 text-right w-40 ${sectionTotal >= 0 ? "text-green-700" : "text-red-700"}`}>
                                                    {sectionTotal >= 0 ? "+" : ""}৳{sectionTotal.toLocaleString()}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })}
                        <div className="px-6 py-4 bg-gray-50">
                            <div className="flex justify-between items-center font-bold text-base">
                                <span>Net Change in Cash</span>
                                <span className="text-indigo-700">৳0</span>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-gray-400 text-center">
                    Cash flow data is populated from posted journal entries. Ensure all transactions are posted for accurate reporting.
                </p>
            </div>
        </AppLayout>
    );
}

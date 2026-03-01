import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { useState } from "react";

const statusColor = { draft: "gray", approved: "green", rejected: "red" };
const fmt = (v) => Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function ExpenseReport({ expenses, categories, total, filters }) {
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? "");
    const [dateTo, setDateTo] = useState(filters?.date_to ?? "");
    const [status, setStatus] = useState(filters?.status ?? "");
    const [categoryId, setCategoryId] = useState(filters?.category_id ?? "");

    const apply = () => router.get(route("reports.expense-report"), {
        date_from: dateFrom, date_to: dateTo, status, category_id: categoryId
    }, { preserveState: true });

    // Group by category for summary
    const byCategory = expenses.reduce((acc, e) => {
        const cat = e.category?.name ?? "Uncategorized";
        acc[cat] = (acc[cat] || 0) + Number(e.amount || 0);
        return acc;
    }, {});

    return (
        <AppLayout title="Expense Report">
            <Head title="Expense Report" />
            <PageHeader title="Expense Report" subtitle="All expenses for the selected period" />
            <div className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">From Date</label>
                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">To Date</label>
                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
                        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">All Categories</option>
                            {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value)}
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">All</option>
                            <option value="draft">Draft</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <button onClick={apply} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Apply</button>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Total Expenses</p>
                        <p className="text-2xl font-bold text-slate-700">{expenses.length}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Total Amount</p>
                        <p className="text-xl font-bold text-red-600">{fmt(total)}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Categories Used</p>
                        <p className="text-2xl font-bold text-blue-600">{Object.keys(byCategory).length}</p>
                    </div>
                </div>

                {/* Category breakdown */}
                {Object.keys(byCategory).length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Breakdown by Category</h3>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(byCategory).sort((a,b) => b[1]-a[1]).map(([cat, amt]) => (
                                <div key={cat} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 text-sm">
                                    <span className="font-medium text-slate-700">{cat}</span>
                                    <span className="text-red-600 font-semibold">{fmt(amt)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Expense table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase">
                            <tr>
                                {["Expense #", "Date", "Title", "Category", "Payment Method", "Amount", "Status"].map(h => (
                                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {expenses.length === 0 && (
                                <tr><td colSpan={7} className="text-center py-12 text-slate-400">No expenses found.</td></tr>
                            )}
                            {expenses.map(e => (
                                <tr key={e.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-mono text-xs text-blue-600">{e.expense_number}</td>
                                    <td className="px-4 py-3">{e.expense_date}</td>
                                    <td className="px-4 py-3 font-medium">{e.title}</td>
                                    <td className="px-4 py-3 text-slate-500">{e.category?.name ?? "—"}</td>
                                    <td className="px-4 py-3 capitalize">{e.payment_method}</td>
                                    <td className="px-4 py-3 font-semibold text-right text-red-700">{fmt(e.amount)}</td>
                                    <td className="px-4 py-3"><Badge color={statusColor[e.status] ?? "gray"}>{e.status}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                        {expenses.length > 0 && (
                            <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                                <tr>
                                    <td colSpan={5} className="px-4 py-3 font-semibold text-slate-700">Total</td>
                                    <td className="px-4 py-3 font-bold text-right text-red-700">{fmt(total)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

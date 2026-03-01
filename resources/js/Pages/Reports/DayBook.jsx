import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { useState } from "react";

const fmt = (v) => Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function DayBook({ entries, filters }) {
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? "");
    const [dateTo, setDateTo] = useState(filters?.date_to ?? "");

    const apply = () => router.get(route("reports.day-book"), { date_from: dateFrom, date_to: dateTo }, { preserveState: true });

    const totalDebit = entries.reduce((s, e) => s + parseFloat(e.total_debit ?? 0), 0);
    const totalCredit = entries.reduce((s, e) => s + parseFloat(e.total_credit ?? 0), 0);

    return (
        <AppLayout title="Day Book">
            <Head title="Day Book" />
            <PageHeader title="Day Book" subtitle="All journal entries for the selected period" />
            <div className="space-y-6">
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
                    <button onClick={apply} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Apply</button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Entry #</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Description</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Reference</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Debit</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Credit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {entries.length === 0 && (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No entries found for the selected period.</td></tr>
                                )}
                                {entries.map(entry => (
                                    <tr key={entry.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-3 text-slate-600">{entry.entry_date}</td>
                                        <td className="px-6 py-3 font-medium text-blue-600">{entry.entry_number}</td>
                                        <td className="px-6 py-3 text-slate-700">{entry.description}</td>
                                        <td className="px-6 py-3 text-slate-500">{entry.reference ?? "—"}</td>
                                        <td className="px-6 py-3 text-right text-green-600 font-medium">{fmt(entry.total_debit)}</td>
                                        <td className="px-6 py-3 text-right text-red-500 font-medium">{fmt(entry.total_credit)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            {entries.length > 0 && (
                                <tfoot className="bg-slate-100 border-t-2 border-slate-300">
                                    <tr>
                                        <td colSpan={4} className="px-6 py-3 text-right font-bold text-slate-700">Totals:</td>
                                        <td className="px-6 py-3 text-right font-bold text-green-700">{fmt(totalDebit)}</td>
                                        <td className="px-6 py-3 text-right font-bold text-red-600">{fmt(totalCredit)}</td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

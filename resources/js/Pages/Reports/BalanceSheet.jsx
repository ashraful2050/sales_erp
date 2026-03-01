import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import { Download } from "lucide-react";

function BSSection({ title, groups }) {
    const sectionTotal = groups?.reduce((s, g) => s + (g.accounts?.reduce((as, a) => as + Number(a.balance || 0), 0) ?? 0), 0) ?? 0;
    return (
        <div className="flex-1">
            <div className="px-4 py-2 bg-slate-700 text-white text-xs font-bold uppercase tracking-wider">{title}</div>
            {groups?.map((g, gi) => {
                const groupTotal = g.accounts?.reduce((s, a) => s + Number(a.balance || 0), 0) ?? 0;
                return (
                    <div key={gi}>
                        <div className="px-4 py-1.5 bg-slate-100 text-xs font-semibold text-slate-600 uppercase">{g.name}</div>
                        {g.accounts?.map((a, ai) => (
                            <div key={ai} className="flex justify-between px-6 py-2 border-b border-slate-50 text-sm hover:bg-slate-50">
                                <span className="text-slate-600">{a.name}</span>
                                <span className="font-mono text-slate-700">৳{Number(a.balance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
                            </div>
                        ))}
                        <div className="flex justify-between px-4 py-2 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
                            <span>Total {g.name}</span>
                            <span className="font-mono">৳{groupTotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                );
            })}
            <div className="flex justify-between px-4 py-3 bg-slate-200 text-sm font-bold">
                <span>Total {title}</span>
                <span className="font-mono">৳{sectionTotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
            </div>
        </div>
    );
}

export default function BalanceSheet({ report, filters }) {
    const [asOf, setAsOf] = useState(filters?.as_of ?? new Date().toISOString().slice(0, 10));
    const run = () => router.get(route("reports.balance-sheet"), { as_of: asOf }, { preserveState: true, replace: true });

    return (
        <AppLayout title="Balance Sheet">
            <Head title="Balance Sheet" />
            <PageHeader
                title="Balance Sheet"
                subtitle="Assets, liabilities and equity as of a date"
                actions={
                    <button className="flex items-center gap-2 text-slate-600 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium">
                        <Download size={16} /> Export
                    </button>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">As of Date</label>
                    <input type="date" value={asOf} onChange={e => setAsOf(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button onClick={run} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Generate</button>
            </div>

            {report && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h3 className="font-semibold text-slate-800">Balance Sheet</h3>
                        {filters?.as_of && <p className="text-xs text-slate-500 mt-0.5">As of {filters.as_of}</p>}
                    </div>
                    <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                        <BSSection title="Assets" groups={report.assets} />
                        <div className="flex-1">
                            <BSSection title="Liabilities" groups={report.liabilities} />
                            <BSSection title="Equity" groups={report.equity} />
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

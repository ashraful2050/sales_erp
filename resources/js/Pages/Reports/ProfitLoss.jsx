import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import { Download } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

function Section({ title, rows, color = "slate" }) {
    const total = rows?.reduce((s, r) => s + Number(r.amount || 0), 0) ?? 0;
    return (
        <div className="mb-2">
            <div className={`px-6 py-2 bg-${color}-50 border-b border-${color}-100`}>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{title}</span>
            </div>
            {rows?.map((r, i) => (
                <div key={i} className="flex justify-between px-6 py-2.5 border-b border-slate-50 hover:bg-slate-50 text-sm">
                    <span className="text-slate-700">{r.name}</span>
                    <span className="font-mono text-slate-700">৳{Number(r.amount).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
                </div>
            ))}
            <div className="flex justify-between px-6 py-2.5 border-b border-slate-200 bg-slate-50 text-sm font-semibold">
                <span>Total {title}</span>
                <span className="font-mono">৳{total.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
            </div>
        </div>
    );
}

export default function ProfitLoss({ report, filters }) {
    const { t } = useTranslation();
    const [fromDate, setFromDate] = useState(filters?.from_date ?? "");
    const [toDate, setToDate] = useState(filters?.to_date ?? "");
    const run = () => router.get(route("reports.profit-loss"), { from_date: fromDate, to_date: toDate }, { preserveState: true, replace: true });

    const totalRevenue = report?.revenue?.reduce((s, r) => s + Number(r.amount || 0), 0) ?? 0;
    const totalExpense = report?.expenses?.reduce((s, r) => s + Number(r.amount || 0), 0) ?? 0;
    const netProfit = totalRevenue - totalExpense;

    return (
        <AppLayout title={t("Profit & Loss")}>
            <Head title={t("Profit & Loss Statement")} />
            <PageHeader
                title={t("Profit & Loss Statement")}
                subtitle={t("Revenue vs expenses for the selected period")}
                actions={
                    <button className="flex items-center gap-2 text-slate-600 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium">
                        <Download size={16} /> {t("Export")}
                    </button>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{t("From Date")}</label>
                    <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{t("To Date")}</label>
                    <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button onClick={run} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">{t("Generate")}</button>
            </div>

            {report && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-w-2xl">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h3 className="font-semibold text-slate-800">Statement of Profit &amp; Loss</h3>
                        {filters?.from_date && <p className="text-xs text-slate-500 mt-0.5">{filters.from_date} to {filters.to_date}</p>}
                    </div>
                    <Section title="Revenue" rows={report.revenue} color="green" />
                    <Section title="Expenses" rows={report.expenses} color="red" />
                    <div className={`flex justify-between px-6 py-4 ${netProfit >= 0 ? "bg-green-50" : "bg-red-50"} text-base font-bold`}>
                        <span>{netProfit >= 0 ? "Net Profit" : "Net Loss"}</span>
                        <span className={`font-mono ${netProfit >= 0 ? "text-green-700" : "text-red-700"}`}>
                            ৳{Math.abs(netProfit).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

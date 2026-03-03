import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Download } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const BUCKETS = ["Current", "1-30 days", "31-60 days", "61-90 days", "90+ days"];

export default function AgedReceivables({ report, filters }) {
    const { t } = useTranslation();
    const [asOf, setAsOf] = useState(filters?.as_of ?? new Date().toISOString().slice(0, 10));
    const run = () => router.get(route("reports.aged-receivables"), { as_of: asOf }, { preserveState: true, replace: true });

    const totals = BUCKETS.map((_, bi) => report?.reduce((s, r) => s + Number(r.buckets?.[bi] ?? 0), 0) ?? 0);
    const grandTotal = totals.reduce((s, t) => s + t, 0);

    return (
        <AppLayout title={t("Aged Receivables")}>
            <Head title={t("Aged Receivables")} />
            <PageHeader
                title={t("Aged Receivables")}
                subtitle={t("Outstanding customer balances by age")}
                actions={
                    <button className="flex items-center gap-2 text-slate-600 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium">
                        <Download size={16} /> {t("Export")}
                    </button>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{t("As of Date")}</label>
                    <input type="date" value={asOf} onChange={e => setAsOf(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <button onClick={run} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">{t("Generate")}</button>
            </div>

            {report && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Customer")}</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Total")}</th>
                                    {BUCKETS.map(b => <th key={b} className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">{b}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {report.length === 0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">{t("No outstanding receivables.")}</td></tr>}
                                {report.map((row, i) => {
                                    const rowTotal = row.buckets?.reduce((s, b) => s + Number(b ?? 0), 0) ?? 0;
                                    return (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-6 py-3 font-medium text-slate-800">{row.customer_name}</td>
                                            <td className="px-6 py-3 text-right font-mono font-semibold text-slate-800">৳{rowTotal.toFixed(2)}</td>
                                            {BUCKETS.map((_, bi) => (
                                                <td key={bi} className={`px-4 py-3 text-right font-mono ${bi > 0 && Number(row.buckets?.[bi]) > 0 ? "text-red-600" : "text-slate-600"}`}>
                                                    {Number(row.buckets?.[bi] ?? 0) > 0 ? `৳${Number(row.buckets[bi]).toFixed(2)}` : "—"}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-slate-100 border-t-2 border-slate-300 text-sm font-semibold">
                                <tr>
                                    <td className="px-6 py-3 text-slate-700">Total</td>
                                    <td className="px-6 py-3 text-right font-mono text-slate-800">৳{grandTotal.toFixed(2)}</td>
                                    {totals.map((t, i) => <td key={i} className="px-4 py-3 text-right font-mono text-slate-800">৳{t.toFixed(2)}</td>)}
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

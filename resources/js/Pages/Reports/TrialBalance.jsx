import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import { Download } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function TrialBalance({ report, filters }) {
    const { t } = useTranslation();
    const [fromDate, setFromDate] = useState(filters?.from_date ?? "");
    const [toDate, setToDate] = useState(filters?.to_date ?? "");

    const run = () => router.get(route("reports.trial-balance"), { from_date: fromDate, to_date: toDate }, { preserveState: true, replace: true });

    const totalDebit = report?.reduce((s, r) => s + Number(r.debit || 0), 0) ?? 0;
    const totalCredit = report?.reduce((s, r) => s + Number(r.credit || 0), 0) ?? 0;

    return (
        <AppLayout title={t("Trial Balance")}>
            <Head title={t("Trial Balance")} />
            <PageHeader
                title={t("Trial Balance")}
                subtitle={t("View all account balances as debit and credit totals")}
                actions={
                    <button className="flex items-center gap-2 text-slate-600 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium">
                        <Download size={16} /> {t("Export")}
                    </button>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{t("From Date")}</label>
                    <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{t("To Date")}</label>
                    <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button onClick={run} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    {t("Generate")}
                </button>
            </div>

            {report && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase w-24">{t("Code")}</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Account Name")}</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Type")}</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Debit (Dr)</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Credit (Cr)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {report.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">{t("No transactions for this period.")}</td></tr>
                                )}
                                {report.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="px-6 py-3 font-mono text-slate-500 text-xs">{row.code}</td>
                                        <td className="px-6 py-3 text-slate-800">{row.name}</td>
                                        <td className="px-6 py-3 capitalize text-slate-500">{row.type}</td>
                                        <td className="px-6 py-3 text-right font-mono text-slate-700">{Number(row.debit) > 0 ? `৳${Number(row.debit).toLocaleString("en-BD", { minimumFractionDigits: 2 })}` : "—"}</td>
                                        <td className="px-6 py-3 text-right font-mono text-slate-700">{Number(row.credit) > 0 ? `৳${Number(row.credit).toLocaleString("en-BD", { minimumFractionDigits: 2 })}` : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                                <tr>
                                    <td colSpan={3} className="px-6 py-3 text-sm font-bold text-slate-700">Total</td>
                                    <td className="px-6 py-3 text-right font-mono font-bold text-slate-800">৳{totalDebit.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-3 text-right font-mono font-bold text-slate-800">৳{totalCredit.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td colSpan={5} className="px-6 py-2 text-right text-xs">
                                        {Math.abs(totalDebit - totalCredit) < 0.01
                                            ? <span className="text-green-600 font-medium">✓ Balanced</span>
                                            : <span className="text-red-600 font-medium">⚠ Difference: ৳{Math.abs(totalDebit - totalCredit).toFixed(2)}</span>
                                        }
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

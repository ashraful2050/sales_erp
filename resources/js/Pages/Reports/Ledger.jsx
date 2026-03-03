import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const fmt = (v) => Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function Ledger({ accounts, account, lines, openingBalance, filters }) {
    const { t } = useTranslation();
    const [accountId, setAccountId] = useState(filters?.account_id ?? "");
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? "");
    const [dateTo, setDateTo] = useState(filters?.date_to ?? "");

    const apply = () => router.get(route("reports.ledger"), { account_id: accountId, date_from: dateFrom, date_to: dateTo }, { preserveState: true });

    const totalDebit = lines.reduce((s, l) => s + parseFloat(l.debit ?? 0), 0);
    const totalCredit = lines.reduce((s, l) => s + parseFloat(l.credit ?? 0), 0);
    const closing = parseFloat(openingBalance ?? 0) + totalDebit - totalCredit;

    return (
        <AppLayout title={t("Ledger")}>
            <Head title={t("Ledger")} />
            <PageHeader title={t("Ledger")} subtitle={t("Account-wise transaction history with running balance")} />
            <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-4 items-end">
                    <div className="min-w-[240px]">
                        <label className="block text-xs font-medium text-slate-600 mb-1">{t("Account")}</label>
                        <select value={accountId} onChange={e => setAccountId(e.target.value)}
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">-- Select Account --</option>
                            {accounts.map(a => <option key={a.id} value={a.id}>{a.code} — {a.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">{t("From Date")}</label>
                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">{t("To Date")}</label>
                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button onClick={apply} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">{t("Show Ledger")}</button>
                </div>

                {account && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-8 text-sm">
                        <div><span className="text-slate-500">Account:</span> <span className="font-semibold text-slate-800 ml-2">{account.name}</span></div>
                        <div><span className="text-slate-500">Code:</span> <span className="font-semibold text-slate-800 ml-2">{account.code}</span></div>
                        <div><span className="text-slate-500">Opening Balance:</span> <span className="font-semibold text-blue-700 ml-2">{fmt(openingBalance)} BDT</span></div>
                    </div>
                )}

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Date")}</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Entry #")}</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Description")}</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Debit")}</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Credit")}</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Balance")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {!account && (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Select an account to view the ledger.</td></tr>
                                )}
                                {account && lines.length === 0 && (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">{t("No transactions for this account in the selected period.")}</td></tr>
                                )}
                                {account && (
                                    <tr className="bg-blue-50">
                                        <td colSpan={5} className="px-6 py-2 text-slate-600 font-medium italic">Opening Balance</td>
                                        <td className="px-6 py-2 text-right font-semibold text-blue-700">{fmt(openingBalance)}</td>
                                    </tr>
                                )}
                                {lines.map(line => (
                                    <tr key={line.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-3 text-slate-600">{line.entry_date}</td>
                                        <td className="px-6 py-3 font-medium text-blue-600">{line.entry_number}</td>
                                        <td className="px-6 py-3 text-slate-700">{line.description}</td>
                                        <td className="px-6 py-3 text-right text-green-600 font-medium">{line.debit > 0 ? fmt(line.debit) : "—"}</td>
                                        <td className="px-6 py-3 text-right text-red-500 font-medium">{line.credit > 0 ? fmt(line.credit) : "—"}</td>
                                        <td className="px-6 py-3 text-right font-medium text-slate-800">{fmt(line.running_balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            {account && lines.length > 0 && (
                                <tfoot className="bg-slate-100 border-t-2 border-slate-300">
                                    <tr>
                                        <td colSpan={3} className="px-6 py-3 text-right font-bold text-slate-700">Totals / Closing Balance:</td>
                                        <td className="px-6 py-3 text-right font-bold text-green-700">{fmt(totalDebit)}</td>
                                        <td className="px-6 py-3 text-right font-bold text-red-600">{fmt(totalCredit)}</td>
                                        <td className="px-6 py-3 text-right font-bold text-slate-800">{fmt(closing)}</td>
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

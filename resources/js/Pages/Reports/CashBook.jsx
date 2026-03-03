import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const fmt = (v) => Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function CashBook({ accounts, transactions, filters, totals }) {
    const { t } = useTranslation();
    const [accountId, setAccountId] = useState(filters?.bank_account_id ?? "");
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? "");
    const [dateTo, setDateTo] = useState(filters?.date_to ?? "");

    const apply = () => router.get(route("reports.cash-book"), { bank_account_id: accountId, date_from: dateFrom, date_to: dateTo }, { preserveState: true });

    let runningBalance = parseFloat(totals?.opening_balance ?? 0);

    return (
        <AppLayout title={t("Cash Book")}>
            <Head title={t("Cash Book")} />
            <PageHeader title={t("Cash Book")} subtitle={t("Bank account transaction history")} />
            <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-4 items-end">
                    <div className="min-w-[240px]">
                        <label className="block text-xs font-medium text-slate-600 mb-1">{t("Bank Account")}</label>
                        <select value={accountId} onChange={e => setAccountId(e.target.value)}
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">-- Select Account --</option>
                            {accounts.map(a => <option key={a.id} value={a.id}>{a.bank_name} — {a.account_number}</option>)}
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
                    <button onClick={apply} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">{t("Show")}</button>
                </div>

                {totals && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                            <p className="text-xs text-slate-500 uppercase font-semibold">{t("Opening Balance")}</p>
                            <p className="text-xl font-bold text-blue-600">{fmt(totals.opening_balance)}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                            <p className="text-xs text-slate-500 uppercase font-semibold">{t("Total Debits (In)")}</p>
                            <p className="text-xl font-bold text-green-600">{fmt(totals.total_debit)}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                            <p className="text-xs text-slate-500 uppercase font-semibold">{t("Total Credits (Out)")}</p>
                            <p className="text-xl font-bold text-red-500">{fmt(totals.total_credit)}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                            <p className="text-xs text-slate-500 uppercase font-semibold">{t("Closing Balance")}</p>
                            <p className="text-xl font-bold text-slate-700">{fmt(parseFloat(totals.opening_balance ?? 0) + parseFloat(totals.total_debit ?? 0) - parseFloat(totals.total_credit ?? 0))}</p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Date")}</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Description")}</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Reference")}</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Debit (In)</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Credit (Out)</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Balance")}</th>
                                    <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Reconciled")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {!accountId && (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">Select a bank account to view the cash book.</td></tr>
                                )}
                                {accountId && transactions.length === 0 && (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">{t("No transactions found for the selected period.")}</td></tr>
                                )}
                                {accountId && totals && (
                                    <tr className="bg-blue-50">
                                        <td colSpan={5} className="px-6 py-2 text-slate-600 font-medium italic">Opening Balance</td>
                                        <td className="px-6 py-2 text-right font-semibold text-blue-700">{fmt(totals.opening_balance)}</td>
                                        <td></td>
                                    </tr>
                                )}
                                {transactions.map(t => {
                                    runningBalance += parseFloat(t.debit_amount ?? 0) - parseFloat(t.credit_amount ?? 0);
                                    return (
                                        <tr key={t.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-3 text-slate-600">{t.transaction_date}</td>
                                            <td className="px-6 py-3 text-slate-700 font-medium">{t.description}</td>
                                            <td className="px-6 py-3 text-slate-500">{t.reference ?? "—"}</td>
                                            <td className="px-6 py-3 text-right text-green-600 font-medium">{t.debit_amount > 0 ? fmt(t.debit_amount) : "—"}</td>
                                            <td className="px-6 py-3 text-right text-red-500 font-medium">{t.credit_amount > 0 ? fmt(t.credit_amount) : "—"}</td>
                                            <td className="px-6 py-3 text-right font-medium text-slate-800">{fmt(runningBalance)}</td>
                                            <td className="px-6 py-3 text-center">
                                                {t.is_reconciled
                                                    ? <Badge color="green">Yes</Badge>
                                                    : <Badge color="gray">No</Badge>
                                                }
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            {accountId && transactions.length > 0 && totals && (
                                <tfoot className="bg-slate-100 border-t-2 border-slate-300">
                                    <tr>
                                        <td colSpan={3} className="px-6 py-3 text-right font-bold text-slate-700">Totals / Closing:</td>
                                        <td className="px-6 py-3 text-right font-bold text-green-700">{fmt(totals.total_debit)}</td>
                                        <td className="px-6 py-3 text-right font-bold text-red-600">{fmt(totals.total_credit)}</td>
                                        <td className="px-6 py-3 text-right font-bold text-slate-800">{fmt(runningBalance)}</td>
                                        <td></td>
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

import AppLayout from "@/Layouts/AppLayout";
import { Head, router, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

const fmt = (v) =>
    Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function BankReconciliationIndex({
    accounts,
    transactions,
    filters,
    summary,
}) {
    const { t } = useTranslation();
    const [selected, setSelected] = useState([]);
    const { confirm: dlgConfirm, alert: dlgAlert } = useDialog();

    const toggleSelect = (id) =>
        setSelected((sel) =>
            sel.includes(id) ? sel.filter((s) => s !== id) : [...sel, id],
        );
    const toggleAll = () =>
        setSelected((sel) =>
            sel.length === transactions.length
                ? []
                : transactions.map((t) => t.id),
        );

    const applyFilter = (key, value) => {
        router.get(
            route("finance.bank-reconciliation"),
            { ...filters, [key]: value },
            { preserveState: true },
        );
    };

    const reconcileSelected = async () => {
        if (!selected.length) {
            await dlgAlert("Please select at least one transaction.", {
                title: t("No Selection"),
                intent: "warning",
            });
            return;
        }
        if (
            await dlgConfirm(`Reconcile ${selected.length} transaction(s)?`, {
                title: t("Confirm Reconciliation"),
                confirmLabel: t("Reconcile"),
                intent: "info",
            })
        ) {
            router.post(
                route("finance.bank-reconciliation.reconcile"),
                { transaction_ids: selected },
                {
                    onSuccess: () => setSelected([]),
                },
            );
        }
    };

    const unreconcile = async (id) => {
        if (
            await dlgConfirm(
                "This transaction will be marked as unreconciled.",
                {
                    title: t("Unreconcile Transaction?"),
                    confirmLabel: t("Unreconcile"),
                    intent: "warning",
                },
            )
        ) {
            router.post(route("finance.bank-reconciliation.unreconcile", id));
        }
    };

    return (
        <AppLayout title={t("Bank Reconciliation")}>
            <Head title={t("Bank Reconciliation")} />
            <PageHeader
                title={t("Bank Reconciliation")}
                subtitle={t("Match bank statement with system transactions")}
            />

            <div className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            {t("Bank Account")}
                        </label>
                        <select
                            value={filters?.bank_account_id ?? ""}
                            onChange={(e) =>
                                applyFilter("bank_account_id", e.target.value)
                            }
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Select Account --</option>
                            {accounts.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.bank_name} — {a.account_number}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            {t("From Date")}
                        </label>
                        <input
                            type="date"
                            value={filters?.date_from ?? ""}
                            onChange={(e) =>
                                applyFilter("date_from", e.target.value)
                            }
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            {t("To Date")}
                        </label>
                        <input
                            type="date"
                            value={filters?.date_to ?? ""}
                            onChange={(e) =>
                                applyFilter("date_to", e.target.value)
                            }
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            {t("Status")}
                        </label>
                        <select
                            value={filters?.reconciled ?? ""}
                            onChange={(e) =>
                                applyFilter("reconciled", e.target.value)
                            }
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">{t("All")}</option>
                            <option value="0">{t("Unreconciled")}</option>
                            <option value="1">{t("Reconciled")}</option>
                        </select>
                    </div>
                </div>

                {/* Summary */}
                {summary && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                            <p className="text-xs text-slate-500 uppercase font-semibold">
                                {t("Total Debits")}
                            </p>
                            <p className="text-lg font-bold text-green-600">
                                {fmt(summary.total_debit)}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                            <p className="text-xs text-slate-500 uppercase font-semibold">
                                {t("Total Credits")}
                            </p>
                            <p className="text-lg font-bold text-red-500">
                                {fmt(summary.total_credit)}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                            <p className="text-xs text-slate-500 uppercase font-semibold">
                                {t("Reconciled")}
                            </p>
                            <p className="text-lg font-bold text-blue-600">
                                {summary.reconciled_count}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                            <p className="text-xs text-slate-500 uppercase font-semibold">
                                {t("Unreconciled")}
                            </p>
                            <p className="text-lg font-bold text-amber-500">
                                {summary.unreconciled_count}
                            </p>
                        </div>
                    </div>
                )}

                {/* Transactions Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700">
                            Transactions ({transactions.length})
                        </h3>
                        {selected.length > 0 && (
                            <button
                                onClick={reconcileSelected}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                            >
                                <CheckCircle size={15} /> Reconcile Selected (
                                {selected.length})
                            </button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selected.length ===
                                                    transactions.length &&
                                                transactions.length > 0
                                            }
                                            onChange={toggleAll}
                                            className="rounded border-slate-300 text-blue-600"
                                        />
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Date")}
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Description")}
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Reference")}
                                    </th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Debit")}
                                    </th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Credit")}
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Status")}
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Action")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {transactions.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-6 py-12 text-center text-slate-400"
                                        >
                                            No transactions found. Select an
                                            account and date range.
                                        </td>
                                    </tr>
                                )}
                                {transactions.map((t) => (
                                    <tr
                                        key={t.id}
                                        className={`hover:bg-slate-50 ${t.is_reconciled ? "opacity-60" : ""}`}
                                    >
                                        <td className="px-4 py-3 text-center">
                                            {!t.is_reconciled && (
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(
                                                        t.id,
                                                    )}
                                                    onChange={() =>
                                                        toggleSelect(t.id)
                                                    }
                                                    className="rounded border-slate-300 text-blue-600"
                                                />
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {t.transaction_date}
                                        </td>
                                        <td className="px-4 py-3 text-slate-700 font-medium">
                                            {t.description}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">
                                            {t.reference ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 text-right text-green-600 font-medium">
                                            {t.debit_amount > 0
                                                ? fmt(t.debit_amount)
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-right text-red-500 font-medium">
                                            {t.credit_amount > 0
                                                ? fmt(t.credit_amount)
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {t.is_reconciled ? (
                                                <Badge color="green">
                                                    Reconciled
                                                </Badge>
                                            ) : (
                                                <Badge color="amber">
                                                    Pending
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {t.is_reconciled && (
                                                <button
                                                    onClick={() =>
                                                        unreconcile(t.id)
                                                    }
                                                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mx-auto"
                                                >
                                                    <XCircle size={14} /> {t("Undo")}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

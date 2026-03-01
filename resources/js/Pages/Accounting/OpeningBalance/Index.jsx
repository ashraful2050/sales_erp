import AppLayout from "@/Layouts/AppLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState, useMemo } from "react";
import PageHeader from "@/Components/PageHeader";
import { Save } from "lucide-react";

const TYPE_COLOR = {
    asset: "blue",
    liability: "red",
    equity: "purple",
    income: "green",
    expense: "orange",
};

export default function OpeningBalanceIndex({
    accounts,
    fiscalYears,
    selectedFY,
    filters,
}) {
    const [search, setSearch] = useState("");
    const [fyId, setFyId] = useState(
        filters?.fiscal_year_id ?? selectedFY?.id ?? "",
    );

    // Local rows state mirrored from accounts (so we can edit inline)
    const [rows, setRows] = useState(() =>
        accounts.map((a) => ({
            account_id: a.id,
            code: a.code,
            name: a.name,
            type: a.type,
            debit: a.opening_debit ?? 0,
            credit: a.opening_credit ?? 0,
            notes: "",
        })),
    );

    const { post, processing } = useForm();

    const filtered = useMemo(
        () =>
            search
                ? rows.filter(
                      (r) =>
                          r.name.toLowerCase().includes(search.toLowerCase()) ||
                          r.code.toLowerCase().includes(search.toLowerCase()),
                  )
                : rows,
        [rows, search],
    );

    const update = (accountId, field, value) => {
        setRows((prev) =>
            prev.map((r) =>
                r.account_id === accountId ? { ...r, [field]: value } : r,
            ),
        );
    };

    const changeFY = (id) => {
        setFyId(id);
        router.get(
            route("accounting.opening-balance.index"),
            { fiscal_year_id: id },
            { preserveState: false },
        );
    };

    const save = (e) => {
        e.preventDefault();
        router.post(route("accounting.opening-balance.upsert"), {
            fiscal_year_id: fyId || null,
            balances: rows.map((r) => ({
                account_id: r.account_id,
                debit: parseFloat(r.debit) || 0,
                credit: parseFloat(r.credit) || 0,
                notes: r.notes,
            })),
        });
    };

    // Totals
    const totalDebit = rows.reduce((s, r) => s + (parseFloat(r.debit) || 0), 0);
    const totalCredit = rows.reduce(
        (s, r) => s + (parseFloat(r.credit) || 0),
        0,
    );
    const balanced = Math.abs(totalDebit - totalCredit) < 0.01;

    return (
        <AppLayout title="Opening Balance">
            <Head title="Opening Balance" />
            <PageHeader
                title="Opening Balance"
                subtitle="Set opening balances for all accounts"
                actions={
                    <button
                        onClick={save}
                        disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Save size={16} />
                        {processing ? "Saving…" : "Save All"}
                    </button>
                }
            />

            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3 items-center">
                {/* Fiscal Year selector */}
                <div>
                    <select
                        value={fyId}
                        onChange={(e) => changeFY(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">No Fiscal Year</option>
                        {fiscalYears.map((fy) => (
                            <option key={fy.id} value={fy.id}>
                                {fy.name} {fy.is_active ? "(Active)" : ""}
                            </option>
                        ))}
                    </select>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search account name or code…"
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                {/* Balance indicator */}
                <div className="ml-auto text-sm">
                    <span
                        className={`font-medium ${balanced ? "text-green-600" : "text-red-600"}`}
                    >
                        {balanced ? "✓ Balanced" : "✗ Not Balanced"} —
                        Difference:{" "}
                        {Math.abs(totalDebit - totalCredit).toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 },
                        )}
                    </span>
                </div>
            </div>

            <form onSubmit={save}>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">
                                        Code
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Account Name
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">
                                        Type
                                    </th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">
                                        Debit (Dr)
                                    </th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">
                                        Credit (Cr)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-slate-400"
                                        >
                                            No accounts found.
                                        </td>
                                    </tr>
                                )}
                                {filtered.map((row) => (
                                    <tr
                                        key={row.account_id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-2 font-mono text-xs text-slate-500">
                                            {row.code}
                                        </td>
                                        <td className="px-6 py-2 text-slate-800">
                                            {row.name}
                                        </td>
                                        <td className="px-6 py-2">
                                            <span
                                                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-${TYPE_COLOR[row.type] ?? "slate"}-100 text-${TYPE_COLOR[row.type] ?? "slate"}-700`}
                                            >
                                                {row.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={row.debit}
                                                onChange={(e) =>
                                                    update(
                                                        row.account_id,
                                                        "debit",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full text-right border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={row.credit}
                                                onChange={(e) =>
                                                    update(
                                                        row.account_id,
                                                        "credit",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full text-right border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase"
                                    >
                                        Totals
                                    </td>
                                    <td className="px-6 py-3 text-right font-bold text-slate-800">
                                        {totalDebit.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </td>
                                    <td className="px-6 py-3 text-right font-bold text-slate-800">
                                        {totalCredit.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}

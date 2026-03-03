import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Edit } from "lucide-react";

export default function Show({ account }) {
    const balance = account.journal_lines?.reduce((sum, line) => sum + Number(line.debit ?? 0) - Number(line.credit ?? 0), 0) ?? 0;

    return (
        <AppLayout>
            <Head title={`Account: ${account.name}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={account.name}
                    subtitle={`Code: ${account.code ?? "—"}`}
                    actions={
                        <div className="flex gap-2">
                            <Link href={route("accounting.accounts.index")} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                                <ArrowLeft className="w-4 h-4" /> {t("Back")}
                            </Link>
                            <Link href={route("accounting.accounts.edit", account.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                                <Edit className="w-4 h-4" /> {t("Edit")}
                            </Link>
                        </div>
                    }
                />

                {/* Balance Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50 text-indigo-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">{t("Current Balance")}</p>
                        <p className="text-2xl font-bold mt-1">৳{Math.abs(balance).toLocaleString()}</p>
                        <p className="text-xs mt-1">{balance >= 0 ? "Debit" : "Credit"}</p>
                    </div>
                    <div className="bg-green-50 text-green-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">{t("Total Debits")}</p>
                        <p className="text-2xl font-bold mt-1">৳{account.journal_lines?.reduce((s, l) => s + Number(l.debit ?? 0), 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 text-red-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">{t("Total Credits")}</p>
                        <p className="text-2xl font-bold mt-1">৳{account.journal_lines?.reduce((s, l) => s + Number(l.credit ?? 0), 0).toLocaleString()}</p>
                    </div>
                </div>

                {/* Account Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <dt className="text-xs text-gray-500">Account Group</dt>
                            <dd className="font-medium">{account.group?.name ?? "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Account Type</dt>
                            <dd className="font-medium capitalize">{account.account_type ?? "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500 mb-1">Status</dt>
                            <dd><Badge color={account.is_active ? "green" : "red"}>{account.is_active ? "Active" : "Inactive"}</Badge></dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Normal Balance</dt>
                            <dd className="font-medium capitalize">{account.normal_balance ?? "—"}</dd>
                        </div>
                    </dl>
                    {account.description && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <dt className="text-xs text-gray-500 mb-1">Description</dt>
                            <dd className="text-sm text-gray-700">{account.description}</dd>
                        </div>
                    )}
                </div>

                {/* Ledger / Journal Lines */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">Ledger Entries</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {["Date", "Journal #", "Description", "Debit", "Credit"].map((h) => (
                                        <th key={h} className={`px-4 py-3 ${h === "Debit" || h === "Credit" ? "text-right" : "text-left"}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {account.journal_lines?.length ? account.journal_lines.map((line) => (
                                    <tr key={line.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">{line.journal_entry?.entry_date}</td>
                                        <td className="px-4 py-3">
                                            <Link href={route("accounting.journal-entries.show", line.journal_entry_id)} className="text-indigo-600 hover:underline">
                                                {line.journal_entry?.entry_number ?? `#${line.journal_entry_id}`}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{line.description ?? line.journal_entry?.reference ?? "—"}</td>
                                        <td className="px-4 py-3 text-right text-green-700">{line.debit > 0 ? `৳${Number(line.debit).toLocaleString()}` : "—"}</td>
                                        <td className="px-4 py-3 text-right text-red-700">{line.credit > 0 ? `৳${Number(line.credit).toLocaleString()}` : "—"}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No journal entries</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

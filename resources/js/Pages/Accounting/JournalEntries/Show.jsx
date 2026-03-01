import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Edit } from "lucide-react";

export default function Show({ entry }) {
    const totalDebits = entry.lines?.reduce((s, l) => s + Number(l.debit ?? 0), 0) ?? 0;
    const totalCredits = entry.lines?.reduce((s, l) => s + Number(l.credit ?? 0), 0) ?? 0;
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

    return (
        <AppLayout>
            <Head title={`Journal: ${entry.entry_number}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={`Journal Entry ${entry.entry_number}`}
                    subtitle={`Date: ${entry.entry_date}`}
                    actions={
                        <div className="flex gap-2">
                            <Link href={route("accounting.journal-entries.index")} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </Link>
                            {entry.status === "draft" && (
                                <Link href={route("accounting.journal-entries.edit", entry.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                                    <Edit className="w-4 h-4" /> Edit
                                </Link>
                            )}
                        </div>
                    }
                />

                {/* Header Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <Badge color={entry.status === "posted" ? "green" : entry.status === "draft" ? "yellow" : "red"}>{entry.status}</Badge>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Entry Type</p>
                            <p className="font-medium capitalize">{entry.entry_type ?? "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Reference</p>
                            <p className="font-medium">{entry.reference ?? "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Created By</p>
                            <p className="font-medium">{entry.created_by?.name ?? "—"}</p>
                        </div>
                    </div>
                    {entry.description && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">Description</p>
                            <p className="text-sm text-gray-700">{entry.description}</p>
                        </div>
                    )}
                </div>

                {/* Balance indicator */}
                <div className={`rounded-xl px-4 py-3 text-sm font-medium ${isBalanced ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {isBalanced ? "✓ Entry is balanced" : `⚠ Entry is unbalanced — Difference: ৳${Math.abs(totalDebits - totalCredits).toLocaleString()}`}
                </div>

                {/* Lines */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">Journal Lines</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-4 py-3 text-left">Account</th>
                                    <th className="px-4 py-3 text-left">Description</th>
                                    <th className="px-4 py-3 text-right">Debit</th>
                                    <th className="px-4 py-3 text-right">Credit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {entry.lines?.map((line) => (
                                    <tr key={line.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <Link href={route("accounting.accounts.show", line.account_id)} className="text-indigo-600 hover:underline font-medium">
                                                {line.account?.code} — {line.account?.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{line.description ?? "—"}</td>
                                        <td className="px-4 py-3 text-right text-green-700 font-medium">
                                            {line.debit > 0 ? `৳${Number(line.debit).toLocaleString()}` : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-right text-red-700 font-medium">
                                            {line.credit > 0 ? `৳${Number(line.credit).toLocaleString()}` : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 font-semibold text-sm">
                                <tr>
                                    <td className="px-4 py-3" colSpan={2}>Totals</td>
                                    <td className="px-4 py-3 text-right text-green-700">৳{totalDebits.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right text-red-700">৳{totalCredits.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

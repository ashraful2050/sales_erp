import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Edit } from "lucide-react";

export default function Show({ group }) {
    return (
        <AppLayout>
            <Head title={`Account Group: ${group.name}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={group.name}
                    subtitle="Account Group Details"
                    actions={
                        <div className="flex gap-2">
                            <Link href={route("accounting.account-groups.index")} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </Link>
                            <Link href={route("accounting.account-groups.edit", group.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                                <Edit className="w-4 h-4" /> Edit
                            </Link>
                        </div>
                    }
                />

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <dt className="text-xs text-gray-500">Code</dt>
                            <dd className="font-medium">{group.code ?? "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Type</dt>
                            <dd className="font-medium capitalize">{group.type ?? "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Total Accounts</dt>
                            <dd className="font-medium">{group.accounts?.length ?? 0}</dd>
                        </div>
                    </dl>
                    {group.description && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <dt className="text-xs text-gray-500 mb-1">Description</dt>
                            <dd className="text-sm text-gray-700">{group.description}</dd>
                        </div>
                    )}
                </div>

                {/* Accounts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">Accounts</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {["Code", "Name", "Type", "Status"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {group.accounts?.length ? group.accounts.map((acc) => (
                                    <tr key={acc.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-500">{acc.code}</td>
                                        <td className="px-4 py-3">
                                            <Link href={route("accounting.accounts.show", acc.id)} className="text-indigo-600 hover:underline font-medium">{acc.name}</Link>
                                        </td>
                                        <td className="px-4 py-3 capitalize">{acc.account_type ?? "—"}</td>
                                        <td className="px-4 py-3"><Badge color={acc.is_active ? "green" : "red"}>{acc.is_active ? "Active" : "Inactive"}</Badge></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No accounts in this group</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

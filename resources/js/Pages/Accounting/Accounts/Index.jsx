import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";

const TYPE_COLOR = {
    asset: "blue",
    liability: "red",
    equity: "purple",
    revenue: "green",
    expense: "amber",
};

export default function AccountsIndex({ accounts, filters }) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [type, setType] = useState(filters?.type ?? "");
    const apply = (s, t) =>
        router.get(
            route("accounting.accounts.index"),
            { search: s, type: t },
            { preserveState: true, replace: true },
        );
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm("This account will be permanently removed.", {
                title: "Delete Account?",
                confirmLabel: "Delete",
                intent: "danger",
            })
        )
            router.delete(route("accounting.accounts.destroy", id));
    };

    return (
        <AppLayout title="Chart of Accounts">
            <Head title="Chart of Accounts" />
            <PageHeader
                title="Chart of Accounts"
                subtitle={`${accounts.total} total accounts`}
                actions={
                    <Link
                        href={route("accounting.accounts.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> New Account
                    </Link>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3">
                <SearchFilter
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        apply(v, type);
                    }}
                    placeholder="Search name or code…"
                />
                <select
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        apply(search, e.target.value);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Types</option>
                    {["asset", "liability", "equity", "revenue", "expense"].map(
                        (t) => (
                            <option key={t} value={t}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </option>
                        ),
                    )}
                </select>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Code
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Account Name
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Group
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Opening Balance
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {accounts.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        No accounts found.
                                    </td>
                                </tr>
                            )}
                            {accounts.data.map((a) => (
                                <tr
                                    key={a.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                                        {a.code}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">
                                            {a.name}
                                        </div>
                                        {a.name_bn && (
                                            <div className="text-xs text-slate-400">
                                                {a.name_bn}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {a.group?.name ?? "—"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            color={
                                                TYPE_COLOR[a.type] ?? "slate"
                                            }
                                        >
                                            {a.type}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-700">
                                        ৳
                                        {Number(
                                            a.opening_balance ?? 0,
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                a.is_active ? "green" : "red"
                                            }
                                        >
                                            {a.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "accounting.accounts.show",
                                                    a.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Eye size={15} />
                                            </Link>
                                            <Link
                                                href={route(
                                                    "accounting.accounts.edit",
                                                    a.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                            >
                                                <Pencil size={15} />
                                            </Link>
                                            {!a.is_system && (
                                                <button
                                                    onClick={() => del(a.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination links={accounts.links} />
            </div>
        </AppLayout>
    );
}

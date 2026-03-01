import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import { Plus, Eye, Pencil, Trash2, Lock } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";

const TYPE_LABELS = {
    asset: "Asset",
    liability: "Liability",
    equity: "Equity",
    revenue: "Revenue",
    expense: "Expense",
};
const TYPE_COLORS = {
    asset: "blue",
    liability: "red",
    equity: "purple",
    revenue: "green",
    expense: "amber",
};

export default function AccountGroupsIndex({ groups, filters }) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [type, setType] = useState(filters?.type ?? "");
    const apply = (s, t) =>
        router.get(
            route("accounting.account-groups.index"),
            { search: s, type: t },
            { preserveState: true, replace: true },
        );
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(
                "This account group will be permanently removed.",
                {
                    title: "Delete Account Group?",
                    confirmLabel: "Delete",
                    intent: "danger",
                },
            )
        )
            router.delete(route("accounting.account-groups.destroy", id));
    };

    return (
        <AppLayout title="Account Groups">
            <Head title="Account Groups" />
            <PageHeader
                title="Account Groups"
                subtitle={`${groups.total} groups`}
                actions={
                    <Link
                        href={route("accounting.account-groups.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> New Group
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
                    placeholder="Search group name…"
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
                    {Object.entries(TYPE_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                            {v}
                        </option>
                    ))}
                </select>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Group Name
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Nature
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    System
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {groups.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        No account groups found.
                                    </td>
                                </tr>
                            )}
                            {groups.data.map((g) => (
                                <tr
                                    key={g.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800 flex items-center gap-2">
                                            {g.is_system && (
                                                <Lock
                                                    size={13}
                                                    className="text-slate-400"
                                                />
                                            )}
                                            {g.name}
                                        </div>
                                        {g.parent && (
                                            <div className="text-xs text-slate-400">
                                                Under: {g.parent.name}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            color={
                                                TYPE_COLORS[g.type] ?? "slate"
                                            }
                                        >
                                            {TYPE_LABELS[g.type] ?? g.type}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 capitalize text-slate-600">
                                        {g.nature}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {g.is_system ? (
                                            <span className="text-xs text-slate-500 font-medium">
                                                System
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-300">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "accounting.account-groups.edit",
                                                    g.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                            >
                                                <Pencil size={15} />
                                            </Link>
                                            {!g.is_system && (
                                                <button
                                                    onClick={() => del(g.id)}
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
                <Pagination links={groups.links} />
            </div>
        </AppLayout>
    );
}

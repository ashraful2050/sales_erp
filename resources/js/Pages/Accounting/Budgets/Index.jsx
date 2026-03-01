import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";

const STATUS_COLORS = { draft: "slate", approved: "green" };

export default function BudgetsIndex({ budgets }) {
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm("This budget will be permanently removed.", {
                title: "Delete Budget?",
                confirmLabel: "Delete",
                intent: "danger",
            })
        )
            router.delete(route("accounting.budgets.destroy", id));
    };

    const fmt = (v) =>
        Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

    return (
        <AppLayout title="Budgets">
            <Head title="Budgets" />
            <PageHeader
                title="Budgets"
                subtitle={`${budgets.length} budgets`}
                actions={
                    <Link
                        href={route("accounting.budgets.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> New Budget
                    </Link>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Name
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Fiscal Year
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Cost Center
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Period
                            </th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {budgets.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center text-slate-400"
                                >
                                    No budgets found.
                                </td>
                            </tr>
                        )}
                        {budgets.map((b) => (
                            <tr
                                key={b.id}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-6 py-4 font-medium text-slate-800">
                                    {b.name}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {b.fiscal_year?.name ?? "—"}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {b.cost_center?.name ?? "—"}
                                </td>
                                <td className="px-6 py-4 capitalize text-slate-500">
                                    {b.period}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Badge color={STATUS_COLORS[b.status]}>
                                        {b.status.charAt(0).toUpperCase() +
                                            b.status.slice(1)}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Link
                                            href={route(
                                                "accounting.budgets.edit",
                                                b.id,
                                            )}
                                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                        >
                                            <Pencil size={15} />
                                        </Link>
                                        <button
                                            onClick={() => del(b.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import ExportButtons from "@/Components/ExportButtons";
import { fmtDate } from "@/utils/date";
import { useDialog } from "@/hooks/useDialog";

const STATUS_COLOR = {
    draft: "slate",
    sent: "blue",
    partial: "amber",
    paid: "green",
    overdue: "red",
    cancelled: "slate",
};
const fmt = (v) =>
    Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function CreditNotesIndex({ notes, filters }) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [status, setStatus] = useState(filters?.status ?? "");

    const apply = (s, st) =>
        router.get(
            route("sales.credit-notes.index"),
            { search: s, status: st },
            { preserveState: true, replace: true },
        );
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm("This credit note will be permanently removed.", {
                title: "Delete Credit Note?",
                confirmLabel: "Delete",
                intent: "danger",
            })
        )
            router.delete(route("sales.credit-notes.destroy", id));
    };

    return (
        <AppLayout title="Credit Notes">
            <Head title="Credit Notes" />
            <PageHeader
                title="Credit Notes (Sales Returns)"
                subtitle={`${notes.total} total`}
                actions={
                    <Link
                        href={route("sales.credit-notes.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> New Credit Note
                    </Link>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3">
                <SearchFilter
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        apply(v, status);
                    }}
                    placeholder="Search by note #, customer…"
                />
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        apply(search, e.target.value);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Status</option>
                    {["draft", "sent", "partial", "paid", "cancelled"].map(
                        (s) => (
                            <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ),
                    )}
                </select>
                <ExportButtons
                    tableId="export-table"
                    filename="credit-notes"
                    title="Credit Notes"
                />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm" id="export-table">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                #
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Date
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Customer
                            </th>
                            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Total
                            </th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 w-28"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {notes.data?.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center text-slate-400"
                                >
                                    No credit notes found.
                                </td>
                            </tr>
                        )}
                        {notes.data?.map((n) => (
                            <tr
                                key={n.id}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-6 py-4 font-mono text-slate-700 font-medium">
                                    {n.invoice_number}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {fmtDate(n.invoice_date)}
                                </td>
                                <td className="px-6 py-4 text-slate-700">
                                    {n.customer?.name}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-800">
                                    {fmt(n.total_amount)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Badge
                                        color={
                                            STATUS_COLOR[n.status] ?? "slate"
                                        }
                                    >
                                        {n.status?.charAt(0).toUpperCase() +
                                            n.status?.slice(1)}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Link
                                            href={route(
                                                "sales.credit-notes.show",
                                                n.id,
                                            )}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <Eye size={15} />
                                        </Link>
                                        <Link
                                            href={route(
                                                "sales.credit-notes.edit",
                                                n.id,
                                            )}
                                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                        >
                                            <Pencil size={15} />
                                        </Link>
                                        <button
                                            onClick={() => del(n.id)}
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
                {notes.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200">
                        <Pagination links={notes.links} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

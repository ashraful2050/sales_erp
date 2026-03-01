import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import { Plus, Eye, Pencil, Trash2, FileText } from "lucide-react";
import ExportButtons from "@/Components/ExportButtons";
import { fmtDate } from "@/utils/date";
import { useDialog } from "@/hooks/useDialog";

const STATUS_COLOR = { draft: "slate", sent: "blue", cancelled: "slate" };
const TYPE_COLOR = { quotation: "blue", proforma: "amber" };
const fmt = (v) =>
    Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function QuotationsIndex({ quotes, filters }) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [type, setType] = useState(filters?.type ?? "");

    const apply = (s, t) =>
        router.get(
            route("sales.quotations.index"),
            { search: s, type: t },
            { preserveState: true, replace: true },
        );
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm("This quotation will be permanently removed.", {
                title: "Delete Quotation?",
                confirmLabel: "Delete",
                intent: "danger",
            })
        )
            router.delete(route("sales.quotations.destroy", id));
    };
    const convert = async (id) => {
        if (
            await dlgConfirm(
                "A new sales invoice will be created from this quotation.",
                {
                    title: "Convert to Invoice?",
                    confirmLabel: "Convert",
                    intent: "info",
                },
            )
        )
            router.post(route("sales.quotations.convert", id));
    };

    return (
        <AppLayout title="Quotations">
            <Head title="Quotations" />
            <PageHeader
                title="Quotations &amp; Proforma Invoices"
                subtitle={`${quotes.total} total`}
                actions={
                    <Link
                        href={route("sales.quotations.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> New Quotation
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
                    placeholder="Search by #, customer…"
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
                    <option value="quotation">Quotation</option>
                    <option value="proforma">Proforma Invoice</option>
                </select>
                <ExportButtons
                    tableId="export-table"
                    filename="quotations"
                    title="Quotations"
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
                                Type
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Date
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Customer
                            </th>
                            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Amount
                            </th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 w-36"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {quotes.data?.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-12 text-center text-slate-400"
                                >
                                    No quotations found.
                                </td>
                            </tr>
                        )}
                        {quotes.data?.map((q) => (
                            <tr
                                key={q.id}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-6 py-4 font-mono text-slate-700 font-medium">
                                    {q.invoice_number}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge color={TYPE_COLOR[q.type]}>
                                        {q.type === "proforma"
                                            ? "Proforma"
                                            : "Quotation"}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {fmtDate(q.invoice_date)}
                                </td>
                                <td className="px-6 py-4 text-slate-700">
                                    {q.customer?.name}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-800">
                                    {fmt(q.total_amount)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Badge
                                        color={
                                            STATUS_COLOR[q.status] ?? "slate"
                                        }
                                    >
                                        {q.status?.charAt(0).toUpperCase() +
                                            q.status?.slice(1)}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Link
                                            href={route(
                                                "sales.quotations.show",
                                                q.id,
                                            )}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            title="View"
                                        >
                                            <Eye size={15} />
                                        </Link>
                                        <Link
                                            href={route(
                                                "sales.quotations.edit",
                                                q.id,
                                            )}
                                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                            title="Edit"
                                        >
                                            <Pencil size={15} />
                                        </Link>
                                        <button
                                            onClick={() => convert(q.id)}
                                            className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded"
                                            title="Convert to Invoice"
                                        >
                                            <FileText size={15} />
                                        </button>
                                        <button
                                            onClick={() => del(q.id)}
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
                {quotes.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200">
                        <Pagination links={quotes.links} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

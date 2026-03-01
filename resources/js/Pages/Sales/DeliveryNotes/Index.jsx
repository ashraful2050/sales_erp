import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Search, Eye, Trash2 } from "lucide-react";
import ExportButtons from "@/Components/ExportButtons";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";

const statusColors = { draft: "gray", dispatched: "blue", delivered: "green" };

export default function DeliveryNotesIndex({ notes, customers, filters }) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [customerId, setCustomerId] = useState(filters.customer_id ?? "");
    const [status, setStatus] = useState(filters.status ?? "");

    const apply = () =>
        router.get(
            route("sales.delivery-notes.index"),
            { search, customer_id: customerId, status },
            { preserveState: true },
        );
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(
                "This delivery note will be permanently removed.",
                {
                    title: "Delete Delivery Note?",
                    confirmLabel: "Delete",
                    intent: "danger",
                },
            )
        )
            router.delete(route("sales.delivery-notes.destroy", id));
    };

    return (
        <AppLayout title="Delivery Notes">
            <Head title="Delivery Notes" />
            <PageHeader
                title="Delivery Notes (Challan)"
                subtitle="Manage goods dispatched to customers"
                actions={
                    <Link
                        href={route("sales.delivery-notes.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> New Delivery Note
                    </Link>
                }
            />
            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2 flex-1 min-w-48">
                    <Search size={16} className="text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && apply()}
                        placeholder="Delivery note number…"
                        className="flex-1 text-sm outline-none"
                    />
                </div>
                <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
                >
                    <option value="">All Customers</option>
                    {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
                >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                </select>
                <button
                    onClick={apply}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700"
                >
                    Filter
                </button>
                <ExportButtons
                    tableId="export-table"
                    filename="delivery-notes"
                    title="Delivery Notes"
                />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm" id="export-table">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {[
                                "Note #",
                                "Date",
                                "Customer",
                                "Invoice",
                                "Status",
                                "",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {notes.data?.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-12 text-slate-400"
                                >
                                    No delivery notes found.
                                </td>
                            </tr>
                        )}
                        {notes.data?.map((n) => (
                            <tr key={n.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-mono text-xs text-blue-600">
                                    {n.note_number}
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                    {n.dispatch_date}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                    {n.customer?.name ?? "—"}
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {n.invoice?.invoice_number ?? "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge
                                        color={statusColors[n.status] ?? "gray"}
                                    >
                                        {n.status}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Link
                                            href={route(
                                                "sales.delivery-notes.show",
                                                n.id,
                                            )}
                                            className="text-slate-400 hover:text-blue-600"
                                        >
                                            <Eye size={15} />
                                        </Link>
                                        <button
                                            onClick={() => del(n.id)}
                                            className="text-slate-400 hover:text-red-600"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {notes.links && notes.links.length > 3 && (
                    <div className="px-4 py-3 border-t border-slate-200 flex gap-1">
                        {notes.links.map((l, i) => (
                            <Link
                                key={i}
                                href={l.url ?? "#"}
                                preserveScroll
                                className={`px-3 py-1 rounded text-sm ${l.active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"} ${!l.url ? "opacity-40 pointer-events-none" : ""}`}
                                dangerouslySetInnerHTML={{ __html: l.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
import ExportButtons from "@/Components/ExportButtons";
import { useState } from "react";
import { fmtDate } from "@/utils/date";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

const statusColor = {
    draft: "gray",
    submitted: "amber",
    approved: "green",
    cancelled: "red",
};
const fmt = (v) =>
    Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function DebitNoteIndex({ debitNotes, filters }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters?.search ?? "");
    const [status, setStatus] = useState(filters?.status ?? "");

    const applyFilters = () =>
        router.get(
            route("purchase.debit-notes.index"),
            { search, status },
            { preserveState: true },
        );

    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(t("This debit note will be permanently removed."), {
                title: t("Delete Debit Note?"),
                confirmLabel: t("Delete"),
                intent: "danger",
            })
        )
            router.delete(route("purchase.debit-notes.destroy", id));
    };

    return (
        <AppLayout title={t("Debit Notes")}>
            <Head title={t("Debit Notes")} />
            <PageHeader
                title={t("Debit Notes")}
                subtitle={t("Manage purchase returns")}
                actions={
                    <Link
                        href={route("purchase.debit-notes.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("New Debit Note")}
                    </Link>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200">
                <div className="p-4 border-b border-slate-200 flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && applyFilters()
                            }
                            placeholder={t("Search debit notes...")}
                            className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            router.get(
                                route("purchase.debit-notes.index"),
                                { search, status: e.target.value },
                                { preserveState: true },
                            );
                        }}
                        className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">{t("All Statuses")}</option>
                        <option value="draft">{t("Draft")}</option>
                        <option value="submitted">{t("Submitted")}</option>
                        <option value="approved">{t("Approved")}</option>
                        <option value="cancelled">{t("Cancelled")}</option>
                    </select>
                    <ExportButtons
                        tableId="export-table"
                        filename="debit-notes"
                        title="Debit Notes"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" id="export-table">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    {t("DN Number")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    {t("Date")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    {t("Vendor")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    {t("Amount")}
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    {t("Status")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    {t("Actions")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {debitNotes.data?.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        {t("No debit notes found.")}
                                    </td>
                                </tr>
                            )}
                            {debitNotes.data?.map((dn) => (
                                <tr key={dn.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-blue-600">
                                        {dn.po_number}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {fmtDate(dn.po_date)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {dn.vendor?.name ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium">
                                        {fmt(dn.total_amount)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                statusColor[dn.status] ?? "gray"
                                            }
                                        >
                                            {dn.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={route(
                                                    "purchase.debit-notes.show",
                                                    dn.id,
                                                )}
                                                className="p-1 text-slate-500 hover:text-blue-600"
                                            >
                                                <Eye size={15} />
                                            </Link>
                                            <Link
                                                href={route(
                                                    "purchase.debit-notes.edit",
                                                    dn.id,
                                                )}
                                                className="p-1 text-slate-500 hover:text-amber-600"
                                            >
                                                <Pencil size={15} />
                                            </Link>
                                            <button
                                                onClick={() => del(dn.id)}
                                                className="p-1 text-slate-500 hover:text-red-600"
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
                {debitNotes.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-600">
                        <span>
                            Showing {debitNotes.from}–{debitNotes.to} of{" "}
                            {debitNotes.total}
                        </span>
                        <div className="flex gap-2">
                            {debitNotes.prev_page_url && (
                                <Link
                                    href={debitNotes.prev_page_url}
                                    className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50"
                                >
                                    Prev
                                </Link>
                            )}
                            {debitNotes.next_page_url && (
                                <Link
                                    href={debitNotes.next_page_url}
                                    className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

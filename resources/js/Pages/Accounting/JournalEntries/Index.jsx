import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import { Plus, Eye, Pencil, Trash2, CheckCircle } from "lucide-react";
import { fmtDate } from "@/utils/date";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

const TYPE_LABEL = {
    journal: "Journal",
    payment: "Payment Voucher",
    receipt: "Receipt Voucher",
    contra: "Contra",
};
const STATUS_COLOR = { draft: "slate", posted: "green", voided: "red" };

export default function JournalEntriesIndex({ entries, filters }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters?.search ?? "");
    const [type, setType] = useState(filters?.type ?? "");
    const [status, setStatus] = useState(filters?.status ?? "");
    const apply = (s, t, st) =>
        router.get(
            route("accounting.journal-entries.index"),
            { search: s, type: t, status: st },
            { preserveState: true, replace: true },
        );
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(
                "This journal entry will be permanently removed.",
                {
                    title: t("Delete Journal Entry?"),
                    confirmLabel: t("Delete"),
                    intent: "danger",
                },
            )
        )
            router.delete(route("accounting.journal-entries.destroy", id));
    };

    return (
        <AppLayout title={t("Journal Entries")}>
            <Head title={t("Journal Entries")} />
            <PageHeader
                title={t("Journal Entries")}
                subtitle={`${entries.total} ${t("total entries")}`}
                actions={
                    <Link
                        href={route("accounting.journal-entries.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("New Entry")}
                    </Link>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3">
                <SearchFilter
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        apply(v, type, status);
                    }}
                    placeholder={t("Search voucher #, narration…")}
                />
                <select
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        apply(search, e.target.value, status);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{t("All Types")}</option>
                    {["journal", "payment", "receipt", "contra"].map((t) => (
                        <option key={t} value={t}>
                            {TYPE_LABEL[t]}
                        </option>
                    ))}
                </select>
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        apply(search, type, e.target.value);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{t("All Status")}</option>
                    <option value="draft">{t("Draft")}</option>
                    <option value="posted">{t("Posted")}</option>
                </select>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Voucher #")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Type")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Date")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Narration")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Created By")}
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Status")}
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {entries.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        {t("No journal entries found.")}
                                    </td>
                                </tr>
                            )}
                            {entries.data.map((jv) => (
                                <tr
                                    key={jv.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-mono font-medium text-blue-600">
                                        <Link
                                            href={route(
                                                "accounting.journal-entries.show",
                                                jv.id,
                                            )}
                                            className="hover:underline"
                                        >
                                            {jv.voucher_number}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge color="indigo">
                                            {TYPE_LABEL[jv.type] ?? jv.type}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {fmtDate(jv.date)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                                        {jv.narration ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {jv.created_by?.name ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                STATUS_COLOR[jv.status] ??
                                                "slate"
                                            }
                                        >
                                            {jv.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "accounting.journal-entries.show",
                                                    jv.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Eye size={15} />
                                            </Link>
                                            {jv.status === "draft" && (
                                                <>
                                                    <Link
                                                        href={route(
                                                            "accounting.journal-entries.edit",
                                                            jv.id,
                                                        )}
                                                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                                    >
                                                        <Pencil size={15} />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            del(jv.id)
                                                        }
                                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination links={entries.links} />
            </div>
        </AppLayout>
    );
}

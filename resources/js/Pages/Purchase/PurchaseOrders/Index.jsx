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
import { useTranslation } from "@/hooks/useTranslation";

const STATUS_COLOR = {
    draft: "slate",
    sent: "blue",
    partial: "amber",
    approved: "cyan",
    received: "green",
    cancelled: "red",
};

export default function PurchaseOrdersIndex({ orders, filters }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters?.search ?? "");
    const [status, setStatus] = useState(filters?.status ?? "");
    const apply = (s, st) =>
        router.get(
            route("purchase.purchase-orders.index"),
            { search: s, status: st },
            { preserveState: true, replace: true },
        );
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(
                "This purchase order will be permanently removed.",
                {
                    title: t("Delete Purchase Order?"),
                    confirmLabel: t("Delete"),
                    intent: "danger",
                },
            )
        )
            router.delete(route("purchase.purchase-orders.destroy", id));
    };

    return (
        <AppLayout title={t("Purchase Orders")}>
            <Head title={t("Purchase Orders")} />
            <PageHeader
                title={t("Purchase Orders")}
                subtitle={`${orders.total} ${t("total orders")}`}
                actions={
                    <Link
                        href={route("purchase.purchase-orders.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("New Purchase Order")}
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
                    placeholder={t("Search PO number…")}
                />
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        apply(search, e.target.value);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{t("All Status")}</option>
                    {[
                        "draft",
                        "sent",
                        "approved",
                        "received",
                        "partial",
                        "cancelled",
                    ].map((s) => (
                        <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
                <ExportButtons
                    tableId="export-table"
                    filename="purchase-orders"
                    title="Purchase Orders"
                />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" id="export-table">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("PO #")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Vendor")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Date")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Expected")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Amount")}
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Status")}
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        {t("No purchase orders found.")}
                                    </td>
                                </tr>
                            )}
                            {orders.data.map((o) => (
                                <tr
                                    key={o.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-mono font-medium text-blue-600">
                                        <Link
                                            href={route(
                                                "purchase.purchase-orders.show",
                                                o.id,
                                            )}
                                            className="hover:underline"
                                        >
                                            {o.po_number}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {o.vendor?.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {fmtDate(o.po_date)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {fmtDate(o.expected_date)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-medium text-slate-800">
                                        ৳
                                        {Number(
                                            o.total_amount,
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                STATUS_COLOR[o.status] ??
                                                "slate"
                                            }
                                        >
                                            {o.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "purchase.purchase-orders.show",
                                                    o.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Eye size={15} />
                                            </Link>
                                            {o.status === "draft" && (
                                                <Link
                                                    href={route(
                                                        "purchase.purchase-orders.edit",
                                                        o.id,
                                                    )}
                                                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                                >
                                                    <Pencil size={15} />
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => del(o.id)}
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
                <Pagination links={orders.links} />
            </div>
        </AppLayout>
    );
}

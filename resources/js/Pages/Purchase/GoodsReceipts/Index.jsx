import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Search, Eye, Trash2 } from "lucide-react";
import ExportButtons from "@/Components/ExportButtons";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

export default function GoodsReceiptsIndex({ grns, vendors, filters }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? "");
    const [vendorId, setVendorId] = useState(filters.vendor_id ?? "");

    const apply = () =>
        router.get(
            route("purchase.goods-receipts.index"),
            { search, vendor_id: vendorId },
            { preserveState: true },
        );
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(
                "Stock levels will NOT be reversed automatically.",
                {
                    title: t("Delete this GRN?"),
                    confirmLabel: t("Delete"),
                    intent: "danger",
                },
            )
        )
            router.delete(route("purchase.goods-receipts.destroy", id));
    };

    return (
        <AppLayout title={t("Goods Receipts (GRN)")}>
            <Head title={t("Goods Receipts")} />
            <PageHeader
                title={t("Goods Receipts (GRN)")}
                subtitle={t("Record received goods from purchase orders")}
                actions={
                    <Link
                        href={route("purchase.goods-receipts.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("New Receipt")}
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
                        placeholder={t("GRN number…")}
                        className="flex-1 text-sm outline-none"
                    />
                </div>
                <select
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
                >
                    <option value="">{t("All Vendors")}</option>
                    {vendors.map((v) => (
                        <option key={v.id} value={v.id}>
                            {v.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={apply}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700"
                >
                    {t("Filter")}
                </button>
                <ExportButtons
                    tableId="export-table"
                    filename="goods-receipts"
                    title="Goods Receipts"
                />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm" id="export-table">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {[
                                "GRN #",
                                "Date",
                                "Vendor",
                                "PO#",
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
                        {grns.data?.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-12 text-slate-400"
                                >
                                    {t("No GRNs found.")}
                                </td>
                            </tr>
                        )}
                        {grns.data?.map((g) => (
                            <tr key={g.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-mono text-xs text-blue-600">
                                    {g.grn_number}
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                    {g.receipt_date}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                    {g.vendor?.name ?? "—"}
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {g.purchase_order?.po_number ?? "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge color="green">{g.status}</Badge>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Link
                                            href={route(
                                                "purchase.goods-receipts.show",
                                                g.id,
                                            )}
                                            className="text-slate-400 hover:text-blue-600"
                                        >
                                            <Eye size={15} />
                                        </Link>
                                        <button
                                            onClick={() => del(g.id)}
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
                {grns.links && grns.links.length > 3 && (
                    <div className="px-4 py-3 border-t border-slate-200 flex gap-1">
                        {grns.links.map((l, i) => (
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

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function GoodsReceiptShow({ grn }) {
    const { t } = useTranslation();
    const totalCost =
        grn.items?.reduce((s, i) => s + Number(i.total_cost ?? 0), 0) ?? 0;

    return (
        <AppLayout title={`GRN — ${grn.grn_number}`}>
            <Head title={`GRN ${grn.grn_number}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={`Goods Receipt — ${grn.grn_number}`}
                    subtitle={`Vendor: ${grn.vendor?.name ?? "—"}`}
                    actions={
                        <Link
                            href={route("purchase.goods-receipts.index")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" /> {t("Back")}
                        </Link>
                    }
                />
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                {t("GRN Number")}
                            </p>
                            <p className="font-semibold font-mono">
                                {grn.grn_number}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                {t("Receipt Date")}
                            </p>
                            <p className="font-medium">{grn.receipt_date}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                {t("Vendor")}
                            </p>
                            <p className="font-medium">
                                {grn.vendor?.name ?? "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                {t("PO Reference")}
                            </p>
                            <p className="font-medium">
                                {grn.purchase_order?.po_number ?? "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                {t("Status")}
                            </p>
                            <Badge color="green">{grn.status}</Badge>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                {t("Created By")}
                            </p>
                            <p className="font-medium">
                                {grn.creator?.name ?? "—"}
                            </p>
                        </div>
                    </div>
                    {grn.notes && (
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-gray-500 mb-1">
                                {t("Notes")}
                            </p>
                            <p className="text-sm">{grn.notes}</p>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-sm font-semibold">
                            Items Received
                        </h3>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                {[
                                    "Product",
                                    "Qty Received",
                                    "Unit Cost",
                                    "Total Cost",
                                ].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {grn.items?.map((item, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">
                                        {item.product?.name ?? "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {Number(
                                            item.quantity_received,
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        ৳
                                        {Number(
                                            item.unit_cost,
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 font-semibold">
                                        ৳
                                        {Number(
                                            item.total_cost,
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 border-t">
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-4 py-3 text-right text-sm font-semibold"
                                >
                                    Total:
                                </td>
                                <td className="px-4 py-3 font-bold text-blue-700">
                                    ৳{totalCost.toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

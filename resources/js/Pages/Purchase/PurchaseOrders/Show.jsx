import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Edit } from "lucide-react";

export default function Show({ order }) {
    const statusColors = { draft: "gray", sent: "blue", received: "green", cancelled: "red", partial: "yellow" };

    const subtotal = order.items?.reduce((s, i) => s + Number(i.subtotal ?? 0), 0) ?? 0;

    return (
        <AppLayout>
            <Head title={`PO: ${order.po_number}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={`Purchase Order ${order.po_number}`}
                    subtitle={`Vendor: ${order.vendor?.name ?? "—"}`}
                    actions={
                        <div className="flex gap-2">
                            <Link href={route("purchase.purchase-orders.index")} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                                <ArrowLeft className="w-4 h-4" /> {t("Back")}
                            </Link>
                            <Link href={route("purchase.purchase-orders.edit", order.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                                <Edit className="w-4 h-4" /> {t("Edit")}
                            </Link>
                        </div>
                    }
                />

                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">{t("Status")}</p>
                            <Badge color={statusColors[order.status] || "gray"}>{order.status}</Badge>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">{t("Order Date")}</p>
                            <p className="text-sm font-medium">{order.order_date}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">{t("Expected Date")}</p>
                            <p className="text-sm font-medium">{order.expected_date ?? "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">{t("Payment Terms")}</p>
                            <p className="text-sm font-medium">{order.payment_terms ?? "—"}</p>
                        </div>
                    </div>
                    {order.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">{t("Notes")}</p>
                            <p className="text-sm text-gray-700">{order.notes}</p>
                        </div>
                    )}
                </div>

                {/* Line Items */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">Line Items</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {["Product", "Qty", "Unit Cost", "Subtotal"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {order.items?.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{item.product?.name ?? "—"}</td>
                                        <td className="px-4 py-3">{item.quantity}</td>
                                        <td className="px-4 py-3">৳{Number(item.unit_cost).toLocaleString()}</td>
                                        <td className="px-4 py-3 font-medium">৳{Number(item.subtotal ?? 0).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                        <div className="w-48 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t("Subtotal")}</span>
                                <span>৳{subtotal.toLocaleString()}</span>
                            </div>
                            {order.tax_amount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">{t("Tax")}</span>
                                    <span>৳{Number(order.tax_amount).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-base border-t pt-2">
                                <span>{t("Total")}</span>
                                <span>৳{Number(order.total_amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

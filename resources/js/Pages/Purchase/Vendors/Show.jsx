import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Edit, Mail, Phone, Hash } from "lucide-react";

export default function Show({ vendor }) {
    const statusColors = { active: "green", inactive: "red" };

    return (
        <AppLayout>
            <Head title={`Vendor: ${vendor.name}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={vendor.name}
                    subtitle={t("Vendor Details")}
                    actions={
                        <div className="flex gap-2">
                            <Link href={route("purchase.vendors.index")} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                                <ArrowLeft className="w-4 h-4" /> {t("Back")}
                            </Link>
                            <Link href={route("purchase.vendors.edit", vendor.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                                <Edit className="w-4 h-4" /> {t("Edit")}
                            </Link>
                        </div>
                    }
                />

                {/* Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Contact Information</h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <dt className="text-xs text-gray-500">Email</dt>
                                <dd className="text-sm font-medium">{vendor.email || "—"}</dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <dt className="text-xs text-gray-500">Phone</dt>
                                <dd className="text-sm font-medium">{vendor.phone || "—"}</dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Hash className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <dt className="text-xs text-gray-500">BIN Number</dt>
                                <dd className="text-sm font-medium">{vendor.bin_number || "—"}</dd>
                            </div>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500 mb-1">Status</dt>
                            <dd><Badge color={statusColors[vendor.status] || "gray"}>{vendor.status}</Badge></dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Payment Terms</dt>
                            <dd className="text-sm font-medium">{vendor.payment_terms || "—"}</dd>
                        </div>
                        {vendor.address && (
                            <div className="sm:col-span-2">
                                <dt className="text-xs text-gray-500">Address</dt>
                                <dd className="text-sm text-gray-900">{vendor.address}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Recent Purchase Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700">Recent Purchase Orders</h3>
                        <Link href={route("purchase.purchase-orders.index")} className="text-xs text-indigo-600 hover:underline">View all</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {["PO Number", "Date", "Expected Date", "Total", "Status"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {vendor.purchase_orders?.length ? vendor.purchase_orders.map((po) => (
                                    <tr key={po.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <Link href={route("purchase.purchase-orders.show", po.id)} className="text-indigo-600 hover:underline font-medium">
                                                {po.po_number}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">{po.order_date}</td>
                                        <td className="px-4 py-3">{po.expected_date ?? "—"}</td>
                                        <td className="px-4 py-3">৳{Number(po.total_amount).toLocaleString()}</td>
                                        <td className="px-4 py-3"><Badge color={po.status === "received" ? "green" : po.status === "cancelled" ? "red" : "yellow"}>{po.status}</Badge></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No purchase orders found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

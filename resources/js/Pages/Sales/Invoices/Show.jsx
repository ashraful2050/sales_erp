import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import InvoicePrintModal from "@/Components/InvoicePrintModal";
import { ArrowLeft, Edit, Printer, CreditCard } from "lucide-react";
import { useState } from "react";
import { fmtDate } from "@/utils/date";

export default function Show({ invoice, company }) {
    const [showPrint, setShowPrint] = useState(false);
    const statusColors = {
        draft: "gray",
        sent: "blue",
        paid: "green",
        overdue: "red",
        cancelled: "red",
    };

    const subtotal =
        invoice.items?.reduce((s, i) => s + Number(i.subtotal ?? 0), 0) ?? 0;
    const taxTotal =
        invoice.items?.reduce((s, i) => s + Number(i.tax_amount ?? 0), 0) ?? 0;

    return (
        <AppLayout>
            <Head title={`Invoice ${invoice.invoice_number}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={`Invoice ${invoice.invoice_number}`}
                    subtitle={`Customer: ${invoice.customer?.name ?? "—"}`}
                    actions={
                        <div className="flex gap-2">
                            <Link
                                href={route("sales.invoices.index")}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </Link>
                            <button
                                onClick={() => setShowPrint(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 text-sm font-medium"
                            >
                                <Printer className="w-4 h-4" /> Print Invoice
                            </button>
                            <Link
                                href={route("sales.invoices.edit", invoice.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                            >
                                <Edit className="w-4 h-4" /> Edit
                            </Link>
                            {["sent", "partial", "overdue"].includes(
                                invoice.status,
                            ) && (
                                <Link
                                    href={route("finance.payments.create", {
                                        invoice_id: invoice.id,
                                    })}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                                >
                                    <CreditCard className="w-4 h-4" /> Record
                                    Payment
                                </Link>
                            )}
                        </div>
                    }
                />

                {/* Header Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <Badge
                                color={statusColors[invoice.status] || "gray"}
                            >
                                {invoice.status}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                Invoice Date
                            </p>
                            <p className="text-sm font-medium">
                                {fmtDate(invoice.invoice_date)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                Due Date
                            </p>
                            <p className="text-sm font-medium">
                                {fmtDate(invoice.due_date)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                Payment Terms
                            </p>
                            <p className="text-sm font-medium">
                                {invoice.payment_terms ?? "—"}
                            </p>
                        </div>
                    </div>
                    {invoice.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">Notes</p>
                            <p className="text-sm text-gray-700">
                                {invoice.notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Line Items */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Line Items
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {[
                                        "Product",
                                        "Description",
                                        "Qty",
                                        "Unit Price",
                                        "Tax",
                                        "Subtotal",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {invoice.items?.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">
                                            {item.product?.name ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {item.description ?? "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.quantity}
                                        </td>
                                        <td className="px-4 py-3">
                                            ৳
                                            {Number(
                                                item.unit_price,
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.taxRate
                                                ? `${item.taxRate.rate}%`
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            ৳
                                            {Number(
                                                item.subtotal ?? 0,
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Totals */}
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                        <div className="w-64 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span>৳{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tax</span>
                                <span>৳{taxTotal.toLocaleString()}</span>
                            </div>
                            {invoice.discount_amount > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Discount</span>
                                    <span>
                                        -৳
                                        {Number(
                                            invoice.discount_amount,
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-base border-t pt-2">
                                <span>Total</span>
                                <span>
                                    ৳
                                    {Number(
                                        invoice.total_amount,
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>Paid</span>
                                <span>
                                    ৳
                                    {Number(
                                        invoice.paid_amount ?? 0,
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between font-semibold text-red-600 border-t pt-2">
                                <span>Balance Due</span>
                                <span>
                                    ৳
                                    {(
                                        Number(invoice.total_amount) -
                                        Number(invoice.paid_amount ?? 0)
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showPrint && (
                <InvoicePrintModal
                    invoice={invoice}
                    company={company}
                    onClose={() => setShowPrint(false)}
                />
            )}
        </AppLayout>
    );
}

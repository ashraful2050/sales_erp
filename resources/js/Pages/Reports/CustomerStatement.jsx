import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { useState } from "react";
import { fmtDate } from "@/utils/date";

const invStatus = {
    draft: "gray",
    sent: "blue",
    paid: "green",
    partial: "amber",
    overdue: "red",
    cancelled: "red",
};
const fmt = (v) =>
    Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function CustomerStatement({
    customers,
    customer,
    invoices,
    payments,
    filters,
}) {
    const [customerId, setCustomerId] = useState(filters?.customer_id ?? "");
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? "");
    const [dateTo, setDateTo] = useState(filters?.date_to ?? "");

    const apply = () =>
        router.get(
            route("reports.customer-statement"),
            {
                customer_id: customerId,
                date_from: dateFrom,
                date_to: dateTo,
            },
            { preserveState: true },
        );

    const totalInvoiced =
        invoices?.reduce((s, i) => s + Number(i.total_amount || 0), 0) ?? 0;
    const totalPaid =
        payments?.reduce((s, p) => s + Number(p.amount || 0), 0) ?? 0;
    const balance = totalInvoiced - totalPaid;

    return (
        <AppLayout title="Customer Statement">
            <Head title="Customer Statement" />
            <PageHeader
                title="Customer Statement"
                subtitle="Account statement for a specific customer"
            />
            <div className="space-y-6">
                {/* Filter bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Customer *
                        </label>
                        <select
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Customer…</option>
                            {customers?.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            From
                        </label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            To
                        </label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={apply}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                    >
                        View Statement
                    </button>
                </div>

                {customer && (
                    <>
                        {/* Customer info + summary */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-1 bg-white rounded-xl border border-slate-200 p-4">
                                <p className="text-xs text-slate-500 uppercase font-semibold mb-2">
                                    Customer
                                </p>
                                <p className="font-bold text-slate-800 text-lg">
                                    {customer.name}
                                </p>
                                {customer.email && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        {customer.email}
                                    </p>
                                )}
                                {customer.phone && (
                                    <p className="text-xs text-slate-500">
                                        {customer.phone}
                                    </p>
                                )}
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                                <p className="text-xs text-slate-500 uppercase font-semibold">
                                    Total Invoiced
                                </p>
                                <p className="text-xl font-bold text-blue-700 mt-1">
                                    {fmt(totalInvoiced)}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                                <p className="text-xs text-slate-500 uppercase font-semibold">
                                    Total Received
                                </p>
                                <p className="text-xl font-bold text-green-600 mt-1">
                                    {fmt(totalPaid)}
                                </p>
                            </div>
                            <div
                                className={`rounded-xl border p-4 text-center ${balance > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}
                            >
                                <p className="text-xs uppercase font-semibold text-slate-500">
                                    Balance Due
                                </p>
                                <p
                                    className={`text-xl font-bold mt-1 ${balance > 0 ? "text-red-700" : "text-green-700"}`}
                                >
                                    {fmt(balance)}
                                </p>
                            </div>
                        </div>

                        {/* Invoices */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-3 border-b bg-slate-50">
                                <h3 className="text-sm font-semibold text-slate-700">
                                    Invoices ({invoices?.length ?? 0})
                                </h3>
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-white border-b text-xs text-slate-500 uppercase">
                                    <tr>
                                        {[
                                            "Invoice #",
                                            "Date",
                                            "Due Date",
                                            "Total",
                                            "Paid",
                                            "Balance",
                                            "Status",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="px-4 py-3 text-left font-semibold"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {!invoices?.length && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-center py-8 text-slate-400"
                                            >
                                                No invoices in this period.
                                            </td>
                                        </tr>
                                    )}
                                    {invoices?.map((inv) => (
                                        <tr
                                            key={inv.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-3 font-mono text-xs text-blue-600">
                                                {inv.invoice_number}
                                            </td>
                                            <td className="px-4 py-3">
                                                {fmtDate(inv.invoice_date)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {fmtDate(inv.due_date)}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-right">
                                                {fmt(inv.total_amount)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-green-700">
                                                {fmt(inv.paid_amount)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-red-700">
                                                {fmt(
                                                    inv.total_amount -
                                                        inv.paid_amount,
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    color={
                                                        invStatus[inv.status] ??
                                                        "gray"
                                                    }
                                                >
                                                    {inv.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {invoices?.length > 0 && (
                                    <tfoot className="bg-slate-50 border-t-2 border-slate-300 text-sm font-bold">
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-4 py-3"
                                            >
                                                Total
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {fmt(totalInvoiced)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-green-700">
                                                {fmt(totalPaid)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-red-700">
                                                {fmt(balance)}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>

                        {/* Payments */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-3 border-b bg-slate-50">
                                <h3 className="text-sm font-semibold text-slate-700">
                                    Payments ({payments?.length ?? 0})
                                </h3>
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-white border-b text-xs text-slate-500 uppercase">
                                    <tr>
                                        {[
                                            "Payment #",
                                            "Date",
                                            "Method",
                                            "Reference",
                                            "Amount",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="px-4 py-3 text-left font-semibold"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {!payments?.length && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="text-center py-8 text-slate-400"
                                            >
                                                No payments in this period.
                                            </td>
                                        </tr>
                                    )}
                                    {payments?.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-3 font-mono text-xs text-green-700">
                                                {p.payment_number}
                                            </td>
                                            <td className="px-4 py-3">
                                                {fmtDate(p.payment_date)}
                                            </td>
                                            <td className="px-4 py-3 capitalize">
                                                {p.payment_method}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {p.reference ?? "—"}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-right text-green-700">
                                                {fmt(p.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {payments?.length > 0 && (
                                    <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold text-sm">
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-4 py-3"
                                            >
                                                Total Received
                                            </td>
                                            <td className="px-4 py-3 text-right text-green-700">
                                                {fmt(totalPaid)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </>
                )}
                {!customer && (
                    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-16 text-center text-slate-400">
                        Select a customer above to view their statement.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

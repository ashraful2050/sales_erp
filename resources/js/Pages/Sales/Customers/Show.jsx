import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Edit, Mail, Phone, CreditCard, Hash } from "lucide-react";
import { fmtDate } from "@/utils/date";

export default function Show({ customer, summary }) {
    const statusColors = { active: "green", inactive: "red" };

    return (
        <AppLayout>
            <Head title={`Customer: ${customer.name}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={customer.name}
                    subtitle="Customer Details"
                    actions={
                        <div className="flex gap-2">
                            <Link
                                href={route("sales.customers.index")}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </Link>
                            <Link
                                href={route(
                                    "sales.customers.edit",
                                    customer.id,
                                )}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                            >
                                <Edit className="w-4 h-4" /> Edit
                            </Link>
                        </div>
                    }
                />

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            label: "Total Invoiced",
                            value: `৳${summary.totalInvoiced.toLocaleString()}`,
                            color: "bg-blue-50 text-blue-700",
                        },
                        {
                            label: "Total Paid",
                            value: `৳${summary.totalPaid.toLocaleString()}`,
                            color: "bg-green-50 text-green-700",
                        },
                        {
                            label: "Outstanding",
                            value: `৳${summary.outstanding.toLocaleString()}`,
                            color: "bg-red-50 text-red-700",
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className={`rounded-xl p-4 ${s.color}`}
                        >
                            <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                                {s.label}
                            </p>
                            <p className="text-2xl font-bold mt-1">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Customer Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        Contact Information
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <dt className="text-xs text-gray-500">Email</dt>
                                <dd className="text-sm font-medium text-gray-900">
                                    {customer.email || "—"}
                                </dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <dt className="text-xs text-gray-500">Phone</dt>
                                <dd className="text-sm font-medium text-gray-900">
                                    {customer.phone || "—"}
                                </dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Hash className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <dt className="text-xs text-gray-500">
                                    BIN Number
                                </dt>
                                <dd className="text-sm font-medium text-gray-900">
                                    {customer.bin_number || "—"}
                                </dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <dt className="text-xs text-gray-500">
                                    Credit Limit
                                </dt>
                                <dd className="text-sm font-medium text-gray-900">
                                    {customer.credit_limit
                                        ? `৳${Number(customer.credit_limit).toLocaleString()}`
                                        : "—"}
                                </dd>
                            </div>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500 mb-1">
                                Status
                            </dt>
                            <dd>
                                <Badge
                                    color={
                                        statusColors[customer.status] || "gray"
                                    }
                                >
                                    {customer.status}
                                </Badge>
                            </dd>
                        </div>
                        {customer.address && (
                            <div className="sm:col-span-2">
                                <dt className="text-xs text-gray-500">
                                    Address
                                </dt>
                                <dd className="text-sm text-gray-900">
                                    {customer.address}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Recent Invoices */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Recent Invoices
                        </h3>
                        <Link
                            href={route("sales.invoices.index")}
                            className="text-xs text-indigo-600 hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {[
                                        "Invoice #",
                                        "Date",
                                        "Due Date",
                                        "Total",
                                        "Paid",
                                        "Status",
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
                                {customer.invoices?.length ? (
                                    customer.invoices.map((inv) => (
                                        <tr
                                            key={inv.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={route(
                                                        "sales.invoices.show",
                                                        inv.id,
                                                    )}
                                                    className="text-indigo-600 hover:underline font-medium"
                                                >
                                                    {inv.invoice_number}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                {fmtDate(inv.invoice_date)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {fmtDate(inv.due_date)}
                                            </td>
                                            <td className="px-4 py-3">
                                                ৳
                                                {Number(
                                                    inv.total_amount,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                ৳
                                                {Number(
                                                    inv.paid_amount ?? 0,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    color={
                                                        inv.status === "paid"
                                                            ? "green"
                                                            : inv.status ===
                                                                "overdue"
                                                              ? "red"
                                                              : "yellow"
                                                    }
                                                >
                                                    {inv.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-8 text-center text-gray-400"
                                        >
                                            No invoices found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

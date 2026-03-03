import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Edit } from "lucide-react";
import { fmtDate } from "@/utils/date";

export default function Show({ payment }) {
    const typeColors = { receipt: "green", payment: "blue", refund: "red" };

    return (
        <AppLayout>
            <Head title={`Payment ${payment.payment_number}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={`Payment ${payment.payment_number}`}
                    subtitle={`Date: ${fmtDate(payment.payment_date)}`}
                    actions={
                        <div className="flex gap-2">
                            <Link
                                href={route("finance.payments.index")}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> {t("Back")}
                            </Link>
                            <Link
                                href={route(
                                    "finance.payments.edit",
                                    payment.id,
                                )}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                            >
                                <Edit className="w-4 h-4" /> {t("Edit")}
                            </Link>
                        </div>
                    }
                />

                {/* Amount Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50 text-indigo-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                            {t("Payment Amount")}
                        </p>
                        <p className="text-2xl font-bold mt-1">
                            ৳{Number(payment.amount).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-green-50 text-green-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                            {t("Type")}
                        </p>
                        <p className="text-2xl font-bold mt-1 capitalize">
                            {payment.payment_type}
                        </p>
                    </div>
                    <div className="bg-blue-50 text-blue-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                            {t("Method")}
                        </p>
                        <p className="text-2xl font-bold mt-1 capitalize">
                            {payment.payment_method ?? "—"}
                        </p>
                    </div>
                </div>

                {/* Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <dt className="text-xs text-gray-500">Customer</dt>
                            <dd className="font-medium">
                                {payment.customer?.name ?? "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Vendor</dt>
                            <dd className="font-medium">
                                {payment.vendor?.name ?? "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">
                                Bank Account
                            </dt>
                            <dd className="font-medium">
                                {payment.bank_account?.account_name ?? "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Reference</dt>
                            <dd className="font-medium">
                                {payment.reference ?? "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500 mb-1">
                                Status
                            </dt>
                            <dd>
                                <Badge
                                    color={
                                        payment.status === "completed"
                                            ? "green"
                                            : payment.status === "pending"
                                              ? "yellow"
                                              : "red"
                                    }
                                >
                                    {payment.status}
                                </Badge>
                            </dd>
                        </div>
                    </dl>
                    {payment.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <dt className="text-xs text-gray-500 mb-1">
                                Notes
                            </dt>
                            <dd className="text-sm text-gray-700">
                                {payment.notes}
                            </dd>
                        </div>
                    )}
                </div>

                {/* Allocations */}
                {payment.allocations?.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700">
                                Allocations
                            </h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {[
                                        "Reference Type",
                                        "Reference ID",
                                        "Amount",
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
                                {payment.allocations.map((a) => (
                                    <tr key={a.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 capitalize">
                                            {a.reference_type ?? "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            #{a.reference_id}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            ৳
                                            {Number(
                                                a.allocated_amount,
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";

const TYPE_COLOR = {
    cash: "green",
    bank: "blue",
    mobile_banking: "purple",
    other: "slate",
};
const TYPE_LABEL = {
    cash: "Cash",
    bank: "Bank",
    mobile_banking: "Mobile Banking",
    other: "Other",
};

export default function PaymentMethodsIndex({ paymentMethods }) {
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(
                "This payment method will be permanently removed.",
                {
                    title: "Delete Payment Method?",
                    confirmLabel: "Delete",
                    intent: "danger",
                },
            )
        )
            router.delete(route("accounting.payment-methods.destroy", id));
    };

    return (
        <AppLayout title="Payment Methods">
            <Head title="Payment Methods" />
            <PageHeader
                title="Payment Methods"
                subtitle={`${paymentMethods.length} methods configured`}
                actions={
                    <Link
                        href={route("accounting.payment-methods.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> Add Method
                    </Link>
                }
            />

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    #
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Linked Account
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Default
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paymentMethods.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        No payment methods found. Add one to get
                                        started.
                                    </td>
                                </tr>
                            )}
                            {paymentMethods.map((pm, i) => (
                                <tr
                                    key={pm.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4 text-slate-500">
                                        {i + 1}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        <div className="flex items-center gap-2">
                                            {pm.is_default && (
                                                <Star
                                                    size={14}
                                                    className="text-yellow-500 fill-yellow-400"
                                                />
                                            )}
                                            {pm.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            color={
                                                TYPE_COLOR[pm.type] ?? "slate"
                                            }
                                        >
                                            {TYPE_LABEL[pm.type] ?? pm.type}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {pm.account?.name ?? (
                                            <span className="text-slate-400">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {pm.is_default ? (
                                            <Badge color="yellow">
                                                Default
                                            </Badge>
                                        ) : (
                                            <span className="text-slate-400 text-xs">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                pm.is_active ? "green" : "slate"
                                            }
                                        >
                                            {pm.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route(
                                                    "accounting.payment-methods.edit",
                                                    pm.id,
                                                )}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                            >
                                                <Pencil size={15} />
                                            </Link>
                                            <button
                                                onClick={() => del(pm.id)}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
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
            </div>
        </AppLayout>
    );
}

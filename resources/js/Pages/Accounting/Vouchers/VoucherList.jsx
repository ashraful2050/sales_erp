import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";

const STATUS_COLOR = {
    draft: "slate",
    pending: "yellow",
    approved: "green",
    rejected: "red",
};

const TYPE_ROUTE = {
    debit: "accounting.vouchers.debit",
    credit: "accounting.vouchers.credit",
    contra: "accounting.vouchers.contra",
    service: "accounting.vouchers.service",
    cash_adjustment: "accounting.vouchers.adjustment",
};

export default function VoucherList({
    vouchers,
    filters,
    title,
    type,
    paymentMethods,
    accounts,
}) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [status, setStatus] = useState(filters?.status ?? "");

    const apply = (s, st) =>
        router.get(
            route(TYPE_ROUTE[type]),
            { search: s, status: st },
            { preserveState: true, replace: true },
        );

    const { confirm: dlgConfirm } = useDialog();

    const del = async (id) => {
        if (
            await dlgConfirm("This voucher will be permanently removed.", {
                title: "Delete Voucher?",
                confirmLabel: "Delete",
                intent: "danger",
            })
        )
            router.delete(route("accounting.vouchers.destroy", id));
    };

    return (
        <AppLayout title={title}>
            <Head title={title} />
            <PageHeader
                title={title}
                subtitle={`${vouchers.total} total`}
                actions={
                    <Link
                        href={
                            route("accounting.vouchers.create") +
                            `?type=${type}`
                        }
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> New Voucher
                    </Link>
                }
            />

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3">
                <SearchFilter
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        apply(v, status);
                    }}
                    placeholder="Search voucher #, narration…"
                />
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        apply(search, e.target.value);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending Approval</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Voucher #
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Date
                                </th>
                                {type === "contra" ? (
                                    <>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            From
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            To
                                        </th>
                                    </>
                                ) : (
                                    <>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Payment Method
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Account
                                        </th>
                                    </>
                                )}
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Narration
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {vouchers.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        No {title.toLowerCase()} found.
                                    </td>
                                </tr>
                            )}
                            {vouchers.data.map((v) => (
                                <tr
                                    key={v.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-mono font-medium text-blue-600">
                                        <Link
                                            href={route(
                                                "accounting.vouchers.show",
                                                v.id,
                                            )}
                                            className="hover:underline"
                                        >
                                            {v.voucher_number}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {v.voucher_date}
                                    </td>
                                    {type === "contra" ? (
                                        <>
                                            <td className="px-6 py-4 text-slate-600">
                                                {v.from_method?.name ?? "—"}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {v.to_method?.name ?? "—"}
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4 text-slate-600">
                                                {v.payment_method?.name ?? "—"}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {v.account?.name ?? "—"}
                                            </td>
                                        </>
                                    )}
                                    <td className="px-6 py-4 text-right font-medium text-slate-800">
                                        {Number(v.amount).toLocaleString(
                                            "en-US",
                                            { minimumFractionDigits: 2 },
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                                        {v.narration ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                STATUS_COLOR[v.status] ??
                                                "slate"
                                            }
                                        >
                                            {v.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route(
                                                    "accounting.vouchers.show",
                                                    v.id,
                                                )}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                            >
                                                <Eye size={15} />
                                            </Link>
                                            {v.status !== "approved" && (
                                                <>
                                                    <Link
                                                        href={route(
                                                            "accounting.vouchers.edit",
                                                            v.id,
                                                        )}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-green-600 hover:bg-green-50"
                                                    >
                                                        <Pencil size={15} />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            del(v.id)
                                                        }
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-100">
                    <Pagination links={vouchers.links} />
                </div>
            </div>
        </AppLayout>
    );
}

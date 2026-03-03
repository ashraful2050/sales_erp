import AppLayout from "@/Layouts/AppLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

const STATUS_COLOR = { pending: "yellow", approved: "green", rejected: "red" };
const TYPE_LABEL = {
    debit: "Debit",
    credit: "Credit",
    contra: "Contra",
    service: "Service",
    cash_adjustment: "Cash Adj.",
};

function RejectModal({ voucher, onClose }) {
    const { data, setData, post, processing } = useForm({
        rejection_reason: "",
    });
    const submit = (e) => {
        e.preventDefault();
        post(route("accounting.vouchers.reject", voucher.id), {
            onSuccess: onClose,
        });
    };
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <form
                onSubmit={submit}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
            >
                <h3 className="font-semibold text-slate-800 mb-3">
                    Reject Voucher {voucher.voucher_number}
                </h3>
                <textarea
                    rows={3}
                    value={data.rejection_reason}
                    onChange={(e) =>
                        setData("rejection_reason", e.target.value)
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    placeholder={t("Rejection reason (optional)…")}
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg border border-slate-200"
                    >
                        {t("Cancel")}
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {t("Confirm Reject")}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function VoucherApproval({ vouchers, counts, filters }) {
    const { t } = useTranslation();
    const [status, setStatus] = useState(filters?.status ?? "pending");
    const [type, setType] = useState(filters?.type ?? "");
    const [rejectVoucher, setRejectVoucher] = useState(null);

    const apply = (s, t) =>
        router.get(
            route("accounting.vouchers.approval"),
            { status: s, type: t },
            { preserveState: true, replace: true },
        );

    const { confirm: dlgConfirm } = useDialog();

    const approve = async (id) => {
        if (
            await dlgConfirm(
                "The voucher will be approved and posted to the journal.",
                {
                    title: t("Approve Voucher?"),
                    confirmLabel: t("Approve"),
                    intent: "success",
                },
            )
        )
            router.post(route("accounting.vouchers.approve", id));
    };

    return (
        <AppLayout title={t("Voucher Approval")}>
            <Head title={t("Voucher Approval")} />
            <PageHeader
                title={t("Voucher Approval")}
                subtitle={t("Review and approve pending vouchers")}
            />

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                    {
                        key: "pending",
                        label: "Pending",
                        color: "bg-yellow-50 border-yellow-200 text-yellow-700",
                    },
                    {
                        key: "approved",
                        label: "Approved",
                        color: "bg-green-50 border-green-200 text-green-700",
                    },
                    {
                        key: "rejected",
                        label: "Rejected",
                        color: "bg-red-50 border-red-200 text-red-700",
                    },
                ].map((c) => (
                    <button
                        key={c.key}
                        onClick={() => {
                            setStatus(c.key);
                            apply(c.key, type);
                        }}
                        className={`${c.color} border rounded-xl p-4 text-left transition-all ${status === c.key ? "ring-2 ring-offset-1" : ""}`}
                    >
                        <div className="text-2xl font-bold">
                            {counts[c.key]}
                        </div>
                        <div className="text-sm font-medium">{c.label}</div>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex gap-3 flex-wrap">
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        apply(e.target.value, type);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{t("All Status")}</option>
                    <option value="pending">{t("Pending")}</option>
                    <option value="approved">{t("Approved")}</option>
                    <option value="rejected">{t("Rejected")}</option>
                </select>
                <select
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        apply(status, e.target.value);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{t("All Types")}</option>
                    {Object.entries(TYPE_LABEL).map(([v, l]) => (
                        <option key={v} value={v}>
                            {l}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Voucher #")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Type")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Date")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Amount")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Narration")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Submitted By")}
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Status")}
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {vouchers.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        {t("No vouchers found.")}
                                    </td>
                                </tr>
                            )}
                            {vouchers.data.map((v) => (
                                <tr key={v.id} className="hover:bg-slate-50">
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
                                    <td className="px-6 py-4">
                                        <Badge color="indigo">
                                            {TYPE_LABEL[v.voucher_type] ??
                                                v.voucher_type}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {v.voucher_date}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium">
                                        {Number(v.amount).toLocaleString(
                                            "en-US",
                                            { minimumFractionDigits: 2 },
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                                        {v.narration ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {v.creator?.name ?? "—"}
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
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "accounting.vouchers.show",
                                                    v.id,
                                                )}
                                                className="p-1.5 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                            >
                                                <Eye size={15} />
                                            </Link>
                                            {v.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            approve(v.id)
                                                        }
                                                        className="p-1.5 rounded text-slate-500 hover:text-green-600 hover:bg-green-50"
                                                    >
                                                        <CheckCircle
                                                            size={15}
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setRejectVoucher(v)
                                                        }
                                                        className="p-1.5 rounded text-slate-500 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <XCircle size={15} />
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

            {rejectVoucher && (
                <RejectModal
                    voucher={rejectVoucher}
                    onClose={() => setRejectVoucher(null)}
                />
            )}
        </AppLayout>
    );
}

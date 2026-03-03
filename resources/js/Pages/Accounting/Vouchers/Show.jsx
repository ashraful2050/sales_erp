import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, CheckCircle, XCircle, Pencil } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

const STATUS_COLOR = {
    draft: "slate",
    pending: "yellow",
    approved: "green",
    rejected: "red",
};
const TYPE_LABELS = {
    debit: "Debit Voucher",
    credit: "Credit Voucher",
    contra: "Contra Voucher",
    service: "Service Payment",
    cash_adjustment: "Cash Adjustment",
};
const TYPE_BACK = {
    debit: "accounting.vouchers.debit",
    credit: "accounting.vouchers.credit",
    contra: "accounting.vouchers.contra",
    service: "accounting.vouchers.service",
    cash_adjustment: "accounting.vouchers.adjustment",
};

function Detail({ label, value }) {
    return (
        <div>
            <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                {label}
            </dt>
            <dd className="text-sm text-slate-800">
                {value ?? <span className="text-slate-400">—</span>}
            </dd>
        </div>
    );
}

export default function VoucherShow({ voucher }) {
    const { t } = useTranslation();
    const [showRejectForm, setShowRejectForm] = useState(false);
    const { data, setData, post, processing } = useForm({
        rejection_reason: "",
    });

    const typeLabel = TYPE_LABELS[voucher.voucher_type] ?? voucher.voucher_type;
    const backRoute =
        TYPE_BACK[voucher.voucher_type] ?? "accounting.vouchers.debit";

    const { confirm: dlgConfirm } = useDialog();

    const approve = async () => {
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
            router.post(route("accounting.vouchers.approve", voucher.id));
    };
    const submitReject = (e) => {
        e.preventDefault();
        post(route("accounting.vouchers.reject", voucher.id), {
            onSuccess: () => setShowRejectForm(false),
        });
    };

    return (
        <AppLayout title={typeLabel}>
            <Head title={typeLabel} />
            <PageHeader
                title={`${typeLabel}: ${voucher.voucher_number}`}
                subtitle={
                    <Badge color={STATUS_COLOR[voucher.status]}>
                        {voucher.status}
                    </Badge>
                }
                actions={
                    <div className="flex items-center gap-2">
                        {voucher.status !== "approved" && (
                            <Link
                                href={route(
                                    "accounting.vouchers.edit",
                                    voucher.id,
                                )}
                                className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                                <Pencil size={15} /> {t("Edit")}
                            </Link>
                        )}
                        {voucher.status === "pending" && (
                            <>
                                <button
                                    onClick={approve}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                                >
                                    <CheckCircle size={15} /> {t("Approve")}
                                </button>
                                <button
                                    onClick={() => setShowRejectForm((v) => !v)}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                                >
                                    <XCircle size={15} /> {t("Reject")}
                                </button>
                            </>
                        )}
                        <Link
                            href={route(backRoute)}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm"
                        >
                            <ArrowLeft size={16} /> {t("Back")}
                        </Link>
                    </div>
                }
            />

            {/* Rejection form */}
            {showRejectForm && (
                <form
                    onSubmit={submitReject}
                    className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex gap-3 items-end"
                >
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-red-700 mb-1">
                            {t("Rejection Reason")}
                        </label>
                        <input
                            type="text"
                            value={data.rejection_reason}
                            onChange={(e) =>
                                setData("rejection_reason", e.target.value)
                            }
                            className="w-full border border-red-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder={t("Optional…")}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        {t("Confirm Reject")}
                    </button>
                </form>
            )}

            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <dl className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <Detail
                        label="Voucher Number"
                        value={voucher.voucher_number}
                    />
                    <Detail label="Type" value={typeLabel} />
                    <Detail label="Date" value={voucher.voucher_date} />
                    {voucher.voucher_type === "contra" ? (
                        <>
                            <Detail
                                label="From"
                                value={voucher.from_method?.name}
                            />
                            <Detail
                                label="To"
                                value={voucher.to_method?.name}
                            />
                        </>
                    ) : (
                        <>
                            <Detail
                                label="Payment Method"
                                value={voucher.payment_method?.name}
                            />
                            <Detail
                                label="Account"
                                value={voucher.account?.name}
                            />
                        </>
                    )}
                    <Detail
                        label="Amount"
                        value={Number(voucher.amount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                        })}
                    />
                    <Detail label="Reference" value={voucher.reference} />
                    <Detail
                        label="Status"
                        value={
                            <Badge color={STATUS_COLOR[voucher.status]}>
                                {voucher.status}
                            </Badge>
                        }
                    />
                    <Detail label="Created By" value={voucher.creator?.name} />
                    {voucher.approved_by_id && (
                        <Detail
                            label="Approved By"
                            value={voucher.approved_by?.name}
                        />
                    )}
                    {voucher.rejection_reason && (
                        <Detail
                            label="Rejection Reason"
                            value={voucher.rejection_reason}
                        />
                    )}
                    {voucher.journal_entry_id && (
                        <Detail
                            label="Journal Entry"
                            value={
                                <Link
                                    href={route(
                                        "accounting.journal-entries.show",
                                        voucher.journal_entry_id,
                                    )}
                                    className="text-blue-600 hover:underline"
                                >
                                    View Journal Entry
                                </Link>
                            }
                        />
                    )}
                </dl>
                {voucher.narration && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                            {t("Narration")}
                        </p>
                        <p className="text-sm text-slate-800">
                            {voucher.narration}
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

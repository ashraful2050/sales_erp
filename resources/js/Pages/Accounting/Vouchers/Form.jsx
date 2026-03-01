import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import InputError from "@/Components/InputError";
import { Save, ArrowLeft } from "lucide-react";

const TYPE_LABELS = {
    debit: "Debit Voucher",
    credit: "Credit Voucher",
    contra: "Contra Voucher",
    service: "Service Payment",
    cash_adjustment: "Cash Adjustment",
};

const TYPE_BACK_ROUTE = {
    debit: "accounting.vouchers.debit",
    credit: "accounting.vouchers.credit",
    contra: "accounting.vouchers.contra",
    service: "accounting.vouchers.service",
    cash_adjustment: "accounting.vouchers.adjustment",
};

export default function VoucherForm({
    voucher,
    type: defaultType,
    paymentMethods,
    accounts,
}) {
    const isEdit = !!voucher;
    const voucherType = voucher?.voucher_type ?? defaultType ?? "debit";

    const { data, setData, post, put, processing, errors } = useForm({
        voucher_type: voucherType,
        voucher_date:
            voucher?.voucher_date ?? new Date().toISOString().split("T")[0],
        payment_method_id: voucher?.payment_method_id ?? "",
        from_payment_method_id: voucher?.from_payment_method_id ?? "",
        to_payment_method_id: voucher?.to_payment_method_id ?? "",
        account_id: voucher?.account_id ?? "",
        amount: voucher?.amount ?? "",
        narration: voucher?.narration ?? "",
        reference: voucher?.reference ?? "",
        status: voucher?.status ?? "draft",
    });

    const isContra = data.voucher_type === "contra";
    const title = TYPE_LABELS[voucherType] ?? "Voucher";
    const backRoute =
        TYPE_BACK_ROUTE[voucherType] ?? "accounting.vouchers.debit";

    const submit = (e) => {
        e.preventDefault();
        isEdit
            ? put(route("accounting.vouchers.update", voucher.id))
            : post(route("accounting.vouchers.store"));
    };

    return (
        <AppLayout title={isEdit ? `Edit ${title}` : `New ${title}`}>
            <Head title={isEdit ? `Edit ${title}` : `New ${title}`} />
            <PageHeader
                title={isEdit ? `Edit ${title}` : `New ${title}`}
                actions={
                    <Link
                        href={route(backRoute)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm"
                    >
                        <ArrowLeft size={16} /> Back
                    </Link>
                }
            />

            <form onSubmit={submit} className="max-w-2xl">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
                    {/* Date + Status row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Voucher Date{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.voucher_date}
                                onChange={(e) =>
                                    setData("voucher_date", e.target.value)
                                }
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <InputError message={errors.voucher_date} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Status
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="draft">Draft</option>
                                <option value="pending">
                                    Submit for Approval
                                </option>
                            </select>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    {/* Payment method fields */}
                    {isContra ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Transfer From{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.from_payment_method_id}
                                    onChange={(e) =>
                                        setData(
                                            "from_payment_method_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">— Select —</option>
                                    {paymentMethods.map((pm) => (
                                        <option key={pm.id} value={pm.id}>
                                            {pm.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.from_payment_method_id}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Transfer To{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.to_payment_method_id}
                                    onChange={(e) =>
                                        setData(
                                            "to_payment_method_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">— Select —</option>
                                    {paymentMethods.map((pm) => (
                                        <option key={pm.id} value={pm.id}>
                                            {pm.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.to_payment_method_id}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Payment Method
                                </label>
                                <select
                                    value={data.payment_method_id}
                                    onChange={(e) =>
                                        setData(
                                            "payment_method_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">— Select —</option>
                                    {paymentMethods.map((pm) => (
                                        <option key={pm.id} value={pm.id}>
                                            {pm.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.payment_method_id}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Account
                                </label>
                                <select
                                    value={data.account_id}
                                    onChange={(e) =>
                                        setData("account_id", e.target.value)
                                    }
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">— Select account —</option>
                                    {accounts.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.code} – {a.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.account_id} />
                            </div>
                        </div>
                    )}

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Amount <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.amount}
                            onChange={(e) => setData("amount", e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                        <InputError message={errors.amount} />
                    </div>

                    {/* Reference */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Reference / Cheque No.
                        </label>
                        <input
                            type="text"
                            value={data.reference}
                            onChange={(e) =>
                                setData("reference", e.target.value)
                            }
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Optional"
                        />
                        <InputError message={errors.reference} />
                    </div>

                    {/* Narration */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Narration
                        </label>
                        <textarea
                            rows={3}
                            value={data.narration}
                            onChange={(e) =>
                                setData("narration", e.target.value)
                            }
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Brief description…"
                        />
                        <InputError message={errors.narration} />
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium"
                    >
                        <Save size={16} />
                        {processing ? "Saving…" : `Save ${title}`}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

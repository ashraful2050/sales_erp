import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft, FileText } from "lucide-react";
import { fmtDate } from "@/utils/date";
import { useTranslation } from "@/hooks/useTranslation";

const Field = ({ label, error, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
        </label>
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);
const Input = ({ error, ...props }) => (
    <input
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-400" : "border-slate-200"}`}
    />
);
const Select = ({ error, children, ...props }) => (
    <select
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-400" : "border-slate-200"}`}
    >
        {children}
    </select>
);

export default function PaymentForm({
    payment,
    invoice: preInvoice,
    pendingInvoices = [],
    accounts,
    bankAccounts,
    customers,
    vendors,
}) {
    const { t } = useTranslation();
    const isEdit = !!payment;

    // If coming from an invoice, pre-fill values
    const initialInvoiceId = preInvoice?.id ?? "";
    const initialBalanceDue = preInvoice
        ? Math.max(
              0,
              Number(preInvoice.total_amount) -
                  Number(preInvoice.paid_amount ?? 0),
          )
        : "";

    const { data, setData, post, put, processing, errors } = useForm({
        payment_number: payment?.payment_number ?? "",
        type: payment?.type ?? (preInvoice ? "received" : "received"),
        payment_date:
            payment?.payment_date ?? new Date().toISOString().slice(0, 10),
        amount: payment?.amount ?? initialBalanceDue,
        payment_method: payment?.payment_method ?? "cash",
        reference: payment?.reference ?? "",
        bank_account_id: payment?.bank_account_id ?? "",
        customer_id: payment?.customer_id ?? preInvoice?.customer_id ?? "",
        vendor_id: payment?.vendor_id ?? "",
        invoice_id: payment?.invoice_id ?? initialInvoiceId,
        notes: payment?.notes ?? "",
    });

    // When user selects a pending invoice from the dropdown
    const handleInvoiceChange = (invoiceId) => {
        setData("invoice_id", invoiceId);
        if (invoiceId) {
            const inv = pendingInvoices.find(
                (i) => String(i.id) === String(invoiceId),
            );
            if (inv) {
                const balance = Math.max(
                    0,
                    Number(inv.total_amount) - Number(inv.paid_amount ?? 0),
                );
                setData((d) => ({
                    ...d,
                    invoice_id: invoiceId,
                    customer_id: inv.customer_id ?? d.customer_id,
                    amount: balance,
                    type: "received",
                }));
            }
        } else {
            setData("invoice_id", "");
        }
    };

    const selectedInvoice = data.invoice_id
        ? preInvoice?.id === Number(data.invoice_id)
            ? preInvoice
            : pendingInvoices.find(
                  (i) => String(i.id) === String(data.invoice_id),
              )
        : null;

    const submit = (e) => {
        e.preventDefault();
        isEdit
            ? put(route("finance.payments.update", payment.id))
            : post(route("finance.payments.store"));
    };

    return (
        <AppLayout title={isEdit ? t("Edit Payment") : t("New Payment")}>
            <Head title={isEdit ? t("Edit Payment") : t("New Payment")} />
            <PageHeader
                title={isEdit ? t("Edit Payment") : t("New Payment")}
                subtitle={t("Record a payment received or made")}
                actions={
                    <Link
                        href={route("finance.payments.index")}
                        className="flex items-center gap-2 text-slate-600 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> {t("Back")}
                    </Link>
                }
            />
            <form onSubmit={submit} className="max-w-3xl space-y-6">
                {/* Invoice Allocation Section */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <FileText size={15} />{" "}
                        {t("Invoice Allocation (Optional)")}
                    </h3>
                    <Field
                        label={t("Apply Payment to Invoice")}
                        error={errors.invoice_id}
                    >
                        <Select
                            value={data.invoice_id}
                            onChange={(e) =>
                                handleInvoiceChange(e.target.value)
                            }
                        >
                            <option value="">
                                {t("— No specific invoice (general payment) —")}
                            </option>
                            {preInvoice &&
                                !pendingInvoices.find(
                                    (i) => i.id === preInvoice.id,
                                ) && (
                                    <option value={preInvoice.id}>
                                        {preInvoice.invoice_number} —{" "}
                                        {preInvoice.customer?.name} — Balance ৳
                                        {Math.max(
                                            0,
                                            Number(preInvoice.total_amount) -
                                                Number(
                                                    preInvoice.paid_amount ?? 0,
                                                ),
                                        ).toLocaleString()}
                                    </option>
                                )}
                            {pendingInvoices.map((inv) => (
                                <option key={inv.id} value={inv.id}>
                                    {inv.invoice_number} — {inv.customer?.name}{" "}
                                    — Balance ৳
                                    {Math.max(
                                        0,
                                        Number(inv.total_amount) -
                                            Number(inv.paid_amount ?? 0),
                                    ).toLocaleString()}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    {/* Invoice info card */}
                    {selectedInvoice && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-blue-500 mb-0.5">
                                    {t("Invoice")}
                                </p>
                                <p className="font-semibold text-blue-800">
                                    {selectedInvoice.invoice_number}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-blue-500 mb-0.5">
                                    {t("Invoice Date")}
                                </p>
                                <p className="font-medium text-blue-700">
                                    {fmtDate(selectedInvoice.invoice_date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-blue-500 mb-0.5">
                                    {t("Invoice Total")}
                                </p>
                                <p className="font-medium text-blue-700">
                                    ৳
                                    {Number(
                                        selectedInvoice.total_amount,
                                    ).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-blue-500 mb-0.5">
                                    {t("Balance Due")}
                                </p>
                                <p className="font-bold text-red-600">
                                    ৳
                                    {Math.max(
                                        0,
                                        Number(selectedInvoice.total_amount) -
                                            Number(
                                                selectedInvoice.paid_amount ??
                                                    0,
                                            ),
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment Details */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        {t("Payment Details")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label={t("Payment Type *")} error={errors.type}>
                            <Select
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                required
                            >
                                <option value="received">
                                    {t("Payment Received (from Customer)")}
                                </option>
                                <option value="made">
                                    {t("Payment Made (to Vendor)")}
                                </option>
                            </Select>
                        </Field>
                        <Field
                            label={t("Payment Date *")}
                            error={errors.payment_date}
                        >
                            <Input
                                type="date"
                                value={data.payment_date}
                                onChange={(e) =>
                                    setData("payment_date", e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field label={t("Amount (৳) *")} error={errors.amount}>
                            <Input
                                type="number"
                                step="any"
                                min="0.01"
                                value={data.amount}
                                onChange={(e) =>
                                    setData("amount", e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field
                            label={t("Payment Method *")}
                            error={errors.payment_method}
                        >
                            <Select
                                value={data.payment_method}
                                onChange={(e) =>
                                    setData("payment_method", e.target.value)
                                }
                                required
                            >
                                <option value="cash">{t("Cash")}</option>
                                <option value="bank">
                                    {t("Bank Transfer")}
                                </option>
                                <option value="cheque">{t("Cheque")}</option>
                                <option value="bkash">bKash</option>
                                <option value="nagad">{t("Nagad")}</option>
                                <option value="rocket">{t("Rocket")}</option>
                                <option value="upay">{t("Upay")}</option>
                                <option value="other">{t("Other")}</option>
                            </Select>
                        </Field>
                        <Field
                            label={t("Reference / Cheque No.")}
                            error={errors.reference}
                        >
                            <Input
                                value={data.reference}
                                onChange={(e) =>
                                    setData("reference", e.target.value)
                                }
                                placeholder={t("Optional")}
                            />
                        </Field>
                        <Field
                            label={t("Bank Account")}
                            error={errors.bank_account_id}
                        >
                            <Select
                                value={data.bank_account_id}
                                onChange={(e) =>
                                    setData("bank_account_id", e.target.value)
                                }
                            >
                                <option value="">
                                    {t("Cash / No Bank Account")}
                                </option>
                                {bankAccounts?.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.bank_name} – {b.account_number}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                        {data.type === "received" ? (
                            <Field
                                label={t("Received From (Customer)")}
                                error={errors.customer_id}
                            >
                                <Select
                                    value={data.customer_id}
                                    onChange={(e) =>
                                        setData("customer_id", e.target.value)
                                    }
                                >
                                    <option value="">
                                        {t("Select customer…")}
                                    </option>
                                    {customers?.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </Select>
                            </Field>
                        ) : (
                            <Field
                                label={t("Paid To (Vendor)")}
                                error={errors.vendor_id}
                            >
                                <Select
                                    value={data.vendor_id}
                                    onChange={(e) =>
                                        setData("vendor_id", e.target.value)
                                    }
                                >
                                    <option value="">
                                        {t("Select vendor…")}
                                    </option>
                                    {vendors?.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.name}
                                        </option>
                                    ))}
                                </Select>
                            </Field>
                        )}
                    </div>
                    <Field
                        label={t("Description / Narration")}
                        error={errors.notes}
                    >
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            rows={2}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Field>
                </div>

                <div className="flex justify-end gap-3 pb-8">
                    <Link
                        href={route("finance.payments.index")}
                        className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                        {t("Cancel")}
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium"
                    >
                        <Save size={16} />{" "}
                        {isEdit ? t("Update Payment") : t("Record Payment")}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

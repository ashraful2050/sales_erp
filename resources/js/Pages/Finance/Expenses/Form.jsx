import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft } from "lucide-react";
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

export default function ExpenseForm({ expense, categories, bankAccounts }) {
    const { t } = useTranslation();
    const isEdit = !!expense;
    const { data, setData, post, put, processing, errors } = useForm({
        expense_category_id: expense?.expense_category_id ?? "",
        expense_date:
            expense?.expense_date ?? new Date().toISOString().slice(0, 10),
        title: expense?.title ?? "",
        amount: expense?.amount ?? "",
        payment_method: expense?.payment_method ?? "cash",
        bank_account_id: expense?.bank_account_id ?? "",
        reference: expense?.reference ?? "",
        notes: expense?.notes ?? "",
        status: expense?.status ?? "approved",
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit
            ? put(route("finance.expenses.update", expense.id))
            : post(route("finance.expenses.store"));
    };

    return (
        <AppLayout title={isEdit ? t("Edit Expense") : t("New Expense")}>
            <Head title={isEdit ? t("Edit Expense") : t("New Expense")} />
            <PageHeader
                title={isEdit ? t("Edit Expense") : t("New Expense")}
                subtitle={t("Record a company expenditure")}
                actions={
                    <Link
                        href={route("finance.expenses.index")}
                        className="flex items-center gap-2 text-slate-600 text-sm"
                    >
                        <ArrowLeft size={16} /> {t("Back")}
                    </Link>
                }
            />
            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field
                            label={t("Expense Date *")}
                            error={errors.expense_date}
                        >
                            <Input
                                type="date"
                                value={data.expense_date}
                                onChange={(e) =>
                                    setData("expense_date", e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field
                            label={t("Category")}
                            error={errors.expense_category_id}
                        >
                            <Select
                                value={data.expense_category_id}
                                onChange={(e) =>
                                    setData(
                                        "expense_category_id",
                                        e.target.value,
                                    )
                                }
                            >
                                <option value="">
                                    {t("— Select category —")}
                                </option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                        <Field
                            label={t("Expense Title *")}
                            error={errors.title}
                        >
                            <Input
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                placeholder={t(
                                    "e.g. Office Rent, Utility Bill",
                                )}
                                required
                                className="md:col-span-2"
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
                                {bankAccounts.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.bank_name} – {b.account_number}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                        <Field label={t("Reference")} error={errors.reference}>
                            <Input
                                value={data.reference}
                                onChange={(e) =>
                                    setData("reference", e.target.value)
                                }
                                placeholder={t("Cheque no., voucher no…")}
                            />
                        </Field>
                        <Field label={t("Status")} error={errors.status}>
                            <Select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                            >
                                <option value="approved">
                                    {t("Approved")}
                                </option>
                                <option value="draft">{t("Draft")}</option>
                                <option value="rejected">
                                    {t("Rejected")}
                                </option>
                            </Select>
                        </Field>
                    </div>
                    <Field label={t("Notes")} error={errors.notes}>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            rows={3}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Field>
                </div>
                <div className="flex justify-end gap-3 pb-8">
                    <Link
                        href={route("finance.expenses.index")}
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
                        {isEdit ? t("Update Expense") : t("Save Expense")}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

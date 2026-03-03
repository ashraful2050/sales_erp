import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import InputError from "@/Components/InputError";
import { Save, ArrowLeft } from "lucide-react";

const TYPES = [
    { value: "cash", label: "Cash" },
    { value: "bank", label: "Bank" },
    { value: "mobile_banking", label: "Mobile Banking" },
    { value: "other", label: "Other" },
];

export default function PaymentMethodForm({ paymentMethod, accounts }) {
    const isEdit = !!paymentMethod;

    const { data, setData, post, put, processing, errors } = useForm({
        name: paymentMethod?.name ?? "",
        type: paymentMethod?.type ?? "cash",
        account_id: paymentMethod?.account_id ?? "",
        is_default: paymentMethod?.is_default ?? false,
        is_active: paymentMethod?.is_active ?? true,
        notes: paymentMethod?.notes ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit
            ? put(route("accounting.payment-methods.update", paymentMethod.id))
            : post(route("accounting.payment-methods.store"));
    };

    return (
        <AppLayout
            title={isEdit ? "Edit Payment Method" : "New Payment Method"}
        >
            <Head
                title={isEdit ? "Edit Payment Method" : "New Payment Method"}
            />
            <PageHeader
                title={isEdit ? "Edit Payment Method" : "New Payment Method"}
                actions={
                    <Link
                        href={route("accounting.payment-methods.index")}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm"
                    >
                        <ArrowLeft size={16} /> {t("Back")}
                    </Link>
                }
            />

            <form onSubmit={submit} className="max-w-xl">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Cash, Brac Bank"
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.type} />
                    </div>

                    {/* Linked Account */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {t("Linked Account")}
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

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {t("Notes")}
                        </label>
                        <input
                            type="text"
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <InputError message={errors.notes} />
                    </div>

                    {/* Toggles */}
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={data.is_default}
                                onChange={(e) =>
                                    setData("is_default", e.target.checked)
                                }
                                className="w-4 h-4 rounded border-slate-300 text-blue-600"
                            />
                            <span className="text-sm text-slate-700">
                                {t("Set as default")}
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData("is_active", e.target.checked)
                                }
                                className="w-4 h-4 rounded border-slate-300 text-blue-600"
                            />
                            <span className="text-sm text-slate-700">
                                {t("Active")}
                            </span>
                        </label>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium"
                    >
                        <Save size={16} />
                        {processing ? "Saving…" : "Save Payment Method"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

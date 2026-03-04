import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function DiscountForm({ rule }) {
    const { t } = useTranslation();
    const isEdit = !!rule;
    const { data, setData, post, put, processing, errors } = useForm({
        name: "",
        code: "",
        type: "percentage",
        value: "",
        max_discount_amount: "",
        min_order_amount: "",
        applies_to: "all",
        applies_to_id: "",
        usage_limit: "",
        start_date: "",
        end_date: "",
        requires_approval: false,
        ...(rule ?? {}),
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit
            ? put(route("sales.discount-rules.update", rule.id))
            : post(route("sales.discount-rules.store"));
    };

    const lbl = (text) => (
        <label className="block text-sm font-medium text-slate-700 mb-1">
            {text}
        </label>
    );
    const inp = (key, type = "text", extra = {}) => (
        <input
            type={type}
            value={data[key]}
            onChange={(e) =>
                setData(
                    key,
                    type === "checkbox" ? e.target.checked : e.target.value,
                )
            }
            {...(type === "checkbox" ? { checked: data[key] } : {})}
            className={
                type === "checkbox"
                    ? "rounded"
                    : "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            }
            {...extra}
        />
    );

    return (
        <AppLayout title={isEdit ? t("Edit Discount") : t("New Discount Rule")}>
            <Head
                title={isEdit ? t("Edit Discount") : t("New Discount Rule")}
            />
            <PageHeader
                title={
                    isEdit ? t("Edit Discount Rule") : t("New Discount Rule")
                }
                actions={
                    <Link
                        href={route("sales.discount-rules.index")}
                        className="flex items-center gap-2 text-sm text-slate-600"
                    >
                        <ArrowLeft size={16} /> {t("Back")}
                    </Link>
                }
            />

            <form onSubmit={submit} className="max-w-2xl">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            {lbl(t("Name *"))}
                            {inp("name")}
                            {errors.name && (
                                <p className="text-red-500 text-xs">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            {lbl(t("Coupon Code"))}
                            {inp("code")}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            {lbl(t("Type"))}
                            <select
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="percentage">
                                    {t("Percentage (%)")}
                                </option>
                                <option value="fixed">
                                    {t("Fixed Amount")}
                                </option>
                                <option value="buy_x_get_y">
                                    {t("Buy X Get Y")}
                                </option>
                            </select>
                        </div>
                        <div>
                            {lbl(t("Value *"))}
                            {inp("value", "number", { step: "0.01", min: "0" })}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            {lbl(t("Max Discount Amount"))}
                            {inp("max_discount_amount", "number", {
                                step: "0.01",
                                min: "0",
                            })}
                        </div>
                        <div>
                            {lbl(t("Min Order Amount"))}
                            {inp("min_order_amount", "number", {
                                step: "0.01",
                                min: "0",
                            })}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            {lbl(t("Usage Limit"))}
                            {inp("usage_limit", "number", { min: "1" })}
                        </div>
                        <div>
                            {lbl(t("Applies To"))}
                            <select
                                value={data.applies_to}
                                onChange={(e) =>
                                    setData("applies_to", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            >
                                {[
                                    "all",
                                    "category",
                                    "product",
                                    "customer",
                                    "segment",
                                ].map((opt) => (
                                    <option key={opt} value={opt}>
                                        {t(
                                            opt.charAt(0).toUpperCase() +
                                                opt.slice(1),
                                        )}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            {lbl(t("Start Date"))}
                            {inp("start_date", "date")}
                        </div>
                        <div>
                            {lbl(t("End Date"))}
                            {inp("end_date", "date")}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {inp("requires_approval", "checkbox")}
                        <span className="text-sm text-slate-700">
                            {t("Requires Approval before activation")}
                        </span>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm"
                    >
                        <Save size={16} /> {isEdit ? t("Update") : t("Create")}{" "}
                        {t("Discount")}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

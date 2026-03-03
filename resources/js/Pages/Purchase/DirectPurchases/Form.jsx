import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const Select = ({ error, children, ...props }) => (
    <select
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${error ? "border-red-400" : "border-slate-200"}`}
    >
        {children}
    </select>
);
const Input = ({ error, className = "", ...props }) => (
    <input
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${error ? "border-red-400" : "border-slate-200"} ${className}`}
    />
);
const Label = ({ children, required }) => (
    <label className="block text-xs font-semibold text-slate-600 mb-1">
        {children}
        {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
);

const emptyLine = () => ({
    product_id: "",
    description: "",
    unit: "",
    quantity: 1,
    unit_price: "",
    discount_pct: 0,
    tax_rate_id: "",
    tax_rate: 0,
    line_total: 0,
});

const PAYMENT_METHODS = [
    "Cash",
    "Bank Transfer",
    "Card",
    "Mobile Banking",
    "Cheque",
    "Other",
];

export default function DirectPurchaseForm({
    vendors,
    products,
    taxRates,
    warehouses,
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        vendor_id: "",
        purchase_date: new Date().toISOString().slice(0, 10),
        currency_code: "BDT",
        payment_method: "Cash",
        notes: "",
        discount_amount: "0",
        items: [emptyLine()],
    });

    const updateLine = (idx, field, val) => {
        const items = [...data.items];
        items[idx] = { ...items[idx], [field]: val };
        const { quantity, unit_price, discount_pct } = items[idx];
        items[idx].line_total =
            Number(quantity) *
            Number(unit_price || 0) *
            (1 - Number(discount_pct || 0) / 100);
        setData("items", items);
    };

    const selectProduct = (idx, productId) => {
        const p = products?.find((p) => String(p.id) === String(productId));
        const items = [...data.items];
        if (p) {
            const tax = taxRates?.find(
                (t) => String(t.id) === String(p.tax_rate_id),
            );
            items[idx] = {
                ...items[idx],
                product_id: productId,
                description: p.name,
                unit: p.unit?.abbreviation ?? "",
                unit_price: p.cost_price,
                tax_rate_id: p.tax_rate_id ?? "",
                tax_rate: tax?.rate ?? 0,
            };
            items[idx].line_total =
                Number(items[idx].quantity) *
                Number(p.cost_price) *
                (1 - Number(items[idx].discount_pct || 0) / 100);
        } else {
            items[idx] = { ...items[idx], product_id: productId };
        }
        setData("items", items);
    };

    const selectTaxRate = (idx, taxRateId) => {
        const tax = taxRates?.find((t) => String(t.id) === String(taxRateId));
        const items = [...data.items];
        items[idx] = {
            ...items[idx],
            tax_rate_id: taxRateId,
            tax_rate: tax?.rate ?? 0,
        };
        setData("items", items);
    };

    const addLine = () => setData("items", [...data.items, emptyLine()]);
    const removeLine = (idx) =>
        setData(
            "items",
            data.items.filter((_, i) => i !== idx),
        );

    const subtotal = data.items.reduce(
        (s, i) => s + Number(i.line_total || 0),
        0,
    );
    const taxTotal = data.items.reduce((s, i) => {
        return s + (Number(i.line_total || 0) * Number(i.tax_rate || 0)) / 100;
    }, 0);
    const grandTotal = subtotal + taxTotal - Number(data.discount_amount || 0);

    const submit = (e) => {
        e.preventDefault();
        post(route("purchase.direct-purchases.store"));
    };

    return (
        <AppLayout title={t("New Direct Purchase")}>
            <Head title={t("New Direct Purchase")} />
            <PageHeader
                title={t("New Direct Purchase")}
                subtitle={t("Immediate cash purchase — bill + payment recorded at once")}
                actions={
                    <Link
                        href={route("purchase.direct-purchases.index")}
                        className="flex items-center gap-2 text-slate-600 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> {t("Back")}
                    </Link>
                }
            />

            <form onSubmit={submit} className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <Label>Vendor</Label>
                        <Select
                            value={data.vendor_id}
                            onChange={(e) =>
                                setData("vendor_id", e.target.value)
                            }
                            error={errors.vendor_id}
                        >
                            <option value="">Cash Purchase (No Vendor)</option>
                            {vendors?.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.name}
                                </option>
                            ))}
                        </Select>
                        {errors.vendor_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.vendor_id}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label required>Purchase Date</Label>
                        <Input
                            type="date"
                            value={data.purchase_date}
                            onChange={(e) =>
                                setData("purchase_date", e.target.value)
                            }
                            error={errors.purchase_date}
                        />
                        {errors.purchase_date && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.purchase_date}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label required>Payment Method</Label>
                        <Select
                            value={data.payment_method}
                            onChange={(e) =>
                                setData("payment_method", e.target.value)
                            }
                        >
                            {PAYMENT_METHODS.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label required>Currency</Label>
                        <Select
                            value={data.currency_code}
                            onChange={(e) =>
                                setData("currency_code", e.target.value)
                            }
                        >
                            {["BDT", "USD", "EUR", "GBP", "INR"].map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-700 text-sm">
                            Items
                        </h3>
                        <button
                            type="button"
                            onClick={addLine}
                            className="flex items-center gap-1 text-teal-600 text-xs font-medium hover:text-teal-700"
                        >
                            <Plus size={13} /> {t("Add Line")}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 w-36">
                                        {t("Product")}
                                    </th>
                                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500">
                                        {t("Description")}
                                    </th>
                                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 w-16">
                                        {t("Unit")}
                                    </th>
                                    <th className="text-right py-2.5 px-3 text-xs font-semibold text-slate-500 w-20">
                                        {t("Qty")}
                                    </th>
                                    <th className="text-right py-2.5 px-3 text-xs font-semibold text-slate-500 w-28">
                                        {t("Unit Price")}
                                    </th>
                                    <th className="text-right py-2.5 px-3 text-xs font-semibold text-slate-500 w-20">
                                        {t("Disc %")}
                                    </th>
                                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 w-28">
                                        {t("Tax")}
                                    </th>
                                    <th className="text-right py-2.5 px-3 text-xs font-semibold text-slate-500 w-28">
                                        {t("Total")}
                                    </th>
                                    <th className="w-8"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.items.map((line, idx) => (
                                    <tr key={idx}>
                                        <td className="px-3 py-2">
                                            <select
                                                value={line.product_id}
                                                onChange={(e) =>
                                                    selectProduct(
                                                        idx,
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                                            >
                                                <option value="">—</option>
                                                {products?.map((p) => (
                                                    <option
                                                        key={p.id}
                                                        value={p.id}
                                                    >
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                value={line.description}
                                                onChange={(e) =>
                                                    updateLine(
                                                        idx,
                                                        "description",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                                                placeholder={t("Description")}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                value={line.unit}
                                                onChange={(e) =>
                                                    updateLine(
                                                        idx,
                                                        "unit",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-teal-400"
                                                placeholder="pcs"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="number"
                                                min="0.0001"
                                                step="any"
                                                value={line.quantity}
                                                onChange={(e) =>
                                                    updateLine(
                                                        idx,
                                                        "quantity",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-right focus:outline-none focus:ring-1 focus:ring-teal-400"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="number"
                                                min="0"
                                                step="any"
                                                value={line.unit_price}
                                                onChange={(e) =>
                                                    updateLine(
                                                        idx,
                                                        "unit_price",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-right focus:outline-none focus:ring-1 focus:ring-teal-400"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="any"
                                                value={line.discount_pct}
                                                onChange={(e) =>
                                                    updateLine(
                                                        idx,
                                                        "discount_pct",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-right focus:outline-none focus:ring-1 focus:ring-teal-400"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <select
                                                value={line.tax_rate_id}
                                                onChange={(e) =>
                                                    selectTaxRate(
                                                        idx,
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                                            >
                                                <option value="">{t("No Tax")}</option>
                                                {taxRates?.map((t) => (
                                                    <option
                                                        key={t.id}
                                                        value={t.id}
                                                    >
                                                        {t.name} ({t.rate}%)
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-2 text-right font-semibold text-slate-700 text-xs">
                                            {Number(
                                                line.line_total || 0,
                                            ).toFixed(2)}
                                        </td>
                                        <td className="px-2 py-2">
                                            {data.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeLine(idx)
                                                    }
                                                    className="text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals + Notes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                            {t("Notes")}
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            rows={3}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                            placeholder={t("Optional notes...")}
                        />
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 text-sm">
                        <div className="flex justify-between text-slate-500">
                            <span>{t("Subtotal")}</span>
                            <span className="font-medium text-slate-700">
                                {subtotal.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>{t("Tax")}</span>
                            <span className="font-medium text-slate-700">
                                {taxTotal.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500 shrink-0">
                                {t("Discount")}
                            </span>
                            <input
                                type="number"
                                min="0"
                                step="any"
                                value={data.discount_amount}
                                onChange={(e) =>
                                    setData("discount_amount", e.target.value)
                                }
                                className="w-28 text-right border border-slate-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div className="flex justify-between font-bold text-base border-t border-slate-200 pt-3">
                            <span>{t("Grand Total")}</span>
                            <span className="text-teal-700">
                                {data.currency_code} {grandTotal.toFixed(2)}
                            </span>
                        </div>
                        <div className="pt-2">
                            <div className="flex items-center justify-center gap-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg py-2 text-xs font-semibold">
                                ✓ Payment will be recorded as{" "}
                                <strong>{data.payment_method}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Link
                        href={route("purchase.direct-purchases.index")}
                        className="px-5 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-60 transition-colors"
                    >
                        <Save size={15} />
                        {processing ? "Saving..." : "Record Purchase"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

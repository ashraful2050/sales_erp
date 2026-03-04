import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft, Plus, Trash2, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const Select = ({ error, children, ...props }) => (
    <select
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-400" : "border-slate-200"}`}
    >
        {children}
    </select>
);
const Input = ({ error, className = "", ...props }) => (
    <input
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-400" : "border-slate-200"} ${className}`}
    />
);

const emptyLine = () => ({
    product_id: "",
    description: "",
    quantity: 1,
    unit_price: "",
    discount_pct: 0,
    tax_rate_id: "",
    line_total: 0,
});

export default function InvoiceForm({
    invoice,
    customers,
    products,
    taxRates,
}) {
    const { t } = useTranslation();
    const isEdit = !!invoice;
    const { data, setData, post, put, processing, errors } = useForm({
        invoice_number: invoice?.invoice_number ?? "",
        customer_id: invoice?.customer_id ?? "",
        invoice_date:
            invoice?.invoice_date ?? new Date().toISOString().slice(0, 10),
        due_date: invoice?.due_date ?? "",
        status: invoice?.status ?? "draft",
        currency_code: invoice?.currency_code ?? "BDT",
        discount_amount: invoice?.discount_amount ?? "0",
        notes: invoice?.notes ?? "",
        terms: invoice?.terms ?? "",
        items: invoice?.items?.length
            ? invoice.items.map((i) => ({
                  ...i,
                  line_total:
                      Number(i.quantity) *
                      Number(i.unit_price) *
                      (1 - Number(i.discount_pct) / 100),
              }))
            : [emptyLine()],
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

    const addLine = () => setData("items", [...data.items, emptyLine()]);
    const removeLine = (idx) =>
        setData(
            "items",
            data.items.filter((_, i) => i !== idx),
        );

    const selectProduct = (idx, productId) => {
        const p = products?.find((p) => String(p.id) === String(productId));
        if (p) {
            const items = [...data.items];
            items[idx] = {
                ...items[idx],
                product_id: productId,
                description: p.name,
                unit_price: p.sale_price,
                tax_rate_id: p.tax_rate_id ?? "",
            };
            items[idx].line_total =
                Number(items[idx].quantity) *
                Number(p.sale_price) *
                (1 - Number(items[idx].discount_pct || 0) / 100);
            setData("items", items);
        } else {
            updateLine(idx, "product_id", productId);
        }
    };

    const subtotal = data.items.reduce(
        (s, i) => s + Number(i.line_total || 0),
        0,
    );
    const taxTotal = data.items.reduce((s, i) => {
        const rate = taxRates?.find(
            (t) => String(t.id) === String(i.tax_rate_id),
        );
        return (
            s + (rate ? (Number(i.line_total) * Number(rate.rate)) / 100 : 0)
        );
    }, 0);
    const grandTotal = subtotal + taxTotal - Number(data.discount_amount || 0);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route("sales.invoices.update", invoice.id));
        } else {
            post(route("sales.invoices.store"));
        }
    };

    return (
        <AppLayout title={isEdit ? t("Edit Invoice") : t("New Invoice")}>
            <Head title={isEdit ? t("Edit Invoice") : t("New Invoice")} />
            <PageHeader
                title={isEdit ? t("Edit Invoice") : t("New Invoice")}
                subtitle={
                    isEdit
                        ? `${t("Invoice #")}${invoice.invoice_number}`
                        : t("Create a new sales invoice")
                }
                actions={
                    <Link
                        href={route("sales.invoices.index")}
                        className="flex items-center gap-2 text-slate-600 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> {t("Back")}
                    </Link>
                }
            />
            <form onSubmit={submit} className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("Customer")} *
                            </label>
                            <Select
                                value={data.customer_id}
                                onChange={(e) =>
                                    setData("customer_id", e.target.value)
                                }
                                required
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
                            {errors.customer_id && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.customer_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("Invoice Date")} *
                            </label>
                            <Input
                                type="date"
                                value={data.invoice_date}
                                onChange={(e) =>
                                    setData("invoice_date", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("Due Date")}
                            </label>
                            <Input
                                type="date"
                                value={data.due_date}
                                onChange={(e) =>
                                    setData("due_date", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("Status")}
                            </label>
                            <Select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                            >
                                <option value="draft">{t("Draft")}</option>
                                <option value="sent">{t("Sent")}</option>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("Invoice Number")}
                            </label>
                            <Input
                                value={data.invoice_number}
                                onChange={(e) =>
                                    setData("invoice_number", e.target.value)
                                }
                                placeholder={t("Auto-generated")}
                            />
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                            {t("Line Items")}
                        </h3>
                        <button
                            type="button"
                            onClick={addLine}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            <Plus size={15} /> {t("Add Line")}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 w-48">
                                        {t("Product")}
                                    </th>
                                    <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">
                                        {t("Description")}
                                    </th>
                                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 w-20">
                                        {t("Qty")}
                                    </th>
                                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 w-28">
                                        {t("Unit Price")}
                                    </th>
                                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 w-20">
                                        {t("Disc %")}
                                    </th>
                                    <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 w-32">
                                        {t("Tax")}
                                    </th>
                                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 w-28">
                                        {t("Total")}
                                    </th>
                                    <th className="w-8 px-2"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-2">
                                            <Select
                                                value={item.product_id}
                                                onChange={(e) =>
                                                    selectProduct(
                                                        idx,
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    {t("— select —")}
                                                </option>
                                                {products?.map((p) => (
                                                    <option
                                                        key={p.id}
                                                        value={p.id}
                                                    >
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                value={item.description}
                                                onChange={(e) =>
                                                    updateLine(
                                                        idx,
                                                        "description",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={t("Description…")}
                                                error={
                                                    errors[
                                                        `items.${idx}.description`
                                                    ]
                                                }
                                            />
                                            {errors[
                                                `items.${idx}.description`
                                            ] && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {
                                                        errors[
                                                            `items.${idx}.description`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                type="number"
                                                step="any"
                                                min="0"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateLine(
                                                        idx,
                                                        "quantity",
                                                        e.target.value,
                                                    )
                                                }
                                                className="text-right"
                                                error={
                                                    errors[
                                                        `items.${idx}.quantity`
                                                    ]
                                                }
                                            />
                                            {errors[
                                                `items.${idx}.quantity`
                                            ] && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {
                                                        errors[
                                                            `items.${idx}.quantity`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                type="number"
                                                step="any"
                                                min="0"
                                                value={item.unit_price}
                                                onChange={(e) =>
                                                    updateLine(
                                                        idx,
                                                        "unit_price",
                                                        e.target.value,
                                                    )
                                                }
                                                className="text-right"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                type="number"
                                                step="any"
                                                min="0"
                                                max="100"
                                                value={item.discount_pct}
                                                onChange={(e) =>
                                                    updateLine(
                                                        idx,
                                                        "discount_pct",
                                                        e.target.value,
                                                    )
                                                }
                                                className="text-right"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Select
                                                value={item.tax_rate_id}
                                                onChange={(e) =>
                                                    updateLine(
                                                        idx,
                                                        "tax_rate_id",
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    {t("No Tax")}
                                                </option>
                                                {taxRates?.map((t) => (
                                                    <option
                                                        key={t.id}
                                                        value={t.id}
                                                    >
                                                        {t.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </td>
                                        <td className="px-4 py-2 text-right font-mono text-slate-700">
                                            ৳
                                            {Number(
                                                item.line_total || 0,
                                            ).toLocaleString("en-BD", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => removeLine(idx)}
                                                disabled={
                                                    data.items.length === 1
                                                }
                                                title={t("Delete")}
                                                className="inline-flex items-center justify-center w-7 h-7 rounded-md text-red-400 hover:text-white hover:bg-red-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Totals */}
                    <div className="border-t border-slate-100 px-6 py-4 flex flex-col items-end gap-2">
                        <div className="w-64 space-y-1 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>{t("Subtotal")}</span>
                                <span className="font-mono">
                                    ৳{subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>{t("VAT / Tax")}</span>
                                <span className="font-mono">
                                    ৳{taxTotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-slate-600 items-center">
                                <span>{t("Discount")}</span>
                                <input
                                    type="number"
                                    step="any"
                                    min="0"
                                    value={data.discount_amount}
                                    onChange={(e) =>
                                        setData(
                                            "discount_amount",
                                            e.target.value,
                                        )
                                    }
                                    className="w-28 border border-slate-200 rounded px-2 py-1 text-right text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-between font-semibold text-slate-800 border-t border-slate-200 pt-2 text-base">
                                <span>{t("Total")}</span>
                                <span className="font-mono">
                                    ৳{grandTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {t("Notes")}
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            rows={3}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {t("Terms & Conditions")}
                        </label>
                        <textarea
                            value={data.terms}
                            onChange={(e) => setData("terms", e.target.value)}
                            rows={3}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pb-8">
                    <Link
                        href={route("sales.invoices.index")}
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
                        {isEdit ? t("Update Invoice") : t("Save Invoice")}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

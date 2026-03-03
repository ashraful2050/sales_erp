import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const emptyLine = () => ({ product_id: "", description: "", quantity: 1, unit_price: "", tax_rate: 0, tax_amount: 0, total: 0 });

export default function QuotationForm({ quote, customers, products, taxRates }) {
    const { t } = useTranslation();
    const isEdit = !!quote;
    const { data, setData, post, put, processing, errors } = useForm({
        customer_id: quote?.customer_id ?? "",
        type: quote?.type ?? "quotation",
        invoice_date: quote?.invoice_date ?? new Date().toISOString().slice(0, 10),
        due_date: quote?.due_date ?? "",
        notes: quote?.notes ?? "",
        terms: quote?.terms ?? "",
        items: quote?.items?.length
            ? quote.items.map(i => ({ product_id: i.product_id ?? "", description: i.description, quantity: i.quantity, unit_price: i.unit_price, tax_rate: i.tax_rate ?? 0, tax_amount: i.tax_amount ?? 0, total: i.total }))
            : [emptyLine()],
    });

    const updateLine = (idx, field, val) => {
        const items = [...data.items];
        items[idx] = { ...items[idx], [field]: val };
        const base = Number(items[idx].quantity || 0) * Number(items[idx].unit_price || 0);
        items[idx].tax_amount = base * (Number(items[idx].tax_rate || 0) / 100);
        items[idx].total = base + items[idx].tax_amount;
        setData("items", items);
    };
    const selectProduct = (idx, productId) => {
        const p = products?.find(p => String(p.id) === String(productId));
        if (p) {
            const items = [...data.items];
            items[idx] = { ...items[idx], product_id: productId, description: p.name, unit_price: p.sale_price };
            const base = Number(items[idx].quantity) * Number(p.sale_price);
            items[idx].tax_amount = base * (Number(items[idx].tax_rate || 0) / 100);
            items[idx].total = base + items[idx].tax_amount;
            setData("items", items);
        } else updateLine(idx, "product_id", productId);
    };
    const addLine = () => setData("items", [...data.items, emptyLine()]);
    const removeLine = (idx) => setData("items", data.items.filter((_, i) => i !== idx));

    const subtotal = data.items.reduce((s, i) => s + Number(i.total || 0) - Number(i.tax_amount || 0), 0);
    const taxTotal = data.items.reduce((s, i) => s + Number(i.tax_amount || 0), 0);
    const grandTotal = subtotal + taxTotal;
    const fmt = (v) => Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) put(route("sales.quotations.update", quote.id));
        else post(route("sales.quotations.store"));
    };

    return (
        <AppLayout title={isEdit ? "Edit Quotation" : "New Quotation"}>
            <Head title={isEdit ? "Edit Quotation" : "New Quotation"} />
            <PageHeader title={isEdit ? "Edit Quotation" : "New Quotation"}
                actions={<Link href={route("sales.quotations.index")} className="flex items-center gap-2 text-slate-600 text-sm font-medium"><ArrowLeft size={16} /> {t("Back")}</Link>}
            />
            <form onSubmit={submit} className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-700 mb-4">Quotation Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Customer <span className="text-red-500">*</span></label>
                            <select value={data.customer_id} onChange={e => setData("customer_id", e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                                <option value="">— Select Customer —</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.customer_id && <p className="text-red-500 text-xs mt-1">{errors.customer_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t("Type")}</label>
                            <select value={data.type} onChange={e => setData("type", e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                                <option value="quotation">{t("Quotation")}</option>
                                <option value="proforma">{t("Proforma Invoice")}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date <span className="text-red-500">*</span></label>
                            <input type="date" value={data.invoice_date} onChange={e => setData("invoice_date", e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t("Valid Until")}</label>
                            <input type="date" value={data.due_date} onChange={e => setData("due_date", e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t("Notes")}</label>
                            <textarea value={data.notes} onChange={e => setData("notes", e.target.value)} rows={2}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                        <h3 className="font-semibold text-slate-700">Items</h3>
                        <button type="button" onClick={addLine} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"><Plus size={15} /> {t("Add Item")}</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-44">{t("Product")}</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Description")}</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-20">{t("Qty")}</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-28">{t("Unit Price")}</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-20">Tax %</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-28">{t("Total")}</th>
                                    <th className="w-10 px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.items.map((line, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="px-3 py-2"><select value={line.product_id} onChange={e => selectProduct(i, e.target.value)} className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs w-full"><option value="">— Product —</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></td>
                                        <td className="px-3 py-2"><input value={line.description} onChange={e => updateLine(i, "description", e.target.value)} className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs w-full" placeholder={t("Description")} /></td>
                                        <td className="px-3 py-2"><input type="number" value={line.quantity} onChange={e => updateLine(i, "quantity", e.target.value)} className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-right w-full" min="0.0001" step="0.0001" /></td>
                                        <td className="px-3 py-2"><input type="number" value={line.unit_price} onChange={e => updateLine(i, "unit_price", e.target.value)} className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-right w-full" min="0" step="0.01" /></td>
                                        <td className="px-3 py-2"><input type="number" value={line.tax_rate} onChange={e => updateLine(i, "tax_rate", e.target.value)} className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-right w-full" min="0" max="100" /></td>
                                        <td className="px-3 py-2 text-right font-medium text-slate-700">{fmt(line.total)}</td>
                                        <td className="px-3 py-2 text-center"><button type="button" onClick={() => removeLine(i)} className="p-1 text-slate-300 hover:text-red-500 rounded"><Trash2 size={14} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                                <tr><td colSpan={5} className="px-4 py-2 text-right text-sm font-medium text-slate-600">Subtotal:</td><td className="px-4 py-2 text-right font-medium">{fmt(subtotal)}</td><td></td></tr>
                                <tr><td colSpan={5} className="px-4 py-2 text-right text-sm font-medium text-slate-600">Tax:</td><td className="px-4 py-2 text-right font-medium text-amber-600">{fmt(taxTotal)}</td><td></td></tr>
                                <tr className="border-t border-slate-200"><td colSpan={5} className="px-4 py-3 text-right font-semibold text-slate-700">Total:</td><td className="px-4 py-3 text-right font-bold text-lg text-slate-800">{fmt(grandTotal)} BDT</td><td></td></tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50">
                        {processing ? "Saving…" : (isEdit ? "Update Quotation" : "Create Quotation")}
                    </button>
                    <Link href={route("sales.quotations.index")} className="text-sm text-slate-500 hover:text-slate-700">Cancel</Link>
                </div>
            </form>
        </AppLayout>
    );
}

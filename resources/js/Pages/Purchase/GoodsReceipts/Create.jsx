import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const Input = ({ error, ...props }) => (
    <input {...props} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-400" : "border-slate-200"}`} />
);
const Select = ({ children, ...props }) => (
    <select {...props} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{children}</select>
);

export default function GoodsReceiptCreate({ po, vendors, products, pendingOrders }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        purchase_order_id: po?.id ?? "",
        vendor_id:         po?.vendor?.id ?? "",
        receipt_date:      new Date().toISOString().slice(0, 10),
        notes:             "",
        items:             po?.items?.map(i => ({
            product_id:       i.product_id,
            name:             i.product?.name ?? "",
            quantity_received: i.quantity,
            unit_cost:        i.unit_price,
        })) ?? [{ product_id: "", name: "", quantity_received: "", unit_cost: "" }],
    });

    const addRow = () => setData("items", [...data.items, { product_id: "", name: "", quantity_received: "", unit_cost: "" }]);
    const removeRow = (idx) => setData("items", data.items.filter((_, i) => i !== idx));
    const updateRow = (idx, field, value) => {
        const rows = [...data.items];
        rows[idx] = { ...rows[idx], [field]: value };
        if (field === "product_id") {
            const prod = products.find(p => String(p.id) === String(value));
            if (prod) rows[idx].name = prod.name;
            if (prod) rows[idx].unit_cost = prod.cost_price ?? "";
        }
        setData("items", rows);
    };

    const handlePoChange = (poId) => {
        setData("purchase_order_id", poId);
        if (!poId) return;
        const selected = pendingOrders.find(p => String(p.id) === String(poId));
        if (selected) setData(d => ({ ...d, purchase_order_id: poId, vendor_id: selected.vendor_id ?? d.vendor_id }));
    };

    const totalCost = data.items.reduce((s, i) => s + (Number(i.quantity_received) * Number(i.unit_cost) || 0), 0);

    return (
        <AppLayout title={t("New Goods Receipt")}>
            <Head title={t("New Goods Receipt (GRN)")} />
            <PageHeader
                title={t("New Goods Receipt (GRN)")}
                subtitle={t("Record goods received from vendor")}
                actions={<Link href={route("purchase.goods-receipts.index")} className="flex items-center gap-2 text-slate-600 text-sm"><ArrowLeft size={16} /> {t("Back")}</Link>}
            />
            <form onSubmit={e => { e.preventDefault(); post(route("purchase.goods-receipts.store")); }} className="space-y-6 max-w-4xl">
                <div className="bg-white rounded-xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t("Purchase Order (optional)")}</label>
                        <Select value={data.purchase_order_id} onChange={e => handlePoChange(e.target.value)}>
                            <option value="">— Without PO —</option>
                            {pendingOrders.map(o => <option key={o.id} value={o.id}>{o.po_number}</option>)}
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Vendor *</label>
                        <Select value={data.vendor_id} onChange={e => setData("vendor_id", e.target.value)} required>
                            <option value="">Select vendor *</option>
                            {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </Select>
                        {errors.vendor_id && <p className="mt-1 text-xs text-red-500">{errors.vendor_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Receipt Date *</label>
                        <Input type="date" value={data.receipt_date} onChange={e => setData("receipt_date", e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t("Notes")}</label>
                        <Input value={data.notes} onChange={e => setData("notes", e.target.value)} placeholder={t("Optional notes…")} />
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-slate-700">Items Received</h3>
                        <button type="button" onClick={addRow}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                            <Plus size={15} /> {t("Add Row")}
                        </button>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {["Product *", "Qty Received *", "Unit Cost (৳) *", "Total", ""].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.items.map((item, i) => (
                                <tr key={i}>
                                    <td className="px-4 py-2">
                                        <Select value={item.product_id} onChange={e => updateRow(i, "product_id", e.target.value)} required>
                                            <option value="">Select product…</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name}{p.code ? ` (${p.code})` : ""}</option>)}
                                        </Select>
                                        {errors[`items.${i}.product_id`] && <p className="text-xs text-red-500">{errors[`items.${i}.product_id`]}</p>}
                                    </td>
                                    <td className="px-4 py-2">
                                        <Input type="number" step="any" min="0.001" value={item.quantity_received}
                                            onChange={e => updateRow(i, "quantity_received", e.target.value)} required />
                                    </td>
                                    <td className="px-4 py-2">
                                        <Input type="number" step="any" min="0" value={item.unit_cost}
                                            onChange={e => updateRow(i, "unit_cost", e.target.value)} required />
                                    </td>
                                    <td className="px-4 py-2 font-mono font-medium">
                                        ৳{((Number(item.quantity_received) || 0) * (Number(item.unit_cost) || 0)).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        {data.items.length > 1 && (
                                            <button type="button" onClick={() => removeRow(i)} className="text-slate-300 hover:text-red-500">
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t border-slate-200 bg-slate-50">
                            <tr>
                                <td colSpan={3} className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Total Cost:</td>
                                <td className="px-4 py-3 font-bold font-mono text-blue-700">৳{totalCost.toLocaleString()}</td>
                                <td />
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="flex justify-end gap-3 pb-8">
                    <Link href={route("purchase.goods-receipts.index")} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</Link>
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium">
                        <Save size={16} /> {t("Save Receipt & Update Stock")}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const empty = { description: "", quantity: 1, unit_price: "", tax_percentage: 0, tax_amount: 0, total: 0 };

export default function DebitNoteForm({ debitNote, vendors, accounts }) {
    const { t } = useTranslation();
    const isEdit = !!debitNote;
    const { data, setData, post, put, processing, errors } = useForm({
        vendor_id:   debitNote?.vendor_id ?? "",
        po_date:     debitNote?.po_date ?? new Date().toISOString().slice(0, 10),
        reference:   debitNote?.reference ?? "",
        notes:       debitNote?.notes ?? "",
        status:      debitNote?.status ?? "draft",
        items:       debitNote?.items?.length
            ? debitNote.items.map(i => ({ description: i.description, quantity: i.quantity, unit_price: i.unit_price, tax_percentage: i.tax_percentage ?? 0, tax_amount: i.tax_amount ?? 0, total: i.total }))
            : [{ ...empty }],
    });

    const recalc = (items) => items.map(it => {
        const sub = parseFloat(it.quantity || 0) * parseFloat(it.unit_price || 0);
        const tax = sub * (parseFloat(it.tax_percentage || 0) / 100);
        return { ...it, tax_amount: tax.toFixed(2), total: (sub + tax).toFixed(2) };
    });

    const updateItem = (i, key, val) => {
        const items = data.items.map((it, idx) => idx === i ? { ...it, [key]: val } : it);
        setData("items", recalc(items));
    };

    const addRow = () => setData("items", [...data.items, { ...empty }]);
    const removeRow = (i) => setData("items", data.items.filter((_, idx) => idx !== i));

    const subtotal = data.items.reduce((s, it) => s + parseFloat(it.unit_price || 0) * parseFloat(it.quantity || 0), 0);
    const taxTotal = data.items.reduce((s, it) => s + parseFloat(it.tax_amount || 0), 0);
    const grandTotal = subtotal + taxTotal;

    const fmt = (v) => Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(route("purchase.debit-notes.update", debitNote.id)) : post(route("purchase.debit-notes.store"));
    };

    const inputCls = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
    const errCls = "text-xs text-red-500 mt-1";

    return (
        <AppLayout title={isEdit ? "Edit Debit Note" : "New Debit Note"}>
            <Head title={isEdit ? "Edit Debit Note" : "New Debit Note"} />
            <PageHeader title={isEdit ? `Edit: ${debitNote.po_number}` : "New Debit Note"} subtitle={t("Purchase return")}
                actions={<Link href={route("purchase.debit-notes.index")} className="flex items-center gap-2 text-slate-600 text-sm"><ArrowLeft size={16} /> {t("Back")}</Link>}
            />
            <form onSubmit={submit} className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-700 mb-4">Debit Note Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Vendor <span className="text-red-500">*</span></label>
                            <select value={data.vendor_id} onChange={e => setData("vendor_id", e.target.value)} className={inputCls}>
                                <option value="">-- Select Vendor --</option>
                                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                            {errors.vendor_id && <p className={errCls}>{errors.vendor_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date <span className="text-red-500">*</span></label>
                            <input type="date" value={data.po_date} onChange={e => setData("po_date", e.target.value)} className={inputCls} />
                            {errors.po_date && <p className={errCls}>{errors.po_date}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t("Status")}</label>
                            <select value={data.status} onChange={e => setData("status", e.target.value)} className={inputCls}>
                                <option value="draft">{t("Draft")}</option>
                                <option value="submitted">{t("Submitted")}</option>
                                <option value="approved">{t("Approved")}</option>
                                <option value="cancelled">{t("Cancelled")}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t("Reference")}</label>
                            <input value={data.reference} onChange={e => setData("reference", e.target.value)} className={inputCls} placeholder={t("Original PO / Invoice ref")} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t("Notes")}</label>
                            <input value={data.notes} onChange={e => setData("notes", e.target.value)} className={inputCls} placeholder={t("Reason for return...")} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700">Return Items</h3>
                        <button type="button" onClick={addRow} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"><Plus size={15} /> {t("Add Row")}</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-1/3">{t("Description")}</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-20">{t("Qty")}</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-28">{t("Cost Price")}</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-20">Tax %</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-28">{t("Tax Amt")}</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-28">{t("Total")}</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.items.map((item, i) => (
                                    <tr key={i}>
                                        <td className="px-4 py-2"><input value={item.description} onChange={e => updateItem(i, "description", e.target.value)} className={inputCls} placeholder={t("Item description")} /></td>
                                        <td className="px-4 py-2"><input type="number" min="1" value={item.quantity} onChange={e => updateItem(i, "quantity", e.target.value)} className={inputCls + " text-right"} /></td>
                                        <td className="px-4 py-2"><input type="number" min="0" step="0.01" value={item.unit_price} onChange={e => updateItem(i, "unit_price", e.target.value)} className={inputCls + " text-right"} /></td>
                                        <td className="px-4 py-2"><input type="number" min="0" max="100" step="0.01" value={item.tax_percentage} onChange={e => updateItem(i, "tax_percentage", e.target.value)} className={inputCls + " text-right"} /></td>
                                        <td className="px-4 py-2 text-right text-amber-600">{fmt(item.tax_amount)}</td>
                                        <td className="px-4 py-2 text-right font-medium">{fmt(item.total)}</td>
                                        <td className="px-4 py-2 text-center">
                                            {data.items.length > 1 && (
                                                <button type="button" onClick={() => removeRow(i)} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                        <div className="w-64 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-slate-600">Subtotal:</span><span className="font-medium">{fmt(subtotal)}</span></div>
                            <div className="flex justify-between"><span className="text-slate-600">Tax:</span><span className="font-medium text-amber-600">{fmt(taxTotal)}</span></div>
                            <div className="flex justify-between pt-2 border-t border-slate-200 text-base"><span className="font-semibold text-slate-700">Grand Total:</span><span className="font-bold text-slate-800">{fmt(grandTotal)} BDT</span></div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Link href={route("purchase.debit-notes.index")} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</Link>
                    <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                        {processing ? "Saving..." : isEdit ? "Update" : "Create Debit Note"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

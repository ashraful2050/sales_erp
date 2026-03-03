import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const Input = ({ error, ...props }) => (
    <input {...props} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-400" : "border-slate-200"}`} />
);
const Select = ({ children, ...props }) => (
    <select {...props} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{children}</select>
);

export default function DeliveryNoteCreate({ invoice: preInvoice, customers, products, pendingInvoices }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        invoice_id:       preInvoice?.id ?? "",
        customer_id:      preInvoice?.customer_id ?? "",
        dispatch_date:    new Date().toISOString().slice(0, 10),
        delivery_address: preInvoice?.customer?.address ?? "",
        vehicle_no:       "",
        driver_name:      "",
        notes:            "",
        items:            preInvoice?.items?.map(i => ({
            product_id: i.product_id,
            name:       i.product?.name ?? "",
            quantity:   i.quantity,
        })) ?? [{ product_id: "", name: "", quantity: "" }],
    });

    const addRow = () => setData("items", [...data.items, { product_id: "", name: "", quantity: "" }]);
    const removeRow = (idx) => setData("items", data.items.filter((_, i) => i !== idx));
    const updateRow = (idx, field, value) => {
        const rows = [...data.items];
        rows[idx] = { ...rows[idx], [field]: value };
        if (field === "product_id") {
            const prod = products.find(p => String(p.id) === String(value));
            if (prod) rows[idx].name = prod.name;
        }
        setData("items", rows);
    };

    const handleInvoiceChange = (invId) => {
        setData("invoice_id", invId);
        if (!invId) return;
        const inv = pendingInvoices.find(i => String(i.id) === String(invId));
        if (inv) setData(d => ({ ...d, invoice_id: invId, customer_id: inv.customer_id ?? d.customer_id }));
    };

    return (
        <AppLayout title={t("New Delivery Note")}>
            <Head title={t("New Delivery Note")} />
            <PageHeader
                title={t("New Delivery Note (Challan)")}
                subtitle={t("Record goods dispatched to customer")}
                actions={<Link href={route("sales.delivery-notes.index")} className="flex items-center gap-2 text-slate-600 text-sm"><ArrowLeft size={16} /> {t("Back")}</Link>}
            />
            <form onSubmit={e => { e.preventDefault(); post(route("sales.delivery-notes.store")); }} className="space-y-6 max-w-4xl">
                <div className="bg-white rounded-xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t("Invoice (optional)")}</label>
                        <Select value={data.invoice_id} onChange={e => handleInvoiceChange(e.target.value)}>
                            <option value="">— Without Invoice —</option>
                            {preInvoice && !pendingInvoices.find(i => i.id === preInvoice.id) &&
                                <option value={preInvoice.id}>{preInvoice.invoice_number}</option>}
                            {pendingInvoices.map(inv => <option key={inv.id} value={inv.id}>{inv.invoice_number} — {inv.customer?.name}</option>)}
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Customer *</label>
                        <Select value={data.customer_id} onChange={e => setData("customer_id", e.target.value)} required>
                            <option value="">Select customer *</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Select>
                        {errors.customer_id && <p className="mt-1 text-xs text-red-500">{errors.customer_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Dispatch Date *</label>
                        <Input type="date" value={data.dispatch_date} onChange={e => setData("dispatch_date", e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle No.</label>
                        <Input value={data.vehicle_no} onChange={e => setData("vehicle_no", e.target.value)} placeholder="e.g. Dhaka Metro G-1234" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t("Driver Name")}</label>
                        <Input value={data.driver_name} onChange={e => setData("driver_name", e.target.value)} placeholder={t("Driver name")} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t("Delivery Address")}</label>
                        <textarea value={data.delivery_address} onChange={e => setData("delivery_address", e.target.value)} rows={2}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={t("Full delivery address")} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t("Notes")}</label>
                        <Input value={data.notes} onChange={e => setData("notes", e.target.value)} placeholder={t("Additional notes")} />
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-slate-700">Items to Deliver</h3>
                        <button type="button" onClick={addRow}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                            <Plus size={15} /> {t("Add Row")}
                        </button>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {["Product *", "Quantity *", "Notes", ""].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.items.map((item, i) => (
                                <tr key={i}>
                                    <td className="px-4 py-2 w-72">
                                        <Select value={item.product_id} onChange={e => updateRow(i, "product_id", e.target.value)} required>
                                            <option value="">Select product…</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name}{p.code ? ` (${p.code})` : ""}</option>)}
                                        </Select>
                                    </td>
                                    <td className="px-4 py-2 w-32">
                                        <Input type="number" step="any" min="0.001" value={item.quantity}
                                            onChange={e => updateRow(i, "quantity", e.target.value)} required />
                                    </td>
                                    <td className="px-4 py-2">
                                        <Input value={item.notes ?? ""} onChange={e => updateRow(i, "notes", e.target.value)} placeholder={t("Optional")} />
                                    </td>
                                    <td className="px-4 py-2 w-10">
                                        {data.items.length > 1 && (
                                            <button type="button" onClick={() => removeRow(i)} className="text-slate-300 hover:text-red-500">
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end gap-3 pb-8">
                    <Link href={route("sales.delivery-notes.index")} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</Link>
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium">
                        <Save size={16} /> {t("Create Delivery Note")}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

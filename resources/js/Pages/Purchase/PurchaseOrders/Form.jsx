import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";

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
    tax_rate_id: "",
    line_total: 0,
});

export default function PurchaseOrderForm({
    order,
    vendors,
    products,
    taxRates,
    warehouses,
}) {
    const isEdit = !!order;
    const { data, setData, post, put, processing, errors } = useForm({
        po_number: order?.po_number ?? "",
        vendor_id: order?.vendor_id ?? "",
        po_date: order?.po_date ?? new Date().toISOString().slice(0, 10),
        expected_date: order?.expected_date ?? "",
        warehouse_id: order?.warehouse_id ?? "",
        currency_code: order?.currency_code ?? "BDT",
        status: order?.status ?? "draft",
        notes: order?.notes ?? "",
        items: order?.items?.length
            ? order.items.map((i) => ({
                  ...i,
                  line_total: Number(i.quantity) * Number(i.unit_price),
              }))
            : [emptyLine()],
    });

    const updateLine = (idx, field, val) => {
        const items = [...data.items];
        items[idx] = { ...items[idx], [field]: val };
        items[idx].line_total =
            Number(items[idx].quantity) * Number(items[idx].unit_price || 0);
        setData("items", items);
    };

    const selectProduct = (idx, productId) => {
        const p = products?.find((p) => String(p.id) === String(productId));
        if (p) {
            const items = [...data.items];
            items[idx] = {
                ...items[idx],
                product_id: productId,
                description: p.name,
                unit_price: p.cost_price ?? "",
                tax_rate_id: p.tax_rate_id ?? "",
            };
            items[idx].line_total =
                Number(items[idx].quantity) *
                Number(items[idx].unit_price || 0);
            setData("items", items);
        } else {
            updateLine(idx, "product_id", productId);
        }
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
        const rate = taxRates?.find(
            (t) => String(t.id) === String(i.tax_rate_id),
        );
        return (
            s + (rate ? (Number(i.line_total) * Number(rate.rate)) / 100 : 0)
        );
    }, 0);
    const grandTotal = subtotal + taxTotal;

    const submit = (e) => {
        e.preventDefault();
        const payload = {
            ...data,
            subtotal,
            tax_amount: taxTotal,
            total_amount: grandTotal,
        };
        isEdit
            ? put(route("purchase.purchase-orders.update", order.id), payload)
            : post(route("purchase.purchase-orders.store"), payload);
    };

    return (
        <AppLayout
            title={isEdit ? "Edit Purchase Order" : "New Purchase Order"}
        >
            <Head
                title={isEdit ? "Edit Purchase Order" : "New Purchase Order"}
            />
            <PageHeader
                title={isEdit ? "Edit Purchase Order" : "New Purchase Order"}
                subtitle={
                    isEdit
                        ? `PO #${order.po_number}`
                        : "Create a new purchase order"
                }
                actions={
                    <Link
                        href={route("purchase.purchase-orders.index")}
                        className="flex items-center gap-2 text-slate-600 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> Back
                    </Link>
                }
            />
            <form onSubmit={submit} className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Vendor *
                            </label>
                            <Select
                                value={data.vendor_id}
                                onChange={(e) =>
                                    setData("vendor_id", e.target.value)
                                }
                                required
                            >
                                <option value="">Select vendor…</option>
                                {vendors?.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Order Date *
                            </label>
                            <Input
                                type="date"
                                value={data.po_date}
                                onChange={(e) =>
                                    setData("po_date", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Expected Date
                            </label>
                            <Input
                                type="date"
                                value={data.expected_date}
                                onChange={(e) =>
                                    setData("expected_date", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Receive Into Warehouse
                            </label>
                            <Select
                                value={data.warehouse_id}
                                onChange={(e) =>
                                    setData("warehouse_id", e.target.value)
                                }
                            >
                                <option value="">Select warehouse…</option>
                                {warehouses?.map((w) => (
                                    <option key={w.id} value={w.id}>
                                        {w.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Status
                            </label>
                            <Select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                            >
                                <option value="draft">Draft</option>
                                <option value="sent">Sent</option>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                PO Number
                            </label>
                            <Input
                                value={data.po_number}
                                onChange={(e) =>
                                    setData("po_number", e.target.value)
                                }
                                placeholder="Auto-generated"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                            Order Items
                        </h3>
                        <button
                            type="button"
                            onClick={addLine}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            <Plus size={15} /> Add Line
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 w-48">
                                        Product
                                    </th>
                                    <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">
                                        Description
                                    </th>
                                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 w-20">
                                        Qty
                                    </th>
                                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 w-28">
                                        Unit Cost
                                    </th>
                                    <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 w-32">
                                        Tax
                                    </th>
                                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 w-28">
                                        Total
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
                                                    — select —
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
                                                placeholder="Description…"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateLine(
                                                        idx,
                                                        "quantity",
                                                        e.target.value,
                                                    )
                                                }
                                                className="text-right"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                type="number"
                                                step="0.01"
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
                                                <option value="">No Tax</option>
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
                                            ).toFixed(2)}
                                        </td>
                                        <td className="px-2 py-2">
                                            {data.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeLine(idx)
                                                    }
                                                    className="text-slate-300 hover:text-red-500"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="border-t border-slate-100 px-6 py-4 flex flex-col items-end gap-1">
                        <div className="w-56 space-y-1 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-mono">
                                    ৳{subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Tax</span>
                                <span className="font-mono">
                                    ৳{taxTotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between font-semibold text-slate-800 border-t border-slate-200 pt-2 text-base">
                                <span>Total</span>
                                <span className="font-mono">
                                    ৳{grandTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Notes
                    </label>
                    <textarea
                        value={data.notes}
                        onChange={(e) => setData("notes", e.target.value)}
                        rows={3}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end gap-3 pb-8">
                    <Link
                        href={route("purchase.purchase-orders.index")}
                        className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium"
                    >
                        <Save size={16} /> {isEdit ? "Update PO" : "Save PO"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Download, AlertTriangle } from "lucide-react";

export default function StockReport({ report, filters, warehouses }) {
    const [warehouse, setWarehouse] = useState(filters?.warehouse_id ?? "");
    const [lowStock, setLowStock] = useState(filters?.low_stock ?? false);
    const run = () => router.get(route("reports.stock"), { warehouse_id: warehouse, low_stock: lowStock ? 1 : 0 }, { preserveState: true, replace: true });

    return (
        <AppLayout title="Stock Report">
            <Head title="Stock Report" />
            <PageHeader
                title="Stock Report"
                subtitle="Current inventory levels by product and warehouse"
                actions={
                    <button className="flex items-center gap-2 text-slate-600 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium">
                        <Download size={16} /> Export
                    </button>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Warehouse</label>
                    <select value={warehouse} onChange={e => setWarehouse(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Warehouses</option>
                        {warehouses?.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={lowStock} onChange={e => setLowStock(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                    <span className="text-sm text-slate-700">Low stock only</span>
                </label>
                <button onClick={run} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Generate</button>
            </div>

            {report && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Product</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">SKU</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Warehouse</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">In Stock</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Reorder Level</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Value (Cost)</th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {report.length === 0 && <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400">No stock data found.</td></tr>}
                                {report.map((row, i) => {
                                    const isLow = Number(row.qty_in_stock) <= Number(row.reorder_level ?? 0);
                                    return (
                                        <tr key={i} className={`hover:bg-slate-50 ${isLow ? "bg-red-50/30" : ""}`}>
                                            <td className="px-6 py-3 font-medium text-slate-800 flex items-center gap-2">
                                                {isLow && <AlertTriangle size={13} className="text-amber-500 shrink-0" />}
                                                {row.product_name}
                                            </td>
                                            <td className="px-6 py-3 font-mono text-xs text-slate-400">{row.sku}</td>
                                            <td className="px-6 py-3 text-slate-500">{row.category}</td>
                                            <td className="px-6 py-3 text-slate-500">{row.warehouse}</td>
                                            <td className="px-6 py-3 text-right font-mono font-semibold text-slate-800">
                                                {Number(row.qty_in_stock).toLocaleString()} {row.unit}
                                            </td>
                                            <td className="px-6 py-3 text-right text-slate-500">{row.reorder_level ?? "—"}</td>
                                            <td className="px-6 py-3 text-right font-mono text-slate-700">৳{Number(row.stock_value ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-center">
                                                {isLow
                                                    ? <Badge color="red">Low Stock</Badge>
                                                    : <Badge color="green">OK</Badge>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

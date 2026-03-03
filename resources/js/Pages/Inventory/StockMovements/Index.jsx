import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Search } from "lucide-react";
import ExportButtons from "@/Components/ExportButtons";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const typeColor = { in: "green", out: "red", adjustment: "amber" };
const typeLabel = { in: "Stock In", out: "Stock Out", adjustment: "Adjustment" };
const fmt = (v) => Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function StockMovementsIndex({ movements, products, warehouses, filters }) {
    const { t } = useTranslation();
    const [f, setF] = useState({ ...filters });

    const apply = (extra = {}) => {
        router.get(route("inventory.stock-movements.index"), { ...f, ...extra }, { preserveState: true });
    };

    return (
        <AppLayout title={t("Stock Movements")}>
            <Head title={t("Stock Movements")} />
            <PageHeader title={t("Stock Movements")} subtitle={t("Track all stock in, stock out and adjustments")}
                actions={
                    <Link href={route("inventory.stock-movements.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        <Plus size={16} /> {t("New Entry")}
                    </Link>
                }
            />

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3">
                <select value={f.product_id ?? ""} onChange={e => { const v = e.target.value; setF(p => ({ ...p, product_id: v })); apply({ product_id: v }); }}
                    className="border border-slate-300 rounded-lg text-sm px-3 py-2 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">{t("All Products")}</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select value={f.warehouse_id ?? ""} onChange={e => { const v = e.target.value; setF(p => ({ ...p, warehouse_id: v })); apply({ warehouse_id: v }); }}
                    className="border border-slate-300 rounded-lg text-sm px-3 py-2 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">{t("All Warehouses")}</option>
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
                <select value={f.movement_type ?? ""} onChange={e => { const v = e.target.value; setF(p => ({ ...p, movement_type: v })); apply({ movement_type: v }); }}
                    className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">{t("All Types")}</option>
                    <option value="in">{t("Stock In")}</option>
                    <option value="out">{t("Stock Out")}</option>
                    <option value="adjustment">{t("Adjustment")}</option>
                </select>
                <input type="date" value={f.date_from ?? ""} onChange={e => { const v = e.target.value; setF(p => ({ ...p, date_from: v })); apply({ date_from: v }); }}
                    className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="date" value={f.date_to ?? ""} onChange={e => { const v = e.target.value; setF(p => ({ ...p, date_to: v })); apply({ date_to: v }); }}
                    className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <ExportButtons tableId="export-table" filename="stock-movements" title="Stock Movements" />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" id="export-table">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Date")}</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Product")}</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Warehouse")}</th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Type")}</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Quantity")}</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Unit Cost")}</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t("Notes")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {movements.data?.length === 0 && (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">{t("No stock movements found.")}</td></tr>
                            )}
                            {movements.data?.map(m => (
                                <tr key={m.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 text-slate-600">{m.movement_date}</td>
                                    <td className="px-6 py-3">
                                        <div className="font-medium text-slate-800">{m.product?.name}</div>
                                        <div className="text-xs text-slate-400">{m.product?.code}</div>
                                    </td>
                                    <td className="px-6 py-3 text-slate-600">{m.warehouse?.name ?? "—"}</td>
                                    <td className="px-6 py-3 text-center">
                                        <Badge color={typeColor[m.movement_type] ?? "gray"}>{typeLabel[m.movement_type] ?? m.movement_type}</Badge>
                                    </td>
                                    <td className={`px-6 py-3 text-right font-semibold ${m.quantity >= 0 ? "text-green-600" : "text-red-500"}`}>
                                        {m.quantity >= 0 ? "+" : ""}{fmt(m.quantity)}
                                    </td>
                                    <td className="px-6 py-3 text-right text-slate-600">{m.unit_cost > 0 ? fmt(m.unit_cost) : "—"}</td>
                                    <td className="px-6 py-3 text-slate-500 text-xs max-w-[200px] truncate">{m.notes ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {movements.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-600">
                        <span>Showing {movements.from}–{movements.to} of {movements.total}</span>
                        <div className="flex gap-2">
                            {movements.prev_page_url && <Link href={movements.prev_page_url} className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50">Prev</Link>}
                            {movements.next_page_url && <Link href={movements.next_page_url} className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50">Next</Link>}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

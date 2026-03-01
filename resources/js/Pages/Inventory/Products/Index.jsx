import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import { Plus, Eye, Pencil, Trash2, AlertTriangle } from "lucide-react";
import ExportButtons from "@/Components/ExportButtons";
import { useDialog } from "@/hooks/useDialog";

export default function ProductsIndex({ products, filters, categories }) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [catId, setCatId] = useState(filters?.category_id ?? "");
    const apply = (s, c) =>
        router.get(
            route("inventory.products.index"),
            { search: s, category_id: c },
            { preserveState: true, replace: true },
        );
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm("This product will be permanently removed.", {
                title: "Delete Product?",
                confirmLabel: "Delete",
                intent: "danger",
            })
        )
            router.delete(route("inventory.products.destroy", id));
    };

    return (
        <AppLayout title="Products">
            <Head title="Products" />
            <PageHeader
                title="Products"
                subtitle={`${products.total} total products`}
                actions={
                    <Link
                        href={route("inventory.products.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> New Product
                    </Link>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3">
                <SearchFilter
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        apply(v, catId);
                    }}
                    placeholder="Search name, code, barcode…"
                />
                <select
                    value={catId}
                    onChange={(e) => {
                        setCatId(e.target.value);
                        apply(search, e.target.value);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Categories</option>
                    {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <ExportButtons
                    tableId="export-table"
                    filename="products"
                    title="Products"
                />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" id="export-table">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Unit
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Cost
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Sale Price
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        No products found.
                                    </td>
                                </tr>
                            )}
                            {products.data.map((p) => {
                                const totalStock =
                                    p.stocks?.reduce(
                                        (a, s) => a + Number(s.quantity),
                                        0,
                                    ) ?? 0;
                                const lowStock =
                                    p.reorder_level &&
                                    totalStock <= p.reorder_level;
                                return (
                                    <tr
                                        key={p.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800 flex items-center gap-1">
                                                {p.name}
                                                {lowStock && (
                                                    <AlertTriangle
                                                        size={13}
                                                        className="text-amber-500"
                                                    />
                                                )}
                                            </div>
                                            {p.code && (
                                                <div className="text-xs text-slate-400 font-mono">
                                                    {p.code}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {p.category?.name ?? "—"}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {p.unit?.abbreviation ?? "—"}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-700">
                                            ৳
                                            {Number(
                                                p.cost_price ?? 0,
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono font-medium text-slate-800">
                                            ৳
                                            {Number(
                                                p.sale_price ?? 0,
                                            ).toLocaleString()}
                                        </td>
                                        <td
                                            className={`px-6 py-4 text-right font-mono font-semibold ${lowStock ? "text-amber-600" : "text-slate-700"}`}
                                        >
                                            {totalStock.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge
                                                color={
                                                    p.is_active
                                                        ? "green"
                                                        : "red"
                                                }
                                            >
                                                {p.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={route(
                                                        "inventory.products.show",
                                                        p.id,
                                                    )}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Eye size={15} />
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "inventory.products.edit",
                                                        p.id,
                                                    )}
                                                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                                >
                                                    <Pencil size={15} />
                                                </Link>
                                                <button
                                                    onClick={() => del(p.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <Pagination links={products.links} />
            </div>
        </AppLayout>
    );
}

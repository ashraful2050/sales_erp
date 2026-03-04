import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import {
    ArrowLeft,
    Edit,
    Package,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function Show({ product }) {
    const { t } = useTranslation();
    const totalStock =
        product.stocks?.reduce((s, st) => s + Number(st.quantity ?? 0), 0) ?? 0;

    return (
        <AppLayout>
            <Head title={`Product: ${product.name}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={product.name}
                    subtitle={
                        product.sku ? `SKU: ${product.sku}` : "Product Details"
                    }
                    actions={
                        <div className="flex gap-2">
                            <Link
                                href={route("inventory.products.index")}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> {t("Back")}
                            </Link>
                            <Link
                                href={route(
                                    "inventory.products.edit",
                                    product.id,
                                )}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                            >
                                <Edit className="w-4 h-4" /> {t("Edit")}
                            </Link>
                        </div>
                    }
                />

                {/* Stock Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 text-blue-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                            {t("Total Stock")}
                        </p>
                        <p className="text-2xl font-bold mt-1">
                            {totalStock} {product.unit?.name ?? ""}
                        </p>
                    </div>
                    <div className="bg-green-50 text-green-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                            {t("Sale Price")}
                        </p>
                        <p className="text-2xl font-bold mt-1">
                            ৳{Number(product.sale_price ?? 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-orange-50 text-orange-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                            {t("Cost Price")}
                        </p>
                        <p className="text-2xl font-bold mt-1">
                            ৳{Number(product.cost_price ?? 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Product Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        Product Information
                    </h3>
                    <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <dt className="text-xs text-gray-500">Category</dt>
                            <dd className="font-medium">
                                {product.category?.name ?? "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Unit</dt>
                            <dd className="font-medium">
                                {product.unit?.name ?? "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Tax Rate</dt>
                            <dd className="font-medium">
                                {product.taxRate
                                    ? `${product.taxRate.rate}%`
                                    : "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">
                                Reorder Level
                            </dt>
                            <dd className="font-medium">
                                {product.reorder_level ?? "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500 mb-1">
                                Status
                            </dt>
                            <dd>
                                <Badge
                                    color={product.is_active ? "green" : "red"}
                                >
                                    {product.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </dd>
                        </div>
                    </dl>
                    {product.description && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <dt className="text-xs text-gray-500 mb-1">
                                Description
                            </dt>
                            <dd className="text-sm text-gray-700">
                                {product.description}
                            </dd>
                        </div>
                    )}
                </div>

                {/* Stock by Warehouse */}
                {product.stocks?.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700">
                                Stock by Warehouse
                            </h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {["Warehouse", "Quantity"].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {product.stocks.map((stock) => (
                                    <tr
                                        key={stock.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {stock.warehouse?.name ?? "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {stock.quantity}{" "}
                                            {product.unit?.name ?? ""}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Stock Movements */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Recent Stock Movements
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {[
                                        "Type",
                                        "Quantity",
                                        "Reference",
                                        "Date",
                                        "Notes",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {product.stock_movements?.length ? (
                                    product.stock_movements.map((m) => (
                                        <tr
                                            key={m.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center gap-1 text-xs font-medium ${m.type === "in" ? "text-green-700" : "text-red-700"}`}
                                                >
                                                    {m.type === "in" ? (
                                                        <TrendingUp className="w-3 h-3" />
                                                    ) : (
                                                        <TrendingDown className="w-3 h-3" />
                                                    )}
                                                    {m.type?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {m.quantity}
                                            </td>
                                            <td className="px-4 py-3">
                                                {m.reference ?? "—"}
                                            </td>
                                            <td className="px-4 py-3">
                                                {m.movement_date}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {m.notes ?? "—"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-gray-400"
                                        >
                                            No stock movements
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { ArrowLeft, Edit } from "lucide-react";

export default function Show({ warehouse }) {
    const totalItems = warehouse.stocks?.length ?? 0;

    return (
        <AppLayout>
            <Head title={`Warehouse: ${warehouse.name}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={warehouse.name}
                    subtitle={t("Warehouse Details")}
                    actions={
                        <div className="flex gap-2">
                            <Link href={route("inventory.warehouses.index")} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                                <ArrowLeft className="w-4 h-4" /> {t("Back")}
                            </Link>
                            <Link href={route("inventory.warehouses.edit", warehouse.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                                <Edit className="w-4 h-4" /> {t("Edit")}
                            </Link>
                        </div>
                    }
                />

                {/* Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                            <dt className="text-xs text-gray-500">Code</dt>
                            <dd className="font-medium">{warehouse.code ?? "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Location</dt>
                            <dd className="font-medium">{warehouse.location ?? "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Total Products</dt>
                            <dd className="font-medium">{totalItems}</dd>
                        </div>
                    </dl>
                </div>

                {/* Stock List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">Current Stock</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {["Product", "SKU", "Quantity"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {warehouse.stocks?.length ? warehouse.stocks.map((stock) => (
                                    <tr key={stock.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">
                                            <Link href={route("inventory.products.show", stock.product_id)} className="text-indigo-600 hover:underline">
                                                {stock.product?.name ?? "—"}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{stock.product?.sku ?? "—"}</td>
                                        <td className="px-4 py-3">{stock.quantity}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No stock in this warehouse</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

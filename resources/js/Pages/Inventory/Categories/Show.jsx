import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Edit } from "lucide-react";

export default function Show({ category }) {
    return (
        <AppLayout>
            <Head title={`Category: ${category.name}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={category.name}
                    subtitle={t("Product Category")}
                    actions={
                        <div className="flex gap-2">
                            <Link href={route("inventory.categories.index")} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                                <ArrowLeft className="w-4 h-4" /> {t("Back")}
                            </Link>
                            <Link href={route("inventory.categories.edit", category.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                                <Edit className="w-4 h-4" /> {t("Edit")}
                            </Link>
                        </div>
                    }
                />

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <dt className="text-xs text-gray-500">Code</dt>
                            <dd className="font-medium">{category.code ?? "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Total Products</dt>
                            <dd className="font-medium">{category.products?.length ?? 0}</dd>
                        </div>
                        {category.description && (
                            <div className="sm:col-span-2">
                                <dt className="text-xs text-gray-500">Description</dt>
                                <dd className="text-gray-700">{category.description}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Products List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">Products in this Category</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {["Name", "SKU", "Sale Price", "Status"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {category.products?.length ? category.products.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <Link href={route("inventory.products.show", p.id)} className="text-indigo-600 hover:underline font-medium">{p.name}</Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{p.sku ?? "—"}</td>
                                        <td className="px-4 py-3">৳{Number(p.sale_price ?? 0).toLocaleString()}</td>
                                        <td className="px-4 py-3"><Badge color={p.is_active ? "green" : "red"}>{p.is_active ? "Active" : "Inactive"}</Badge></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No products in this category</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

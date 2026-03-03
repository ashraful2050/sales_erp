import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

export default function CategoriesIndex({ categories }) {
    const { t } = useTranslation();
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(t("This category will be permanently removed."), {
                title: t("Delete Category?"),
                confirmLabel: t("Delete"),
                intent: "danger",
            })
        )
            router.delete(route("inventory.categories.destroy", id));
    };

    return (
        <AppLayout title={t("Product Categories")}>
            <Head title={t("Product Categories")} />
            <PageHeader
                title={t("Product Categories")}
                subtitle={`${categories.length} ${t("categories")}`}
                actions={
                    <Link
                        href={route("inventory.categories.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("Add Category")}
                    </Link>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Category Name")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Code")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Description")}
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Status")}
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        {t("No categories found.")}
                                    </td>
                                </tr>
                            )}
                            {categories.map((c) => (
                                <tr
                                    key={c.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {c.name}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                                        {c.code ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {c.description ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                c.is_active ? "green" : "slate"
                                            }
                                        >
                                            {c.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "inventory.categories.edit",
                                                    c.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                            >
                                                <Pencil size={15} />
                                            </Link>
                                            <button
                                                onClick={() => del(c.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

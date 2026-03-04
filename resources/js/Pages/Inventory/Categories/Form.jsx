import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { ArrowLeft, Save } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function Form({ category }) {
    const { t } = useTranslation();
    const isEdit = !!category;
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name ?? "",
        code: category?.code ?? "",
        description: category?.description ?? "",
        is_active: category?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route("inventory.categories.update", category.id));
        } else {
            post(route("inventory.categories.store"));
        }
    };

    return (
        <AppLayout
            title={isEdit ? t("Edit Category") : t("New Product Category")}
        >
            <Head
                title={isEdit ? t("Edit Category") : t("New Product Category")}
            />
            <div className="p-6 max-w-2xl mx-auto space-y-6">
                <PageHeader
                    title={
                        isEdit ? t("Edit Category") : t("New Product Category")
                    }
                    actions={
                        <Link
                            href={route("inventory.categories.index")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" /> {t("Back")}
                        </Link>
                    }
                />

                <form
                    onSubmit={submit}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("Category Name")}{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={t("e.g. Electronics")}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("Code")}
                            </label>
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={t("e.g. ELEC")}
                            />
                            {errors.code && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("Description")}
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={t("Optional description...")}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Active */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData("is_active", e.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                                htmlFor="is_active"
                                className="text-sm font-medium text-gray-700"
                            >
                                {t("Active")}
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <Link
                            href={route("inventory.categories.index")}
                            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            {t("Cancel")}
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {processing
                                ? t("Saving...")
                                : isEdit
                                  ? t("Update Category")
                                  : t("Create Category")}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

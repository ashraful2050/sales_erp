import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export default function Form({ asset, categories }) {
    const { t } = useTranslation();
    const isEdit = !!asset;
    const { data, setData, post, put, processing, errors } = useForm({
        name: asset?.name ?? "",
        asset_code: asset?.asset_code ?? "",
        category_id: asset?.asset_category_id ?? "",
        purchase_date: asset?.purchase_date ?? "",
        purchase_cost: asset?.purchase_cost ?? "",
        salvage_value: asset?.salvage_value ?? "",
        useful_life_years: asset?.useful_life_years ?? "",
        depreciation_rate: asset?.depreciation_rate ?? "",
        depreciation_method: asset?.depreciation_method ?? "straight_line",
        location: asset?.location ?? "",
        serial_number: asset?.serial_number ?? "",
        status: asset?.status ?? "active",
        description: asset?.description ?? "",
    });

    // Auto-fill depreciation info from selected category
    const handleCategoryChange = (id) => {
        setData((prev) => {
            const cat = categories.find((c) => c.id === parseInt(id));
            return {
                ...prev,
                category_id: id,
                ...(cat
                    ? {
                          depreciation_method:
                              cat.depreciation_method ??
                              prev.depreciation_method,
                          useful_life_years:
                              cat.useful_life_years ?? prev.useful_life_years,
                          depreciation_rate:
                              cat.depreciation_rate ?? prev.depreciation_rate,
                      }
                    : {}),
            };
        });
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route("assets.fixed-assets.update", asset.id));
        } else {
            post(route("assets.fixed-assets.store"));
        }
    };

    const depreciationMethods = [
        { value: "straight_line", label: "Straight Line" },
        { value: "declining_balance", label: "Declining Balance" },
        { value: "sum_of_years", label: "Sum of Years Digits" },
    ];

    const statusOptions = ["active", "disposed", "written_off"];

    return (
        <AppLayout>
            <Head title={isEdit ? `Edit: ${asset.name}` : "New Fixed Asset"} />
            <div className="p-6 max-w-3xl mx-auto space-y-6">
                <PageHeader
                    title={isEdit ? "Edit Fixed Asset" : "New Fixed Asset"}
                    actions={
                        <Link
                            href={route("assets.fixed-assets.index")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" /> {t("Back")}
                        </Link>
                    }
                />

                <form
                    onSubmit={submit}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
                >
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">
                            Asset Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Asset Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. Dell Laptop"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("Asset Code")}
                                </label>
                                <input
                                    type="text"
                                    value={data.asset_code}
                                    onChange={(e) =>
                                        setData("asset_code", e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. FA-001"
                                />
                                {errors.asset_code && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.asset_code}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) =>
                                        handleCategoryChange(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Select category...</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("Status")}
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    {statusOptions.map((s) => (
                                        <option key={s} value={s}>
                                            {s
                                                .replace("_", " ")
                                                .replace(/\b\w/g, (c) =>
                                                    c.toUpperCase(),
                                                )}
                                        </option>
                                    ))}
                                </select>
                                {errors.status && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("Serial Number")}
                                </label>
                                <input
                                    type="text"
                                    value={data.serial_number}
                                    onChange={(e) =>
                                        setData("serial_number", e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. SN-123456"
                                />
                                {errors.serial_number && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.serial_number}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("Location")}
                                </label>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData("location", e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. Head Office, Floor 3"
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.location}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("Description")}
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={2}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder={t("Optional notes...")}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Financial & Depreciation */}
                    <div className="border-t border-gray-100 pt-5">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">
                            Valuation & Depreciation
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Purchase Date{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.purchase_date}
                                    onChange={(e) =>
                                        setData("purchase_date", e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.purchase_date && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.purchase_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Purchase Cost (৳){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.purchase_cost}
                                    onChange={(e) =>
                                        setData("purchase_cost", e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="0.00"
                                />
                                {errors.purchase_cost && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.purchase_cost}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Salvage Value (৳)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.salvage_value}
                                    onChange={(e) =>
                                        setData("salvage_value", e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="0.00"
                                />
                                {errors.salvage_value && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.salvage_value}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Useful Life (Years){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    step="0.5"
                                    value={data.useful_life_years}
                                    onChange={(e) =>
                                        setData(
                                            "useful_life_years",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. 5"
                                />
                                {errors.useful_life_years && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.useful_life_years}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Depreciation Rate (% / year){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.depreciation_rate}
                                    onChange={(e) =>
                                        setData(
                                            "depreciation_rate",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. 20"
                                />
                                {errors.depreciation_rate && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.depreciation_rate}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("Depreciation Method")}
                                </label>
                                <select
                                    value={data.depreciation_method}
                                    onChange={(e) =>
                                        setData(
                                            "depreciation_method",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    {depreciationMethods.map((m) => (
                                        <option key={m.value} value={m.value}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.depreciation_method && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.depreciation_method}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Preview calculation */}
                        {data.purchase_cost && data.useful_life_years && (
                            <div className="mt-4 bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-700">
                                <strong>Annual Depreciation Estimate: </strong>৳
                                {(
                                    (Number(data.purchase_cost) -
                                        Number(data.salvage_value || 0)) /
                                    Number(data.useful_life_years)
                                ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}{" "}
                                / year
                                <span className="text-xs ml-2 opacity-70">
                                    (Straight-line basis)
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <Link
                            href={route("assets.fixed-assets.index")}
                            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {processing
                                ? "Saving..."
                                : isEdit
                                  ? "Update Asset"
                                  : "Add Asset"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

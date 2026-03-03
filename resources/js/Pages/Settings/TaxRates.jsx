import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

function TaxForm({ initial, onSave, onCancel }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: initial?.name ?? "",
        rate: initial?.rate ?? "",
        type: initial?.type ?? "vat",
        is_active: initial?.is_active ?? true,
    });
    const submit = (e) => {
        e.preventDefault();
        const method = initial ? put : post;
        const url = initial
            ? route("settings.tax-rates.update", initial.id)
            : route("settings.tax-rates.store");
        method(url, {
            onSuccess: () => {
                reset();
                onSave();
            },
        });
    };
    return (
        <form
            onSubmit={submit}
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3 items-end"
        >
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t("Name")}
                </label>
                <input
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="e.g. VAT 15%"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-400" : "border-slate-200"}`}
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    Rate (%)
                </label>
                <input
                    type="number"
                    step="0.01"
                    value={data.rate}
                    onChange={(e) => setData("rate", e.target.value)}
                    placeholder="15.00"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.rate ? "border-red-400" : "border-slate-200"}`}
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t("Type")}
                </label>
                <select
                    value={data.type}
                    onChange={(e) => setData("type", e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="vat">{t("VAT")}</option>
                    <option value="income_tax">{t("Income Tax")}</option>
                    <option value="withholding">{t("Withholding")}</option>
                    <option value="other">{t("Other")}</option>
                </select>
            </div>
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                >
                    <Check size={14} /> {initial ? "Update" : "Add"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-2 text-slate-400 hover:text-slate-600"
                >
                    <X size={16} />
                </button>
            </div>
        </form>
    );
}

export default function TaxRatesIndex({ taxRates }) {
    const { t } = useTranslation();
    const { confirm: dlgConfirm } = useDialog();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const del = async (id) => {
        if (
            await dlgConfirm(t("Delete this tax rate? This cannot be undone."), {
                title: t("Delete Tax Rate"),
                confirmLabel: t("Delete"),
                intent: "danger",
            })
        )
            router.delete(route("settings.tax-rates.destroy", id));
    };

    return (
        <AppLayout title={t("Tax Rates")}>
            <Head title={t("Tax Rates")} />
            <PageHeader
                title={t("Tax Rates")}
                subtitle={t("Manage VAT and tax rate configurations")}
                actions={
                    <button
                        onClick={() => {
                            setEditing(null);
                            setShowForm(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("Add Tax Rate")}
                    </button>
                }
            />
            {showForm && (
                <TaxForm
                    initial={editing}
                    onSave={() => setShowForm(false)}
                    onCancel={() => setShowForm(false)}
                />
            )}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Name")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Rate")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Type")}
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Status")}
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {taxRates.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        {t("No tax rates defined.")}
                                    </td>
                                </tr>
                            )}
                            {taxRates.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {t.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700 font-mono">
                                        {t.rate}%
                                    </td>
                                    <td className="px-6 py-4 capitalize text-slate-500">
                                        {t.type?.replace(/_/g, " ")}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                t.is_active ? "green" : "slate"
                                            }
                                        >
                                            {t.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => {
                                                    setEditing(t);
                                                    setShowForm(true);
                                                }}
                                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                onClick={() => del(t.id)}
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

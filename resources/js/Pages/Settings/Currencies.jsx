import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Pencil, Trash2, X, Check, Star } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

function CurrencyForm({ initial, onSave, onCancel }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: initial?.code ?? "",
        name: initial?.name ?? "",
        symbol: initial?.symbol ?? "",
        exchange_rate: initial?.exchange_rate ?? "1.00",
        is_base: initial?.is_base ?? false,
    });
    const submit = (e) => {
        e.preventDefault();
        const method = initial ? put : post;
        const url = initial
            ? route("settings.currencies.update", initial.id)
            : route("settings.currencies.store");
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
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 grid grid-cols-2 md:grid-cols-5 gap-3 items-end"
        >
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    Code *
                </label>
                <input
                    value={data.code}
                    onChange={(e) =>
                        setData("code", e.target.value.toUpperCase())
                    }
                    placeholder={t("USD")}
                    maxLength={3}
                    disabled={!!initial}
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.code ? "border-red-400" : "border-slate-200"} ${initial ? "bg-slate-100 text-slate-400" : ""}`}
                />
                {errors.code && (
                    <p className="text-red-500 text-xs mt-1">{errors.code}</p>
                )}
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    Name *
                </label>
                <input
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder={t("US Dollar")}
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.name ? "border-red-400" : "border-slate-200"}`}
                />
                {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    Symbol *
                </label>
                <input
                    value={data.symbol}
                    onChange={(e) => setData("symbol", e.target.value)}
                    placeholder="$"
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.symbol ? "border-red-400" : "border-slate-200"}`}
                />
                {errors.symbol && (
                    <p className="text-red-500 text-xs mt-1">{errors.symbol}</p>
                )}
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    Exchange Rate *
                </label>
                <input
                    type="number"
                    step="0.000001"
                    value={data.exchange_rate}
                    onChange={(e) => setData("exchange_rate", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.exchange_rate ? "border-red-400" : "border-slate-200"}`}
                />
                {errors.exchange_rate && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.exchange_rate}
                    </p>
                )}
            </div>
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium"
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

export default function CurrenciesIndex({ currencies }) {
    const { t } = useTranslation();
    const { confirm: dlgConfirm } = useDialog();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const del = async (id) => {
        if (
            await dlgConfirm(t("Delete this currency? This cannot be undone."), {
                title: t("Delete Currency"),
                confirmLabel: t("Delete"),
                intent: "danger",
            })
        )
            router.delete(route("settings.currencies.destroy", id));
    };

    return (
        <AppLayout title={t("Currencies")}>
            <Head title={t("Currencies")} />
            <PageHeader
                title={t("Currencies")}
                subtitle={t("Manage exchange rates and currencies")}
                actions={
                    <button
                        onClick={() => {
                            setEditing(null);
                            setShowForm(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("Add Currency")}
                    </button>
                }
            />
            {showForm && (
                <CurrencyForm
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
                                    {t("Code")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Name")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Symbol")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Exchange Rate")}
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Base")}
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {currencies.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        {t("No currencies defined.")}
                                    </td>
                                </tr>
                            )}
                            {currencies.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono font-semibold text-slate-800">
                                        {c.code}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {c.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {c.symbol}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-700">
                                        {Number(c.exchange_rate).toFixed(4)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {c.is_base ? (
                                            <Star
                                                size={15}
                                                className="inline text-amber-500 fill-amber-500"
                                            />
                                        ) : (
                                            <span className="text-slate-300">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => {
                                                    setEditing(c);
                                                    setShowForm(true);
                                                }}
                                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            {!c.is_base && (
                                                <button
                                                    onClick={() => del(c.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
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

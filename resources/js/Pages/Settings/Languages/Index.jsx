import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Pencil, Trash2, Star, Globe, BookOpen } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

// ── Language Form ─────────────────────────────────────────────────────────────
function LanguageForm({ initial, onSave, onCancel }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: initial?.name ?? "",
        native_name: initial?.native_name ?? "",
        code: initial?.code ?? "",
        flag: initial?.flag ?? "",
        is_rtl: initial?.is_rtl ?? false,
        is_active: initial?.is_active ?? true,
        sort_order: initial?.sort_order ?? 0,
    });

    const submit = (e) => {
        e.preventDefault();
        const method = initial ? put : post;
        const url = initial
            ? route("settings.languages.update", initial.id)
            : route("settings.languages.store");
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
            className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-5 grid grid-cols-2 md:grid-cols-4 gap-4 items-end"
        >
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    Language Name *
                </label>
                <input
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder={t("English")}
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.name ? "border-red-400" : "border-slate-200"}`}
                />
                {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
            </div>

            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t("Native Name")}
                </label>
                <input
                    value={data.native_name}
                    onChange={(e) => setData("native_name", e.target.value)}
                    placeholder="বাংলা"
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.native_name ? "border-red-400" : "border-slate-200"}`}
                />
                {errors.native_name && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.native_name}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    Code * (e.g. en, bn, fr)
                </label>
                <input
                    value={data.code}
                    onChange={(e) =>
                        setData("code", e.target.value.toLowerCase())
                    }
                    placeholder="en"
                    maxLength={10}
                    disabled={!!initial}
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.code ? "border-red-400" : "border-slate-200"} ${initial ? "bg-slate-100 text-slate-400" : ""}`}
                />
                {errors.code && (
                    <p className="text-red-500 text-xs mt-1">{errors.code}</p>
                )}
            </div>

            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t("Flag Emoji")}
                </label>
                <input
                    value={data.flag}
                    onChange={(e) => setData("flag", e.target.value)}
                    placeholder="🇺🇸"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
            </div>

            <div className="flex items-center gap-4 col-span-2 md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                    <input
                        type="checkbox"
                        checked={data.is_rtl}
                        onChange={(e) => setData("is_rtl", e.target.checked)}
                        className="w-4 h-4 rounded"
                    />
                    {t("Right-to-Left (RTL)")}
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                    <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData("is_active", e.target.checked)}
                        className="w-4 h-4 rounded"
                    />
                    {t("Active")}
                </label>
                <div className="flex items-center gap-1 text-sm text-slate-700">
                    <label>{t("Sort Order")}</label>
                    <input
                        type="number"
                        value={data.sort_order}
                        onChange={(e) =>
                            setData("sort_order", parseInt(e.target.value) || 0)
                        }
                        min={0}
                        className="w-16 border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    />
                </div>
            </div>

            <div className="col-span-2 md:col-span-2 flex gap-2 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    {t("Cancel")}
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                    {processing
                        ? "Saving..."
                        : initial
                          ? "Update Language"
                          : "Add Language"}
                </button>
            </div>
        </form>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function LanguagesIndex({ languages }) {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const { confirm } = useDialog();

    const handleDelete = (lang) => {
        confirm({
            title: t("Delete Language"),
            message: `Are you sure you want to delete "${lang.name}"? All translations for this language will also be deleted.`,
            onConfirm: () =>
                router.delete(route("settings.languages.destroy", lang.id)),
        });
    };

    const handleSetDefault = (lang) => {
        router.post(
            route("settings.languages.set-default", lang.id),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <AppLayout>
            <Head title={t("Language Management")} />

            <PageHeader
                title={t("languages.title", { default: "Language Management" })}
                description="Manage languages and translations for your ERP system."
                actions={
                    !showForm && !editing ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={16} /> {t("Add Language")}
                        </button>
                    ) : null
                }
            />

            <div className="p-6">
                {/* Add Form */}
                {showForm && (
                    <LanguageForm
                        onSave={() => setShowForm(false)}
                        onCancel={() => setShowForm(false)}
                    />
                )}

                {/* Edit Form */}
                {editing && (
                    <LanguageForm
                        initial={editing}
                        onSave={() => setEditing(null)}
                        onCancel={() => setEditing(null)}
                    />
                )}

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                                    {t("Language")}
                                </th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                                    {t("Code")}
                                </th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                                    {t("RTL")}
                                </th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                                    {t("Status")}
                                </th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                                    {t("Default")}
                                </th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                                    {t("Actions")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {languages.map((lang) => (
                                <tr
                                    key={lang.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">
                                                {lang.flag ?? "🌐"}
                                            </span>
                                            <div>
                                                <p className="font-medium text-slate-800">
                                                    {lang.name}
                                                </p>
                                                {lang.native_name &&
                                                    lang.native_name !==
                                                        lang.name && (
                                                        <p className="text-xs text-slate-400">
                                                            {lang.native_name}
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <code className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-mono">
                                            {lang.code}
                                        </code>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            color={
                                                lang.is_rtl ? "blue" : "slate"
                                            }
                                        >
                                            {lang.is_rtl ? "RTL" : "LTR"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            color={
                                                lang.is_active ? "green" : "red"
                                            }
                                        >
                                            {lang.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        {lang.is_default ? (
                                            <Badge color="yellow">
                                                Default
                                            </Badge>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    handleSetDefault(lang)
                                                }
                                                className="text-xs text-slate-400 hover:text-yellow-600 hover:underline transition-colors"
                                            >
                                                {t("Set Default")}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={route(
                                                    "settings.languages.translations",
                                                    lang.id,
                                                )}
                                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                            >
                                                <BookOpen size={13} /> {t("Translations")}
                                            </a>
                                            <button
                                                onClick={() => {
                                                    setEditing(lang);
                                                    setShowForm(false);
                                                }}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            {!lang.is_default && (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(lang)
                                                    }
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {languages.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-slate-400"
                                    >
                                        {t("No languages found.")}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

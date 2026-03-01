import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Plus, Edit, Trash2, X, Save, BookOpen } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";

const COLORS = [
    "blue",
    "green",
    "purple",
    "red",
    "amber",
    "teal",
    "indigo",
    "pink",
    "slate",
    "orange",
    "cyan",
    "rose",
];
const ICONS = [
    "📁",
    "📚",
    "💡",
    "⚙️",
    "🛒",
    "💰",
    "📊",
    "👥",
    "🏪",
    "🔧",
    "📝",
    "❓",
    "🎯",
    "🔐",
    "ℹ️",
    "🚀",
];

const COLOR_BG = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
    teal: "bg-teal-500",
    indigo: "bg-indigo-500",
    pink: "bg-pink-500",
    slate: "bg-slate-400",
    orange: "bg-orange-500",
    cyan: "bg-cyan-500",
    rose: "bg-rose-500",
};

const emptyForm = {
    name: "",
    description: "",
    icon: "📁",
    color: "blue",
    sort_order: 0,
    is_active: true,
};

export default function FaqCategories({ categories }) {
    const [editing, setEditing] = useState(null); // null = new, id = edit

    const { data, setData, post, put, processing, errors, reset } =
        useForm(emptyForm);

    const openNew = () => {
        reset();
        setData(emptyForm);
        setEditing("new");
    };
    const openEdit = (cat) => {
        setData({
            name: cat.name,
            description: cat.description ?? "",
            icon: cat.icon ?? "📁",
            color: cat.color ?? "blue",
            sort_order: cat.sort_order ?? 0,
            is_active: cat.is_active,
        });
        setEditing(cat.id);
    };
    const close = () => {
        setEditing(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editing === "new") {
            post(route("faq.categories.store"), { onSuccess: close });
        } else {
            put(route("faq.categories.update", editing), { onSuccess: close });
        }
    };

    const { confirm: dlgConfirm } = useDialog();
    const del = async (id, name) => {
        if (
            await dlgConfirm(
                `Articles in this category will become uncategorized.`,
                {
                    title: `Delete "${name}"?`,
                    confirmLabel: "Delete",
                    intent: "danger",
                },
            )
        ) {
            router.delete(route("faq.categories.destroy", id));
        }
    };

    return (
        <AppLayout title="FAQ Categories">
            <Head title="FAQ Categories" />
            <PageHeader
                title="FAQ Categories"
                subtitle="Organize your knowledge base articles by topic"
                actions={
                    <div className="flex gap-2">
                        <Link
                            href={route("faq.index")}
                            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg text-sm"
                        >
                            <BookOpen size={15} /> View KB
                        </Link>
                        <button
                            onClick={openNew}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            <Plus size={15} /> New Category
                        </button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Category cards */}
                <div className="lg:col-span-2">
                    {categories?.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                            <BookOpen
                                size={40}
                                className="mx-auto text-slate-200 mb-3"
                            />
                            <p className="text-slate-500 font-medium">
                                No categories yet
                            </p>
                            <button
                                onClick={openNew}
                                className="mt-3 text-blue-600 text-sm font-medium hover:underline"
                            >
                                Create your first category
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {categories.map((cat) => {
                                const bgColor =
                                    COLOR_BG[cat.color] ?? "bg-slate-400";
                                return (
                                    <div
                                        key={cat.id}
                                        className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${editing === cat.id ? "border-blue-400 shadow-md" : "border-slate-200 hover:border-slate-300"}`}
                                    >
                                        <div className={`${bgColor} h-2`} />
                                        <div className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">
                                                        {cat.icon}
                                                    </span>
                                                    <div>
                                                        <p className="font-semibold text-slate-800">
                                                            {cat.name}
                                                        </p>
                                                        {cat.description && (
                                                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                                                {
                                                                    cat.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() =>
                                                            openEdit(cat)
                                                        }
                                                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                                    >
                                                        <Edit size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            del(
                                                                cat.id,
                                                                cat.name,
                                                            )
                                                        }
                                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-3">
                                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                                    {cat.faq_count} articles
                                                </span>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full ${cat.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                                                >
                                                    {cat.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Form panel */}
                {editing !== null && (
                    <div className="bg-white rounded-xl border-2 border-blue-300 shadow-lg p-5 h-fit">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800">
                                {editing === "new"
                                    ? "New Category"
                                    : "Edit Category"}
                            </h3>
                            <button
                                onClick={close}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-600 mb-1 block">
                                    Name *
                                </label>
                                <input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600 mb-1 block">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={2}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600 mb-2 block">
                                    Icon
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {ICONS.map((icon) => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() =>
                                                setData("icon", icon)
                                            }
                                            className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all border-2 ${data.icon === icon ? "border-blue-500 bg-blue-50 scale-110" : "border-transparent hover:border-slate-200"}`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600 mb-2 block">
                                    Color
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {COLORS.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setData("color", c)}
                                            className={`w-6 h-6 rounded-full transition-all ${COLOR_BG[c] ?? "bg-slate-400"} ${data.color === c ? "ring-2 ring-offset-1 ring-slate-600 scale-110" : ""}`}
                                            title={c}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-slate-600 mb-1 block">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.sort_order}
                                        onChange={(e) =>
                                            setData(
                                                "sort_order",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-slate-600 mb-1 block">
                                        Status
                                    </label>
                                    <select
                                        value={data.is_active ? "1" : "0"}
                                        onChange={(e) =>
                                            setData(
                                                "is_active",
                                                e.target.value === "1",
                                            )
                                        }
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Preview */}
                            <div
                                className={`rounded-xl border-2 overflow-hidden`}
                            >
                                <div
                                    className={`${COLOR_BG[data.color] ?? "bg-slate-400"} h-1.5`}
                                />
                                <div className="p-3 flex items-center gap-2">
                                    <span className="text-xl">{data.icon}</span>
                                    <span className="font-semibold text-slate-700 text-sm">
                                        {data.name || "Category Name"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={close}
                                    className="flex-1 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
                                >
                                    <Save size={14} />{" "}
                                    {editing === "new" ? "Create" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

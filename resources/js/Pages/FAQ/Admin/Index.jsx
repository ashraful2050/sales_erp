import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import ExportButtons from "@/Components/ExportButtons";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Search,
    EyeOff,
    BookOpen,
    FolderOpen,
} from "lucide-react";
import { useState, useRef } from "react";
import { useDialog } from "@/hooks/useDialog";

const COLOR_MAP = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    amber: "bg-amber-100 text-amber-700",
    teal: "bg-teal-100 text-teal-700",
    indigo: "bg-indigo-100 text-indigo-700",
    slate: "bg-slate-100 text-slate-600",
};

export default function FaqAdminIndex({ faqs, categories, filters }) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [catFilter, setCat] = useState(filters?.category ?? "");
    const tableRef = useRef(null);

    const applyFilter = (s, c) => {
        router.get(
            route("faq.admin.index"),
            { search: s || undefined, category: c || undefined },
            { preserveState: true, replace: true },
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilter(search, catFilter);
    };

    const { confirm: dlgConfirm } = useDialog();

    const del = async (id, q) => {
        if (
            await dlgConfirm(
                `Delete this FAQ article? This cannot be undone.`,
                {
                    title: `Delete "${q}"?`,
                    confirmLabel: "Delete",
                    intent: "danger",
                },
            )
        )
            router.delete(route("faq.admin.destroy", id));
    };

    return (
        <AppLayout title="Manage FAQs">
            <Head title="Manage FAQs" />
            <PageHeader
                title="Manage FAQ Articles"
                subtitle={`${faqs?.total ?? 0} total articles`}
                actions={
                    <div className="flex items-center gap-2">
                        <Link
                            href={route("faq.categories.index")}
                            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
                        >
                            <FolderOpen size={15} /> Categories
                        </Link>
                        <Link
                            href={route("faq.index")}
                            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
                        >
                            <Eye size={15} /> View KB
                        </Link>
                        <Link
                            href={route("faq.admin.create")}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            <Plus size={15} /> New Article
                        </Link>
                    </div>
                }
            />

            {/* Filters */}
            <form
                onSubmit={handleSearch}
                className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-end"
            >
                <div className="flex-1 min-w-48 relative">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search questions…"
                        className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={catFilter}
                    onChange={(e) => {
                        setCat(e.target.value);
                        applyFilter(search, e.target.value);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Categories</option>
                    {(categories ?? []).map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.icon} {c.name}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                    Search
                </button>
                <ExportButtons
                    tableId="faq-table"
                    filename="faq-articles"
                    title="FAQ Articles"
                />
            </form>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm" id="faq-table">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                #
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                Question
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                Category
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                                Status
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                                Views
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                                Helpful
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {(faqs?.data ?? []).length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-5 py-12 text-center text-slate-400"
                                >
                                    <BookOpen
                                        size={32}
                                        className="mx-auto mb-2 opacity-40"
                                    />
                                    No FAQ articles yet.{" "}
                                    <Link
                                        href={route("faq.admin.create")}
                                        className="text-blue-600 font-medium hover:underline"
                                    >
                                        Create the first one.
                                    </Link>
                                </td>
                            </tr>
                        ) : (
                            (faqs?.data ?? []).map((faq, i) => {
                                const catColor =
                                    COLOR_MAP[faq.category?.color] ??
                                    COLOR_MAP.slate;
                                const total =
                                    (faq.helpful_yes ?? 0) +
                                    (faq.helpful_no ?? 0);
                                const pct =
                                    total > 0
                                        ? Math.round(
                                              (faq.helpful_yes / total) * 100,
                                          )
                                        : null;
                                return (
                                    <tr
                                        key={faq.id}
                                        className={`hover:bg-slate-50 ${faq.deleted_at ? "opacity-50" : ""}`}
                                    >
                                        <td className="px-5 py-3 text-slate-400 text-xs">
                                            {(faqs.from ?? 0) + i}
                                        </td>
                                        <td className="px-5 py-3">
                                            <Link
                                                href={route("faq.show", faq.id)}
                                                className="font-medium text-slate-800 hover:text-blue-600 line-clamp-2 leading-snug"
                                            >
                                                {faq.question}
                                            </Link>
                                            {(faq.tags ?? []).length > 0 && (
                                                <div className="flex gap-1 mt-1 flex-wrap">
                                                    {faq.tags
                                                        .slice(0, 3)
                                                        .map((t) => (
                                                            <span
                                                                key={t}
                                                                className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded"
                                                            >
                                                                {t}
                                                            </span>
                                                        ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {faq.category ? (
                                                <span
                                                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${catColor}`}
                                                >
                                                    {faq.category.icon}{" "}
                                                    {faq.category.name}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {faq.is_published ? (
                                                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                    <Eye size={10} /> Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                                                    <EyeOff size={10} /> Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-slate-600">
                                            {faq.views}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm">
                                            {pct !== null ? (
                                                <span
                                                    className={`font-semibold ${pct >= 70 ? "text-green-600" : pct >= 40 ? "text-amber-600" : "text-red-500"}`}
                                                >
                                                    {pct}%
                                                </span>
                                            ) : (
                                                <span className="text-slate-300">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Link
                                                    href={route(
                                                        "faq.show",
                                                        faq.id,
                                                    )}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Eye size={14} />
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "faq.admin.edit",
                                                        faq.id,
                                                    )}
                                                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                                                >
                                                    <Edit size={14} />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        del(
                                                            faq.id,
                                                            faq.question,
                                                        )
                                                    }
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            {faqs?.links && (
                <div className="mt-4">
                    <Pagination links={faqs.links} />
                </div>
            )}
        </AppLayout>
    );
}

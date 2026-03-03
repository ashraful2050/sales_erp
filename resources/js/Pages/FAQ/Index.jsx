import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Search, BookOpen, ChevronRight, Eye, Plus, Settings2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const COLOR_MAP = {
    blue:   "bg-blue-50 text-blue-700 border-blue-200",
    green:  "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    red:    "bg-red-50 text-red-700 border-red-200",
    amber:  "bg-amber-50 text-amber-700 border-amber-200",
    teal:   "bg-teal-50 text-teal-700 border-teal-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    pink:   "bg-pink-50 text-pink-700 border-pink-200",
    slate:  "bg-slate-50 text-slate-700 border-slate-200",
};

export default function FaqIndex({ categories, faqs, filters }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters?.search ?? "");
    const [activeCategory, setActiveCategory] = useState(filters?.category ?? null);

    const doSearch = (s, cat) => {
        router.get(route("faq.index"), { search: s || undefined, category: cat || undefined }, { preserveState: true, replace: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        doSearch(search, activeCategory);
    };

    const selectCategory = (id) => {
        const next = activeCategory == id ? null : id;
        setActiveCategory(next);
        doSearch(search, next);
    };

    return (
        <AppLayout title={t("Knowledge Base")}>
            <Head title={t("Knowledge Base")} />

            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 mb-6 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={20} className="text-blue-200" />
                        <span className="text-blue-200 text-sm font-medium">AccounTech BD — Knowledge Base</span>
                    </div>
                    <h1 className="text-3xl font-black mb-2">How can we help you?</h1>
                    <p className="text-blue-200 mb-5">{t("Search our knowledge base or browse by category")}</p>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={t("Search articles, questions…")}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                        </div>
                        <button type="submit" className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/20">
                            {t("Search")}
                        </button>
                    </form>
                </div>
            </div>

            {/* Category cards */}
            {categories?.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Browse by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {categories.map(cat => {
                            const colorCls = COLOR_MAP[cat.color] ?? COLOR_MAP.slate;
                            const isActive = activeCategory == cat.id;
                            return (
                                <button key={cat.id} onClick={() => selectCategory(cat.id)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                                        isActive
                                            ? "border-blue-500 bg-blue-50 shadow-md"
                                            : `border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm`
                                    }`}>
                                    <span className="text-2xl">{cat.icon}</span>
                                    <span className="text-xs font-semibold text-slate-700 leading-tight">{cat.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${colorCls}`}>
                                        {cat.faq_count} article{cat.faq_count !== 1 ? "s" : ""}
                                    </span>
                                </button>
                            );
                        })}
                        {activeCategory && (
                            <button onClick={() => selectCategory(null)}
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-300 text-slate-400 text-xs">
                                <span className="text-xl">✕</span>
                                {t("Clear filter")}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Results */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {filters?.search
                        ? `Search results for "${filters.search}" (${faqs?.length ?? 0})`
                        : filters?.category
                        ? `${faqs?.length ?? 0} articles in category`
                        : `All Articles (${faqs?.length ?? 0})`}
                </h2>
                <div className="flex items-center gap-2">
                    <Link href={route("faq.admin.index")} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 font-medium">
                        <Settings2 size={13} /> {t("Manage")}
                    </Link>
                    <Link href={route("faq.admin.create")} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                        <Plus size={13} /> {t("New Article")}
                    </Link>
                </div>
            </div>

            {faqs?.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                    <BookOpen size={40} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-500 font-medium">{t("No articles found")}</p>
                    <p className="text-slate-400 text-sm mt-1">Try a different search term or browse another category</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {(faqs ?? []).map(faq => {
                        const catColor = COLOR_MAP[faq.category?.color] ?? COLOR_MAP.slate;
                        return (
                            <Link key={faq.id} href={route("faq.show", faq.id)}
                                className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all group">
                                <div className="flex items-start gap-3 min-w-0">
                                    <span className="text-xl shrink-0 mt-0.5">{faq.category?.icon ?? "📄"}</span>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">{faq.question}</p>
                                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                            {faq.category && (
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${catColor}`}>{faq.category.name}</span>
                                            )}
                                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                                <Eye size={11} /> {faq.views} views
                                            </span>
                                            {(faq.tags ?? []).slice(0,3).map(tag => (
                                                <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 shrink-0 ml-4 transition-colors" />
                            </Link>
                        );
                    })}
                </div>
            )}
        </AppLayout>
    );
}

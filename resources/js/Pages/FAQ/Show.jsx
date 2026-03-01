import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, Eye, ThumbsUp, ThumbsDown, Tag, ChevronRight, Edit } from "lucide-react";

const COLOR_MAP = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function FaqShow({ faq, related }) {
    const catColor = COLOR_MAP[faq.category?.color] ?? COLOR_MAP.slate;

    const sendFeedback = (helpful) => {
        router.post(route("faq.helpful", faq.id), { helpful }, { preserveScroll: true });
    };

    const total = (faq.helpful_yes ?? 0) + (faq.helpful_no ?? 0);
    const pct = total > 0 ? Math.round((faq.helpful_yes / total) * 100) : null;

    return (
        <AppLayout title={faq.question}>
            <Head title={faq.question} />

            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                    <Link href={route("faq.index")} className="hover:text-blue-600 flex items-center gap-1">
                        <ArrowLeft size={14} /> Knowledge Base
                    </Link>
                    {faq.category && (
                        <>
                            <ChevronRight size={14} />
                            <Link href={route("faq.index", { category: faq.faq_category_id })}
                                className="hover:text-blue-600">{faq.category.name}</Link>
                        </>
                    )}
                    <ChevronRight size={14} />
                    <span className="text-slate-600 truncate max-w-xs">{faq.question}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Article */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            {/* Article header */}
                            <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        {faq.category && (
                                            <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${catColor}`}>
                                                <span>{faq.category.icon}</span> {faq.category.name}
                                            </span>
                                        )}
                                    </div>
                                    <Link href={route("faq.admin.edit", faq.id)}
                                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 font-medium">
                                        <Edit size={12} /> Edit
                                    </Link>
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 leading-snug">{faq.question}</h1>
                                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                                    <span className="flex items-center gap-1"><Eye size={12} /> {faq.views} views</span>
                                    {pct !== null && (
                                        <span className="flex items-center gap-1">
                                            <ThumbsUp size={12} /> {pct}% found this helpful
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Answer */}
                            <div className="px-8 py-7 prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                                {faq.answer}
                            </div>

                            {/* Tags */}
                            {(faq.tags ?? []).length > 0 && (
                                <div className="px-8 pb-6 flex items-center gap-2 flex-wrap">
                                    <Tag size={13} className="text-slate-400" />
                                    {faq.tags.map(tag => (
                                        <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Helpful? */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
                            <p className="font-semibold text-slate-700 mb-1">Was this article helpful?</p>
                            <p className="text-xs text-slate-400 mb-4">
                                {total > 0 ? `${faq.helpful_yes} of ${total} people found this helpful` : "Be the first to rate this article"}
                            </p>
                            <div className="flex justify-center gap-3">
                                <button onClick={() => sendFeedback(1)}
                                    className="flex items-center gap-2 px-5 py-2 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-100 transition-colors">
                                    <ThumbsUp size={15} /> Yes, helpful! <span className="bg-green-100 text-green-600 rounded-full px-2 py-0.5 text-xs">{faq.helpful_yes}</span>
                                </button>
                                <button onClick={() => sendFeedback(0)}
                                    className="flex items-center gap-2 px-5 py-2 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
                                    <ThumbsDown size={15} /> Not helpful <span className="bg-red-100 text-red-500 rounded-full px-2 py-0.5 text-xs">{faq.helpful_no}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {related?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-100">
                                    <h3 className="text-sm font-semibold text-slate-700">Related Articles</h3>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {related.map(r => (
                                        <Link key={r.id} href={route("faq.show", r.id)}
                                            className="flex items-start gap-2 px-5 py-3 hover:bg-slate-50 group transition-colors">
                                            <span className="text-slate-300 text-xs mt-1">📄</span>
                                            <p className="text-sm text-slate-700 group-hover:text-blue-600 leading-snug">{r.question}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                            <p className="text-sm font-semibold text-blue-800 mb-1">Can't find an answer?</p>
                            <p className="text-xs text-blue-600 mb-3">Browse all articles or contact your administrator</p>
                            <Link href={route("faq.index")}
                                className="block text-center bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-700">
                                Browse All Articles
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

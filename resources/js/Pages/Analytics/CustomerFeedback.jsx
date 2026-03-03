import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import { Plus, Star, ThumbsUp, Minus, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const sentimentColors = {
    positive: "green",
    neutral: "slate",
    negative: "red",
};
const sentimentIcons = {
    positive: ThumbsUp,
    neutral: Minus,
    negative: ThumbsDown,
};

export default function CustomerFeedback({ feedbacks, summary, filters }) {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        customer_id: "",
        customer_name: "",
        rating: 5,
        feedback_text: "",
        category: "product",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("analytics.feedback.store"), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    return (
        <AppLayout title={t("Customer Feedback")}>
            <Head title={t("Customer Feedback")} />
            <PageHeader
                title={t("Customer Feedback")}
                subtitle={t("Feedback analysis and sentiment tracking")}
                actions={
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        <Plus size={15} /> {t("Add Feedback")}
                    </button>
                }
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    {
                        label: "Total Feedback",
                        value: summary?.total || 0,
                        color: "blue",
                    },
                    {
                        label: "Positive",
                        value: summary?.positive || 0,
                        color: "green",
                    },
                    {
                        label: "Neutral",
                        value: summary?.neutral || 0,
                        color: "slate",
                    },
                    {
                        label: "Negative",
                        value: summary?.negative || 0,
                        color: "red",
                    },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="bg-white rounded-xl border border-slate-200 p-4 text-center"
                    >
                        <p className={`text-2xl font-bold text-${s.color}-600`}>
                            {s.value}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {summary && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((r) => (
                            <Star
                                key={r}
                                size={16}
                                className={
                                    r <= Math.round(summary.avg_rating || 0)
                                        ? "text-yellow-400"
                                        : "text-slate-200"
                                }
                                fill={
                                    r <= Math.round(summary.avg_rating || 0)
                                        ? "currentColor"
                                        : "none"
                                }
                            />
                        ))}
                        <span className="ml-1 text-sm font-medium text-slate-700">
                            {Number(summary.avg_rating || 0).toFixed(1)}
                        </span>
                    </div>
                    <span className="text-sm text-slate-400">
                        Average rating across {summary.total} responses
                    </span>
                </div>
            )}

            {/* Create Form */}
            {showForm && (
                <form
                    onSubmit={submit}
                    className="bg-white rounded-xl border border-slate-200 p-5 mb-6 max-w-xl"
                >
                    <h3 className="font-semibold text-slate-700 mb-3">
                        Add Feedback
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-slate-600">
                                {t("Customer Name")}
                            </label>
                            <input
                                value={data.customer_name}
                                onChange={(e) =>
                                    setData("customer_name", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-slate-600">
                                    {t("Rating")}
                                </label>
                                <div className="flex gap-1 mt-1">
                                    {[1, 2, 3, 4, 5].map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setData("rating", r)}
                                        >
                                            <Star
                                                size={20}
                                                className={
                                                    r <= data.rating
                                                        ? "text-yellow-400"
                                                        : "text-slate-200"
                                                }
                                                fill={
                                                    r <= data.rating
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-600">
                                    {t("Category")}
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) =>
                                        setData("category", e.target.value)
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                                >
                                    {[
                                        "product",
                                        "service",
                                        "delivery",
                                        "support",
                                        "pricing",
                                        "overall",
                                    ].map((c) => (
                                        <option key={c} value={c}>
                                            {c.charAt(0).toUpperCase() +
                                                c.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-600">
                                {t("Feedback")}
                            </label>
                            <textarea
                                rows={3}
                                value={data.feedback_text}
                                onChange={(e) =>
                                    setData("feedback_text", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            {t("Submit")}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="text-slate-500 text-sm"
                        >
                            {t("Cancel")}
                        </button>
                    </div>
                </form>
            )}

            {/* Filters */}
            <div className="flex gap-2 mb-4">
                {["all", "positive", "neutral", "negative"].map((s) => (
                    <button
                        key={s}
                        onClick={() =>
                            router.get(
                                route("analytics.feedback"),
                                { ...filters, sentiment: s === "all" ? "" : s },
                                { preserveState: true },
                            )
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium border
                            ${(filters?.sentiment || "") === (s === "all" ? "" : s) ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                    >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {/* Feedback list */}
            <div className="space-y-3">
                {feedbacks.data?.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">
                        {t("No feedback yet.")}
                    </div>
                ) : (
                    feedbacks.data?.map((fb) => {
                        const SentIcon = sentimentIcons[fb.sentiment] || Minus;
                        return (
                            <div
                                key={fb.id}
                                className="bg-white rounded-xl border border-slate-200 p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-full bg-${sentimentColors[fb.sentiment] || "slate"}-50 flex items-center justify-center`}
                                        >
                                            <SentIcon
                                                size={14}
                                                className={`text-${sentimentColors[fb.sentiment] || "slate"}-500`}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">
                                                {fb.customer_name ||
                                                    "Anonymous"}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (r) => (
                                                            <Star
                                                                key={r}
                                                                size={11}
                                                                className={
                                                                    r <=
                                                                    fb.rating
                                                                        ? "text-yellow-400"
                                                                        : "text-slate-200"
                                                                }
                                                                fill={
                                                                    r <=
                                                                    fb.rating
                                                                        ? "currentColor"
                                                                        : "none"
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                                <Badge
                                                    color={
                                                        sentimentColors[
                                                            fb.sentiment
                                                        ] || "slate"
                                                    }
                                                    label={
                                                        fb.sentiment ||
                                                        "neutral"
                                                    }
                                                />
                                                {fb.category && (
                                                    <Badge
                                                        color="slate"
                                                        label={fb.category}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        {new Date(
                                            fb.created_at,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                {fb.comment && (
                                    <p className="text-sm text-slate-600 mt-2 ml-11">
                                        {fb.comment}
                                    </p>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
            <div className="mt-4">
                <Pagination links={feedbacks.links} />
            </div>
        </AppLayout>
    );
}

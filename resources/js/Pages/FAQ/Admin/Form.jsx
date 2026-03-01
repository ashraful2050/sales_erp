import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft, Plus, X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function FaqForm({ editFaq, categories }) {
    const isEdit = !!editFaq;
    const [tagInput, setTagInput] = useState("");

    const { data, setData, post, put, processing, errors } = useForm({
        faq_category_id: editFaq?.faq_category_id ?? "",
        question: editFaq?.question ?? "",
        answer: editFaq?.answer ?? "",
        tags: editFaq?.tags ?? [],
        is_published: editFaq?.is_published ?? true,
        sort_order: editFaq?.sort_order ?? 0,
    });

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !data.tags.includes(t)) {
            setData("tags", [...data.tags, t]);
        }
        setTagInput("");
    };
    const removeTag = (t) =>
        setData(
            "tags",
            data.tags.filter((x) => x !== t),
        );

    const submit = (e) => {
        e.preventDefault();
        isEdit
            ? put(route("faq.admin.update", editFaq.id))
            : post(route("faq.admin.store"));
    };

    return (
        <AppLayout title={isEdit ? "Edit FAQ" : "New FAQ Article"}>
            <Head title={isEdit ? "Edit FAQ" : "New FAQ Article"} />
            <PageHeader
                title={isEdit ? "Edit FAQ Article" : "Create FAQ Article"}
                subtitle="Add helpful articles to your knowledge base"
                actions={
                    <Link
                        href={route("faq.admin.index")}
                        className="flex items-center gap-2 text-slate-600 text-sm font-medium hover:text-slate-900"
                    >
                        <ArrowLeft size={16} /> Back
                    </Link>
                }
            />

            <form onSubmit={submit} className="max-w-3xl space-y-5">
                {/* Category + Sort + Status row */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Category
                        </label>
                        <select
                            value={data.faq_category_id}
                            onChange={(e) =>
                                setData("faq_category_id", e.target.value)
                            }
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">— No Category —</option>
                            {(categories ?? []).map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.icon} {c.name}
                                </option>
                            ))}
                        </select>
                        {errors.faq_category_id && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.faq_category_id}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Sort Order
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={data.sort_order}
                            onChange={(e) =>
                                setData("sort_order", e.target.value)
                            }
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Question */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Question <span className="text-red-400">*</span>
                    </label>
                    <input
                        value={data.question}
                        onChange={(e) => setData("question", e.target.value)}
                        placeholder="e.g. How do I record a payment?"
                        required
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.question && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.question}
                        </p>
                    )}
                </div>

                {/* Answer */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-semibold text-slate-700">
                            Answer <span className="text-red-400">*</span>
                        </label>
                        <span className="text-xs text-slate-400">
                            {data.answer.length} chars
                        </span>
                    </div>
                    <textarea
                        value={data.answer}
                        onChange={(e) => setData("answer", e.target.value)}
                        rows={12}
                        required
                        placeholder="Write a clear, detailed answer. You can use plain text with line breaks for formatting."
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono leading-relaxed"
                    />
                    {errors.answer && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.answer}
                        </p>
                    )}
                </div>

                {/* Tags */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Tags{" "}
                        <span className="text-slate-400 font-normal">
                            (optional)
                        </span>
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {data.tags.map((tag) => (
                            <span
                                key={tag}
                                className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-1 rounded-full"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="hover:text-red-500 ml-0.5"
                                >
                                    <X size={11} />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                            placeholder="Add a tag (press Enter)"
                            maxLength={50}
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium"
                        >
                            <Plus size={14} /> Add
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                        e.g. invoice, payment, setup, VAT
                    </p>
                </div>

                {/* Publish toggle */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-700">
                            Publication Status
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {data.is_published
                                ? "Visible to all users in the Knowledge Base"
                                : "Draft — only visible to admins"}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            setData("is_published", !data.is_published)
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                            data.is_published
                                ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                        }`}
                    >
                        {data.is_published ? (
                            <>
                                <Eye size={15} /> Published
                            </>
                        ) : (
                            <>
                                <EyeOff size={15} /> Draft
                            </>
                        )}
                    </button>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pb-8">
                    <Link
                        href={route("faq.admin.index")}
                        className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium"
                    >
                        <Save size={16} />{" "}
                        {isEdit ? "Update Article" : "Publish Article"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

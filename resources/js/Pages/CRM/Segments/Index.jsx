import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";

export default function SegmentsIndex({ segments }) {
    const { confirm } = useDialog();
    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        description: "",
        type: "manual",
        criteria: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("crm.segments.store"), { onSuccess: () => reset() });
    };
    const del = async (id) => {
        if (
            await confirm("This segment will be deleted.", {
                title: "Delete Segment?",
                confirmLabel: "Delete",
                intent: "danger",
            })
        )
            router.delete(route("crm.segments.destroy", id));
    };

    return (
        <AppLayout title="Customer Segments">
            <Head title="Customer Segments" />
            <PageHeader
                title="Customer Segments"
                subtitle="Group customers for targeted marketing"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create Form */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="font-semibold text-slate-700 mb-4">
                        New Segment
                    </h3>
                    <form onSubmit={submit} className="space-y-3">
                        <div>
                            <input
                                placeholder="Segment name *"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <textarea
                            placeholder="Description…"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows={2}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        />
                        <select
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="manual">Manual</option>
                            <option value="auto">Auto (rule-based)</option>
                        </select>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                        >
                            <Plus size={15} /> Create Segment
                        </button>
                    </form>
                </div>

                {/* Segments List */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {segments.length === 0 ? (
                            <div className="col-span-2 text-center py-8 text-slate-400">
                                No segments yet.
                            </div>
                        ) : (
                            segments.map((seg) => (
                                <div
                                    key={seg.id}
                                    className="bg-white rounded-xl border border-slate-200 p-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users
                                                size={16}
                                                className="text-blue-500"
                                            />
                                            <h4 className="font-medium text-slate-800">
                                                {seg.name}
                                            </h4>
                                        </div>
                                        <button
                                            onClick={() => del(seg.id)}
                                            className="text-slate-300 hover:text-red-500"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {seg.description || "No description"}
                                    </p>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-xs text-slate-400 capitalize bg-slate-100 px-2 py-0.5 rounded">
                                            {seg.type}
                                        </span>
                                        <span className="text-sm font-semibold text-blue-600">
                                            {seg.members_count} customers
                                        </span>
                                    </div>
                                    <a
                                        href={route(
                                            "crm.segments.show",
                                            seg.id,
                                        )}
                                        className="mt-3 w-full text-center text-xs text-blue-600 hover:underline block"
                                    >
                                        View Members →
                                    </a>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

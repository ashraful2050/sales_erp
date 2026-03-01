import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import {
    Plus,
    CheckCircle2,
    Clock,
    AlertCircle,
    User,
    Calendar,
    MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";

const statusColors = {
    pending: "yellow",
    in_progress: "blue",
    completed: "green",
    cancelled: "slate",
    on_hold: "orange",
};
const priorityColors = {
    low: "slate",
    medium: "yellow",
    high: "orange",
    urgent: "red",
    critical: "red",
};

export default function TasksIndex({ tasks, users, summary, filters }) {
    const { confirm } = useDialog();
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        title: "",
        description: "",
        type: "general",
        assigned_to: "",
        priority: "medium",
        due_date: "",
        estimated_hours: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("tasks.store"), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };
    const del = async (id) => {
        if (
            await confirm("Delete this task?", {
                title: "Delete Task?",
                confirmLabel: "Delete",
                intent: "danger",
            })
        )
            router.delete(route("tasks.destroy", id));
    };
    const complete = (id) => router.post(route("tasks.complete", id));

    return (
        <AppLayout title="Tasks">
            <Head title="Tasks" />
            <PageHeader
                title="Task Management"
                subtitle="Team task and workflow management"
                actions={
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        <Plus size={15} /> New Task
                    </button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {[
                    {
                        label: "Total",
                        value: summary?.total || 0,
                        icon: Clock,
                        color: "blue",
                    },
                    {
                        label: "Pending",
                        value: summary?.pending || 0,
                        icon: AlertCircle,
                        color: "yellow",
                    },
                    {
                        label: "In Progress",
                        value: summary?.in_progress || 0,
                        icon: Clock,
                        color: "indigo",
                    },
                    {
                        label: "Completed",
                        value: summary?.completed || 0,
                        icon: CheckCircle2,
                        color: "green",
                    },
                    {
                        label: "Overdue",
                        value: summary?.overdue || 0,
                        icon: AlertCircle,
                        color: "red",
                    },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3"
                    >
                        <div
                            className={`w-10 h-10 rounded-lg bg-${s.color}-50 flex items-center justify-center`}
                        >
                            <s.icon
                                size={18}
                                className={`text-${s.color}-600`}
                            />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-800">
                                {s.value}
                            </p>
                            <p className="text-xs text-slate-400">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Form */}
            {showForm && (
                <form
                    onSubmit={submit}
                    className="bg-white rounded-xl border border-slate-200 p-5 mb-6 max-w-2xl"
                >
                    <h3 className="font-semibold text-slate-700 mb-3">
                        Create Task
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-slate-600">
                                Title *
                            </label>
                            <input
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-xs mt-0.5">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="text-xs text-slate-600">
                                Description
                            </label>
                            <textarea
                                rows={2}
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            <div>
                                <label className="text-xs text-slate-600">
                                    Type
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                                >
                                    {[
                                        "general",
                                        "follow_up",
                                        "call",
                                        "meeting",
                                        "demo",
                                    ].map((t) => (
                                        <option key={t} value={t}>
                                            {t
                                                .replace("_", " ")
                                                .charAt(0)
                                                .toUpperCase() +
                                                t.replace("_", " ").slice(1)}
                                        </option>
                                    ))}
                                </select>
                                {errors.type && (
                                    <p className="text-red-500 text-xs mt-0.5">
                                        {errors.type}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs text-slate-600">
                                    Assigned To
                                </label>
                                <select
                                    value={data.assigned_to}
                                    onChange={(e) =>
                                        setData("assigned_to", e.target.value)
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                                >
                                    <option value="">-- Unassigned --</option>
                                    {users?.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-600">
                                    Priority
                                </label>
                                <select
                                    value={data.priority}
                                    onChange={(e) =>
                                        setData("priority", e.target.value)
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                                >
                                    {[
                                        "low",
                                        "medium",
                                        "high",
                                        "urgent",
                                        "critical",
                                    ].map((p) => (
                                        <option key={p} value={p}>
                                            {p.charAt(0).toUpperCase() +
                                                p.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-600">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) =>
                                        setData("due_date", e.target.value)
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Create Task
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="text-slate-500 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-3 flex flex-wrap gap-3">
                {["all", "pending", "in_progress", "completed", "on_hold"].map(
                    (s) => (
                        <button
                            key={s}
                            onClick={() =>
                                router.get(
                                    route("tasks.index"),
                                    {
                                        ...filters,
                                        status: s === "all" ? "" : s,
                                    },
                                    { preserveState: true },
                                )
                            }
                            className={`px-3 py-1 rounded-full text-xs font-medium border
                            ${(filters?.status || "") === (s === "all" ? "" : s) ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                        >
                            {s === "all"
                                ? "All"
                                : s.replace("_", " ").charAt(0).toUpperCase() +
                                  s.replace("_", " ").slice(1)}
                        </button>
                    ),
                )}
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-xl border border-slate-200">
                {tasks.data?.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        No tasks found.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                                    Task
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                                    Assigned
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                                    Priority
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                                    Status
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                                    Due
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                                    Comments
                                </th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {tasks.data.map((t) => (
                                <tr
                                    key={t.id}
                                    className="hover:bg-slate-50 group"
                                >
                                    <td className="px-4 py-3">
                                        <div>
                                            <p
                                                className={`font-medium ${t.status === "completed" ? "line-through text-slate-400" : "text-slate-800"}`}
                                            >
                                                {t.title}
                                            </p>
                                            {t.description && (
                                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                                    {t.description}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {t.assigned_to ? (
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <User
                                                        size={10}
                                                        className="text-blue-600"
                                                    />
                                                </div>
                                                <span className="text-slate-600 text-xs">
                                                    {t.assigned_to.name ||
                                                        t.assigned_to}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 text-xs">
                                                Unassigned
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            color={
                                                priorityColors[t.priority] ||
                                                "slate"
                                            }
                                            label={t.priority}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            color={
                                                statusColors[t.status] ||
                                                "slate"
                                            }
                                            label={t.status.replace("_", " ")}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        {t.due_date ? (
                                            <span
                                                className={`text-xs flex items-center gap-1 ${new Date(t.due_date) < new Date() && t.status !== "completed" ? "text-red-500" : "text-slate-500"}`}
                                            >
                                                <Calendar size={11} />{" "}
                                                {new Date(
                                                    t.due_date,
                                                ).toLocaleDateString()}
                                            </span>
                                        ) : (
                                            <span className="text-slate-300 text-xs">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="flex items-center gap-1 text-xs text-slate-400">
                                            <MessageCircle size={11} />{" "}
                                            {t.comments_count || 0}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                                            {t.status !== "completed" && (
                                                <button
                                                    onClick={() =>
                                                        complete(t.id)
                                                    }
                                                    className="p-1.5 text-green-500 hover:bg-green-50 rounded"
                                                    title="Mark complete"
                                                >
                                                    <CheckCircle2 size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => del(t.id)}
                                                className="p-1.5 text-red-400 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div className="mt-4">
                <Pagination links={tasks.links} />
            </div>
        </AppLayout>
    );
}

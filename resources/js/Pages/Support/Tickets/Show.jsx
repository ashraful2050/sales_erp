import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Send, Star, Lock, Unlock } from "lucide-react";
import { useState } from "react";

const statusColors = {
    open: "blue",
    in_progress: "yellow",
    waiting_customer: "orange",
    resolved: "green",
    closed: "slate",
};
const priorityColors = {
    low: "slate",
    medium: "yellow",
    high: "orange",
    urgent: "red",
    critical: "red",
};

export default function TicketShow({ ticket, replies }) {
    const [rating, setRating] = useState(ticket.satisfaction_rating || 0);
    const { data, setData, post, processing, reset, errors } = useForm({
        message: "",
        is_internal: false,
        attachments: null,
    });
    const ratingForm = useForm({ rating: 0 });

    const submitReply = (e) => {
        e.preventDefault();
        post(route("support.tickets.reply", ticket.id), {
            onSuccess: () => reset(),
        });
    };
    const updateStatus = (status) =>
        router.patch(route("support.tickets.update", ticket.id), { status });
    const submitRating = (r) => {
        setRating(r);
        ratingForm.setData("rating", r);
        router.post(route("support.tickets.rate", ticket.id), { rating: r });
    };

    return (
        <AppLayout title={`Ticket ${ticket.ticket_number}`}>
            <Head title={`Ticket ${ticket.ticket_number}`} />
            <PageHeader
                title={ticket.subject}
                subtitle={`${ticket.ticket_number} · ${ticket.customer_name}`}
                actions={
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("support.tickets.index")}
                            className="text-slate-500 hover:text-slate-700 text-sm"
                        >
                            ← Tickets
                        </Link>
                        <select
                            value={ticket.status}
                            onChange={(e) => updateStatus(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700"
                        >
                            {[
                                "open",
                                "in_progress",
                                "waiting_customer",
                                "resolved",
                                "closed",
                            ].map((s) => (
                                <option key={s} value={s}>
                                    {s
                                        .replace("_", " ")
                                        .charAt(0)
                                        .toUpperCase() +
                                        s.replace("_", " ").slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                }
            />

            <div className="grid grid-cols-3 gap-6">
                {/* Thread */}
                <div className="col-span-2 space-y-4">
                    {/* Original message */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                                    {ticket.customer_name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">
                                        {ticket.customer_name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {ticket.customer_email}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400">
                                {new Date(ticket.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">
                            {ticket.description}
                        </p>
                    </div>

                    {/* Replies */}
                    {replies?.map((reply) => (
                        <div
                            key={reply.id}
                            className={`rounded-xl border p-4 ${reply.is_internal ? "border-amber-200 bg-amber-50" : "bg-white border-slate-200"}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs">
                                        {reply.user?.name?.charAt(0) || "?"}
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">
                                        {reply.user?.name || "Agent"}
                                    </p>
                                    {reply.is_internal && (
                                        <span className="bg-amber-200 text-amber-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Lock size={9} /> Internal
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-slate-400">
                                    {new Date(
                                        reply.created_at,
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                {reply.message}
                            </p>
                        </div>
                    ))}

                    {/* Reply form */}
                    {ticket.status !== "closed" && (
                        <form
                            onSubmit={submitReply}
                            className="bg-white rounded-xl border border-slate-200 p-4"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-sm font-medium text-slate-700">
                                    Reply
                                </span>
                                <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_internal}
                                        onChange={(e) =>
                                            setData(
                                                "is_internal",
                                                e.target.checked,
                                            )
                                        }
                                        className="rounded"
                                    />
                                    <Lock size={11} /> Internal note
                                </label>
                            </div>
                            <textarea
                                rows={4}
                                value={data.message}
                                onChange={(e) =>
                                    setData("message", e.target.value)
                                }
                                placeholder="Write your reply..."
                                className={`w-full border rounded-lg px-3 py-2 text-sm ${data.is_internal ? "border-amber-300 bg-amber-50" : "border-slate-300"}`}
                            />
                            {errors.message && (
                                <p className="text-red-500 text-xs mt-0.5">
                                    {errors.message}
                                </p>
                            )}
                            <div className="mt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                    <Send size={13} />{" "}
                                    {data.is_internal
                                        ? "Add Note"
                                        : "Send Reply"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Ticket Details
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Status</span>
                                <Badge
                                    color={
                                        statusColors[ticket.status] || "slate"
                                    }
                                    label={ticket.status.replace("_", " ")}
                                />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Priority</span>
                                <Badge
                                    color={
                                        priorityColors[ticket.priority] ||
                                        "slate"
                                    }
                                    label={ticket.priority}
                                />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Channel</span>
                                <span className="text-slate-700">
                                    {ticket.channel}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Category</span>
                                <span className="text-slate-700">
                                    {ticket.category?.replace("_", " ")}
                                </span>
                            </div>
                            {ticket.assignee && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Assigned
                                    </span>
                                    <span className="text-slate-700">
                                        {ticket.assignee.name}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-slate-500">Created</span>
                                <span className="text-slate-700">
                                    {new Date(
                                        ticket.created_at,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Satisfaction Rating */}
                    {ticket.status === "resolved" && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                Satisfaction Rating
                            </h3>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => submitRating(r)}
                                        className={`text-2xl transition-colors ${r <= rating ? "text-yellow-400" : "text-slate-200 hover:text-yellow-300"}`}
                                    >
                                        <Star
                                            size={24}
                                            fill={
                                                r <= rating
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    </button>
                                ))}
                            </div>
                            {ticket.feedback_note && (
                                <p className="text-xs text-slate-500 mt-2 italic">
                                    "{ticket.feedback_note}"
                                </p>
                            )}
                        </div>
                    )}

                    {/* SLA info */}
                    {ticket.first_response_at && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 text-sm space-y-2">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                SLA
                            </h3>
                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    First Response
                                </span>
                                <span className="text-slate-700">
                                    {new Date(
                                        ticket.first_response_at,
                                    ).toLocaleString()}
                                </span>
                            </div>
                            {ticket.resolved_at && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Resolved
                                    </span>
                                    <span className="text-slate-700">
                                        {new Date(
                                            ticket.resolved_at,
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

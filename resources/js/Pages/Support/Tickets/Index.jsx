import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import {
    Plus,
    Headphones,
    Clock,
    CheckCircle2,
    AlertCircle,
    Star,
} from "lucide-react";
import { Link } from "@inertiajs/react";

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

export default function TicketsIndex({ tickets, stats, filters }) {
    const changeStatus = (id, status) =>
        router.patch(route("support.tickets.update", id), { status });

    return (
        <AppLayout title="Support Tickets">
            <Head title="Support Tickets" />
            <PageHeader
                title="Customer Support"
                subtitle="Manage customer support tickets"
                actions={
                    <Link
                        href={route("support.tickets.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        <Plus size={15} /> New Ticket
                    </Link>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    {
                        label: "Open",
                        value: stats?.open || 0,
                        icon: AlertCircle,
                        color: "blue",
                    },
                    {
                        label: "In Progress",
                        value: stats?.in_progress || 0,
                        icon: Clock,
                        color: "yellow",
                    },
                    {
                        label: "Resolved",
                        value: stats?.resolved || 0,
                        icon: CheckCircle2,
                        color: "green",
                    },
                    {
                        label: "Avg Rating",
                        value: stats?.avg_rating
                            ? Number(stats.avg_rating).toFixed(1) + "★"
                            : "—",
                        icon: Star,
                        color: "amber",
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

            {/* Status filter tabs */}
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-3 flex flex-wrap gap-2">
                {[
                    "all",
                    "open",
                    "in_progress",
                    "waiting_customer",
                    "resolved",
                    "closed",
                ].map((s) => (
                    <button
                        key={s}
                        onClick={() =>
                            router.get(
                                route("support.tickets.index"),
                                { ...filters, status: s === "all" ? "" : s },
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
                ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200">
                {tickets.data?.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        <Headphones
                            size={32}
                            className="mx-auto mb-2 text-slate-300"
                        />
                        No support tickets found.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                                    Ticket
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                                    Customer
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                                    Channel
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                                    Priority
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                                    Status
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                                    Assigned
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                                    Created
                                </th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {tickets.data.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-slate-800 text-xs text-blue-600">
                                                {t.ticket_number}
                                            </p>
                                            <p className="text-sm font-medium text-slate-700 mt-0.5">
                                                {t.subject}
                                            </p>
                                            {t.category && (
                                                <p className="text-xs text-slate-400">
                                                    {t.category.replace(
                                                        "_",
                                                        " ",
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="text-sm text-slate-700">
                                                {t.customer_name}
                                            </p>
                                            {t.customer_email && (
                                                <p className="text-xs text-slate-400">
                                                    {t.customer_email}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            color="slate"
                                            label={t.channel}
                                        />
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
                                        {t.assignee ? (
                                            <span className="text-xs text-slate-600">
                                                {t.assignee.name}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-300">
                                                Unassigned
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-400">
                                        {new Date(
                                            t.created_at,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link
                                            href={route(
                                                "support.tickets.show",
                                                t.id,
                                            )}
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div className="mt-4">
                <Pagination links={tickets.links} />
            </div>
        </AppLayout>
    );
}

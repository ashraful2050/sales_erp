import { useState } from "react";
import { router } from "@inertiajs/react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import {
    Search,
    MailCheck,
    MailX,
    Clock,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { fmtDateTime } from "@/utils/date";

const mailableLabels = {
    "App\\Mail\\TenantApproved": "Tenant Approved",
    "App\\Mail\\ContactRequestReceived": "Contact Request Notification",
};

function shortMailableClass(cls) {
    if (!cls) return "—";
    return mailableLabels[cls] ?? cls.split("\\").pop();
}

function RecipientList({ to }) {
    if (!to || !to.length) return <span className="text-slate-500">—</span>;
    return (
        <div className="space-y-0.5">
            {to.map((r, i) => (
                <div key={i} className="text-slate-300 text-xs">
                    {r.name ? (
                        <span className="text-slate-400">{r.name} </span>
                    ) : null}
                    <span className="text-slate-300">&lt;{r.address}&gt;</span>
                </div>
            ))}
        </div>
    );
}

export default function EmailLogsIndex({ logs, counts, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [statusFilter, setStatus] = useState(filters.status || "");

    function applyFilters(overrides = {}) {
        router.get(
            route("superadmin.email-logs.index"),
            { search, status: statusFilter, ...overrides },
            { preserveState: true, replace: true },
        );
    }

    function handleSearch(e) {
        e.preventDefault();
        applyFilters();
    }

    function handleStatus(val) {
        setStatus(val);
        applyFilters({ status: val });
    }

    const tabs = [
        { value: "", label: "All", count: counts.total },
        { value: "sent", label: "Sent", count: counts.sent },
        { value: "failed", label: "Failed", count: counts.failed },
    ];

    return (
        <SuperAdminLayout title="Email Logs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Email Logs
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            History of all outgoing emails from the system
                        </p>
                    </div>
                    <button
                        onClick={() => router.reload()}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-2 rounded-xl text-sm transition-colors"
                    >
                        <RefreshCw size={14} />
                        Refresh
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        {
                            label: "Total Sent",
                            count: counts.sent,
                            color: "text-green-400",
                            bg: "bg-green-500/10  border-green-500/20",
                            Icon: MailCheck,
                        },
                        {
                            label: "Total Failed",
                            count: counts.failed,
                            color: "text-red-400",
                            bg: "bg-red-500/10    border-red-500/20",
                            Icon: MailX,
                        },
                        {
                            label: "All Emails",
                            count: counts.total,
                            color: "text-violet-400",
                            bg: "bg-violet-500/10 border-violet-500/20",
                            Icon: MailCheck,
                        },
                    ].map(({ label, count, color, bg, Icon }) => (
                        <div
                            key={label}
                            className={`${bg} border rounded-xl px-4 py-3 flex items-center gap-3`}
                        >
                            <Icon size={20} className={color} />
                            <div>
                                <p className={`text-xl font-bold ${color}`}>
                                    {count}
                                </p>
                                <p className="text-slate-500 text-xs">
                                    {label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleStatus(tab.value)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                                    statusFilter === tab.value
                                        ? "bg-violet-600 text-white"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {tab.label}
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        statusFilter === tab.value
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-800 text-slate-400"
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="flex gap-2 flex-1 max-w-sm ml-auto"
                    >
                        <div className="relative flex-1">
                            <Search
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search subject, email..."
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-violet-600 hover:bg-violet-500 text-white px-4 rounded-xl text-sm transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {logs.data.length === 0 ? (
                        <div className="text-center py-16">
                            <MailCheck
                                size={32}
                                className="text-slate-700 mx-auto mb-3"
                            />
                            <p className="text-slate-500">
                                No email logs found.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-800 text-left">
                                        <th className="px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wide">
                                            Type
                                        </th>
                                        <th className="px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wide">
                                            Subject
                                        </th>
                                        <th className="px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wide">
                                            Recipient(s)
                                        </th>
                                        <th className="px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wide">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wide">
                                            Sent At
                                        </th>
                                        <th className="px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wide hidden lg:table-cell">
                                            Error
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {logs.data.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-lg font-mono">
                                                    {shortMailableClass(
                                                        log.mailable_class,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-white text-sm max-w-xs truncate">
                                                    {log.subject || "—"}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <RecipientList to={log.to} />
                                            </td>
                                            <td className="px-4 py-3">
                                                {log.status === "sent" ? (
                                                    <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full text-xs font-medium">
                                                        <CheckCircle2
                                                            size={10}
                                                        />
                                                        Sent
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full text-xs font-medium">
                                                        <AlertCircle
                                                            size={10}
                                                        />
                                                        Failed
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                    <Clock size={11} />
                                                    {fmtDateTime(log.sent_at)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                {log.error_message ? (
                                                    <p
                                                        className="text-red-400 text-xs max-w-xs truncate"
                                                        title={
                                                            log.error_message
                                                        }
                                                    >
                                                        {log.error_message}
                                                    </p>
                                                ) : (
                                                    <span className="text-slate-700 text-xs">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {logs.last_page > 1 && (
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-slate-500 text-sm">
                            Showing {logs.from}–{logs.to} of {logs.total}
                        </p>
                        <div className="flex gap-2">
                            {logs.prev_page_url && (
                                <button
                                    onClick={() =>
                                        router.get(logs.prev_page_url)
                                    }
                                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-sm transition-colors"
                                >
                                    <ChevronLeft size={14} /> Prev
                                </button>
                            )}
                            {logs.next_page_url && (
                                <button
                                    onClick={() =>
                                        router.get(logs.next_page_url)
                                    }
                                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-sm transition-colors"
                                >
                                    Next <ChevronRight size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}

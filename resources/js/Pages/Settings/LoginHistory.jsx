import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { useState, useRef } from "react";
import PageHeader from "@/Components/PageHeader";
import {
    Search,
    X,
    LogIn,
    LogOut,
    AlertCircle,
    Monitor,
    Smartphone,
    Globe,
    Clock,
    MapPin,
} from "lucide-react";
import { fmtDate } from "@/utils/date";

const EVENT_CONFIG = {
    login: { label: "Login", cls: "bg-green-100 text-green-800", Icon: LogIn },
    logout: { label: "Logout", cls: "bg-blue-100 text-blue-800", Icon: LogOut },
    failed: {
        label: "Failed",
        cls: "bg-red-100 text-red-800",
        Icon: AlertCircle,
    },
};

function duration(loggedIn, loggedOut) {
    if (!loggedIn || !loggedOut) return null;
    const ms = new Date(loggedOut) - new Date(loggedIn);
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hrs}h ${rem}m`;
}

export default function LoginHistory({ histories, stats, users, filters }) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [event, setEvent] = useState(filters?.event ?? "");
    const [userId, setUserId] = useState(filters?.user_id ?? "");
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? "");
    const [dateTo, setDateTo] = useState(filters?.date_to ?? "");
    const timer = useRef(null);

    const applyFilters = (overrides = {}) => {
        router.get(
            route("settings.login-history.index"),
            {
                search,
                event,
                user_id: userId,
                date_from: dateFrom,
                date_to: dateTo,
                ...overrides,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearch = (v) => {
        setSearch(v);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => applyFilters({ search: v }), 400);
    };

    return (
        <AppLayout>
            <Head title="Login History" />
            <div className="p-6 space-y-6">
                <PageHeader
                    title="Login History"
                    subtitle="All login, logout, and failed attempt events (Super Admin only)"
                    icon={LogIn}
                    iconClass="bg-cyan-100 text-cyan-600"
                />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {[
                        {
                            label: "Total",
                            value: stats.total,
                            color: "text-slate-700",
                        },
                        {
                            label: "Today",
                            value: stats.today,
                            color: "text-cyan-600",
                        },
                        {
                            label: "Logins",
                            value: stats.logins,
                            color: "text-green-600",
                        },
                        {
                            label: "Logouts",
                            value: stats.logouts,
                            color: "text-blue-600",
                        },
                        {
                            label: "Failed",
                            value: stats.failed,
                            color: "text-red-600",
                        },
                        {
                            label: "Unique IPs",
                            value: stats.unique_ips,
                            color: "text-violet-600",
                        },
                    ].map(({ label, value, color }) => (
                        <div
                            key={label}
                            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
                        >
                            <div className={`text-2xl font-bold ${color}`}>
                                {value?.toLocaleString() ?? 0}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap gap-3 items-end">
                    <div className="relative flex-1 min-w-[160px]">
                        <Search
                            size={15}
                            className="absolute left-3 top-2.5 text-slate-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search user, IP, browser…"
                            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={event}
                        onChange={(e) => {
                            setEvent(e.target.value);
                            applyFilters({ event: e.target.value });
                        }}
                        className="py-2 px-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="">All Events</option>
                        <option value="login">Login</option>
                        <option value="logout">Logout</option>
                        <option value="failed">Failed</option>
                    </select>
                    {Array.isArray(users) && users.length > 0 && (
                        <select
                            value={userId}
                            onChange={(e) => {
                                setUserId(e.target.value);
                                applyFilters({ user_id: e.target.value });
                            }}
                            className="py-2 px-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="">All Users</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    )}
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => {
                            setDateFrom(e.target.value);
                            applyFilters({ date_from: e.target.value });
                        }}
                        className="py-2 px-3 text-sm border border-slate-300 rounded-lg"
                    />
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => {
                            setDateTo(e.target.value);
                            applyFilters({ date_to: e.target.value });
                        }}
                        className="py-2 px-3 text-sm border border-slate-300 rounded-lg"
                    />
                    {(search || event || userId || dateFrom || dateTo) && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setEvent("");
                                setUserId("");
                                setDateFrom("");
                                setDateTo("");
                                applyFilters({
                                    search: "",
                                    event: "",
                                    user_id: "",
                                    date_from: "",
                                    date_to: "",
                                });
                            }}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-slate-500 border border-slate-300 rounded-lg hover:bg-slate-100"
                        >
                            <X size={14} /> Clear
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    {[
                                        "Time",
                                        "User",
                                        "Event",
                                        "IP Address",
                                        "Browser",
                                        "Platform",
                                        "Device",
                                        "Duration",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {histories.data?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="text-center py-16 text-slate-400"
                                        >
                                            <LogIn
                                                size={40}
                                                className="mx-auto mb-3 opacity-30"
                                            />
                                            No login history found.
                                        </td>
                                    </tr>
                                ) : (
                                    histories.data?.map((h) => {
                                        const cfg =
                                            EVENT_CONFIG[h.event] ??
                                            EVENT_CONFIG.login;
                                        const Ico = cfg.Icon;
                                        const dur = duration(
                                            h.logged_in_at,
                                            h.logged_out_at,
                                        );
                                        return (
                                            <tr
                                                key={h.id}
                                                className="hover:bg-cyan-50/30 transition-colors"
                                            >
                                                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                                                    <div>
                                                        {fmtDate(
                                                            h.logged_in_at,
                                                        )}
                                                    </div>
                                                    <div className="text-slate-400">
                                                        {new Date(
                                                            h.logged_in_at,
                                                        ).toLocaleTimeString()}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-slate-800 text-xs">
                                                        {h.user_name ??
                                                            h.user?.name ??
                                                            "Unknown"}
                                                    </div>
                                                    <div className="text-slate-400 text-xs">
                                                        {h.user_email ??
                                                            h.user?.email ??
                                                            ""}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.cls}`}
                                                    >
                                                        <Ico size={11} />
                                                        {cfg.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 text-xs font-mono">
                                                    {h.ip_address ?? "—"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1 text-xs text-slate-600">
                                                        <Globe
                                                            size={12}
                                                            className="text-slate-400"
                                                        />
                                                        {h.browser ?? "—"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1 text-xs text-slate-600">
                                                        <Monitor
                                                            size={12}
                                                            className="text-slate-400"
                                                        />
                                                        {h.platform ?? "—"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1 text-xs text-slate-600">
                                                        {h.device_type ===
                                                        "mobile" ? (
                                                            <Smartphone
                                                                size={12}
                                                                className="text-slate-400"
                                                            />
                                                        ) : (
                                                            <Monitor
                                                                size={12}
                                                                className="text-slate-400"
                                                            />
                                                        )}
                                                        {h.device_type ?? "—"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {dur ? (
                                                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                                            <Clock size={11} />{" "}
                                                            {dur}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300 text-xs">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {histories.last_page > 1 && (
                        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
                            <span>
                                Showing {histories.from}–{histories.to} of{" "}
                                {histories.total?.toLocaleString()} results
                            </span>
                            <div className="flex items-center gap-1">
                                {histories.links?.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url || link.active}
                                        onClick={() =>
                                            link.url &&
                                            router.get(
                                                link.url,
                                                {},
                                                { preserveState: true },
                                            )
                                        }
                                        className={`px-2.5 py-1 rounded text-sm ${link.active ? "bg-cyan-600 text-white font-semibold" : "border border-slate-200 hover:bg-slate-100 disabled:opacity-40"}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

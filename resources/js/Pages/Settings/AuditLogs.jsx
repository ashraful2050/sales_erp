import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { useState, useRef } from "react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import {
    Search,
    Filter,
    Eye,
    ChevronLeft,
    ChevronRight,
    Activity,
    Plus,
    Edit2,
    Trash2,
    RotateCcw,
    X,
    Clock,
} from "lucide-react";
import { fmtDateTime } from "@/utils/date";
import { useTranslation } from "@/hooks/useTranslation";

const EVENT_COLORS = {
    created: "bg-green-100 text-green-800",
    updated: "bg-blue-100 text-blue-800",
    deleted: "bg-red-100 text-red-800",
    restored: "bg-purple-100 text-purple-800",
};
const EVENT_ICONS = {
    created: Plus,
    updated: Edit2,
    deleted: Trash2,
    restored: RotateCcw,
};

function DiffView({ oldValues, newValues }) {
    if (!oldValues && !newValues)
        return <p className="text-slate-500 text-sm">{t("No diff data.")}</p>;
    const keys = Array.from(
        new Set([
            ...Object.keys(oldValues ?? {}),
            ...Object.keys(newValues ?? {}),
        ]),
    );
    return (
        <table className="w-full text-sm border-collapse">
            <thead>
                <tr className="bg-slate-100 text-left">
                    <th className="px-3 py-2 font-semibold text-slate-600 w-1/4">
                        {t("Field")}
                    </th>
                    <th className="px-3 py-2 font-semibold text-red-600 w-[37.5%]">
                        {t("Before")}
                    </th>
                    <th className="px-3 py-2 font-semibold text-green-600 w-[37.5%]">
                        {t("After")}
                    </th>
                </tr>
            </thead>
            <tbody>
                {keys.map((k) => {
                    const before = oldValues?.[k] ?? null;
                    const after = newValues?.[k] ?? null;
                    const changed =
                        JSON.stringify(before) !== JSON.stringify(after);
                    return (
                        <tr
                            key={k}
                            className={`border-t ${changed ? "bg-yellow-50" : ""}`}
                        >
                            <td className="px-3 py-1.5 text-slate-500 font-mono text-xs">
                                {k}
                            </td>
                            <td className="px-3 py-1.5 text-red-700 font-mono text-xs break-all">
                                {before !== null
                                    ? String(
                                          typeof before === "object"
                                              ? JSON.stringify(before)
                                              : before,
                                      )
                                    : "–"}
                            </td>
                            <td className="px-3 py-1.5 text-green-700 font-mono text-xs break-all">
                                {after !== null
                                    ? String(
                                          typeof after === "object"
                                              ? JSON.stringify(after)
                                              : after,
                                      )
                                    : "–"}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

function DetailModal({ log, onClose }) {
    if (!log) return null;
    const EventIcon = EVENT_ICONS[log.action] ?? Activity;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${EVENT_COLORS[log.action] ?? "bg-slate-100 text-slate-700"}`}
                        >
                            <EventIcon size={13} />
                            {log.action}
                        </span>
                        <h2 className="text-base font-semibold text-slate-800">
                            {log.description ||
                                log.model_type?.split("\\").pop() ||
                                "Audit Detail"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 transition"
                    >
                        <X size={20} />
                    </button>
                </div>
                {/* Meta */}
                <div className="grid grid-cols-2 gap-4 px-6 py-4 bg-slate-50 border-b text-sm">
                    <div>
                        <span className="font-medium text-slate-500">
                            Time:{" "}
                        </span>
                        {fmtDateTime(log.created_at)}
                    </div>
                    <div>
                        <span className="font-medium text-slate-500">
                            Module:{" "}
                        </span>
                        {log.module ?? "–"}
                    </div>
                    <div>
                        <span className="font-medium text-slate-500">
                            User:{" "}
                        </span>
                        {log.user_name ?? log.user?.name ?? "–"}{" "}
                        {log.user_email ? `(${log.user_email})` : ""}
                    </div>
                    <div>
                        <span className="font-medium text-slate-500">IP: </span>
                        {log.ip_address ?? "–"}
                    </div>
                    <div className="col-span-2">
                        <span className="font-medium text-slate-500">
                            URL:{" "}
                        </span>
                        <span className="break-all text-blue-600 text-xs">
                            {log.url ?? "–"}
                        </span>
                    </div>
                </div>
                {/* Diff */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <h3 className="text-sm font-semibold text-slate-600 mb-3">
                        Changes
                    </h3>
                    <DiffView
                        oldValues={log.old_values}
                        newValues={log.new_values}
                    />
                </div>
            </div>
        </div>
    );
}

export default function AuditLogs({ logs, stats, topUsers, filters }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters?.search ?? "");
    const [event, setEvent] = useState(filters?.event ?? "");
    const [module, setModule] = useState(filters?.module ?? "");
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? "");
    const [dateTo, setDateTo] = useState(filters?.date_to ?? "");
    const [detail, setDetail] = useState(null);
    const timer = useRef(null);

    const applyFilters = (overrides = {}) => {
        router.get(
            route("settings.audit-logs.index"),
            {
                search,
                event,
                module,
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

    const viewDetail = (log) => setDetail(log);

    return (
        <AppLayout>
            <Head title={t("Audit Logs")} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={t("Audit Logs")}
                    subtitle={t("Complete activity trail for all system changes (Super Admin only)")}
                    icon={Activity}
                    iconClass="bg-violet-100 text-violet-600"
                />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        {
                            label: "Total Events",
                            value: stats.total,
                            color: "text-violet-600",
                        },
                        {
                            label: "Today",
                            value: stats.today,
                            color: "text-blue-600",
                        },
                        {
                            label: "Created",
                            value: stats.created,
                            color: "text-green-600",
                        },
                        {
                            label: "Updated",
                            value: stats.updated,
                            color: "text-amber-600",
                        },
                        {
                            label: "Deleted",
                            value: stats.deleted,
                            color: "text-red-600",
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
                            placeholder={t("Search user, model, IP…")}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={event}
                        onChange={(e) => {
                            setEvent(e.target.value);
                            applyFilters({ event: e.target.value });
                        }}
                        className="py-2 px-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                    >
                        <option value="">{t("All Events")}</option>
                        <option value="created">{t("Created")}</option>
                        <option value="updated">{t("Updated")}</option>
                        <option value="deleted">{t("Deleted")}</option>
                        <option value="restored">{t("Restored")}</option>
                        <option value="login">{t("Login")}</option>
                        <option value="logout">{t("Logout")}</option>
                    </select>
                    {Array.isArray(filters?.modules) &&
                        filters.modules.length > 0 && (
                            <select
                                value={module}
                                onChange={(e) => {
                                    setModule(e.target.value);
                                    applyFilters({ module: e.target.value });
                                }}
                                className="py-2 px-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                            >
                                <option value="">{t("All Modules")}</option>
                                {filters.modules.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
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
                    {(search || event || module || dateFrom || dateTo) && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setEvent("");
                                setModule("");
                                setDateFrom("");
                                setDateTo("");
                                applyFilters({
                                    search: "",
                                    event: "",
                                    module: "",
                                    date_from: "",
                                    date_to: "",
                                });
                            }}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-slate-500 border border-slate-300 rounded-lg hover:bg-slate-100"
                        >
                            <X size={14} /> {t("Clear")}
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
                                        "Module",
                                        "Description",
                                        "IP Address",
                                        "",
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
                                {logs.data?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="text-center py-16 text-slate-400"
                                        >
                                            <Activity
                                                size={40}
                                                className="mx-auto mb-3 opacity-30"
                                            />
                                            {t("No audit logs found.")}
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data?.map((log) => {
                                        const EventIcon =
                                            EVENT_ICONS[log.action] ?? Clock;
                                        return (
                                            <tr
                                                key={log.id}
                                                className="hover:bg-violet-50/30 transition-colors"
                                            >
                                                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                                                    {fmtDateTime(
                                                        log.created_at,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-slate-800 text-xs">
                                                        {log.user_name ??
                                                            log.user?.name ??
                                                            "System"}
                                                    </div>
                                                    <div className="text-slate-400 text-xs">
                                                        {log.user_email ??
                                                            log.user?.email ??
                                                            ""}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${EVENT_COLORS[log.action] ?? "bg-slate-100 text-slate-600"}`}
                                                    >
                                                        <EventIcon size={11} />
                                                        {log.action ?? "—"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 text-xs">
                                                    {log.module ??
                                                        log.model_type
                                                            ?.split("\\")
                                                            .pop() ??
                                                        "—"}
                                                </td>
                                                <td
                                                    className="px-4 py-3 text-slate-700 text-xs max-w-[200px] truncate"
                                                    title={
                                                        log.description ??
                                                        log.auditable_label ??
                                                        ""
                                                    }
                                                >
                                                    {log.description ??
                                                        log.auditable_label ??
                                                        "—"}
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 text-xs font-mono">
                                                    {log.ip_address ?? "—"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {(log.old_values ||
                                                        log.new_values) && (
                                                        <button
                                                            onClick={() =>
                                                                viewDetail(log)
                                                            }
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition"
                                                        >
                                                            <Eye size={12} />{" "}
                                                            Diff
                                                        </button>
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
                    {logs.last_page > 1 && (
                        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
                            <span>
                                Showing {logs.from}–{logs.to} of{" "}
                                {logs.total?.toLocaleString()} results
                            </span>
                            <div className="flex items-center gap-1">
                                {logs.links?.map((link, i) => (
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
                                        className={`px-2.5 py-1 rounded text-sm ${link.active ? "bg-violet-600 text-white font-semibold" : "border border-slate-200 hover:bg-slate-100 disabled:opacity-40"}`}
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

            {detail && (
                <DetailModal log={detail} onClose={() => setDetail(null)} />
            )}
        </AppLayout>
    );
}

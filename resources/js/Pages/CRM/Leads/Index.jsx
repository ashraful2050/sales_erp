import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    Plus,
    Eye,
    Pencil,
    Trash2,
    TrendingUp,
    Users,
    DollarSign,
    Target,
} from "lucide-react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

const statusColors = {
    new: "blue",
    contacted: "yellow",
    qualified: "indigo",
    proposal: "purple",
    negotiation: "orange",
    won: "green",
    lost: "red",
};
const priorityColors = { low: "slate", medium: "yellow", high: "orange" };

export default function LeadsIndex({ leads, stats, filters }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters?.search ?? "");
    const [status, setStatus] = useState(filters?.status ?? "");
    const [priority, setPriority] = useState(filters?.priority ?? "");
    const { confirm } = useDialog();

    const applyFilters = (s, st, pr) => {
        router.get(
            route("crm.leads.index"),
            { search: s, status: st, priority: pr },
            { preserveState: true, replace: true },
        );
    };

    const del = async (id) => {
        if (
            await confirm("This lead will be permanently deleted.", {
                title: t("Delete Lead?"),
                confirmLabel: t("Delete"),
                intent: "danger",
            })
        )
            router.delete(route("crm.leads.destroy", id));
    };

    const fmtCurrency = (v) =>
        new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(v);

    return (
        <AppLayout title={t("CRM – Leads")}>
            <Head title={t("Leads")} />
            <PageHeader
                title={t("Leads")}
                subtitle={t("Manage your sales pipeline")}
                actions={
                    <Link
                        href={route("crm.leads.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("New Lead")}
                    </Link>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    {
                        label: "Total Leads",
                        value: stats.total,
                        icon: Users,
                        color: "blue",
                    },
                    {
                        label: "New",
                        value: stats.new,
                        icon: Target,
                        color: "indigo",
                    },
                    {
                        label: "Qualified",
                        value: stats.qualified,
                        icon: TrendingUp,
                        color: "purple",
                    },
                    {
                        label: "Pipeline Value",
                        value: fmtCurrency(stats.totalValue),
                        icon: DollarSign,
                        color: "green",
                    },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="bg-white rounded-xl border border-slate-200 p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-${s.color}-50`}>
                                <s.icon
                                    size={18}
                                    className={`text-${s.color}-600`}
                                />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">
                                    {s.label}
                                </p>
                                <p className="text-lg font-bold text-slate-800">
                                    {s.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3">
                <SearchFilter
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        applyFilters(v, status, priority);
                    }}
                    placeholder={t("Search leads…")}
                />
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        applyFilters(search, e.target.value, priority);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                    <option value="">{t("All Status")}</option>
                    {[
                        "new",
                        "contacted",
                        "qualified",
                        "proposal",
                        "negotiation",
                        "won",
                        "lost",
                    ].map((s) => (
                        <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
                <select
                    value={priority}
                    onChange={(e) => {
                        setPriority(e.target.value);
                        applyFilters(search, status, e.target.value);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                    <option value="">{t("All Priority")}</option>
                    {["low", "medium", "high"].map((p) => (
                        <option key={p} value={p}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {[
                                    "Title",
                                    "Contact",
                                    "Status",
                                    "Priority",
                                    "Score",
                                    "Value",
                                    "Assigned",
                                    "Actions",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leads.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-4 py-8 text-center text-slate-400"
                                    >
                                        {t("No leads found.")}
                                    </td>
                                </tr>
                            ) : (
                                leads.data.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-3 font-medium text-slate-800">
                                            {lead.title}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            <div>
                                                {lead.contact_name || "-"}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {lead.company_name || ""}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                color={
                                                    statusColors[lead.status]
                                                }
                                                label={lead.status.replace(
                                                    "_",
                                                    " ",
                                                )}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                color={
                                                    priorityColors[
                                                        lead.priority
                                                    ]
                                                }
                                                label={lead.priority}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-slate-200 rounded-full h-1.5">
                                                    <div
                                                        className="bg-blue-500 h-1.5 rounded-full"
                                                        style={{
                                                            width: `${lead.score}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {lead.score}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {fmtCurrency(lead.estimated_value)}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {lead.assigned_to?.name || "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={route(
                                                        "crm.leads.show",
                                                        lead.id,
                                                    )}
                                                    className="p-1 text-slate-400 hover:text-blue-600"
                                                >
                                                    <Eye size={15} />
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "crm.leads.edit",
                                                        lead.id,
                                                    )}
                                                    className="p-1 text-slate-400 hover:text-yellow-600"
                                                >
                                                    <Pencil size={15} />
                                                </Link>
                                                <button
                                                    onClick={() => del(lead.id)}
                                                    className="p-1 text-slate-400 hover:text-red-600"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="border-t border-slate-200 px-4 py-3">
                    <Pagination links={leads.links} meta={leads} />
                </div>
            </div>
        </AppLayout>
    );
}

import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    Building2,
    Plus,
    Search,
    Eye,
    Edit,
    Pause,
    Play,
    Trash2,
    UserCheck,
    ChevronLeft,
    ChevronRight,
    CreditCard,
} from "lucide-react";
import { fmtDate } from "@/utils/date";
import { useTranslation } from "@/hooks/useTranslation";

const StatusBadge = ({ status }) => {
    const cls =
        {
            active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            suspended: "bg-red-500/20 text-red-400 border-red-500/30",
            pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            cancelled: "bg-slate-500/20 text-slate-400 border-slate-500/30",
        }[status] ?? "bg-slate-500/20 text-slate-400 border-slate-500/30";
    return (
        <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}
        >
            {status}
        </span>
    );
};

export default function TenantsIndex({ tenants, filters, plans }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? "");
    const [status, setStatus] = useState(filters.status ?? "");
    const [suspendModal, setSuspendModal] = useState(null);
    const { post, processing } = useForm({});

    const applyFilter = () => {
        router.get(
            route("superadmin.tenants.index"),
            { search, status },
            { preserveState: true, replace: true },
        );
    };

    const handleSuspend = (tenantId, reason) => {
        router.post(
            route("superadmin.tenants.suspend", tenantId),
            { reason },
            {
                onSuccess: () => setSuspendModal(null),
            },
        );
    };

    const handleActivate = (tenantId) => {
        router.post(route("superadmin.tenants.activate", tenantId));
    };

    const handleImpersonate = (tenantId) => {
        router.post(route("superadmin.tenants.impersonate", tenantId));
    };

    return (
        <SuperAdminLayout title="Tenants">
            <Head title={t("Tenants — Super Admin")} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        All Tenants
                    </h2>
                    <p className="text-slate-400 text-sm mt-0.5">
                        {tenants.total} total companies
                    </p>
                </div>
                <Link
                    href={route("superadmin.tenants.create")}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> {t("New Tenant")}
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 min-w-[240px]">
                    <Search size={15} className="text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyFilter()}
                        placeholder={t("Search by name or email...")}
                        className="bg-transparent text-slate-200 text-sm outline-none placeholder-slate-500 flex-1"
                    />
                </div>
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                    }}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none"
                >
                    <option value="">{t("All statuses")}</option>
                    <option value="active">{t("Active")}</option>
                    <option value="suspended">{t("Suspended")}</option>
                    <option value="pending">{t("Pending")}</option>
                    <option value="cancelled">{t("Cancelled")}</option>
                </select>
                <button
                    onClick={applyFilter}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    {t("Filter")}
                </button>
            </div>

            {/* Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    {t("Company")}
                                </th>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    {t("Admin")}
                                </th>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    {t("Plan")}
                                </th>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    {t("Users")}
                                </th>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    {t("Status")}
                                </th>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    {t("Joined")}
                                </th>
                                <th className="text-right text-slate-400 py-3 px-4 font-medium">
                                    {t("Actions")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {tenants.data.map((tenant) => (
                                <tr
                                    key={tenant.id}
                                    className="hover:bg-slate-700/30 transition-colors"
                                >
                                    <td className="py-3 px-4">
                                        <Link
                                            href={route(
                                                "superadmin.tenants.show",
                                                tenant.id,
                                            )}
                                            className="text-violet-400 hover:text-violet-300 font-semibold"
                                        >
                                            {tenant.name}
                                        </Link>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {tenant.email}
                                        </p>
                                    </td>
                                    <td className="py-3 px-4 text-slate-300">
                                        {tenant.primary_user?.name ?? "—"}
                                    </td>
                                    <td className="py-3 px-4">
                                        {tenant.active_subscription?.plan ? (
                                            <span className="text-violet-300 text-xs font-medium">
                                                {
                                                    tenant.active_subscription
                                                        .plan.name
                                                }
                                                {tenant.active_subscription
                                                    .status === "trial" && (
                                                    <span className="ml-1 text-amber-400">
                                                        (trial)
                                                    </span>
                                                )}
                                            </span>
                                        ) : (
                                            <span className="text-slate-500 text-xs">
                                                {t("No plan")}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-slate-300">
                                        {tenant.users_count}
                                    </td>
                                    <td className="py-3 px-4">
                                        <StatusBadge status={tenant.status} />
                                    </td>
                                    <td className="py-3 px-4 text-slate-400 text-xs">
                                        {fmtDate(tenant.created_at)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "superadmin.tenants.show",
                                                    tenant.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-md transition-colors"
                                                title="View"
                                            >
                                                <Eye size={15} />
                                            </Link>
                                            <Link
                                                href={route(
                                                    "superadmin.tenants.edit",
                                                    tenant.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={15} />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleImpersonate(tenant.id)
                                                }
                                                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-md transition-colors"
                                                title="Impersonate"
                                            >
                                                <UserCheck size={15} />
                                            </button>
                                            {tenant.status === "active" ? (
                                                <button
                                                    onClick={() =>
                                                        setSuspendModal(tenant)
                                                    }
                                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                                    title="Suspend"
                                                >
                                                    <Pause size={15} />
                                                </button>
                                            ) : tenant.status ===
                                              "suspended" ? (
                                                <button
                                                    onClick={() =>
                                                        handleActivate(
                                                            tenant.id,
                                                        )
                                                    }
                                                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors"
                                                    title="Activate"
                                                >
                                                    <Play size={15} />
                                                </button>
                                            ) : null}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tenants.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-12 text-center text-slate-500"
                                    >
                                        {t("No tenants found.")}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {tenants.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
                        <p className="text-sm text-slate-400">
                            Showing {tenants.from}–{tenants.to} of{" "}
                            {tenants.total}
                        </p>
                        <div className="flex items-center gap-2">
                            {tenants.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || "#"}
                                    preserveScroll
                                    className={`px-3 py-1.5 text-xs rounded-md transition-colors
                                        ${
                                            link.active
                                                ? "bg-violet-600 text-white"
                                                : link.url
                                                  ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                                  : "bg-slate-800 text-slate-600 cursor-not-allowed"
                                        }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Suspend Modal */}
            {suspendModal && (
                <SuspendModal
                    tenant={suspendModal}
                    onConfirm={(reason) =>
                        handleSuspend(suspendModal.id, reason)
                    }
                    onClose={() => setSuspendModal(null)}
                />
            )}
        </SuperAdminLayout>
    );
}

function SuspendModal({ tenant, onConfirm, onClose }) {
    const [reason, setReason] = useState("");
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md mx-4">
                <h3 className="text-white font-semibold text-lg mb-2">
                    Suspend Tenant
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                    Are you sure you want to suspend{" "}
                    <strong className="text-white">{tenant.name}</strong>? Their
                    users will be logged out on next access.
                </p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={t("Reason for suspension (optional)...")}
                    rows={3}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none resize-none placeholder-slate-500 mb-4"
                />
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                        {t("Cancel")}
                    </button>
                    <button
                        onClick={() => onConfirm(reason)}
                        className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        {t("Suspend Tenant")}
                    </button>
                </div>
            </div>
        </div>
    );
}

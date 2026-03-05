import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    Building2,
    Users,
    FileText,
    Package,
    DollarSign,
    UserCheck,
    Pause,
    Play,
    ArrowLeft,
    CreditCard,
    Edit,
    Calendar,
    Globe,
    Phone,
    Mail,
    ChevronDown,
    ShieldCheck,
    Monitor,
    Sun,
    LayoutGrid,
} from "lucide-react";
import { fmtDate, fmtDateTime } from "@/utils/date";
import { useTranslation } from "@/hooks/useTranslation";

const StatusBadge = ({ status }) => {
    const cls =
        {
            active: "bg-emerald-500/20 text-emerald-400",
            suspended: "bg-red-500/20 text-red-400",
            pending: "bg-amber-500/20 text-amber-400",
            cancelled: "bg-slate-500/20 text-slate-400",
            trial: "bg-violet-500/20 text-violet-400",
            expired: "bg-red-500/20 text-red-400",
        }[status] ?? "bg-slate-500/20 text-slate-400";
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
            {status}
        </span>
    );
};

const StatCard = ({ label, value, icon: Icon }) => (
    <div className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-violet-600/30 rounded-lg flex items-center justify-center">
            <Icon size={18} className="text-violet-400" />
        </div>
        <div>
            <p className="text-slate-400 text-xs">{label}</p>
            <p className="text-white font-bold text-lg">{value}</p>
        </div>
    </div>
);

export default function TenantShow({ tenant, stats, plans }) {
    const { t } = useTranslation();
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [suspendModal, setSuspendModal] = useState(false);

    const impersonate = () =>
        router.post(route("superadmin.tenants.impersonate", tenant.id));
    const activate = () =>
        router.post(route("superadmin.tenants.activate", tenant.id));

    const fmtAmt = (n) => "$" + new Intl.NumberFormat().format(n ?? 0);

    return (
        <SuperAdminLayout title={tenant.name}>
            <Head title={`${tenant.name} — Super Admin`} />

            {/* Back */}
            <Link
                href={route("superadmin.tenants.index")}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-5 transition-colors"
            >
                <ArrowLeft size={14} /> {t("All Tenants")}
            </Link>

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-white">
                            {tenant.name}
                        </h2>
                        <StatusBadge status={tenant.status} />
                    </div>
                    <p className="text-slate-400 text-sm mt-1">
                        {tenant.email} · {tenant.slug}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={route("superadmin.tenants.edit", tenant.id)}
                        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                        <Edit size={15} /> {t("Edit")}
                    </Link>
                    <Link
                        href={route(
                            "superadmin.tenants.permissions.edit",
                            tenant.id,
                        )}
                        className="flex items-center gap-2 bg-violet-700 hover:bg-violet-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                        <ShieldCheck size={15} /> {t("Permissions")}
                    </Link>
                    <button
                        onClick={impersonate}
                        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                        <UserCheck size={15} /> {t("Impersonate")}
                    </button>
                    <button
                        onClick={() => setShowPlanModal(true)}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                        <CreditCard size={15} /> {t("Assign Plan")}
                    </button>
                    {tenant.status === "active" ? (
                        <button
                            onClick={() => setSuspendModal(true)}
                            className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                            <Pause size={15} /> {t("Suspend")}
                        </button>
                    ) : (
                        <button
                            onClick={activate}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                            <Play size={15} /> {t("Activate")}
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                <StatCard
                    label="Invoices"
                    value={stats.invoices}
                    icon={FileText}
                />
                <StatCard
                    label="Customers"
                    value={stats.customers}
                    icon={Users}
                />
                <StatCard
                    label="Products"
                    value={stats.products}
                    icon={Package}
                />
                <StatCard
                    label="Employees"
                    value={stats.employees}
                    icon={Users}
                />
                <StatCard
                    label="Revenue"
                    value={fmtAmt(stats.total_revenue)}
                    icon={DollarSign}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Company Info */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                    <h3 className="text-white font-semibold mb-4">
                        {t("Company Info")}
                    </h3>
                    <div className="space-y-3 text-sm">
                        {[
                            {
                                icon: Globe,
                                label: "Country",
                                value: tenant.country,
                            },
                            {
                                icon: Phone,
                                label: "Phone",
                                value: tenant.phone,
                            },
                            { icon: Mail, label: "Email", value: tenant.email },
                            {
                                icon: Calendar,
                                label: "Joined",
                                value: fmtDate(tenant.created_at),
                            },
                            {
                                icon: Calendar,
                                label: "Last Active",
                                value: tenant.last_active_at
                                    ? fmtDateTime(tenant.last_active_at)
                                    : "Never",
                            },
                        ].map((row) => (
                            <div
                                key={row.label}
                                className="flex items-center gap-3"
                            >
                                <row.icon
                                    size={14}
                                    className="text-slate-500 shrink-0"
                                />
                                <span className="text-slate-400">
                                    {row.label}:
                                </span>
                                <span className="text-slate-200">
                                    {row.value || "—"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subscription History */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 lg:col-span-2">
                    <h3 className="text-white font-semibold mb-4">
                        {t("Subscription History")}
                    </h3>
                    <div className="space-y-2">
                        {tenant.subscriptions?.map((sub) => (
                            <div
                                key={sub.id}
                                className="flex items-center justify-between bg-slate-700/40 rounded-lg px-3 py-2.5"
                            >
                                <div>
                                    <p className="text-sm text-white font-medium">
                                        {sub.plan?.name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {sub.billing_cycle} · Started{" "}
                                        {sub.starts_at
                                            ? fmtDate(sub.starts_at)
                                            : "—"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <StatusBadge status={sub.status} />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Exp:{" "}
                                        {sub.expires_at
                                            ? fmtDate(sub.expires_at)
                                            : sub.trial_ends_at
                                              ? fmtDate(sub.trial_ends_at) +
                                                " (trial)"
                                              : "Lifetime"}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {!tenant.subscriptions?.length && (
                            <p className="text-slate-500 text-sm">
                                {t("No subscriptions.")}
                            </p>
                        )}
                    </div>
                </div>

                {/* Users */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 lg:col-span-3">
                    <h3 className="text-white font-semibold mb-4">
                        {t("Users")} ({tenant.users?.length})
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left text-slate-400 py-2 pr-4 font-medium">
                                        {t("Name")}
                                    </th>
                                    <th className="text-left text-slate-400 py-2 pr-4 font-medium">
                                        {t("Email")}
                                    </th>
                                    <th className="text-left text-slate-400 py-2 font-medium">
                                        {t("Role")}
                                    </th>
                                    <th className="text-left text-slate-400 py-2 font-medium">
                                        {t("Status")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {tenant.users?.map((user) => (
                                    <tr key={user.id}>
                                        <td className="py-2.5 pr-4 text-white">
                                            {user.name}
                                        </td>
                                        <td className="py-2.5 pr-4 text-slate-400">
                                            {user.email}
                                        </td>
                                        <td className="py-2.5 pr-4">
                                            <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded-full text-xs">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-2.5">
                                            <StatusBadge
                                                status={
                                                    user.is_active
                                                        ? "active"
                                                        : "suspended"
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Layout Switcher ── */}
            <LayoutSwitcher tenant={tenant} />

            {showPlanModal && (
                <AssignPlanModal
                    tenant={tenant}
                    plans={plans}
                    onClose={() => setShowPlanModal(false)}
                />
            )}

            {suspendModal && (
                <SuspendModal
                    tenant={tenant}
                    onClose={() => setSuspendModal(false)}
                />
            )}
        </SuperAdminLayout>
    );
}

function AssignPlanModal({ tenant, plans, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        plan_id: tenant.active_subscription?.plan_id ?? "",
        billing_cycle: tenant.active_subscription?.billing_cycle ?? "monthly",
        expires_at: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("superadmin.tenants.assign-plan", tenant.id), {
            onSuccess: onClose,
        });
    };

    const selectedPlan = plans.find(
        (p) => String(p.id) === String(data.plan_id),
    );

    const totalPrice = (() => {
        if (!selectedPlan) return null;
        if (data.billing_cycle === "monthly") {
            return { amount: selectedPlan.price_monthly, label: "/ month" };
        }
        if (data.billing_cycle === "yearly") {
            const yearly =
                selectedPlan.price_yearly > 0
                    ? selectedPlan.price_yearly
                    : selectedPlan.price_monthly * 12;
            return {
                amount: yearly,
                label: "/ year",
                monthly: selectedPlan.price_monthly,
            };
        }
        if (data.billing_cycle === "trial") {
            return { amount: 0, label: "free trial" };
        }
        if (data.billing_cycle === "lifetime") {
            const lifetime =
                selectedPlan.price_yearly > 0
                    ? selectedPlan.price_yearly * 3
                    : selectedPlan.price_monthly * 36;
            return { amount: lifetime, label: "one-time" };
        }
        return null;
    })();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md mx-4">
                <h3 className="text-white font-semibold text-lg mb-4">
                    Assign Plan — {tenant.name}
                </h3>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-xs mb-1">
                            {t("Plan")}
                        </label>
                        <select
                            value={data.plan_id}
                            onChange={(e) => setData("plan_id", e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none"
                        >
                            <option value="">Select a plan…</option>
                            {plans.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} — ${p.price_monthly}/mo
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-400 text-xs mb-1">
                            {t("Billing Cycle")}
                        </label>
                        <select
                            value={data.billing_cycle}
                            onChange={(e) =>
                                setData("billing_cycle", e.target.value)
                            }
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none"
                        >
                            <option value="trial">{t("Trial")}</option>
                            <option value="monthly">{t("Monthly")}</option>
                            <option value="yearly">{t("Yearly")}</option>
                            <option value="lifetime">{t("Lifetime")}</option>
                        </select>
                    </div>

                    {/* Total Price Summary */}
                    {totalPrice !== null && (
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3">
                            <p className="text-slate-400 text-xs mb-1">
                                {t("Total Price")}
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-white">
                                    $
                                    {new Intl.NumberFormat().format(
                                        totalPrice.amount,
                                    )}
                                </span>
                                <span className="text-slate-400 text-sm">
                                    {totalPrice.label}
                                </span>
                            </div>
                            {data.billing_cycle === "yearly" &&
                                totalPrice.monthly > 0 && (
                                    <p className="text-emerald-400 text-xs mt-1">
                                        ${totalPrice.monthly}/mo × 12 months
                                        {selectedPlan.price_yearly > 0 &&
                                            selectedPlan.price_yearly <
                                                selectedPlan.price_monthly *
                                                    12 && (
                                                <span className="ml-2 text-emerald-300 font-medium">
                                                    — save $
                                                    {new Intl.NumberFormat().format(
                                                        selectedPlan.price_monthly *
                                                            12 -
                                                            selectedPlan.price_yearly,
                                                    )}
                                                </span>
                                            )}
                                    </p>
                                )}
                        </div>
                    )}

                    <div>
                        <label className="block text-slate-400 text-xs mb-1">
                            {t("Custom Expiry (optional)")}
                        </label>
                        <input
                            type="date"
                            value={data.expires_at}
                            onChange={(e) =>
                                setData("expires_at", e.target.value)
                            }
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none"
                        />
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                        >
                            {t("Cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 text-sm text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-60"
                        >
                            {t("Assign Plan")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function SuspendModal({ tenant, onClose }) {
    const { data, setData, post, processing } = useForm({ reason: "" });
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md mx-4">
                <h3 className="text-white font-semibold text-lg mb-2">
                    {t("Suspend Tenant")}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                    Suspend{" "}
                    <strong className="text-white">{tenant.name}</strong>?
                </p>
                <textarea
                    value={data.reason}
                    onChange={(e) => setData("reason", e.target.value)}
                    placeholder={t("Reason (optional)...")}
                    rows={3}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none resize-none mb-4"
                />
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg"
                    >
                        {t("Cancel")}
                    </button>
                    <button
                        onClick={() =>
                            post(
                                route("superadmin.tenants.suspend", tenant.id),
                                { onSuccess: onClose },
                            )
                        }
                        disabled={processing}
                        className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-60"
                    >
                        {t("Suspend")}
                    </button>
                </div>
            </div>
        </div>
    );
}
// ── Layout Switcher component ─────────────────────────────────────────────────
function LayoutSwitcher({ tenant }) {
    const currentLayout = tenant.settings?.layout ?? "dark";
    const [saving, setSaving] = useState(false);
    const { t } = useTranslation();

    const setLayout = (layout) => {
        setSaving(true);
        router.post(
            route("superadmin.tenants.set-layout", tenant.id),
            { layout },
            { onFinish: () => setSaving(false) },
        );
    };

    const layouts = [
        {
            id: "dark",
            label: "Dark",
            desc: "Slate-900 sidebar, dark ERP feel",
            icon: Monitor,
            preview: (
                <div className="w-full h-16 rounded bg-slate-900 flex overflow-hidden text-[9px]">
                    <div className="w-8 h-full bg-slate-800 flex flex-col gap-0.5 p-0.5">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="bg-slate-600 rounded h-1.5 w-full"
                            />
                        ))}
                    </div>
                    <div className="flex-1 bg-slate-700 p-1">
                        <div className="bg-slate-600 h-2 w-3/4 rounded mb-1" />
                        <div className="bg-slate-600 h-1.5 w-1/2 rounded" />
                    </div>
                </div>
            ),
            accent: "border-violet-500 bg-violet-500/10",
            badge: "bg-violet-600",
        },
        {
            id: "light",
            label: "Light",
            desc: "White sidebar, indigo accents",
            icon: Sun,
            preview: (
                <div className="w-full h-16 rounded bg-white flex overflow-hidden border border-slate-200">
                    <div className="w-8 h-full bg-white border-r border-slate-200 flex flex-col gap-0.5 p-0.5">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="bg-indigo-100 rounded h-1.5 w-full"
                            />
                        ))}
                    </div>
                    <div className="flex-1 bg-slate-50 p-1">
                        <div className="bg-slate-200 h-2 w-3/4 rounded mb-1" />
                        <div className="bg-slate-200 h-1.5 w-1/2 rounded" />
                    </div>
                </div>
            ),
            accent: "border-indigo-500 bg-indigo-500/10",
            badge: "bg-indigo-600",
        },
        {
            id: "tally",
            label: "Tally",
            desc: "Classic ERP, Tally Prime style",
            icon: LayoutGrid,
            preview: (
                <div className="w-full h-16 rounded overflow-hidden flex flex-col">
                    <div className="h-3 bg-[#1a3c2c] flex items-center px-1 gap-0.5">
                        <div className="h-1 w-8 bg-[#4caf6e] rounded" />
                    </div>
                    <div className="flex flex-1">
                        <div className="w-8 bg-[#1a3c2c] flex flex-col gap-0.5 p-0.5 pt-1">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="bg-[#4caf6e]/30 rounded h-1.5 w-full"
                                />
                            ))}
                        </div>
                        <div className="flex-1 bg-[#f0f4f0] p-1">
                            <div className="bg-[#c8d8c8] h-1.5 w-3/4 rounded mb-1" />
                            <div className="bg-[#c8d8c8] h-1 w-1/2 rounded" />
                        </div>
                    </div>
                    <div className="h-2 bg-[#143020]" />
                </div>
            ),
            accent: "border-emerald-500 bg-emerald-500/10",
            badge: "bg-emerald-600",
        },
        {
            id: "odoo",
            label: "Odoo",
            desc: "Odoo 18 style — purple top bar, app switcher",
            icon: LayoutGrid,
            preview: (
                <div className="w-full h-16 rounded overflow-hidden flex flex-col">
                    <div className="h-4 bg-[#714B67] flex items-center px-1.5 gap-1">
                        <div className="w-2.5 h-2.5 rounded bg-white/30" />
                        <div className="h-1 w-10 bg-white/30 rounded" />
                        <div className="flex-1" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
                    </div>
                    <div className="flex flex-1 bg-[#F0EEEB]">
                        <div className="w-10 bg-white border-r border-slate-200 flex flex-col gap-0.5 p-0.5 pt-1">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="bg-[#714B67]/20 rounded h-1.5 w-full"
                                />
                            ))}
                        </div>
                        <div className="flex-1 p-1">
                            <div className="bg-white h-1.5 w-3/4 rounded mb-1 shadow-sm" />
                            <div className="bg-white h-1 w-1/2 rounded shadow-sm" />
                        </div>
                    </div>
                </div>
            ),
            accent: "border-[#714B67] bg-[#714B67]/10",
            badge: "bg-[#714B67]",
        },
    ];

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mt-6">
            <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                <LayoutGrid size={16} className="text-violet-400" />
                Application Layout
            </h3>
            <p className="text-slate-400 text-xs mb-4">
                Choose the UI layout this company's users will see when they log
                in.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {layouts.map((l) => {
                    const active = currentLayout === l.id;
                    const Icon = l.icon;
                    return (
                        <button
                            key={l.id}
                            onClick={() =>
                                !active && !saving && setLayout(l.id)
                            }
                            disabled={saving}
                            className={`group flex flex-col rounded-xl border-2 p-3 text-left transition-all
                                ${active ? l.accent + " cursor-default" : "border-slate-600 hover:border-slate-400 bg-slate-700/40"}
                                ${saving ? "opacity-60 cursor-wait" : ""}
                            `}
                        >
                            {l.preview}
                            <div className="flex items-center gap-2 mt-2.5">
                                <Icon
                                    size={13}
                                    className={
                                        active ? "text-white" : "text-slate-400"
                                    }
                                />
                                <span
                                    className={`font-semibold text-sm ${active ? "text-white" : "text-slate-300"}`}
                                >
                                    {l.label}
                                </span>
                                {active && (
                                    <span
                                        className={`ml-auto px-1.5 py-0.5 text-[10px] rounded font-bold text-white ${l.badge}`}
                                    >
                                        {t("Active")}
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                {l.desc}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

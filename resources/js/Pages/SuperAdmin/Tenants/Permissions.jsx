import { useState, useMemo } from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import {
    ArrowLeft,
    ShieldCheck,
    ShieldX,
    CheckSquare,
    Square,
    Save,
    Info,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

// ── Action labels ──────────────────────────────────────────────────────────
const ACTION_LABELS = {
    view: "View",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
};
const ACTION_COLORS = {
    view: "bg-blue-500/10   text-blue-400   border-blue-500/30",
    create: "bg-green-500/10  text-green-400  border-green-500/30",
    edit: "bg-amber-500/10  text-amber-400  border-amber-500/30",
    delete: "bg-red-500/10    text-red-400    border-red-500/30",
};

// ── Single permission checkbox ─────────────────────────────────────────────
function PermToggle({ label, value, onChange, color = "" }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!value)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all select-none ${
                value
                    ? color ||
                      "bg-violet-500/15 text-violet-300 border-violet-500/40"
                    : "bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-600"
            }`}
        >
            {value ? <CheckSquare size={12} /> : <Square size={12} />}
            {label}
        </button>
    );
}

// ── Module Card ────────────────────────────────────────────────────────────
function ModuleCard({
    module,
    label,
    icon,
    actions,
    features,
    featureLabels,
    permissions,
    onChange,
}) {
    const [open, setOpen] = useState(true);

    // Compute counts for this module
    const allKeys = useMemo(() => {
        const keys = actions.map((a) => `${module}.${a}`);
        if (features) {
            Object.keys(features).forEach((f) => keys.push(`${module}.${f}`));
        }
        return keys;
    }, [module, actions, features]);

    const grantedCount = allKeys.filter((k) => permissions[k]).length;
    const totalCount = allKeys.length;
    const allGranted = grantedCount === totalCount;
    const noneGranted = grantedCount === 0;

    function grantAll() {
        const patch = {};
        allKeys.forEach((k) => (patch[k] = true));
        onChange(patch);
    }
    function revokeAll() {
        const patch = {};
        allKeys.forEach((k) => (patch[k] = false));
        onChange(patch);
    }

    return (
        <div
            className={`border rounded-xl overflow-hidden transition-all ${
                grantedCount > 0
                    ? "border-slate-700 bg-slate-900"
                    : "border-slate-800 bg-slate-900/50"
            }`}
        >
            {/* Module header */}
            <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                onClick={() => setOpen(!open)}
            >
                <span className="text-xl leading-none">{icon || "📦"}</span>
                <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold">{label}</p>
                    <p className="text-slate-500 text-xs">
                        {grantedCount}/{totalCount} permissions granted
                    </p>
                </div>
                {/* Grant / Revoke all */}
                <div
                    className="flex gap-1.5 mr-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        onClick={grantAll}
                        disabled={allGranted}
                        className="flex items-center gap-1 bg-green-500/10 hover:bg-green-500/20 disabled:opacity-40 text-green-400 border border-green-500/20 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors"
                    >
                        <ShieldCheck size={10} /> {t("All")}
                    </button>
                    <button
                        type="button"
                        onClick={revokeAll}
                        disabled={noneGranted}
                        className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-40 text-red-400 border border-red-500/20 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors"
                    >
                        <ShieldX size={10} /> {t("None")}
                    </button>
                </div>
                {/* Progress bar + expand */}
                <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-violet-500 rounded-full transition-all"
                            style={{
                                width: `${totalCount ? (grantedCount / totalCount) * 100 : 0}%`,
                            }}
                        />
                    </div>
                    {open ? (
                        <ChevronDown size={14} className="text-slate-500" />
                    ) : (
                        <ChevronRight size={14} className="text-slate-500" />
                    )}
                </div>
            </div>

            {open && (
                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-800">
                    {/* Actions row */}
                    <div>
                        <p className="text-slate-500 text-[10px] uppercase tracking-wide mb-2">
                            {t("Module Access")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {actions.map((action) => {
                                const key = `${module}.${action}`;
                                return (
                                    <PermToggle
                                        key={key}
                                        label={ACTION_LABELS[action] ?? action}
                                        value={!!permissions[key]}
                                        color={ACTION_COLORS[action]}
                                        onChange={(v) => onChange({ [key]: v })}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Features */}
                    {features && Object.keys(features).length > 0 && (
                        <div>
                            <p className="text-slate-500 text-[10px] uppercase tracking-wide mb-2">
                                {t("Features")}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(features).map(
                                    ([feat, featLabel]) => {
                                        const key = `${module}.${feat}`;
                                        return (
                                            <PermToggle
                                                key={key}
                                                label={featLabel}
                                                value={!!permissions[key]}
                                                onChange={(v) =>
                                                    onChange({ [key]: v })
                                                }
                                            />
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function TenantPermissions({
    tenant,
    permissions: initialPermissions,
    modules,
    moduleLabels,
    moduleIcons,
    features,
    featureLabels,
    hasRole,
}) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, isDirty } = useForm({
        permissions: { ...initialPermissions },
    });

    // Flat patch helper
    function patchPermissions(patch) {
        setData("permissions", { ...data.permissions, ...patch });
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route("superadmin.tenants.permissions.update", tenant.id));
    }

    // Summary counts
    const totalGranted = Object.values(data.permissions).filter(Boolean).length;
    const totalKeys = Object.keys(data.permissions).length;

    const moduleList = Object.entries(modules);

    return (
        <SuperAdminLayout title={`Permissions — ${tenant.name}`}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {/* Back */}
                <Link
                    href={route("superadmin.tenants.show", tenant.id)}
                    className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-5 transition-colors"
                >
                    <ArrowLeft size={14} /> Back to {tenant.name}
                </Link>

                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center">
                                <ShieldCheck
                                    size={20}
                                    className="text-violet-400"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">
                                    Admin Permissions
                                </h1>
                                <p className="text-slate-400 text-sm mt-0.5">
                                    {tenant.name} ·{" "}
                                    {tenant.active_subscription?.plan?.name ??
                                        "No active plan"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Summary badge */}
                        <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-center">
                            <p className="text-violet-400 font-bold text-lg leading-none">
                                {totalGranted}
                                <span className="text-slate-500 font-normal text-sm">
                                    /{totalKeys}
                                </span>
                            </p>
                            <p className="text-slate-500 text-xs mt-0.5">
                                {t("Granted")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info note */}
                {!hasRole && (
                    <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl px-4 py-3 mb-5 text-sm">
                        <Info size={15} className="mt-0.5 flex-shrink-0" />
                        <span>
                            This tenant has no custom admin role yet. Saving
                            will create one with the permissions you select
                            below. By default, all permissions are pre-loaded.
                        </span>
                    </div>
                )}

                {flash?.success && (
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 mb-5 text-sm">
                        <ShieldCheck size={15} />
                        {flash.success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Grant All / Revoke All global */}
                    <div className="flex gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => {
                                const patch = {};
                                Object.keys(data.permissions).forEach(
                                    (k) => (patch[k] = true),
                                );
                                setData("permissions", patch);
                            }}
                            className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                            <ShieldCheck size={14} /> {t("Grant All Permissions")}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const patch = {};
                                Object.keys(data.permissions).forEach(
                                    (k) => (patch[k] = false),
                                );
                                setData("permissions", patch);
                            }}
                            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                            <ShieldX size={14} /> {t("Revoke All Permissions")}
                        </button>
                    </div>

                    {/* Module cards */}
                    <div className="space-y-3 mb-24">
                        {moduleList.map(([module, actions]) => (
                            <ModuleCard
                                key={module}
                                module={module}
                                label={moduleLabels[module] ?? module}
                                icon={moduleIcons?.[module]}
                                actions={actions}
                                features={features[module] ?? null}
                                featureLabels={featureLabels}
                                permissions={data.permissions}
                                onChange={patchPermissions}
                            />
                        ))}
                    </div>

                    {/* Sticky footer */}
                    <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-slate-950/95 backdrop-blur border-t border-slate-800 px-6 py-4 flex items-center justify-between z-30">
                        <p className="text-slate-400 text-sm">
                            {isDirty ? (
                                <span className="text-amber-400">
                                    {t("You have unsaved changes")}
                                </span>
                            ) : (
                                `${totalGranted} of ${totalKeys} permissions granted`
                            )}
                        </p>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
                        >
                            {processing ? (
                                <svg
                                    className="animate-spin h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
                                </svg>
                            ) : (
                                <Save size={15} />
                            )}
                            Save Permissions
                        </button>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}

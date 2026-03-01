import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft, ShieldCheck, ChevronDown, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";

const actionLabels = { view: "View", create: "Add", edit: "Edit", delete: "Delete" };
const actionColors = {
    view:   "bg-blue-50   text-blue-700   border-blue-200",
    create: "bg-green-50  text-green-700  border-green-200",
    edit:   "bg-amber-50  text-amber-700  border-amber-200",
    delete: "bg-red-50    text-red-700    border-red-200",
};

const MODULE_COLORS = {
    reports:    { bg: "bg-purple-50",  border: "border-purple-200",  text: "text-purple-700",  badge: "bg-purple-100 text-purple-700" },
    accounting: { bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700",    badge: "bg-blue-100 text-blue-700" },
    sales:      { bg: "bg-green-50",   border: "border-green-200",   text: "text-green-700",   badge: "bg-green-100 text-green-700" },
    purchase:   { bg: "bg-orange-50",  border: "border-orange-200",  text: "text-orange-700",  badge: "bg-orange-100 text-orange-700" },
    finance:    { bg: "bg-cyan-50",    border: "border-cyan-200",    text: "text-cyan-700",    badge: "bg-cyan-100 text-cyan-700" },
    inventory:  { bg: "bg-teal-50",    border: "border-teal-200",    text: "text-teal-700",    badge: "bg-teal-100 text-teal-700" },
    hr:         { bg: "bg-pink-50",    border: "border-pink-200",    text: "text-pink-700",    badge: "bg-pink-100 text-pink-700" },
    assets:     { bg: "bg-yellow-50",  border: "border-yellow-200",  text: "text-yellow-700",  badge: "bg-yellow-100 text-yellow-700" },
    pos:        { bg: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-700",  badge: "bg-indigo-100 text-indigo-700" },
    settings:   { bg: "bg-slate-50",   border: "border-slate-200",   text: "text-slate-700",   badge: "bg-slate-100 text-slate-600" },
    users:      { bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700",    badge: "bg-rose-100 text-rose-700" },
};

export default function RoleForm({ editRole, modules, moduleLabels, features, featureLabels, moduleIcons }) {
    const isEdit = !!editRole;
    const [activeTab, setActiveTab]       = useState("module");
    const [expandedMods, setExpandedMods] = useState(() => {
        // Start with all feature-module sections expanded
        return Object.keys(featureLabels ?? {}).reduce((acc, m) => ({ ...acc, [m]: true }), {});
    });

    // Build initial permissions from existing role or all-false (modules + features)
    const buildInitialPerms = () => {
        const perms = {};
        Object.entries(modules).forEach(([mod, actions]) => {
            actions.forEach(action => {
                const key = `${mod}.${action}`;
                perms[key] = editRole?.permissions?.[key] ?? false;
            });
        });
        Object.entries(featureLabels ?? {}).forEach(([mod, feats]) => {
            Object.keys(feats).forEach(feat => {
                const key = `${mod}.${feat}`;
                perms[key] = editRole?.permissions?.[key] ?? false;
            });
        });
        return perms;
    };

    const { data, setData, post, put, processing, errors } = useForm({
        name:        editRole?.name ?? "",
        permissions: buildInitialPerms(),
    });

    const toggle = (key) => {
        setData("permissions", { ...data.permissions, [key]: !data.permissions[key] });
    };

    const toggleModule = (mod) => {
        const actions = modules[mod];
        const allOn = actions.every(a => data.permissions[`${mod}.${a}`]);
        const updated = { ...data.permissions };
        actions.forEach(a => { updated[`${mod}.${a}`] = !allOn; });
        setData("permissions", updated);
    };

    const toggleAction = (action) => {
        const keys = Object.keys(modules).map(mod => `${mod}.${action}`).filter(k => k in data.permissions);
        const allOn = keys.every(k => data.permissions[k]);
        const updated = { ...data.permissions };
        keys.forEach(k => { updated[k] = !allOn; });
        setData("permissions", updated);
    };

    const toggleFeatureModule = (mod) => {
        const feats = Object.keys(featureLabels[mod] ?? {});
        const allOn = feats.every(f => data.permissions[`${mod}.${f}`]);
        const updated = { ...data.permissions };
        feats.forEach(f => { updated[`${mod}.${f}`] = !allOn; });
        setData("permissions", updated);
    };

    const toggleAllFeatures = (on) => {
        const updated = { ...data.permissions };
        Object.entries(featureLabels ?? {}).forEach(([mod, feats]) => {
            Object.keys(feats).forEach(f => { updated[`${mod}.${f}`] = on; });
        });
        setData("permissions", updated);
    };

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(route("settings.roles.update", editRole.id)) : post(route("settings.roles.store"));
    };

    const allActions = [...new Set(Object.values(modules).flat())];

    // Count helpers
    const modulePermCount   = Object.entries(data.permissions).filter(([k, v]) => {
        const mod = k.split(".")[0];
        const action = k.split(".")[1];
        return v && modules[mod]?.includes(action);
    }).length;
    const featurePermCount  = Object.entries(data.permissions).filter(([k, v]) => {
        const [mod, feat] = k.split(".");
        return v && featureLabels[mod]?.[feat] !== undefined;
    }).length;
    const totalFeatureCount = Object.values(featureLabels ?? {}).reduce((s, f) => s + Object.keys(f).length, 0);
    const totalModuleCount  = Object.values(modules).reduce((s, a) => s + a.length, 0);


    return (
        <AppLayout title={isEdit ? "Edit Role" : "Create Role"}>
            <Head title={isEdit ? "Edit Role" : "Create Role"} />
            <PageHeader
                title={isEdit ? `Edit Role: ${editRole.name}` : "Create New Role"}
                subtitle="Define a name and assign permissions for each module and feature"
                actions={
                    <Link href={route("settings.roles.index")} className="flex items-center gap-2 text-slate-600 text-sm font-medium hover:text-slate-900">
                        <ArrowLeft size={16} /> Back to Roles
                    </Link>
                }
            />

            <form onSubmit={submit} className="space-y-6">
                {/* Role Name */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role Name <span className="text-red-400">*</span></label>
                    <input
                        value={data.name}
                        onChange={e => setData("name", e.target.value)}
                        placeholder="e.g. Sales Manager, Accountant, Report Viewer…"
                        required
                        className="w-full max-w-sm border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Summary pills */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-sm text-blue-700">
                        <ShieldCheck size={15} />
                        <span>Module access: <strong>{modulePermCount}/{totalModuleCount}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5 text-sm text-purple-700">
                        <ShieldCheck size={15} />
                        <span>Feature access: <strong>{featurePermCount}/{totalFeatureCount}</strong></span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex border-b border-slate-200">
                        {[
                            { id: "module",  label: "Module Permissions",  desc: `${modulePermCount}/${totalModuleCount} enabled` },
                            { id: "feature", label: "Feature Permissions", desc: `${featurePermCount}/${totalFeatureCount} enabled` },
                        ].map(tab => (
                            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-6 py-4 text-left transition-colors border-b-2 ${
                                    activeTab === tab.id
                                        ? "border-blue-600 bg-blue-50/50"
                                        : "border-transparent hover:bg-slate-50"
                                }`}>
                                <p className={`text-sm font-semibold ${activeTab === tab.id ? "text-blue-700" : "text-slate-600"}`}>{tab.label}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{tab.desc}</p>
                            </button>
                        ))}
                    </div>

                    {/* ── TAB 1: Module Permissions (existing matrix) ── */}
                    {activeTab === "module" && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-52">Module</th>
                                        {allActions.map(action => (
                                            <th key={action} className="px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                <button type="button" onClick={() => toggleAction(action)}
                                                    className={`px-3 py-1 rounded-md border text-xs font-medium transition-colors ${actionColors[action] ?? "bg-slate-50 text-slate-600 border-slate-200"} hover:opacity-80`}
                                                    title={`Toggle all "${actionLabels[action] ?? action}"`}>
                                                    {actionLabels[action] ?? action}
                                                </button>
                                            </th>
                                        ))}
                                        <th className="px-3 py-3 text-center text-xs font-semibold text-slate-500 w-20">All</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {Object.entries(modules).map(([mod, actions]) => {
                                        const color     = MODULE_COLORS[mod] ?? MODULE_COLORS.settings;
                                        const modAllOn  = actions.every(a => data.permissions[`${mod}.${a}`]);
                                        const modSomeOn = actions.some(a => data.permissions[`${mod}.${a}`]);
                                        return (
                                            <tr key={mod} className="hover:bg-slate-50">
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base">{moduleIcons?.[mod] ?? "🔷"}</span>
                                                        <span className="font-medium text-slate-800">{moduleLabels[mod] ?? mod}</span>
                                                    </div>
                                                </td>
                                                {allActions.map(action => {
                                                    const key    = `${mod}.${action}`;
                                                    const exists = key in data.permissions;
                                                    const checked = data.permissions[key] ?? false;
                                                    return (
                                                        <td key={action} className="px-3 py-3 text-center">
                                                            {exists ? (
                                                                <button type="button" onClick={() => toggle(key)}
                                                                    className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center mx-auto transition-all ${
                                                                        checked
                                                                            ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                                                            : "bg-white border-slate-200 text-slate-300 hover:border-blue-300"
                                                                    }`}>
                                                                    {checked ? (
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            ) : (
                                                                <span className="text-slate-200">—</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                                <td className="px-3 py-3 text-center">
                                                    <button type="button" onClick={() => toggleModule(mod)}
                                                        className={`text-xs font-medium px-2.5 py-1 rounded-md border transition-colors ${
                                                            modAllOn  ? "bg-blue-600 border-blue-600 text-white" :
                                                            modSomeOn ? "bg-blue-100 border-blue-300 text-blue-700" :
                                                                        "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                                                        }`}>
                                                        {modAllOn ? "All ✓" : modSomeOn ? "Some" : "None"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── TAB 2: Feature Permissions (granular) ── */}
                    {activeTab === "feature" && (
                        <div className="p-5 space-y-4">
                            {/* Global toggles */}
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-xs text-slate-400 mr-2">Quick set:</span>
                                <button type="button" onClick={() => toggleAllFeatures(true)}
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">
                                    Enable All Features
                                </button>
                                <button type="button" onClick={() => toggleAllFeatures(false)}
                                    className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200">
                                    Disable All
                                </button>
                            </div>

                            {Object.entries(featureLabels ?? {}).map(([mod, feats]) => {
                                const color    = MODULE_COLORS[mod] ?? MODULE_COLORS.settings;
                                const featKeys = Object.keys(feats);
                                const enabled  = featKeys.filter(f => data.permissions[`${mod}.${f}`]).length;
                                const allOn    = enabled === featKeys.length;
                                const expanded = expandedMods[mod] !== false;

                                return (
                                    <div key={mod} className={`rounded-xl border ${color.border} overflow-hidden`}>
                                        {/* Module header */}
                                        <div className={`${color.bg} px-4 py-3 flex items-center justify-between`}>
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-lg">{moduleIcons?.[mod] ?? "🔷"}</span>
                                                <div>
                                                    <p className={`text-sm font-bold ${color.text}`}>{moduleLabels[mod] ?? mod}</p>
                                                    <p className="text-xs text-slate-400">{enabled} of {featKeys.length} features enabled</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => toggleFeatureModule(mod)}
                                                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                                                        allOn
                                                            ? `${color.badge} border-current`
                                                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                                    }`}>
                                                    {allOn ? "All On ✓" : enabled > 0 ? `${enabled}/${featKeys.length}` : "All Off"}
                                                </button>
                                                <button type="button"
                                                    onClick={() => setExpandedMods(prev => ({ ...prev, [mod]: !expanded }))}
                                                    className={`p-1 rounded-lg ${color.text} hover:bg-white/60`}>
                                                    {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Feature toggles grid */}
                                        {expanded && (
                                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 bg-white">
                                                {Object.entries(feats).map(([feat, label]) => {
                                                    const key     = `${mod}.${feat}`;
                                                    const checked = data.permissions[key] ?? false;
                                                    return (
                                                        <button key={feat} type="button" onClick={() => toggle(key)}
                                                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${
                                                                checked
                                                                    ? `${color.bg} ${color.border} ${color.text}`
                                                                    : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                                                            }`}>
                                                            {checked ? (
                                                                <ToggleRight size={18} className={color.text} />
                                                            ) : (
                                                                <ToggleLeft size={18} className="text-slate-300" />
                                                            )}
                                                            <span className="text-xs font-medium leading-tight">{label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Save / Cancel */}
                <div className="flex justify-end gap-3 pb-8">
                    <Link href={route("settings.roles.index")}
                        className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                        Cancel
                    </Link>
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium">
                        <Save size={16} /> {isEdit ? "Update Role" : "Create Role"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}


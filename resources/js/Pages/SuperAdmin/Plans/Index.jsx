import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import { Plus, Edit, Trash2, Package, Check, X } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";

const FEATURES = [
    { key: "accounting", label: "Accounting / GL" },
    { key: "sales", label: "Sales & Invoicing" },
    { key: "purchase", label: "Purchase Orders" },
    { key: "inventory", label: "Inventory Management" },
    { key: "hr", label: "HR & Payroll" },
    { key: "assets", label: "Fixed Assets" },
    { key: "pos", label: "Point of Sale (POS)" },
    { key: "reports", label: "Advanced Reports" },
    { key: "multi_warehouse", label: "Multi Warehouse" },
    { key: "api_access", label: "API Access" },
];

const emptyForm = {
    name: "",
    description: "",
    price_monthly: 0,
    price_yearly: 0,
    max_users: 5,
    max_invoices_per_month: 100,
    max_products: 500,
    max_employees: 50,
    trial_days: 14,
    is_active: true,
    sort_order: 0,
    features: [],
};

export default function PlansIndex({ plans }) {
    const [modal, setModal] = useState(null); // null | 'create' | { plan }
    const { data, setData, post, put, processing, errors, reset } =
        useForm(emptyForm);

    const openCreate = () => {
        reset();
        Object.keys(emptyForm).forEach((k) => setData(k, emptyForm[k]));
        setModal("create");
    };

    const openEdit = (plan) => {
        Object.keys(emptyForm).forEach((k) =>
            setData(k, plan[k] ?? emptyForm[k]),
        );
        setModal({ plan });
    };

    const submit = (e) => {
        e.preventDefault();
        if (modal === "create") {
            post(route("superadmin.plans.store"), {
                onSuccess: () => setModal(null),
            });
        } else {
            put(route("superadmin.plans.update", modal.plan.id), {
                onSuccess: () => setModal(null),
            });
        }
    };

    const toggleFeature = (key) => {
        const current = data.features ?? [];
        setData(
            "features",
            current.includes(key)
                ? current.filter((k) => k !== key)
                : [...current, key],
        );
    };

    const { confirm: dlgConfirm } = useDialog();

    const deletePlan = async (plan) => {
        if (
            await dlgConfirm(
                `All tenants on this plan will lose access to its features.`,
                {
                    title: `Delete Plan "${plan.name}"?`,
                    confirmLabel: "Delete",
                    intent: "danger",
                },
            )
        ) {
            router.delete(route("superadmin.plans.destroy", plan.id));
        }
    };

    return (
        <SuperAdminLayout title="Plans">
            <Head title="Plans — Super Admin" />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        Subscription Plans
                    </h2>
                    <p className="text-slate-400 text-sm mt-0.5">
                        Manage SaaS plans offered to tenants
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> New Plan
                </button>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`bg-slate-800 border rounded-xl p-5 flex flex-col gap-4 ${plan.is_active ? "border-slate-700" : "border-slate-700/40 opacity-60"}`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Package
                                        size={16}
                                        className="text-violet-400"
                                    />
                                    <h3 className="text-white font-bold">
                                        {plan.name}
                                    </h3>
                                    {!plan.is_active && (
                                        <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                {plan.description && (
                                    <p className="text-slate-400 text-xs mt-1">
                                        {plan.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => openEdit(plan)}
                                    className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-md transition-colors"
                                >
                                    <Edit size={14} />
                                </button>
                                <button
                                    onClick={() => deletePlan(plan)}
                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="flex gap-4">
                            <div className="bg-slate-700/50 rounded-lg px-3 py-2 text-center">
                                <p className="text-lg font-bold text-white">
                                    ${plan.price_monthly}
                                </p>
                                <p className="text-xs text-slate-400">
                                    / month
                                </p>
                            </div>
                            <div className="bg-slate-700/50 rounded-lg px-3 py-2 text-center">
                                <p className="text-lg font-bold text-white">
                                    ${plan.price_yearly}
                                </p>
                                <p className="text-xs text-slate-400">/ year</p>
                            </div>
                        </div>

                        {/* Limits */}
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                            {[
                                { label: "Users", value: plan.max_users },
                                {
                                    label: "Invoices/mo",
                                    value: plan.max_invoices_per_month,
                                },
                                { label: "Products", value: plan.max_products },
                                {
                                    label: "Employees",
                                    value: plan.max_employees,
                                },
                                { label: "Trial Days", value: plan.trial_days },
                                {
                                    label: "Tenants",
                                    value: plan.subscriptions_count,
                                },
                            ].map((l) => (
                                <div
                                    key={l.label}
                                    className="flex justify-between bg-slate-700/30 rounded px-2 py-1"
                                >
                                    <span className="text-slate-400">
                                        {l.label}
                                    </span>
                                    <span className="text-slate-200 font-medium">
                                        {l.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Features */}
                        {plan.features?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {plan.features.map((f) => {
                                    const feat = FEATURES.find(
                                        (ff) => ff.key === f,
                                    );
                                    return (
                                        <span
                                            key={f}
                                            className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full"
                                        >
                                            {feat?.label ?? f}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
                {plans.length === 0 && (
                    <div className="col-span-3 py-16 text-center text-slate-500">
                        No plans yet. Create your first plan.
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
                            <h3 className="text-white font-semibold">
                                {modal === "create"
                                    ? "Create Plan"
                                    : `Edit: ${modal.plan.name}`}
                            </h3>
                            <button
                                onClick={() => setModal(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-xs mb-1">
                                        Name *
                                    </label>
                                    <input
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none"
                                    />
                                    {errors.name && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs mb-1">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) =>
                                            setData(
                                                "sort_order",
                                                +e.target.value,
                                            )
                                        }
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-xs mb-1">
                                    Description
                                </label>
                                <input
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-xs mb-1">
                                        Price / Month ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.price_monthly}
                                        onChange={(e) =>
                                            setData(
                                                "price_monthly",
                                                +e.target.value,
                                            )
                                        }
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs mb-1">
                                        Price / Year ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.price_yearly}
                                        onChange={(e) =>
                                            setData(
                                                "price_yearly",
                                                +e.target.value,
                                            )
                                        }
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { key: "max_users", label: "Max Users" },
                                    {
                                        key: "max_invoices_per_month",
                                        label: "Invoices/mo",
                                    },
                                    {
                                        key: "max_products",
                                        label: "Max Products",
                                    },
                                    {
                                        key: "max_employees",
                                        label: "Max Employees",
                                    },
                                    { key: "trial_days", label: "Trial Days" },
                                ].map((f) => (
                                    <div key={f.key}>
                                        <label className="block text-slate-400 text-xs mb-1">
                                            {f.label}
                                        </label>
                                        <input
                                            type="number"
                                            value={data[f.key]}
                                            onChange={(e) =>
                                                setData(f.key, +e.target.value)
                                            }
                                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none"
                                        />
                                    </div>
                                ))}
                                <div className="flex items-end pb-0.5">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) =>
                                                setData(
                                                    "is_active",
                                                    e.target.checked,
                                                )
                                            }
                                            className="accent-violet-600"
                                        />
                                        Active
                                    </label>
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-slate-400 text-xs mb-2">
                                    Included Features
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {FEATURES.map((feat) => {
                                        const active = (
                                            data.features ?? []
                                        ).includes(feat.key);
                                        return (
                                            <button
                                                type="button"
                                                key={feat.key}
                                                onClick={() =>
                                                    toggleFeature(feat.key)
                                                }
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border transition-colors text-left
                                                    ${active ? "bg-violet-600/20 border-violet-500/50 text-violet-300" : "bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500"}`}
                                            >
                                                {active ? (
                                                    <Check
                                                        size={12}
                                                        className="shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-3 h-3 shrink-0" />
                                                )}
                                                {feat.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModal(null)}
                                    className="px-4 py-2 text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm text-white bg-violet-600 hover:bg-violet-700 rounded-lg disabled:opacity-60"
                                >
                                    {processing
                                        ? "Saving..."
                                        : modal === "create"
                                          ? "Create Plan"
                                          : "Update Plan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}

import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import { Head, useForm, router, Link } from "@inertiajs/react";
import { useState } from "react";
import {
    Plus,
    Edit,
    Trash2,
    HandCoins,
    Copy,
    Check,
    X,
    ExternalLink,
    RefreshCw,
    DollarSign,
    Users,
    TrendingUp,
    Clock,
} from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

const emptyForm = {
    name: "",
    email: "",
    phone: "",
    commission_rate: 10,
    status: "active",
    notes: "",
};

function StatCard({ icon: Icon, label, value, color = "violet" }) {
    const colors = {
        violet: "text-violet-400 bg-violet-500/10",
        green: "text-emerald-400 bg-emerald-500/10",
        yellow: "text-yellow-400 bg-yellow-500/10",
        blue: "text-blue-400 bg-blue-500/10",
    };
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
            <div className={`p-2.5 rounded-lg ${colors[color]}`}>
                <Icon size={20} className={colors[color].split(" ")[0]} />
            </div>
            <div>
                <p className="text-slate-400 text-xs">{label}</p>
                <p className="text-white text-lg font-bold">{value}</p>
            </div>
        </div>
    );
}

function CopyBtn({ text }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={copy}
            className="p-1 text-slate-400 hover:text-violet-400 transition-colors"
            title="Copy"
        >
            {copied ? (
                <Check size={13} className="text-emerald-400" />
            ) : (
                <Copy size={13} />
            )}
        </button>
    );
}

export default function AffiliatesIndex({ affiliates, stats }) {
    const { t } = useTranslation();
    const [modal, setModal] = useState(null);
    const { data, setData, post, put, processing, errors, reset } =
        useForm(emptyForm);
    const { confirm: dlgConfirm } = useDialog();

    const openCreate = () => {
        reset();
        Object.keys(emptyForm).forEach((k) => setData(k, emptyForm[k]));
        setModal("create");
    };

    const openEdit = (aff) => {
        Object.keys(emptyForm).forEach((k) =>
            setData(k, aff[k] ?? emptyForm[k]),
        );
        setModal({ aff });
    };

    const submit = (e) => {
        e.preventDefault();
        if (modal === "create") {
            post(route("superadmin.affiliates.store"), {
                onSuccess: () => setModal(null),
            });
        } else {
            put(route("superadmin.affiliates.update", modal.aff.id), {
                onSuccess: () => setModal(null),
            });
        }
    };

    const deleteAffiliate = async (aff) => {
        if (
            await dlgConfirm(
                `This will permanently delete "${aff.name}". Affiliates with conversions cannot be deleted.`,
                {
                    title: t("Delete Affiliate?"),
                    confirmLabel: t("Delete"),
                    intent: "danger",
                },
            )
        ) {
            router.delete(route("superadmin.affiliates.destroy", aff.id));
        }
    };

    const markPaid = async (aff) => {
        if (
            await dlgConfirm(
                `Mark all pending commissions for "${aff.name}" as paid and reset balance to $0?`,
                {
                    title: t("Mark as Paid?"),
                    confirmLabel: t("Mark Paid"),
                    intent: "primary",
                },
            )
        ) {
            router.post(route("superadmin.affiliates.mark-paid", aff.id));
        }
    };

    const regenerate = async (aff) => {
        if (
            await dlgConfirm(
                `The old affiliate link for "${aff.name}" will stop working. Are you sure?`,
                {
                    title: t("Regenerate Affiliate Code?"),
                    confirmLabel: t("Regenerate"),
                    intent: "danger",
                },
            )
        ) {
            router.post(route("superadmin.affiliates.regenerate-code", aff.id));
        }
    };

    const fmt = (n) =>
        (n ?? 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    return (
        <SuperAdminLayout title="Affiliates">
            <Head title={t("Affiliates — Super Admin")} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        {t("Affiliates")}
                    </h2>
                    <p className="text-slate-400 text-sm mt-0.5">
                        {t(
                            "Manage your affiliate program and track referral commissions",
                        )}
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> {t("Add Affiliate")}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    icon={Users}
                    label="Total Affiliates"
                    value={stats.total}
                    color="violet"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Active Affiliates"
                    value={stats.active}
                    color="green"
                />
                <StatCard
                    icon={DollarSign}
                    label="Total Earned"
                    value={`$${fmt(stats.total_earned)}`}
                    color="blue"
                />
                <StatCard
                    icon={Clock}
                    label="Pending Payout"
                    value={`$${fmt(stats.pending)}`}
                    color="yellow"
                />
            </div>

            {/* Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left text-slate-400 font-medium px-4 py-3">
                                    {t("Name")}
                                </th>
                                <th className="text-left text-slate-400 font-medium px-4 py-3">
                                    {t("Affiliate Code / Link")}
                                </th>
                                <th className="text-center text-slate-400 font-medium px-4 py-3">
                                    {t("Commission")}
                                </th>
                                <th className="text-center text-slate-400 font-medium px-4 py-3">
                                    {t("Conversions")}
                                </th>
                                <th className="text-right text-slate-400 font-medium px-4 py-3">
                                    {t("Total Earned")}
                                </th>
                                <th className="text-right text-slate-400 font-medium px-4 py-3">
                                    {t("Pending")}
                                </th>
                                <th className="text-center text-slate-400 font-medium px-4 py-3">
                                    {t("Status")}
                                </th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {affiliates.map((aff) => {
                                const affUrl = `${window.location.origin}/register/tenant?ref=${aff.affiliate_code}`;
                                return (
                                    <tr
                                        key={aff.id}
                                        className="border-b border-slate-700/50 hover:bg-slate-700/20"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="text-white font-medium">
                                                {aff.name}
                                            </p>
                                            <p className="text-slate-400 text-xs">
                                                {aff.email}
                                            </p>
                                            {aff.phone && (
                                                <p className="text-slate-500 text-xs">
                                                    {aff.phone}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 bg-slate-700/50 rounded px-2 py-1 w-fit">
                                                <span className="font-mono text-violet-300 text-xs">
                                                    {aff.affiliate_code}
                                                </span>
                                                <CopyBtn text={affUrl} />
                                            </div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-slate-500 text-xs truncate max-w-[200px]">
                                                    {affUrl}
                                                </span>
                                                <CopyBtn text={affUrl} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-emerald-400 font-medium">
                                                {aff.commission_rate}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Link
                                                href={route(
                                                    "superadmin.affiliates.show",
                                                    aff.id,
                                                )}
                                                className="text-violet-400 hover:text-violet-300 font-medium"
                                            >
                                                {aff.conversions_count}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-right text-white font-medium">
                                            ${fmt(aff.total_earned)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span
                                                className={`font-medium ${
                                                    aff.balance > 0
                                                        ? "text-yellow-400"
                                                        : "text-slate-400"
                                                }`}
                                            >
                                                ${fmt(aff.balance)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${
                                                    aff.status === "active"
                                                        ? "bg-emerald-500/20 text-emerald-400"
                                                        : "bg-slate-700 text-slate-400"
                                                }`}
                                            >
                                                {aff.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 justify-end">
                                                {aff.balance > 0 && (
                                                    <button
                                                        onClick={() =>
                                                            markPaid(aff)
                                                        }
                                                        className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors"
                                                        title="Mark commissions as paid"
                                                    >
                                                        <DollarSign size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        regenerate(aff)
                                                    }
                                                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
                                                    title="Regenerate affiliate code"
                                                >
                                                    <RefreshCw size={14} />
                                                </button>
                                                <Link
                                                    href={route(
                                                        "superadmin.affiliates.show",
                                                        aff.id,
                                                    )}
                                                    className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-md transition-colors"
                                                    title="View conversions"
                                                >
                                                    <ExternalLink size={14} />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        openEdit(aff)
                                                    }
                                                    className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteAffiliate(aff)
                                                    }
                                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {affiliates.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-4 py-16 text-center text-slate-500"
                                    >
                                        No affiliates yet. Add your first
                                        affiliate to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create / Edit Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
                            <h3 className="text-white font-semibold">
                                {modal === "create"
                                    ? "Add Affiliate"
                                    : `Edit: ${modal.aff.name}`}
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
                                        {t("Name")} *
                                    </label>
                                    <input
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none focus:border-violet-500"
                                        placeholder={t("John Doe")}
                                    />
                                    {errors.name && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs mb-1">
                                        {t("Email")} *
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none focus:border-violet-500"
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-xs mb-1">
                                        {t("Phone")}
                                    </label>
                                    <input
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none focus:border-violet-500"
                                        placeholder="+1 555 000 0000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs mb-1">
                                        {t("Commission Rate (%)")} *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={data.commission_rate}
                                        onChange={(e) =>
                                            setData(
                                                "commission_rate",
                                                +e.target.value,
                                            )
                                        }
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none focus:border-violet-500"
                                    />
                                    {errors.commission_rate && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.commission_rate}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-xs mb-1">
                                    {t("Status")}
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none focus:border-violet-500"
                                >
                                    <option value="active">
                                        {t("Active")}
                                    </option>
                                    <option value="inactive">
                                        {t("Inactive")}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-xs mb-1">
                                    {t("Notes")}
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    rows={2}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none focus:border-violet-500 resize-none"
                                    placeholder={t(
                                        "Optional notes about this affiliate...",
                                    )}
                                />
                            </div>

                            <div className="flex gap-3 justify-end pt-1">
                                <button
                                    type="button"
                                    onClick={() => setModal(null)}
                                    className="px-4 py-2 text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg"
                                >
                                    {t("Cancel")}
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm text-white bg-violet-600 hover:bg-violet-700 rounded-lg disabled:opacity-60"
                                >
                                    {processing
                                        ? "Saving..."
                                        : modal === "create"
                                          ? "Add Affiliate"
                                          : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}

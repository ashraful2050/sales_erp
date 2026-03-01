import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    DollarSign,
    Building2,
    Package,
    Clock,
    CheckCircle,
} from "lucide-react";
import { useDialog } from "@/hooks/useDialog";

function Badge({ status }) {
    return status === "paid" ? (
        <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
            <CheckCircle size={11} /> Paid
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
            <Clock size={11} /> Pending
        </span>
    );
}

export default function AffiliateShow({ affiliate, conversions }) {
    const { confirm: dlgConfirm } = useDialog();

    const markPaid = async () => {
        if (
            await dlgConfirm(
                `Mark all pending commissions for "${affiliate.name}" as paid and reset balance to $0?`,
                {
                    title: "Mark as Paid?",
                    confirmLabel: "Mark Paid",
                    intent: "primary",
                },
            )
        ) {
            router.post(route("superadmin.affiliates.mark-paid", affiliate.id));
        }
    };

    const fmt = (n) =>
        (n ?? 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const affUrl = `${window.location.origin}/register/tenant?ref=${affiliate.affiliate_code}`;
    const pendingCount = conversions.filter(
        (c) => c.status === "pending",
    ).length;

    return (
        <SuperAdminLayout title="Affiliate Detail">
            <Head title={`Affiliate: ${affiliate.name}`} />

            {/* Back + Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-3">
                    <Link
                        href={route("superadmin.affiliates.index")}
                        className="mt-1 p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {affiliate.name}
                        </h2>
                        <p className="text-slate-400 text-sm mt-0.5">
                            {affiliate.email}
                        </p>
                    </div>
                </div>
                {pendingCount > 0 && (
                    <button
                        onClick={markPaid}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <DollarSign size={15} /> Mark All Paid
                    </button>
                )}
            </div>

            {/* Affiliate Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    {
                        label: "Commission Rate",
                        value: `${affiliate.commission_rate}%`,
                        color: "text-violet-400",
                    },
                    {
                        label: "Total Conversions",
                        value: conversions.length,
                        color: "text-blue-400",
                    },
                    {
                        label: "Total Earned",
                        value: `$${fmt(affiliate.total_earned)}`,
                        color: "text-emerald-400",
                    },
                    {
                        label: "Pending Payout",
                        value: `$${fmt(affiliate.balance)}`,
                        color: "text-yellow-400",
                    },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="bg-slate-800 border border-slate-700 rounded-xl p-4"
                    >
                        <p className="text-slate-400 text-xs mb-1">{s.label}</p>
                        <p className={`text-xl font-bold ${s.color}`}>
                            {s.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Affiliate Link */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6">
                <p className="text-slate-400 text-xs mb-1">
                    Affiliate Referral Link
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm text-violet-300 bg-slate-700/60 px-3 py-1.5 rounded-lg break-all">
                        {affUrl}
                    </span>
                    <button
                        onClick={() => navigator.clipboard.writeText(affUrl)}
                        className="text-xs text-slate-400 hover:text-violet-400 bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        Copy Link
                    </button>
                </div>
            </div>

            {/* Conversions Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="text-white font-semibold text-sm">
                        Conversion History
                    </h3>
                    <span className="text-slate-400 text-xs">
                        {conversions.length} total
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left text-slate-400 font-medium px-4 py-3">
                                    Tenant
                                </th>
                                <th className="text-left text-slate-400 font-medium px-4 py-3">
                                    Plan
                                </th>
                                <th className="text-center text-slate-400 font-medium px-4 py-3">
                                    Billing
                                </th>
                                <th className="text-right text-slate-400 font-medium px-4 py-3">
                                    Amount Paid
                                </th>
                                <th className="text-right text-slate-400 font-medium px-4 py-3">
                                    Commission
                                </th>
                                <th className="text-center text-slate-400 font-medium px-4 py-3">
                                    Status
                                </th>
                                <th className="text-right text-slate-400 font-medium px-4 py-3">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {conversions.map((c) => (
                                <tr
                                    key={c.id}
                                    className="border-b border-slate-700/50 hover:bg-slate-700/20"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Building2
                                                size={14}
                                                className="text-slate-400 shrink-0"
                                            />
                                            <span className="text-white">
                                                {c.company?.name ?? "—"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Package
                                                size={14}
                                                className="text-slate-400 shrink-0"
                                            />
                                            <span className="text-slate-200">
                                                {c.plan?.name ?? "—"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full capitalize">
                                            {c.billing_cycle}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-200">
                                        ${fmt(c.amount_paid)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        <span
                                            className={
                                                c.status === "paid"
                                                    ? "text-emerald-400"
                                                    : "text-yellow-400"
                                            }
                                        >
                                            ${fmt(c.commission_amount)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge status={c.status} />
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-400 text-xs">
                                        {new Date(
                                            c.created_at,
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {conversions.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-12 text-center text-slate-500"
                                    >
                                        No conversions yet for this affiliate.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SuperAdminLayout>
    );
}

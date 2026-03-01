import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Building2,
    Users,
    CreditCard,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    ArrowRight,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { fmtDate } from "@/utils/date";

const StatusBadge = ({ status }) => {
    const cls =
        {
            active: "bg-emerald-500/20 text-emerald-400",
            suspended: "bg-red-500/20 text-red-400",
            pending: "bg-amber-500/20 text-amber-400",
            cancelled: "bg-slate-500/20 text-slate-400",
            trial: "bg-violet-500/20 text-violet-400",
        }[status] ?? "bg-slate-500/20 text-slate-400";
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
            {status}
        </span>
    );
};

const Stat = ({ label, value, sub, icon: Icon, color }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-slate-400 text-sm">{label}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
                {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
            </div>
            <div
                className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}
            >
                <Icon size={18} className="text-white" />
            </div>
        </div>
    </div>
);

export default function SuperAdminDashboard({
    totalTenants,
    activeTenants,
    suspendedTenants,
    totalUsers,
    activeSubscriptions,
    expiredSubscriptions,
    mrr,
    arr,
    recentTenants,
    expiringSoon,
    monthlySignups,
}) {
    const fmt = (n) => new Intl.NumberFormat().format(n ?? 0);
    const fmtCurrency = (n) => "$" + new Intl.NumberFormat().format(n ?? 0);

    return (
        <SuperAdminLayout title="Dashboard">
            <Head title="Super Admin Dashboard" />

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Stat
                    label="Total Tenants"
                    value={fmt(totalTenants)}
                    icon={Building2}
                    color="bg-violet-600"
                />
                <Stat
                    label="Active Tenants"
                    value={fmt(activeTenants)}
                    icon={CheckCircle}
                    color="bg-emerald-600"
                    sub={`${suspendedTenants} suspended`}
                />
                <Stat
                    label="Total Users"
                    value={fmt(totalUsers)}
                    icon={Users}
                    color="bg-blue-600"
                />
                <Stat
                    label="Active Subs"
                    value={fmt(activeSubscriptions)}
                    icon={CreditCard}
                    color="bg-teal-600"
                    sub={`${expiredSubscriptions} expired`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <Stat
                    label="Monthly Recurring Revenue"
                    value={fmtCurrency(mrr)}
                    icon={DollarSign}
                    color="bg-amber-600"
                    sub="from active monthly plans"
                />
                <Stat
                    label="Annual Recurring Revenue"
                    value={fmtCurrency(arr)}
                    icon={TrendingUp}
                    color="bg-pink-600"
                    sub="from active yearly plans"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Monthly Signups */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                    <h3 className="text-white font-semibold mb-4">
                        Monthly Signups (12M)
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={monthlySignups}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#334155"
                            />
                            <XAxis
                                dataKey="month"
                                tick={{ fill: "#94a3b8", fontSize: 11 }}
                            />
                            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{
                                    background: "#1e293b",
                                    border: "1px solid #334155",
                                    borderRadius: 8,
                                    color: "#f1f5f9",
                                }}
                            />
                            <Bar
                                dataKey="signups"
                                fill="#7c3aed"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Expiring Soon */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Clock size={16} className="text-amber-400" /> Expiring
                        Soon (7 days)
                    </h3>
                    {expiringSoon.length === 0 ? (
                        <p className="text-slate-500 text-sm">
                            No subscriptions expiring soon.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {expiringSoon.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="flex items-center justify-between bg-slate-700/50 rounded-lg px-3 py-2"
                                >
                                    <div>
                                        <p className="text-sm text-white font-medium">
                                            {sub.company?.name}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {sub.company?.email}
                                        </p>
                                    </div>
                                    <div className="text-right text-xs">
                                        <p className="text-amber-400">
                                            {sub.expires_at
                                                ? fmtDate(sub.expires_at)
                                                : "Trial"}
                                        </p>
                                        <StatusBadge status={sub.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Tenants */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Recent Tenants</h3>
                    <Link
                        href={route("superadmin.tenants.index")}
                        className="text-violet-400 text-sm hover:text-violet-300 flex items-center gap-1"
                    >
                        View all <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left text-slate-400 py-2 pr-4 font-medium">
                                    Company
                                </th>
                                <th className="text-left text-slate-400 py-2 pr-4 font-medium">
                                    Email
                                </th>
                                <th className="text-left text-slate-400 py-2 pr-4 font-medium">
                                    Plan
                                </th>
                                <th className="text-left text-slate-400 py-2 pr-4 font-medium">
                                    Status
                                </th>
                                <th className="text-left text-slate-400 py-2 font-medium">
                                    Joined
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {recentTenants.map((tenant) => (
                                <tr
                                    key={tenant.id}
                                    className="hover:bg-slate-700/30 transition-colors"
                                >
                                    <td className="py-2.5 pr-4">
                                        <Link
                                            href={route(
                                                "superadmin.tenants.show",
                                                tenant.id,
                                            )}
                                            className="text-violet-400 hover:text-violet-300 font-medium"
                                        >
                                            {tenant.name}
                                        </Link>
                                    </td>
                                    <td className="py-2.5 pr-4 text-slate-400">
                                        {tenant.email}
                                    </td>
                                    <td className="py-2.5 pr-4 text-slate-300">
                                        {tenant.active_subscription?.plan
                                            ?.name ?? (
                                            <span className="text-slate-500">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-2.5 pr-4">
                                        <StatusBadge status={tenant.status} />
                                    </td>
                                    <td className="py-2.5 text-slate-400">
                                        {fmtDate(tenant.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SuperAdminLayout>
    );
}

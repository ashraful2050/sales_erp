import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Users, BarChart2, TrendingUp, UserCheck, Layers } from "lucide-react";

function HBar({ label, value, sub, max, color = "blue" }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">{label}</span>
                <span className="text-slate-500">{sub ?? value}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full">
                <div
                    className={`h-2.5 bg-${color}-500 rounded-full transition-all`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color = "blue" }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div
                className={`w-10 h-10 rounded-lg bg-${color}-50 flex items-center justify-center mb-3`}
            >
                <Icon size={18} className={`text-${color}-600`} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
        </div>
    );
}

export default function WorkloadBalancing({
    repWorkload,
    leadDist,
    leadVolume,
}) {
    const maxInvoices = repWorkload?.length
        ? Math.max(...repWorkload.map((r) => r.count))
        : 1;
    const maxLeads = leadDist?.length
        ? Math.max(...leadDist.map((r) => r.leads))
        : 1;
    const maxVolume = leadVolume?.length
        ? Math.max(...leadVolume.map((r) => r.count))
        : 1;

    const totalInvoices = repWorkload?.reduce((a, b) => a + b.count, 0) ?? 0;
    const totalLeads = leadDist?.reduce((a, b) => a + b.leads, 0) ?? 0;
    const avgInvoices = repWorkload?.length
        ? Math.round(totalInvoices / repWorkload.length)
        : 0;

    return (
        <AppLayout>
            <Head title="Workload Balancing" />
            <div className="p-6 space-y-6">
                <PageHeader
                    title="Workload Balancing & Resource Allocation"
                    subtitle="Improve sales team productivity using Line Balancing & Capacity Planning"
                />

                <div className="flex flex-wrap gap-2">
                    {[
                        "Line Balancing",
                        "Capacity Planning",
                        "Work Measurement",
                        "Lead Distribution",
                    ].map((c) => (
                        <span
                            key={c}
                            className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700"
                        >
                            {c}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        label="Sales Reps Tracked"
                        value={repWorkload?.length ?? 0}
                        icon={Users}
                        color="blue"
                    />
                    <StatCard
                        label="Total Orders (30d)"
                        value={totalInvoices}
                        icon={BarChart2}
                        color="green"
                    />
                    <StatCard
                        label="Avg Orders / Rep"
                        value={avgInvoices}
                        icon={Layers}
                        color="purple"
                    />
                    <StatCard
                        label="Total Leads Tracked"
                        value={totalLeads}
                        icon={UserCheck}
                        color="orange"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Rep Workload */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <Users size={16} className="text-blue-500" /> Sales
                            Rep Workload (Last 30 Days)
                        </h3>
                        {repWorkload?.length ? (
                            repWorkload.map((r, i) => (
                                <HBar
                                    key={i}
                                    label={r.rep}
                                    value={r.count}
                                    sub={`${r.count} orders · $${Number(r.value).toLocaleString()}`}
                                    max={maxInvoices}
                                    color={
                                        r.count > avgInvoices * 1.3
                                            ? "red"
                                            : r.count < avgInvoices * 0.7
                                              ? "yellow"
                                              : "green"
                                    }
                                />
                            ))
                        ) : (
                            <p className="text-slate-400 text-sm">
                                No workload data available.
                            </p>
                        )}
                        <p className="text-xs text-slate-400 mt-2">
                            Red = overloaded · Yellow = underutilized · Green =
                            balanced
                        </p>
                    </div>

                    {/* Lead Distribution */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <UserCheck size={16} className="text-purple-500" />{" "}
                            Lead Distribution & Win Rate
                        </h3>
                        {leadDist?.length ? (
                            leadDist.map((r, i) => (
                                <div key={i} className="mb-4">
                                    <HBar
                                        label={r.rep}
                                        value={r.leads}
                                        sub={`${r.leads} leads · ${r.leads > 0 ? Math.round((r.won / r.leads) * 100) : 0}% win rate`}
                                        max={maxLeads}
                                        color="purple"
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-sm">
                                No lead distribution data.
                            </p>
                        )}
                    </div>
                </div>

                {/* Lead Volume Trend */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-green-500" /> Lead
                        Volume Trend (Capacity Planning)
                    </h3>
                    {leadVolume?.length ? (
                        <div
                            className="flex items-end gap-2"
                            style={{ height: 120 }}
                        >
                            {leadVolume.map((r, i) => (
                                <div
                                    key={i}
                                    className="flex-1 flex flex-col items-center gap-1"
                                >
                                    <div
                                        className="w-full bg-green-400 rounded-sm"
                                        style={{
                                            height: `${maxVolume > 0 ? (r.count / maxVolume) * 100 : 0}%`,
                                        }}
                                        title={`${r.month}: ${r.count}`}
                                    />
                                    <span className="text-[9px] text-slate-400 text-center">
                                        {r.month}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm">
                            No trend data available.
                        </p>
                    )}
                </div>

                {/* Territory Balancing Tip */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-blue-800 mb-1">
                        💡 Territory Balancing Recommendation
                    </h4>
                    <p className="text-sm text-blue-700">
                        Any rep with {">"}30% above average workload should have
                        leads auto-redistributed. Use automated lead
                        distribution rules in CRM to maintain balanced capacity.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

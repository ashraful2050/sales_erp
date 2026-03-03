import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft } from "lucide-react";

export default function Show({ period }) {
    const totalGross = period.records?.reduce((s, r) => s + Number(r.gross_salary ?? 0), 0) ?? 0;
    const totalDeductions = period.records?.reduce((s, r) => s + Number(r.total_deduction ?? 0), 0) ?? 0;
    const totalNet = period.records?.reduce((s, r) => s + Number(r.net_salary ?? 0), 0) ?? 0;

    return (
        <AppLayout>
            <Head title={`Payroll: ${period.period_start} - ${period.period_end}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={`Payroll Period`}
                    subtitle={`${period.period_start} → ${period.period_end}`}
                    actions={
                        <Link href={route("hr.payroll.index")} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                            <ArrowLeft className="w-4 h-4" /> {t("Back")}
                        </Link>
                    }
                />

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Employees", value: period.records?.length ?? 0, color: "bg-blue-50 text-blue-700", currency: false },
                        { label: "Total Gross", value: totalGross.toLocaleString(), color: "bg-indigo-50 text-indigo-700", currency: true },
                        { label: "Total Deductions", value: totalDeductions.toLocaleString(), color: "bg-red-50 text-red-700", currency: true },
                        { label: "Total Net Pay", value: totalNet.toLocaleString(), color: "bg-green-50 text-green-700", currency: true },
                    ].map((s) => (
                        <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
                            <p className="text-xs font-medium uppercase tracking-wide opacity-70">{s.label}</p>
                            <p className="text-2xl font-bold mt-1">{s.currency ? `৳${s.value}` : s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Status:</span>
                    <Badge color={period.status === "paid" ? "green" : period.status === "draft" ? "yellow" : "blue"}>{period.status}</Badge>
                </div>

                {/* Payroll Records */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">Employee Payroll Records</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {["Employee", "Department", "Gross", "Allowances", "Deductions", "Net Pay", "Status"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {period.records?.length ? period.records.map((rec) => (
                                    <tr key={rec.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <Link href={route("hr.employees.show", rec.employee_id)} className="text-indigo-600 hover:underline font-medium">
                                                {rec.employee?.name ?? "—"}
                                            </Link>
                                            <p className="text-xs text-gray-400">{rec.employee?.employee_id}</p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{rec.employee?.department?.name ?? "—"}</td>
                                        <td className="px-4 py-3">৳{Number(rec.gross_salary ?? 0).toLocaleString()}</td>
                                        <td className="px-4 py-3">৳{Number(rec.total_allowance ?? 0).toLocaleString()}</td>
                                        <td className="px-4 py-3">৳{Number(rec.total_deduction ?? 0).toLocaleString()}</td>
                                        <td className="px-4 py-3 font-medium">৳{Number(rec.net_salary ?? 0).toLocaleString()}</td>
                                        <td className="px-4 py-3"><Badge color={rec.status === "paid" ? "green" : "yellow"}>{rec.status}</Badge></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No payroll records</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

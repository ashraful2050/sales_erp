import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { fmtDate } from "@/utils/date";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

export default function PayrollIndex({ periods }) {
    const { t } = useTranslation();
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(
                "Delete this payroll period? This cannot be undone.",
                {
                    title: t("Delete Payroll Period"),
                    confirmLabel: t("Delete"),
                    intent: "danger",
                },
            )
        )
            router.delete(route("hr.payroll.destroy", id));
    };
    const STATUS_COLOR = {
        draft: "slate",
        processed: "amber",
        approved: "green",
        paid: "cyan",
        cancelled: "red",
    };

    return (
        <AppLayout title={t("Payroll")}>
            <Head title={t("Payroll")} />
            <PageHeader
                title={t("Payroll")}
                subtitle={t("Manage payroll periods")}
                actions={
                    <Link
                        href={route("hr.payroll.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("New Payroll Period")}
                    </Link>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Period")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Start Date")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("End Date")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Payment Date")}
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Employees")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Total Net")}
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Status")}
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {periods.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        {t("No payroll periods found.")}
                                    </td>
                                </tr>
                            )}
                            {periods.data.map((p) => (
                                <tr
                                    key={p.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {p.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {fmtDate(p.start_date)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {fmtDate(p.end_date)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {fmtDate(p.payment_date)}
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-700">
                                        {p.records_count ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-medium text-slate-800">
                                        ৳
                                        {Number(
                                            p.total_net_salary ?? 0,
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                STATUS_COLOR[p.status] ??
                                                "slate"
                                            }
                                        >
                                            {p.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "hr.payroll.show",
                                                    p.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Eye size={15} />
                                            </Link>
                                            <button
                                                onClick={() => del(p.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination links={periods.links} />
            </div>
        </AppLayout>
    );
}

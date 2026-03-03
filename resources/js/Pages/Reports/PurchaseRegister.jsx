import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { useState } from "react";
import { fmtDate } from "@/utils/date";
import { useTranslation } from "@/hooks/useTranslation";

const statusColor = {
    draft: "gray",
    sent: "amber",
    approved: "green",
    received: "green",
    cancelled: "red",
};
const fmt = (v) =>
    Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function PurchaseRegister({ orders, filters, totals }) {
    const { t } = useTranslation();
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? "");
    const [dateTo, setDateTo] = useState(filters?.date_to ?? "");
    const [status, setStatus] = useState(filters?.status ?? "");

    const apply = () =>
        router.get(
            route("reports.purchase-register"),
            { date_from: dateFrom, date_to: dateTo, status },
            { preserveState: true },
        );

    return (
        <AppLayout title={t("Purchase Register")}>
            <Head title={t("Purchase Register")} />
            <PageHeader
                title={t("Purchase Register")}
                subtitle={t("All purchase orders for the selected period")}
            />
            <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            {t("From Date")}
                        </label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            {t("To Date")}
                        </label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            {t("Status")}
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">{t("All")}</option>
                            <option value="draft">{t("Draft")}</option>
                            <option value="sent">{t("Sent")}</option>
                            <option value="approved">{t("Approved")}</option>
                            <option value="received">{t("Received")}</option>
                            <option value="cancelled">{t("Cancelled")}</option>
                        </select>
                    </div>
                    <button
                        onClick={apply}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                    >
                        {t("Apply")}
                    </button>
                </div>

                {totals && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                            <p className="text-xs text-slate-500 uppercase font-semibold">
                                {t("Total Orders")}
                            </p>
                            <p className="text-2xl font-bold text-slate-700">
                                {totals.count}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                            <p className="text-xs text-slate-500 uppercase font-semibold">
                                {t("Total Purchase")}
                            </p>
                            <p className="text-xl font-bold text-blue-600">
                                {fmt(totals.total_amount)}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                            <p className="text-xs text-slate-500 uppercase font-semibold">
                                {t("Total Paid")}
                            </p>
                            <p className="text-xl font-bold text-green-600">
                                {fmt(totals.paid_amount)}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                            <p className="text-xs text-slate-500 uppercase font-semibold">
                                {t("Total Due")}
                            </p>
                            <p className="text-xl font-bold text-red-500">
                                {fmt(totals.due_amount)}
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("PO Number")}
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Date")}
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Vendor")}
                                    </th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Subtotal")}
                                    </th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Tax")}
                                    </th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Total")}
                                    </th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Paid")}
                                    </th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Due")}
                                    </th>
                                    <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Status")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-6 py-12 text-center text-slate-400"
                                        >
                                            No orders found for the selected
                                            period.
                                        </td>
                                    </tr>
                                )}
                                {orders.map((po) => (
                                    <tr
                                        key={po.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-3 font-medium text-blue-600">
                                            {po.po_number}
                                        </td>
                                        <td className="px-6 py-3 text-slate-600">
                                            {fmtDate(po.po_date)}
                                        </td>
                                        <td className="px-6 py-3 text-slate-700">
                                            {po.vendor?.name ?? "—"}
                                        </td>
                                        <td className="px-6 py-3 text-right text-slate-600">
                                            {fmt(po.subtotal)}
                                        </td>
                                        <td className="px-6 py-3 text-right text-amber-600">
                                            {fmt(po.tax_amount)}
                                        </td>
                                        <td className="px-6 py-3 text-right font-medium">
                                            {fmt(po.total_amount)}
                                        </td>
                                        <td className="px-6 py-3 text-right text-green-600">
                                            {fmt(po.paid_amount)}
                                        </td>
                                        <td className="px-6 py-3 text-right text-red-500">
                                            {fmt(
                                                parseFloat(po.total_amount) -
                                                    parseFloat(
                                                        po.paid_amount ?? 0,
                                                    ),
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <Badge
                                                color={
                                                    statusColor[po.status] ??
                                                    "gray"
                                                }
                                            >
                                                {po.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            {orders.length > 0 && totals && (
                                <tfoot className="bg-slate-100 border-t-2 border-slate-300">
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-6 py-3 text-right font-bold text-slate-700"
                                        >
                                            Totals ({totals.count}):
                                        </td>
                                        <td className="px-6 py-3 text-right font-bold text-slate-700">
                                            {fmt(totals.subtotal)}
                                        </td>
                                        <td className="px-6 py-3 text-right font-bold text-amber-600">
                                            {fmt(totals.tax_amount)}
                                        </td>
                                        <td className="px-6 py-3 text-right font-bold text-slate-800">
                                            {fmt(totals.total_amount)}
                                        </td>
                                        <td className="px-6 py-3 text-right font-bold text-green-700">
                                            {fmt(totals.paid_amount)}
                                        </td>
                                        <td className="px-6 py-3 text-right font-bold text-red-600">
                                            {fmt(totals.due_amount)}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

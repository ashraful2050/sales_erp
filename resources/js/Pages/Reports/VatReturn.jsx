import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import { Download } from "lucide-react";
import { fmtDate } from "@/utils/date";

export default function VatReturn({ report, filters }) {
    const [fromDate, setFromDate] = useState(filters?.from_date ?? "");
    const [toDate, setToDate] = useState(filters?.to_date ?? "");
    const run = () =>
        router.get(
            route("reports.vat-return"),
            { from_date: fromDate, to_date: toDate },
            { preserveState: true, replace: true },
        );

    const outputVat = Number(report?.output_vat ?? 0);
    const inputVat = Number(report?.input_vat ?? 0);
    const netVat = outputVat - inputVat;

    return (
        <AppLayout title="VAT Return">
            <Head title="VAT Return" />
            <PageHeader
                title="VAT Return"
                subtitle="Output VAT collected vs Input VAT paid"
                actions={
                    <button className="flex items-center gap-2 text-slate-600 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium">
                        <Download size={16} /> Export
                    </button>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                        From Date
                    </label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                        To Date
                    </label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                </div>
                <button
                    onClick={run}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                    Generate
                </button>
            </div>

            {report && (
                <div className="space-y-4 max-w-2xl">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                            <p className="text-xs text-green-600 font-medium uppercase mb-1">
                                Output VAT (Sales)
                            </p>
                            <p className="text-2xl font-bold text-green-700 font-mono">
                                ৳
                                {outputVat.toLocaleString("en-BD", {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                            <p className="text-xs text-red-600 font-medium uppercase mb-1">
                                Input VAT (Purchases)
                            </p>
                            <p className="text-2xl font-bold text-red-700 font-mono">
                                ৳
                                {inputVat.toLocaleString("en-BD", {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                        <div
                            className={`${netVat >= 0 ? "bg-amber-50 border-amber-100" : "bg-blue-50 border-blue-100"} border rounded-xl p-4 text-center`}
                        >
                            <p
                                className={`text-xs font-medium uppercase mb-1 ${netVat >= 0 ? "text-amber-600" : "text-blue-600"}`}
                            >
                                {netVat >= 0
                                    ? "Net VAT Payable"
                                    : "VAT Refundable"}
                            </p>
                            <p
                                className={`text-2xl font-bold font-mono ${netVat >= 0 ? "text-amber-700" : "text-blue-700"}`}
                            >
                                ৳
                                {Math.abs(netVat).toLocaleString("en-BD", {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Output VAT Detail */}
                    {report.output_details?.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-3 bg-green-50 border-b border-green-100 text-xs font-semibold text-green-700 uppercase">
                                Output VAT — Sales Transactions
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="text-left px-6 py-2 text-xs font-medium text-slate-500">
                                            Invoice
                                        </th>
                                        <th className="text-left px-6 py-2 text-xs font-medium text-slate-500">
                                            Customer
                                        </th>
                                        <th className="text-left px-6 py-2 text-xs font-medium text-slate-500">
                                            Date
                                        </th>
                                        <th className="text-right px-6 py-2 text-xs font-medium text-slate-500">
                                            Taxable
                                        </th>
                                        <th className="text-right px-6 py-2 text-xs font-medium text-slate-500">
                                            VAT
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {report.output_details.map((r, i) => (
                                        <tr
                                            key={i}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-2 font-mono text-xs text-slate-500">
                                                {r.number}
                                            </td>
                                            <td className="px-6 py-2 text-slate-700">
                                                {r.party}
                                            </td>
                                            <td className="px-6 py-2 text-slate-500">
                                                {fmtDate(r.date)}
                                            </td>
                                            <td className="px-6 py-2 text-right font-mono">
                                                ৳{Number(r.taxable).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-2 text-right font-mono text-green-700">
                                                ৳{Number(r.vat).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Input VAT Detail */}
                    {report.input_details?.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-3 bg-red-50 border-b border-red-100 text-xs font-semibold text-red-700 uppercase">
                                Input VAT — Purchase Transactions
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="text-left px-6 py-2 text-xs font-medium text-slate-500">
                                            PO / Bill
                                        </th>
                                        <th className="text-left px-6 py-2 text-xs font-medium text-slate-500">
                                            Vendor
                                        </th>
                                        <th className="text-left px-6 py-2 text-xs font-medium text-slate-500">
                                            Date
                                        </th>
                                        <th className="text-right px-6 py-2 text-xs font-medium text-slate-500">
                                            Taxable
                                        </th>
                                        <th className="text-right px-6 py-2 text-xs font-medium text-slate-500">
                                            VAT
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {report.input_details.map((r, i) => (
                                        <tr
                                            key={i}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-2 font-mono text-xs text-slate-500">
                                                {r.number}
                                            </td>
                                            <td className="px-6 py-2 text-slate-700">
                                                {r.party}
                                            </td>
                                            <td className="px-6 py-2 text-slate-500">
                                                {fmtDate(r.date)}
                                            </td>
                                            <td className="px-6 py-2 text-right font-mono">
                                                ৳{Number(r.taxable).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-2 text-right font-mono text-red-700">
                                                ৳{Number(r.vat).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </AppLayout>
    );
}

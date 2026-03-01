import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Pencil } from "lucide-react";
import { fmtDate } from "@/utils/date";

const statusColor = {
    draft: "gray",
    submitted: "amber",
    approved: "green",
    cancelled: "red",
};
const fmt = (v) =>
    Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function DebitNoteShow({ debitNote }) {
    return (
        <AppLayout title={`Debit Note ${debitNote.po_number}`}>
            <Head title={`Debit Note ${debitNote.po_number}`} />
            <PageHeader
                title={`Debit Note: ${debitNote.po_number}`}
                subtitle={`Date: ${fmtDate(debitNote.po_date)}`}
                actions={
                    <div className="flex gap-2">
                        <Link
                            href={route("purchase.debit-notes.index")}
                            className="flex items-center gap-2 text-slate-600 text-sm font-medium"
                        >
                            <ArrowLeft size={16} /> Back
                        </Link>
                        <Link
                            href={route(
                                "purchase.debit-notes.edit",
                                debitNote.id,
                            )}
                            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            <Pencil size={16} /> Edit
                        </Link>
                    </div>
                }
            />
            <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-slate-500">Vendor:</span>{" "}
                            <span className="font-medium text-slate-800 ml-2">
                                {debitNote.vendor?.name ?? "—"}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-500">Status:</span>{" "}
                            <span className="ml-2">
                                <Badge
                                    color={
                                        statusColor[debitNote.status] ?? "gray"
                                    }
                                >
                                    {debitNote.status}
                                </Badge>
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-500">Date:</span>{" "}
                            <span className="font-medium text-slate-800 ml-2">
                                {fmtDate(debitNote.po_date)}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-500">Reference:</span>{" "}
                            <span className="font-medium text-slate-800 ml-2">
                                {debitNote.reference ?? "—"}
                            </span>
                        </div>
                    </div>
                    {debitNote.notes && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-sm text-slate-600">
                                <span className="font-medium">Notes:</span>{" "}
                                {debitNote.notes}
                            </p>
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h3 className="font-semibold text-slate-700">
                            Return Items
                        </h3>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    Description
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    Qty
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    Cost Price
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    Tax
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {debitNote.items?.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-medium text-slate-800">
                                        {item.description}
                                    </td>
                                    <td className="px-6 py-3 text-right text-slate-600">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-3 text-right text-slate-600">
                                        {fmt(item.unit_price)}
                                    </td>
                                    <td className="px-6 py-3 text-right text-amber-600">
                                        {fmt(item.tax_amount)}
                                    </td>
                                    <td className="px-6 py-3 text-right font-medium text-slate-800">
                                        {fmt(item.total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-6 py-2 text-right font-medium text-slate-600"
                                >
                                    Tax Total:
                                </td>
                                <td className="px-6 py-2 text-right font-medium text-amber-600">
                                    {fmt(debitNote.tax_amount)}
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-6 py-3 text-right font-semibold text-slate-700"
                                >
                                    Grand Total:
                                </td>
                                <td className="px-6 py-3 text-right font-bold text-slate-800">
                                    {fmt(debitNote.total_amount)} BDT
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

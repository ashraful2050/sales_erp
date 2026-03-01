import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Pencil } from "lucide-react";
import { fmtDate } from "@/utils/date";

const fmt = (v) =>
    Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function CreditNoteShow({ note }) {
    return (
        <AppLayout title={`Credit Note ${note.invoice_number}`}>
            <Head title={`Credit Note ${note.invoice_number}`} />
            <PageHeader
                title={`Credit Note: ${note.invoice_number}`}
                subtitle={`Date: ${fmtDate(note.invoice_date)}`}
                actions={
                    <div className="flex gap-2">
                        <Link
                            href={route("sales.credit-notes.index")}
                            className="flex items-center gap-2 text-slate-600 text-sm font-medium"
                        >
                            <ArrowLeft size={16} /> Back
                        </Link>
                        <Link
                            href={route("sales.credit-notes.edit", note.id)}
                            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            <Pencil size={16} /> Edit
                        </Link>
                    </div>
                }
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">
                                    Customer:
                                </span>{" "}
                                <span className="font-medium text-slate-800 ml-2">
                                    {note.customer?.name}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500">Date:</span>{" "}
                                <span className="font-medium text-slate-800 ml-2">
                                    {fmtDate(note.invoice_date)}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500">Status:</span>{" "}
                                <span className="ml-2">
                                    <Badge color="slate">{note.status}</Badge>
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500">Total:</span>{" "}
                                <span className="font-bold text-slate-800 ml-2">
                                    {fmt(note.total_amount)} BDT
                                </span>
                            </div>
                        </div>
                        {note.notes && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <p className="text-sm text-slate-600">
                                    <span className="font-medium">Notes:</span>{" "}
                                    {note.notes}
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
                                        Unit Price
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
                                {note.items?.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-3">
                                            <div className="font-medium text-slate-800">
                                                {item.description}
                                            </div>
                                            {item.product && (
                                                <div className="text-xs text-slate-400">
                                                    {item.product.name}
                                                </div>
                                            )}
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
                                        colSpan={4}
                                        className="px-6 py-2 text-right font-medium text-slate-600"
                                    >
                                        Tax Total:
                                    </td>
                                    <td className="px-6 py-2 text-right font-medium text-amber-600">
                                        {fmt(note.tax_amount)}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-3 text-right font-semibold text-slate-700"
                                    >
                                        Grand Total:
                                    </td>
                                    <td className="px-6 py-3 text-right font-bold text-slate-800">
                                        {fmt(note.total_amount)} BDT
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

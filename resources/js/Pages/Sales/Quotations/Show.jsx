import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Pencil, FileText } from "lucide-react";
import { fmtDate } from "@/utils/date";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

const fmt = (v) =>
    Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function QuotationShow({ quote }) {
    const { t } = useTranslation();
    const { confirm: dlgConfirm } = useDialog();
    const convert = async () => {
        if (
            await dlgConfirm(
                "A new sales invoice will be created from this quotation.",
                {
                    title: t("Convert to Invoice?"),
                    confirmLabel: t("Convert"),
                    intent: "info",
                },
            )
        )
            router.post(route("sales.quotations.convert", quote.id));
    };

    return (
        <AppLayout title={`Quotation ${quote.invoice_number}`}>
            <Head title={`Quotation ${quote.invoice_number}`} />
            <PageHeader
                title={`Quotation: ${quote.invoice_number}`}
                subtitle={`Date: ${fmtDate(quote.invoice_date)}`}
                actions={
                    <div className="flex gap-2">
                        <Link
                            href={route("sales.quotations.index")}
                            className="flex items-center gap-2 text-slate-600 text-sm font-medium"
                        >
                            <ArrowLeft size={16} /> {t("Back")}
                        </Link>
                        <Link
                            href={route("sales.quotations.edit", quote.id)}
                            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            <Pencil size={16} /> {t("Edit")}
                        </Link>
                        <button
                            onClick={convert}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            <FileText size={16} /> {t("Convert to Invoice")}
                        </button>
                    </div>
                }
            />
            <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-slate-500">Customer:</span>{" "}
                            <span className="font-medium text-slate-800 ml-2">
                                {quote.customer?.name}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-500">Type:</span>{" "}
                            <span className="ml-2">
                                <Badge color="blue">
                                    {quote.type === "proforma"
                                        ? "Proforma"
                                        : "Quotation"}
                                </Badge>
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-500">Date:</span>{" "}
                            <span className="font-medium text-slate-800 ml-2">
                                {fmtDate(quote.invoice_date)}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-500">Valid Until:</span>{" "}
                            <span className="font-medium text-slate-800 ml-2">
                                {fmtDate(quote.due_date)}
                            </span>
                        </div>
                    </div>
                    {quote.notes && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-sm text-slate-600">
                                <span className="font-medium">Notes:</span>{" "}
                                {quote.notes}
                            </p>
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h3 className="font-semibold text-slate-700">Items</h3>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    {t("Description")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    {t("Qty")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    {t("Unit Price")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    {t("Tax")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                    {t("Total")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {quote.items?.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3">
                                        <div className="font-medium text-slate-800">
                                            {item.description}
                                        </div>
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
                                    Subtotal:
                                </td>
                                <td className="px-6 py-2 text-right font-medium text-amber-600">
                                    {fmt(quote.tax_amount)}
                                </td>
                                <td className="px-6 py-2 text-right font-medium">
                                    {fmt(quote.subtotal)}
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
                                    {fmt(quote.total_amount)} BDT
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

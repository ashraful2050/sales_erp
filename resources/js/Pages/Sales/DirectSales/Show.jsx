import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { ArrowLeft, Printer, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const fmt = (n) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(n ?? 0);
const fmtDate = (d) =>
    d
        ? new Date(d).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "—";

export default function DirectSaleShow({ sale, company }) {
    const { t } = useTranslation();
    const confirmDelete = () => {
        if (confirm("Delete this direct sale permanently?")) {
            router.delete(route("sales.direct-sales.destroy", sale.id));
        }
    };

    return (
        <AppLayout title={`Direct Sale — ${sale.invoice_number}`}>
            <Head title={`Direct Sale ${sale.invoice_number}`} />
            <PageHeader
                title={sale.invoice_number}
                subtitle={t("Direct Sale Receipt")}
                actions={
                    <div className="flex gap-2">
                        <Link
                            href={route("sales.direct-sales.index")}
                            className="flex items-center gap-2 text-slate-600 text-sm font-medium"
                        >
                            <ArrowLeft size={16} /> {t("Back")}
                        </Link>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                            <Printer size={15} /> {t("Print")}
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                            <Trash2 size={15} /> {t("Delete")}
                        </button>
                    </div>
                }
            />

            <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-3xl">
                {/* Header */}
                <div className="flex justify-between mb-6">
                    <div>
                        <p className="text-2xl font-bold text-slate-800">
                            {company?.name}
                        </p>
                        <p className="text-slate-500 text-sm">
                            {company?.address}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-blue-700">
                            {sale.invoice_number}
                        </p>
                        <p className="text-slate-500 text-sm">
                            Date: {fmtDate(sale.invoice_date)}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                            {t("PAID")}
                        </span>
                    </div>
                </div>

                {/* Customer */}
                <div className="mb-5 p-3 bg-slate-50 rounded-lg text-sm">
                    <span className="text-slate-500 mr-2">Customer:</span>
                    <span className="font-semibold text-slate-700">
                        {sale.customer?.name ?? "Walk-in Customer"}
                    </span>
                </div>

                {/* Items */}
                <table className="w-full text-sm mb-5">
                    <thead className="border-b-2 border-slate-200">
                        <tr>
                            <th className="text-left py-2 font-semibold text-slate-600">
                                {t("#")}
                            </th>
                            <th className="text-left py-2 font-semibold text-slate-600">
                                {t("Description")}
                            </th>
                            <th className="text-right py-2 font-semibold text-slate-600">
                                {t("Qty")}
                            </th>
                            <th className="text-right py-2 font-semibold text-slate-600">
                                {t("Unit Price")}
                            </th>
                            <th className="text-right py-2 font-semibold text-slate-600">
                                {t("Disc%")}
                            </th>
                            <th className="text-right py-2 font-semibold text-slate-600">
                                {t("Tax")}
                            </th>
                            <th className="text-right py-2 font-semibold text-slate-600">
                                {t("Total")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sale.items?.map((item, i) => (
                            <tr key={item.id}>
                                <td className="py-2 text-slate-400">{i + 1}</td>
                                <td className="py-2 text-slate-700">
                                    {item.description}
                                </td>
                                <td className="py-2 text-right">
                                    {item.quantity} {item.unit}
                                </td>
                                <td className="py-2 text-right">
                                    {fmt(item.unit_price)}
                                </td>
                                <td className="py-2 text-right">
                                    {item.discount_pct ?? 0}%
                                </td>
                                <td className="py-2 text-right">
                                    {fmt(item.tax_amount)}
                                </td>
                                <td className="py-2 text-right font-semibold">
                                    {fmt(item.total)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-64 space-y-2 text-sm">
                        <div className="flex justify-between text-slate-500">
                            <span>{t("Subtotal")}</span>
                            <span>{fmt(sale.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>{t("Tax")}</span>
                            <span>{fmt(sale.tax_amount)}</span>
                        </div>
                        {Number(sale.discount_amount) > 0 && (
                            <div className="flex justify-between text-red-600">
                                <span>{t("Discount")}</span>
                                <span>−{fmt(sale.discount_amount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-base border-t border-slate-200 pt-2">
                            <span>{t("Grand Total")}</span>
                            <span className="text-blue-700">
                                {sale.currency_code} {fmt(sale.total_amount)}
                            </span>
                        </div>
                        <div className="flex justify-between text-emerald-600 font-medium">
                            <span>{t("Amount Paid")}</span>
                            <span>{fmt(sale.paid_amount)}</span>
                        </div>
                    </div>
                </div>

                {sale.notes && (
                    <div className="mt-5 pt-4 border-t border-slate-100 text-sm text-slate-500">
                        <strong className="text-slate-600">Notes: </strong>
                        {sale.notes}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

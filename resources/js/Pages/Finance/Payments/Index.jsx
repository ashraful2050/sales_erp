import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import {
    Plus,
    Eye,
    Pencil,
    Trash2,
    ArrowDownLeft,
    ArrowUpRight,
} from "lucide-react";
import ExportButtons from "@/Components/ExportButtons";
import { fmtDate } from "@/utils/date";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

const METHOD_LABEL = {
    cash: "Cash",
    bank: "Bank",
    bkash: "bKash",
    nagad: "Nagad",
    rocket: "Rocket",
    upay: "Upay",
    cheque: "Cheque",
    other: "Other",
};
const TYPE_COLOR = { received: "green", made: "red" };

export default function PaymentsIndex({ payments, filters }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters?.search ?? "");
    const [type, setType] = useState(filters?.type ?? "");
    const apply = (s, t) =>
        router.get(
            route("finance.payments.index"),
            { search: s, type: t },
            { preserveState: true, replace: true },
        );
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(t("This payment will be permanently removed."), {
                title: t("Delete Payment?"),
                confirmLabel: t("Delete"),
                intent: "danger",
            })
        )
            router.delete(route("finance.payments.destroy", id));
    };

    return (
        <AppLayout title={t("Payments")}>
            <Head title={t("Payments")} />
            <PageHeader
                title={t("Payments")}
                subtitle={`${payments.total} ${t("total payments")}`}
                actions={
                    <Link
                        href={route("finance.payments.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("Record Payment")}
                    </Link>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3">
                <SearchFilter
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        apply(v, type);
                    }}
                    placeholder={t("Search payment #…")}
                />
                <select
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        apply(search, e.target.value);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{t("All Types")}</option>
                    <option value="received">{t("Money Received")}</option>
                    <option value="made">{t("Money Paid")}</option>
                </select>
                <ExportButtons
                    tableId="export-table"
                    filename="payments"
                    title="Payments"
                />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" id="export-table">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Payment #")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Type")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Party")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Date")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Method")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Amount")}
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payments.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        {t("No payments found.")}
                                    </td>
                                </tr>
                            )}
                            {payments.data.map((p) => (
                                <tr
                                    key={p.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-mono font-medium text-blue-600">
                                        <Link
                                            href={route(
                                                "finance.payments.show",
                                                p.id,
                                            )}
                                            className="hover:underline"
                                        >
                                            {p.payment_number}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div
                                            className={`flex items-center gap-1 text-xs font-semibold ${p.type === "received" ? "text-emerald-600" : "text-red-600"}`}
                                        >
                                            {p.type === "received" ? (
                                                <ArrowDownLeft size={14} />
                                            ) : (
                                                <ArrowUpRight size={14} />
                                            )}
                                            {p.type === "received"
                                                ? "Received"
                                                : "Paid"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {p.customer?.name ??
                                            p.vendor?.name ??
                                            "—"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {fmtDate(p.payment_date)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {METHOD_LABEL[p.payment_method] ??
                                            p.payment_method}
                                    </td>
                                    <td
                                        className={`px-6 py-4 text-right font-mono font-medium ${p.type === "received" ? "text-emerald-700" : "text-red-700"}`}
                                    >
                                        ৳{Number(p.amount).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "finance.payments.show",
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
                <Pagination links={payments.links} />
            </div>
        </AppLayout>
    );
}

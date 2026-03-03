import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import { Plus, Eye, Pencil, Trash2, Mail, Phone } from "lucide-react";
import ExportButtons from "@/Components/ExportButtons";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

export default function VendorsIndex({ vendors, filters }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters?.search ?? "");
    const apply = (s) =>
        router.get(
            route("purchase.vendors.index"),
            { search: s },
            { preserveState: true, replace: true },
        );
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(t("This vendor will be permanently removed."), {
                title: t("Delete Vendor?"),
                confirmLabel: t("Delete"),
                intent: "danger",
            })
        )
            router.delete(route("purchase.vendors.destroy", id));
    };

    return (
        <AppLayout title={t("Vendors")}>
            <Head title={t("Vendors")} />
            <PageHeader
                title={t("Vendors")}
                subtitle={`${vendors.total} ${t("total vendors")}`}
                actions={
                    <Link
                        href={route("purchase.vendors.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("New Vendor")}
                    </Link>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex gap-3">
                <SearchFilter
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        apply(v);
                    }}
                    placeholder={t("Search name, email, phone…")}
                />
                <ExportButtons
                    tableId="export-table"
                    filename="vendors"
                    title="Vendors"
                />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" id="export-table">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Name")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Contact")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("TIN / BIN")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Credit Limit")}
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Status")}
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {vendors.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        {t("No vendors found.")}
                                    </td>
                                </tr>
                            )}
                            {vendors.data.map((v) => (
                                <tr
                                    key={v.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">
                                            {v.name}
                                        </div>
                                        {v.name_bn && (
                                            <div className="text-slate-400 text-xs">
                                                {v.name_bn}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {v.email && (
                                            <div className="flex items-center gap-1 text-slate-600">
                                                <Mail size={12} />
                                                {v.email}
                                            </div>
                                        )}
                                        {v.phone && (
                                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                                                <Phone size={12} />
                                                {v.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-xs">
                                        {v.tin_number && (
                                            <div>TIN: {v.tin_number}</div>
                                        )}
                                        {v.bin_number && (
                                            <div>BIN: {v.bin_number}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-700">
                                        {v.credit_limit
                                            ? `৳${Number(v.credit_limit).toLocaleString()}`
                                            : "—"}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                v.is_active ? "green" : "red"
                                            }
                                        >
                                            {v.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "purchase.vendors.show",
                                                    v.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Eye size={15} />
                                            </Link>
                                            <Link
                                                href={route(
                                                    "purchase.vendors.edit",
                                                    v.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                            >
                                                <Pencil size={15} />
                                            </Link>
                                            <button
                                                onClick={() => del(v.id)}
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
                <Pagination links={vendors.links} />
            </div>
        </AppLayout>
    );
}

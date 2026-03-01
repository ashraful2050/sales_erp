import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge, { statusColor } from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import { Plus, Eye, Pencil, Trash2, Mail, Phone } from "lucide-react";
import ExportButtons from "@/Components/ExportButtons";
import { useDialog } from "@/hooks/useDialog";

export default function CustomersIndex({ customers, filters }) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [status, setStatus] = useState(filters?.status ?? "");

    const applyFilters = (s, st) => {
        router.get(
            route("sales.customers.index"),
            { search: s, status: st },
            { preserveState: true, replace: true },
        );
    };

    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm("This customer and linked data will be removed.", {
                title: "Delete Customer?",
                confirmLabel: "Delete",
                intent: "danger",
            })
        )
            router.delete(route("sales.customers.destroy", id));
    };

    return (
        <AppLayout title="Customers">
            <Head title="Customers" />
            <PageHeader
                title="Customers"
                subtitle={`${customers.total} total customers`}
                actions={
                    <Link
                        href={route("sales.customers.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> New Customer
                    </Link>
                }
            />

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3">
                <SearchFilter
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        applyFilters(v, status);
                    }}
                    placeholder="Search name, email, phone…"
                />
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        applyFilters(search, e.target.value);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <ExportButtons
                    tableId="export-table"
                    filename="customers"
                    title="Customers"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" id="export-table">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    BIN
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Credit Limit
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {customers.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                            {customers.data.map((c) => (
                                <tr
                                    key={c.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">
                                            {c.name}
                                        </div>
                                        {c.name_bn && (
                                            <div className="text-slate-400 text-xs">
                                                {c.name_bn}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {c.email && (
                                            <div className="flex items-center gap-1 text-slate-600">
                                                <Mail size={12} />
                                                {c.email}
                                            </div>
                                        )}
                                        {c.phone && (
                                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                                                <Phone size={12} />
                                                {c.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {c.bin_number ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-700 font-mono">
                                        {c.credit_limit
                                            ? `৳${Number(c.credit_limit).toLocaleString()}`
                                            : "—"}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                c.is_active ? "green" : "red"
                                            }
                                        >
                                            {c.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "sales.customers.show",
                                                    c.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Eye size={15} />
                                            </Link>
                                            <Link
                                                href={route(
                                                    "sales.customers.edit",
                                                    c.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                            >
                                                <Pencil size={15} />
                                            </Link>
                                            <button
                                                onClick={() => del(c.id)}
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
                <Pagination links={customers.links} />
            </div>
        </AppLayout>
    );
}

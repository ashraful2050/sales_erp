import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import { Plus, Search, Eye, Trash2, ShoppingCart } from "lucide-react";

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

export default function DirectSalesIndex({ sales, filters }) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? "");
    const [dateTo, setDateTo] = useState(filters?.date_to ?? "");

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(
            route("sales.direct-sales.index"),
            { search, date_from: dateFrom, date_to: dateTo },
            { preserveState: true },
        );
    };

    const confirmDelete = (id) => {
        if (confirm("Delete this direct sale?")) {
            router.delete(route("sales.direct-sales.destroy", id));
        }
    };

    return (
        <AppLayout title="Direct Sales">
            <Head title="Direct Sales" />
            <PageHeader
                title="Direct Sales"
                subtitle="Cash / immediate sales — invoice + payment in one step"
                actions={
                    <Link
                        href={route("sales.direct-sales.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus size={16} /> New Direct Sale
                    </Link>
                }
            />

            {/* Filters */}
            <form onSubmit={applyFilters} className="flex flex-wrap gap-3 mb-5">
                <div className="relative">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search DS# or customer..."
                        className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-800 transition-colors"
                >
                    Filter
                </button>
            </form>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-slate-600">
                                Ref #
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-600">
                                Customer
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-600">
                                Date
                            </th>
                            <th className="text-right py-3 px-4 font-semibold text-slate-600">
                                Amount
                            </th>
                            <th className="text-center py-3 px-4 font-semibold text-slate-600">
                                Status
                            </th>
                            <th className="py-3 px-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sales.data?.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-12 text-center text-slate-400"
                                >
                                    <ShoppingCart
                                        size={32}
                                        className="mx-auto mb-2 opacity-30"
                                    />
                                    No direct sales yet.
                                </td>
                            </tr>
                        )}
                        {sales.data?.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50">
                                <td className="py-3 px-4 font-mono text-blue-700">
                                    {s.invoice_number}
                                </td>
                                <td className="py-3 px-4 text-slate-700">
                                    {s.customer?.name ?? (
                                        <span className="text-slate-400 italic">
                                            Walk-in
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-slate-500">
                                    {fmtDate(s.invoice_date)}
                                </td>
                                <td className="py-3 px-4 text-right font-semibold">
                                    {s.currency_code} {fmt(s.total_amount)}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                        Paid
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Link
                                            href={route(
                                                "sales.direct-sales.show",
                                                s.id,
                                            )}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                        >
                                            <Eye size={15} />
                                        </Link>
                                        <button
                                            onClick={() => confirmDelete(s.id)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {sales.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-sm text-slate-500">
                        <span>
                            Showing {sales.from}–{sales.to} of {sales.total}
                        </span>
                        <div className="flex gap-1">
                            {sales.links?.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() =>
                                        link.url &&
                                        router.get(
                                            link.url,
                                            {},
                                            { preserveState: true },
                                        )
                                    }
                                    disabled={!link.url}
                                    className={`px-3 py-1 rounded text-xs ${link.active ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200 disabled:opacity-40"}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

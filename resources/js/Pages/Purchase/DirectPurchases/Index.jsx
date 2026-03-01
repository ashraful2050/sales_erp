import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import { Plus, Search, Eye, Trash2, Truck } from "lucide-react";

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

export default function DirectPurchasesIndex({ purchases, filters }) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? "");
    const [dateTo, setDateTo] = useState(filters?.date_to ?? "");

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(
            route("purchase.direct-purchases.index"),
            { search, date_from: dateFrom, date_to: dateTo },
            { preserveState: true },
        );
    };

    const confirmDelete = (id) => {
        if (confirm("Delete this direct purchase?")) {
            router.delete(route("purchase.direct-purchases.destroy", id));
        }
    };

    return (
        <AppLayout title="Direct Purchases">
            <Head title="Direct Purchases" />
            <PageHeader
                title="Direct Purchases"
                subtitle="Cash / immediate purchases — bill + payment in one step"
                actions={
                    <Link
                        href={route("purchase.direct-purchases.create")}
                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus size={16} /> New Direct Purchase
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
                        placeholder="Search DP# or vendor..."
                        className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                                Vendor
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
                        {purchases.data?.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-12 text-center text-slate-400"
                                >
                                    <Truck
                                        size={32}
                                        className="mx-auto mb-2 opacity-30"
                                    />
                                    No direct purchases yet.
                                </td>
                            </tr>
                        )}
                        {purchases.data?.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50">
                                <td className="py-3 px-4 font-mono text-teal-700">
                                    {p.po_number}
                                </td>
                                <td className="py-3 px-4 text-slate-700">
                                    {p.vendor?.name ?? (
                                        <span className="text-slate-400 italic">
                                            Cash Purchase
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-slate-500">
                                    {fmtDate(p.po_date)}
                                </td>
                                <td className="py-3 px-4 text-right font-semibold">
                                    {p.currency_code} {fmt(p.total_amount)}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                                        Received & Paid
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Link
                                            href={route(
                                                "purchase.direct-purchases.show",
                                                p.id,
                                            )}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                        >
                                            <Eye size={15} />
                                        </Link>
                                        <button
                                            onClick={() => confirmDelete(p.id)}
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
                {purchases.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-sm text-slate-500">
                        <span>
                            Showing {purchases.from}–{purchases.to} of{" "}
                            {purchases.total}
                        </span>
                        <div className="flex gap-1">
                            {purchases.links?.map((link, i) => (
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
                                    className={`px-3 py-1 rounded text-xs ${link.active ? "bg-teal-600 text-white" : "bg-slate-100 hover:bg-slate-200 disabled:opacity-40"}`}
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

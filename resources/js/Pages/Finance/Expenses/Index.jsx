import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Search, Trash2, Edit, ArrowUpRight } from "lucide-react";
import ExportButtons from "@/Components/ExportButtons";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";

const statusColors = { approved: "green", draft: "gray", rejected: "red" };

export default function ExpensesIndex({ expenses, categories, filters }) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [categoryId, setCategoryId] = useState(filters.category_id ?? "");
    const [from, setFrom] = useState(filters.from ?? "");
    const [to, setTo] = useState(filters.to ?? "");

    const apply = () => router.get(route("finance.expenses.index"), { search, category_id: categoryId, from, to }, { preserveState: true });
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => { if (await dlgConfirm("This expense record will be permanently removed.", { title: "Delete Expense?", confirmLabel: "Delete", intent: "danger" })) router.delete(route("finance.expenses.destroy", id)); };

    return (
        <AppLayout title="Expenses">
            <Head title="Expenses" />
            <PageHeader
                title="Expenses"
                subtitle="Track all company expenditures"
                actions={
                    <div className="flex gap-2">
                        <Link href={route("finance.expense-categories.index")} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">Categories</Link>
                        <Link href={route("finance.expenses.create")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                            <Plus size={16} /> New Expense
                        </Link>
                    </div>
                }
            />

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2 flex-1 min-w-48">
                    <Search size={16} className="text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && apply()}
                        placeholder="Title or expense number…" className="flex-1 text-sm outline-none" />
                </div>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm" />
                <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm" />
                <button onClick={apply} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700">Filter</button>
                <ExportButtons tableId="export-table" filename="expenses" title="Expenses" />
            </div>

            {/* Table */}}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm" id="export-table">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {["Expense #", "Date", "Title", "Category", "Method", "Amount", "Status", ""].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {expenses.data?.length === 0 && (
                            <tr><td colSpan={8} className="text-center py-12 text-slate-400">No expenses found.</td></tr>
                        )}
                        {expenses.data?.map(e => (
                            <tr key={e.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-mono text-xs text-blue-600">{e.expense_number}</td>
                                <td className="px-4 py-3 text-slate-600">{e.expense_date}</td>
                                <td className="px-4 py-3 font-medium">{e.title}</td>
                                <td className="px-4 py-3 text-slate-500">{e.category?.name ?? "—"}</td>
                                <td className="px-4 py-3 capitalize text-slate-500">{e.payment_method}</td>
                                <td className="px-4 py-3 font-semibold font-mono">৳{Number(e.amount).toLocaleString()}</td>
                                <td className="px-4 py-3"><Badge color={statusColors[e.status] ?? "gray"}>{e.status}</Badge></td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Link href={route("finance.expenses.edit", e.id)} className="text-slate-400 hover:text-blue-600"><Edit size={15} /></Link>
                                        <button onClick={() => del(e.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={15} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination */}
                {expenses.links && expenses.links.length > 3 && (
                    <div className="px-4 py-3 border-t border-slate-200 flex gap-1">
                        {expenses.links.map((l, i) => (
                            <Link key={i} href={l.url ?? "#"} preserveScroll
                                className={`px-3 py-1 rounded text-sm ${l.active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"} ${!l.url ? "opacity-40 pointer-events-none" : ""}`}
                                dangerouslySetInnerHTML={{ __html: l.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

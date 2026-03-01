import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import { Plus, CheckCircle, DollarSign } from "lucide-react";
import { useState } from "react";

const statusColors = { pending: "yellow", approved: "blue", paid: "green" };

export default function CommissionsIndex({ structures, records, stats }) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        name: "",
        type: "percentage",
        rate: "",
        applies_to: "all",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("sales.commissions.structures.store"), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const fmt = (v) =>
        `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    return (
        <AppLayout title="Sales Commissions">
            <Head title="Sales Commissions" />
            <PageHeader
                title="Sales Commissions"
                subtitle="Track and manage sales rep commissions"
                actions={
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        <Plus size={15} /> New Structure
                    </button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    ["Pending", stats.total_pending, "yellow"],
                    ["Approved", stats.total_approved, "blue"],
                    ["Paid", stats.total_paid, "green"],
                ].map(([l, v, c]) => (
                    <div
                        key={l}
                        className="bg-white rounded-xl border border-slate-200 p-4"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <DollarSign size={16} className={`text-${c}-500`} />
                            <span className="text-sm text-slate-500">{l}</span>
                        </div>
                        <div className={`text-2xl font-bold text-${c}-600`}>
                            {fmt(v)}
                        </div>
                    </div>
                ))}
            </div>

            {/* New Structure Form */}
            {showForm && (
                <form
                    onSubmit={submit}
                    className="bg-white rounded-xl border border-slate-200 p-5 mb-6 max-w-lg"
                >
                    <h3 className="font-semibold text-slate-700 mb-3">
                        New Commission Structure
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            ["name", "Name *", "text"],
                            ["type", "Type", "select"],
                            ["rate", "Rate *", "number"],
                            ["applies_to", "Applies To", "select"],
                        ].map(([key, lbl, type]) => (
                            <div key={key}>
                                <label className="text-xs text-slate-600">
                                    {lbl}
                                </label>
                                {type === "select" ? (
                                    <select
                                        value={data[key]}
                                        onChange={(e) =>
                                            setData(key, e.target.value)
                                        }
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                                    >
                                        {key === "type"
                                            ? [
                                                  "percentage",
                                                  "fixed",
                                                  "tiered",
                                              ].map((o) => (
                                                  <option key={o} value={o}>
                                                      {o
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                          o.slice(1)}
                                                  </option>
                                              ))
                                            : [
                                                  "all",
                                                  "product",
                                                  "category",
                                                  "customer",
                                              ].map((o) => (
                                                  <option key={o} value={o}>
                                                      {o
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                          o.slice(1)}
                                                  </option>
                                              ))}
                                    </select>
                                ) : (
                                    <input
                                        type={type}
                                        step="any"
                                        value={data[key]}
                                        onChange={(e) =>
                                            setData(key, e.target.value)
                                        }
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3 mt-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="text-slate-500 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Commission Records */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-700">
                        Commission Records
                    </h3>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            {[
                                "Sales Rep",
                                "Structure",
                                "Sale Amount",
                                "Commission",
                                "Period",
                                "Status",
                                "Actions",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-4 py-2 text-left text-xs text-slate-500 uppercase"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {records.data?.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-8 text-center text-slate-400"
                                >
                                    No commission records.
                                </td>
                            </tr>
                        ) : (
                            records.data?.map((r) => (
                                <tr key={r.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-2 font-medium">
                                        {r.user?.name}
                                    </td>
                                    <td className="px-4 py-2 text-slate-500">
                                        {r.structure?.name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {fmt(r.sale_amount)}
                                    </td>
                                    <td className="px-4 py-2 font-semibold text-green-600">
                                        {fmt(r.commission_amount)}
                                    </td>
                                    <td className="px-4 py-2 text-slate-500">
                                        {r.period_date}
                                    </td>
                                    <td className="px-4 py-2">
                                        <Badge
                                            color={statusColors[r.status]}
                                            label={r.status}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        {r.status === "pending" && (
                                            <button
                                                onClick={() =>
                                                    router.post(
                                                        route(
                                                            "sales.commissions.records.approve",
                                                            r.id,
                                                        ),
                                                    )
                                                }
                                                className="p-1 text-slate-400 hover:text-green-600"
                                                title="Approve"
                                            >
                                                <CheckCircle size={14} />
                                            </button>
                                        )}
                                        {r.status === "approved" && (
                                            <button
                                                onClick={() =>
                                                    router.post(
                                                        route(
                                                            "sales.commissions.records.paid",
                                                            r.id,
                                                        ),
                                                    )
                                                }
                                                className="p-1 text-slate-400 hover:text-blue-600 text-xs"
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="p-4 border-t border-slate-200">
                    <Pagination links={records.links} meta={records} />
                </div>
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import { Plus, Eye, Pencil, Trash2, Check, X } from "lucide-react";
import { fmtDate } from "@/utils/date";
import { useDialog } from "@/hooks/useDialog";

const STATUS_COLOR = {
    pending: "amber",
    approved: "green",
    rejected: "red",
    cancelled: "slate",
};

export default function LeavesIndex({ leaves, filters, leaveTypes }) {
    const { confirm: dlgConfirm } = useDialog();
    const [status, setStatus] = useState(filters?.status ?? "");
    const apply = (st) =>
        router.get(
            route("hr.leaves.index"),
            { status: st },
            { preserveState: true, replace: true },
        );

    const approve = (id) =>
        router.put(
            route("hr.leaves.update", id),
            { action: "approve" },
            { preserveAll: true },
        );
    const reject = (id) =>
        router.put(
            route("hr.leaves.update", id),
            { action: "reject" },
            { preserveAll: true },
        );
    const del = async (id) => {
        if (
            await dlgConfirm(
                "Delete this leave request? This cannot be undone.",
                {
                    title: "Delete Leave Request",
                    confirmLabel: "Delete",
                    intent: "danger",
                },
            )
        )
            router.delete(route("hr.leaves.destroy", id));
    };

    return (
        <AppLayout title="Leave Requests">
            <Head title="Leave Requests" />
            <PageHeader
                title="Leave Requests"
                subtitle={`${leaves.total} total requests`}
                actions={
                    <Link
                        href={route("hr.leaves.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> New Leave Request
                    </Link>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3">
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        apply(e.target.value);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Employee
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Leave Type
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    From
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    To
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Days
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leaves.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        No leave requests found.
                                    </td>
                                </tr>
                            )}
                            {leaves.data.map((l) => (
                                <tr
                                    key={l.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {l.employee?.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {l.leave_type?.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {fmtDate(l.start_date)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {fmtDate(l.end_date)}
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium text-slate-700">
                                        {l.days}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                STATUS_COLOR[l.status] ??
                                                "slate"
                                            }
                                        >
                                            {l.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            {l.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            approve(l.id)
                                                        }
                                                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                                                        title="Approve"
                                                    >
                                                        <Check size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            reject(l.id)
                                                        }
                                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                        title="Reject"
                                                    >
                                                        <X size={15} />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => del(l.id)}
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
                <Pagination links={leaves.links} />
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Edit, Calendar } from "lucide-react";
import { fmtDate } from "@/utils/date";

export default function Show({ leave }) {
    const statusColors = {
        pending: "yellow",
        approved: "green",
        rejected: "red",
        cancelled: "gray",
    };

    const start = new Date(leave.start_date);
    const end = new Date(leave.end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return (
        <AppLayout>
            <Head title={`Leave Request #${leave.id}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={`Leave Request #${leave.id}`}
                    subtitle={`Employee: ${leave.employee?.name ?? "—"}`}
                    actions={
                        <div className="flex gap-2">
                            <Link
                                href={route("hr.leaves.index")}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> {t("Back")}
                            </Link>
                            {leave.status === "pending" && (
                                <Link
                                    href={route("hr.leaves.edit", leave.id)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                                >
                                    <Edit className="w-4 h-4" /> {t("Edit")}
                                </Link>
                            )}
                        </div>
                    }
                />

                {/* Status Banner */}
                <div
                    className={`rounded-xl px-5 py-3 flex items-center gap-3 ${
                        leave.status === "approved"
                            ? "bg-green-50 text-green-700"
                            : leave.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-yellow-50 text-yellow-700"
                    }`}
                >
                    <span className="text-sm font-semibold capitalize">
                        {leave.status}
                    </span>
                    {leave.approved_at && (
                        <span className="text-xs opacity-70">
                            on {leave.approved_at}
                        </span>
                    )}
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <dl className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <dt className="text-xs text-gray-500">
                                Leave Type
                            </dt>
                            <dd className="font-medium mt-1">
                                {leave.leave_type?.name ?? "—"}
                            </dd>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <dt className="text-xs text-gray-500">
                                    Start Date
                                </dt>
                                <dd className="font-medium">
                                    {fmtDate(leave.start_date)}
                                </dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <dt className="text-xs text-gray-500">
                                    End Date
                                </dt>
                                <dd className="font-medium">
                                    {fmtDate(leave.end_date)}
                                </dd>
                            </div>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Duration</dt>
                            <dd className="font-medium">
                                {days} day{days !== 1 ? "s" : ""}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">
                                Applied On
                            </dt>
                            <dd className="font-medium">
                                {fmtDate(leave.created_at)}
                            </dd>
                        </div>
                    </dl>
                    {leave.reason && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <dt className="text-xs text-gray-500 mb-1">
                                Reason
                            </dt>
                            <dd className="text-sm text-gray-700">
                                {leave.reason}
                            </dd>
                        </div>
                    )}
                    {leave.rejection_reason && (
                        <div className="mt-2">
                            <dt className="text-xs text-red-500 mb-1">
                                Rejection Reason
                            </dt>
                            <dd className="text-sm text-red-700">
                                {leave.rejection_reason}
                            </dd>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

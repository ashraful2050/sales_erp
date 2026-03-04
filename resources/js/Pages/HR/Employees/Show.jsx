import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Edit, Mail, Phone, Calendar } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function Show({ employee }) {
    const { t } = useTranslation();
    return (
        <AppLayout>
            <Head title={`Employee: ${employee.name}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={employee.name}
                    subtitle={`ID: ${employee.employee_id ?? "—"}`}
                    actions={
                        <div className="flex gap-2">
                            <Link
                                href={route("hr.employees.index")}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> {t("Back")}
                            </Link>
                            <Link
                                href={route("hr.employees.edit", employee.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                            >
                                <Edit className="w-4 h-4" /> {t("Edit")}
                            </Link>
                        </div>
                    }
                />

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50 text-indigo-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                            {t("Basic Salary")}
                        </p>
                        <p className="text-2xl font-bold mt-1">
                            ৳
                            {Number(
                                employee.basic_salary ?? 0,
                            ).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-blue-50 text-blue-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                            {t("Department")}
                        </p>
                        <p className="text-xl font-bold mt-1">
                            {employee.department?.name ?? "—"}
                        </p>
                    </div>
                    <div className="bg-purple-50 text-purple-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                            {t("Designation")}
                        </p>
                        <p className="text-xl font-bold mt-1">
                            {employee.designation?.name ?? "—"}
                        </p>
                    </div>
                </div>

                {/* Employee Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        Employee Information
                    </h3>
                    <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <dt className="text-xs text-gray-500">Email</dt>
                                <dd className="font-medium">
                                    {employee.email ?? "—"}
                                </dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <dt className="text-xs text-gray-500">Phone</dt>
                                <dd className="font-medium">
                                    {employee.phone ?? "—"}
                                </dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <dt className="text-xs text-gray-500">
                                    Join Date
                                </dt>
                                <dd className="font-medium">
                                    {employee.join_date ?? "—"}
                                </dd>
                            </div>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">NID</dt>
                            <dd className="font-medium">
                                {employee.nid ?? "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">
                                Employment Type
                            </dt>
                            <dd className="font-medium capitalize">
                                {employee.employment_type ?? "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500 mb-1">
                                Status
                            </dt>
                            <dd>
                                <Badge
                                    color={
                                        employee.status === "active"
                                            ? "green"
                                            : "red"
                                    }
                                >
                                    {employee.status}
                                </Badge>
                            </dd>
                        </div>
                        {employee.bank_account_number && (
                            <div>
                                <dt className="text-xs text-gray-500">
                                    Bank Account
                                </dt>
                                <dd className="font-medium">
                                    {employee.bank_account_number}
                                </dd>
                            </div>
                        )}
                        {employee.address && (
                            <div className="col-span-2">
                                <dt className="text-xs text-gray-500">
                                    Address
                                </dt>
                                <dd className="text-gray-700">
                                    {employee.address}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Payroll History */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Recent Payroll
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {[
                                        "Period",
                                        "Gross",
                                        "Deductions",
                                        "Net Pay",
                                        "Status",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {employee.payroll_records?.length ? (
                                    employee.payroll_records.map((pr) => (
                                        <tr
                                            key={pr.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {pr.payroll?.period_start} →{" "}
                                                {pr.payroll?.period_end}
                                            </td>
                                            <td className="px-4 py-3">
                                                ৳
                                                {Number(
                                                    pr.gross_salary ?? 0,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                ৳
                                                {Number(
                                                    pr.total_deduction ?? 0,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                ৳
                                                {Number(
                                                    pr.net_salary ?? 0,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    color={
                                                        pr.status === "paid"
                                                            ? "green"
                                                            : "yellow"
                                                    }
                                                >
                                                    {pr.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-gray-400"
                                        >
                                            No payroll records
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

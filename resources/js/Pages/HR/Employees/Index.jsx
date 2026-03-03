import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import ExportButtons from "@/Components/ExportButtons";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

export default function EmployeesIndex({ employees, filters, departments }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters?.search ?? "");
    const [deptId, setDeptId] = useState(filters?.department_id ?? "");
    const [status, setStatus] = useState(filters?.status ?? "");
    const { confirm: dlgConfirm } = useDialog();
    const apply = (s, d, st) =>
        router.get(
            route("hr.employees.index"),
            { search: s, department_id: d, status: st },
            { preserveState: true, replace: true },
        );
    const del = async (id) => {
        if (
            await dlgConfirm(
                "Delete this employee record? This cannot be undone.",
                {
                    title: t("Delete Employee"),
                    confirmLabel: t("Delete"),
                    intent: "danger",
                },
            )
        )
            router.delete(route("hr.employees.destroy", id));
    };

    return (
        <AppLayout title={t("Employees")}>
            <Head title={t("Employees")} />
            <PageHeader
                title={t("Employees")}
                subtitle={`${employees.total} ${t("total employees")}`}
                actions={
                    <Link
                        href={route("hr.employees.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("New Employee")}
                    </Link>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3">
                <SearchFilter
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        apply(v, deptId, status);
                    }}
                    placeholder={t("Search name, ID, email…")}
                />
                <select
                    value={deptId}
                    onChange={(e) => {
                        setDeptId(e.target.value);
                        apply(search, e.target.value, status);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{t("All Departments")}</option>
                    {departments?.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        apply(search, deptId, e.target.value);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{t("All Status")}</option>
                    <option value="active">{t("Active")}</option>
                    <option value="inactive">{t("Inactive")}</option>
                    <option value="terminated">{t("Terminated")}</option>
                </select>
                <ExportButtons
                    tableId="export-table"
                    filename="employees"
                    title="Employees"
                />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" id="export-table">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Employee")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Department")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Designation")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Joining Date")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Basic Salary")}
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Status")}
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {employees.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        {t("No employees found.")}
                                    </td>
                                </tr>
                            )}
                            {employees.data.map((e) => (
                                <tr
                                    key={e.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">
                                            {e.name}
                                        </div>
                                        {e.employee_id && (
                                            <div className="text-xs text-slate-400 font-mono">
                                                {e.employee_id}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {e.department?.name ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {e.designation?.name ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {e.joining_date}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-medium text-slate-800">
                                        ৳
                                        {Number(
                                            e.basic_salary,
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                e.status === "active"
                                                    ? "green"
                                                    : e.status === "terminated"
                                                      ? "slate"
                                                      : "red"
                                            }
                                        >
                                            {e.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "hr.employees.show",
                                                    e.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Eye size={15} />
                                            </Link>
                                            <Link
                                                href={route(
                                                    "hr.employees.edit",
                                                    e.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                            >
                                                <Pencil size={15} />
                                            </Link>
                                            <button
                                                onClick={() => del(e.id)}
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
                <Pagination links={employees.links} />
            </div>
        </AppLayout>
    );
}

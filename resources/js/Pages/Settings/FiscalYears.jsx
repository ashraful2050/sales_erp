import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Trash2, X, Check, Lock } from "lucide-react";
import { fmtDate } from "@/utils/date";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

function FiscalYearForm({ onSave, onCancel }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        start_date: "",
        end_date: "",
        status: "active",
    });
    const submit = (e) => {
        e.preventDefault();
        post(route("settings.fiscal-years.store"), {
            onSuccess: () => {
                reset();
                onSave();
            },
        });
    };
    return (
        <form
            onSubmit={submit}
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 grid grid-cols-2 md:grid-cols-5 gap-3 items-end"
        >
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t("Name")}
                </label>
                <input
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder={t("FY 2024-25")}
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.name ? "border-red-400" : "border-slate-200"}`}
                />
                {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t("Start Date")}
                </label>
                <input
                    type="date"
                    value={data.start_date}
                    onChange={(e) => setData("start_date", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.start_date ? "border-red-400" : "border-slate-200"}`}
                />
                {errors.start_date && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.start_date}
                    </p>
                )}
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t("End Date")}
                </label>
                <input
                    type="date"
                    value={data.end_date}
                    onChange={(e) => setData("end_date", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.end_date ? "border-red-400" : "border-slate-200"}`}
                />
                {errors.end_date && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.end_date}
                    </p>
                )}
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t("Status")}
                </label>
                <select
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-white ${errors.status ? "border-red-400" : "border-slate-200"}`}
                >
                    <option value="active">{t("Active")}</option>
                    <option value="pending">{t("Pending")}</option>
                    <option value="closed">{t("Closed")}</option>
                </select>
                {errors.status && (
                    <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                )}
            </div>
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                >
                    <Check size={14} /> {t("Add")}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-2 text-slate-400 hover:text-slate-600"
                >
                    <X size={16} />
                </button>
            </div>
        </form>
    );
}

const STATUS_MAP = { active: "green", closed: "slate", locked: "red" };

export default function FiscalYearsIndex({ fiscalYears }) {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(
                "Delete this fiscal year? This cannot be undone.",
                {
                    title: t("Delete Fiscal Year"),
                    confirmLabel: t("Delete"),
                    intent: "danger",
                },
            )
        )
            router.delete(route("settings.fiscal-years.destroy", id));
    };
    const close = async (id) => {
        if (
            await dlgConfirm(
                "This action locks all journal entries for this period.",
                {
                    title: t("Close Fiscal Year?"),
                    confirmLabel: t("Close Year"),
                    intent: "warning",
                },
            )
        )
            router.put(route("settings.fiscal-years.update", id), {
                status: "closed",
            });
    };

    return (
        <AppLayout title={t("Fiscal Years")}>
            <Head title={t("Fiscal Years")} />
            <PageHeader
                title={t("Fiscal Years")}
                subtitle={t("Manage accounting periods and fiscal year settings")}
                actions={
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("New Fiscal Year")}
                    </button>
                }
            />
            {showForm && (
                <FiscalYearForm
                    onSave={() => setShowForm(false)}
                    onCancel={() => setShowForm(false)}
                />
            )}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Name")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Start Date")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("End Date")}
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Status")}
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {fiscalYears.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        {t("No fiscal years defined.")}
                                    </td>
                                </tr>
                            )}
                            {fiscalYears.map((fy) => (
                                <tr key={fy.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                                        {fy.status === "locked" && (
                                            <Lock
                                                size={13}
                                                className="text-slate-400"
                                            />
                                        )}
                                        {fy.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {fmtDate(fy.start_date)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {fmtDate(fy.end_date)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                STATUS_MAP[fy.status] ?? "slate"
                                            }
                                            className="capitalize"
                                        >
                                            {fy.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {fy.status === "active" && (
                                                <button
                                                    onClick={() => close(fy.id)}
                                                    className="text-xs px-2 py-1 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-md"
                                                >
                                                    {t("Close Year")}
                                                </button>
                                            )}
                                            {fy.status !== "locked" && (
                                                <button
                                                    onClick={() => del(fy.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

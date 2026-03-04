import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export default function BudgetForm({
    budget,
    lines: initLines,
    fiscalYears,
    costCenters,
    accounts,
}) {
    const { t } = useTranslation();
    const isEdit = !!budget;
    const { data, setData, post, put, processing, errors } = useForm({
        name: budget?.name ?? "",
        fiscal_year_id: budget?.fiscal_year_id ?? "",
        cost_center_id: budget?.cost_center_id ?? "",
        period: budget?.period ?? "monthly",
        status: budget?.status ?? "draft",
        lines:
            initLines?.length > 0
                ? initLines.map((l) => ({
                      account_id: String(l.account_id),
                      month: l.month ?? "",
                      budgeted_amount: l.budgeted_amount,
                  }))
                : [{ account_id: "", month: "", budgeted_amount: "" }],
    });

    const addLine = () =>
        setData("lines", [
            ...data.lines,
            { account_id: "", month: "", budgeted_amount: "" },
        ]);
    const removeLine = (i) =>
        setData(
            "lines",
            data.lines.filter((_, idx) => idx !== i),
        );
    const updateLine = (i, key, val) => {
        const ls = [...data.lines];
        ls[i] = { ...ls[i], [key]: val };
        setData("lines", ls);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) put(route("accounting.budgets.update", budget.id));
        else post(route("accounting.budgets.store"));
    };

    const totalBudgeted = data.lines.reduce(
        (s, l) => s + (parseFloat(l.budgeted_amount) || 0),
        0,
    );

    return (
        <AppLayout title={isEdit ? t("Edit Budget") : t("New Budget")}>
            <Head title={isEdit ? t("Edit Budget") : t("New Budget")} />
            <PageHeader
                title={isEdit ? t("Edit Budget") : t("New Budget")}
                breadcrumbs={[
                    {
                        label: t("Budgets"),
                        href: route("accounting.budgets.index"),
                    },
                    { label: isEdit ? t("Edit") : t("New") },
                ]}
            />
            <form onSubmit={submit} className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-700 mb-4">
                        {t("Budget Details")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("Budget Name")}{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                placeholder={t("e.g. Annual Budget 2025")}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("Fiscal Year")}{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.fiscal_year_id}
                                onChange={(e) =>
                                    setData("fiscal_year_id", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">{t("— Select —")}</option>
                                {fiscalYears.map((fy) => (
                                    <option key={fy.id} value={fy.id}>
                                        {fy.name}
                                    </option>
                                ))}
                            </select>
                            {errors.fiscal_year_id && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.fiscal_year_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("Cost Center")}
                            </label>
                            <select
                                value={data.cost_center_id}
                                onChange={(e) =>
                                    setData("cost_center_id", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">
                                    {t("— All / General —")}
                                </option>
                                {costCenters.map((cc) => (
                                    <option key={cc.id} value={cc.id}>
                                        {cc.name}
                                        {cc.code ? ` (${cc.code})` : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("Period")}{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.period}
                                onChange={(e) =>
                                    setData("period", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="monthly">{t("Monthly")}</option>
                                <option value="quarterly">
                                    {t("Quarterly")}
                                </option>
                                <option value="annual">{t("Annual")}</option>
                            </select>
                        </div>
                        {isEdit && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {t("Status")}
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="draft">{t("Draft")}</option>
                                    <option value="approved">
                                        {t("Approved")}
                                    </option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Budget Lines */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                        <h3 className="font-semibold text-slate-700">
                            {t("Budget Lines")}
                        </h3>
                        <button
                            type="button"
                            onClick={addLine}
                            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
                        >
                            <Plus size={15} /> {t("Add Line")}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Account")}
                                    </th>
                                    {data.period === "monthly" && (
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                                            {t("Month")}
                                        </th>
                                    )}
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {t("Budgeted Amount (BDT)")}
                                    </th>
                                    <th className="w-10 px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.lines.map((line, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="px-4 py-2">
                                            <select
                                                value={line.account_id}
                                                onChange={(e) =>
                                                    updateLine(
                                                        i,
                                                        "account_id",
                                                        e.target.value,
                                                    )
                                                }
                                                className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm w-full"
                                            >
                                                <option value="">
                                                    {t("— Select Account —")}
                                                </option>
                                                {accounts.map((a) => (
                                                    <option
                                                        key={a.id}
                                                        value={a.id}
                                                    >
                                                        {a.code} - {a.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        {data.period === "monthly" && (
                                            <td className="px-4 py-2">
                                                <select
                                                    value={line.month}
                                                    onChange={(e) =>
                                                        updateLine(
                                                            i,
                                                            "month",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm"
                                                >
                                                    <option value="">
                                                        {t("— Month —")}
                                                    </option>
                                                    {MONTHS.map((m, idx) => (
                                                        <option
                                                            key={idx + 1}
                                                            value={idx + 1}
                                                        >
                                                            {t(m)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        )}
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={line.budgeted_amount}
                                                onChange={(e) =>
                                                    updateLine(
                                                        i,
                                                        "budgeted_amount",
                                                        e.target.value,
                                                    )
                                                }
                                                className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-right w-full"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => removeLine(i)}
                                                className="p-1 text-slate-300 hover:text-red-500 rounded"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                                <tr>
                                    <td
                                        className="px-4 py-3 font-semibold text-slate-700"
                                        colSpan={
                                            data.period === "monthly" ? 2 : 1
                                        }
                                    >
                                        {t("Total Budget")}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                                        {totalBudgeted.toLocaleString("en-BD", {
                                            minimumFractionDigits: 2,
                                        })}{" "}
                                        BDT
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                        {processing
                            ? t("Saving...")
                            : isEdit
                              ? t("Update Budget")
                              : t("Create Budget")}
                    </button>
                    <Link
                        href={route("accounting.budgets.index")}
                        className="text-sm text-slate-500 hover:text-slate-700"
                    >
                        {t("Cancel")}
                    </Link>
                </div>
            </form>
        </AppLayout>
    );
}

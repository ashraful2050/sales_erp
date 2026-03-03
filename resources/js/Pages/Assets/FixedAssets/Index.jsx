import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import SearchFilter from "@/Components/SearchFilter";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import ExportButtons from "@/Components/ExportButtons";
import { fmtDate } from "@/utils/date";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

const STATUS_COLOR = {
    active: "green",
    disposed: "slate",
    fully_depreciated: "amber",
};
const DEP_METHOD = {
    straight_line: "Straight Line",
    reducing_balance: "Reducing Balance",
    declining_balance: "Declining Balance",
    sum_of_years: "Sum of Years",
};

export default function FixedAssetsIndex({ assets, filters, categories }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters?.search ?? "");
    const [catId, setCatId] = useState(filters?.category_id ?? "");
    const [status, setStatus] = useState(filters?.status ?? "");
    const apply = (s, c, st) =>
        router.get(
            route("assets.fixed-assets.index"),
            { search: s, category_id: c, status: st },
            { preserveState: true, replace: true },
        );
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(t("Delete this asset? This cannot be undone."), {
                title: t("Delete Asset"),
                confirmLabel: t("Delete"),
                intent: "danger",
            })
        )
            router.delete(route("assets.fixed-assets.destroy", id));
    };

    return (
        <AppLayout title={t("Fixed Assets")}>
            <Head title={t("Fixed Assets")} />
            <PageHeader
                title={t("Fixed Assets")}
                subtitle={`${assets.total} ${t("total assets")}`}
                actions={
                    <Link
                        href={route("assets.fixed-assets.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("Add Asset")}
                    </Link>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-4 flex flex-wrap gap-3">
                <SearchFilter
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        apply(v, catId, status);
                    }}
                    placeholder={t("Search asset name, code…")}
                />
                <select
                    value={catId}
                    onChange={(e) => {
                        setCatId(e.target.value);
                        apply(search, e.target.value, status);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{t("All Categories")}</option>
                    {categories?.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        apply(search, catId, e.target.value);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{t("All Status")}</option>
                    <option value="active">{t("Active")}</option>
                    <option value="disposed">{t("Disposed")}</option>
                    <option value="fully_depreciated">{t("Fully Depreciated")}</option>
                </select>
                <ExportButtons
                    tableId="export-table"
                    filename="fixed-assets"
                    title="Fixed Assets"
                />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" id="export-table">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Asset")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Category")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Purchase Date")}
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Method")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Cost")}
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Current Value")}
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t("Status")}
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {assets.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        {t("No assets found.")}
                                    </td>
                                </tr>
                            )}
                            {assets.data.map((a) => (
                                <tr
                                    key={a.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">
                                            {a.name}
                                        </div>
                                        {a.asset_code && (
                                            <div className="text-xs text-slate-400 font-mono">
                                                {a.asset_code}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {a.category?.name ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {fmtDate(a.purchase_date)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                        {DEP_METHOD[a.depreciation_method] ??
                                            a.depreciation_method}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-700">
                                        ৳
                                        {Number(
                                            a.purchase_cost,
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-medium text-slate-800">
                                        ৳
                                        {Number(
                                            a.current_value ?? 0,
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            color={
                                                STATUS_COLOR[a.status] ??
                                                "slate"
                                            }
                                        >
                                            {a.status?.replace(/_/g, " ")}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "assets.fixed-assets.show",
                                                    a.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Eye size={15} />
                                            </Link>
                                            <Link
                                                href={route(
                                                    "assets.fixed-assets.edit",
                                                    a.id,
                                                )}
                                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                            >
                                                <Pencil size={15} />
                                            </Link>
                                            <button
                                                onClick={() => del(a.id)}
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
                <Pagination links={assets.links} />
            </div>
        </AppLayout>
    );
}

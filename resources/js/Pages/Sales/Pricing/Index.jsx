import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

const typeColors = {
    fixed: "blue",
    percentage: "green",
    tiered: "purple",
    dynamic: "orange",
};

export default function PricingIndex({ rules }) {
    const { t } = useTranslation();
    const { confirm } = useDialog();
    const del = async (id) => {
        if (
            await confirm("Delete this pricing rule?", {
                title: t("Delete?"),
                confirmLabel: t("Delete"),
                intent: "danger",
            })
        )
            router.delete(route("sales.pricing-rules.destroy", id));
    };

    return (
        <AppLayout title={t("Pricing Rules")}>
            <Head title={t("Pricing Rules")} />
            <PageHeader
                title={t("Pricing Rules")}
                subtitle={t("Dynamic pricing engine")}
                actions={
                    <Link
                        href={route("sales.pricing-rules.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        <Plus size={15} /> {t("New Rule")}
                    </Link>
                }
            />

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {[
                                "Name",
                                "Type",
                                "Adjustment",
                                "Applies To",
                                "Validity",
                                "Priority",
                                "Status",
                                "Actions",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rules.data?.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-8 text-center text-slate-400"
                                >
                                    {t("No pricing rules yet.")}
                                </td>
                            </tr>
                        ) : (
                            rules.data?.map((r) => (
                                <tr key={r.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2">
                                        <Tag
                                            size={14}
                                            className="text-blue-500"
                                        />
                                        {r.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            color={
                                                typeColors[r.type] || "slate"
                                            }
                                            label={r.type}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {r.adjustment_type === "percentage"
                                            ? `${r.adjustment_value}%`
                                            : `$${r.adjustment_value}`}
                                    </td>
                                    <td className="px-4 py-3 capitalize text-slate-600">
                                        {r.applies_to?.replace("_", " ")}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                        {r.start_date || "Any"} –{" "}
                                        {r.end_date || "Any"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {r.priority}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            color={
                                                r.is_active ? "green" : "slate"
                                            }
                                            label={
                                                r.is_active
                                                    ? "Active"
                                                    : "Inactive"
                                            }
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            <Link
                                                href={route(
                                                    "sales.pricing-rules.edit",
                                                    r.id,
                                                )}
                                                className="p-1 text-slate-400 hover:text-yellow-600"
                                            >
                                                <Pencil size={14} />
                                            </Link>
                                            <button
                                                onClick={() => del(r.id)}
                                                className="p-1 text-slate-400 hover:text-red-600"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="p-4 border-t border-slate-200">
                    <Pagination links={rules.links} meta={rules} />
                </div>
            </div>
        </AppLayout>
    );
}

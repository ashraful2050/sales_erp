import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import { Plus, Pencil, Trash2, CheckCircle } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

const typeColors = {
    percentage: "green",
    fixed: "blue",
    buy_x_get_y: "purple",
};
const statusColors = {
    active: "green",
    inactive: "slate",
    pending_approval: "yellow",
};

export default function DiscountsIndex({ rules }) {
    const { t } = useTranslation();
    const { confirm } = useDialog();
    const del = async (id) => {
        if (
            await confirm("Delete this discount rule?", {
                title: t("Delete?"),
                confirmLabel: t("Delete"),
                intent: "danger",
            })
        )
            router.delete(route("sales.discount-rules.destroy", id));
    };

    return (
        <AppLayout title={t("Discount Rules")}>
            <Head title={t("Discount Rules")} />
            <PageHeader
                title={t("Discount Rules")}
                subtitle={t("Manage coupons and discount structures")}
                actions={
                    <Link
                        href={route("sales.discount-rules.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        <Plus size={15} /> {t("New Discount")}
                    </Link>
                }
            />

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {[
                                "Name",
                                "Code",
                                "Type",
                                "Value",
                                "Min Order",
                                "Usage",
                                "Validity",
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
                                    colSpan={9}
                                    className="px-4 py-8 text-center text-slate-400"
                                >
                                    {t("No discount rules yet.")}
                                </td>
                            </tr>
                        ) : (
                            rules.data?.map((r) => (
                                <tr key={r.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-800">
                                        {r.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">
                                            {r.code || "—"}
                                        </code>
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
                                        {r.type === "percentage"
                                            ? `${r.value}%`
                                            : `$${r.value}`}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">
                                        {r.min_order_amount
                                            ? `$${r.min_order_amount}`
                                            : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">
                                        {r.usage_count}/{r.usage_limit || "∞"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                        {r.start_date || "Any"} –{" "}
                                        {r.end_date || "Any"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1">
                                            <Badge
                                                color={
                                                    statusColors[r.status] ||
                                                    "slate"
                                                }
                                                label={r.status?.replace(
                                                    "_",
                                                    " ",
                                                )}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            {r.status ===
                                                "pending_approval" && (
                                                <button
                                                    onClick={() =>
                                                        router.post(
                                                            route(
                                                                "sales.discount-rules.approve",
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
                                            <Link
                                                href={route(
                                                    "sales.discount-rules.edit",
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

import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

export default function SegmentShow({ segment, allCustomers }) {
    const { t } = useTranslation();
    const { confirm } = useDialog();
    const { data, setData, post, processing } = useForm({ customer_id: "" });

    const add = (e) => {
        e.preventDefault();
        post(route("crm.segments.members.add", segment.id));
    };
    const remove = async (cid) => {
        if (
            await confirm("Remove this customer from the segment?", {
                title: t("Remove Customer?"),
                confirmLabel: t("Remove"),
                intent: "danger",
            })
        )
            router.delete(
                route("crm.segments.members.remove", {
                    customerSegment: segment.id,
                    customer: cid,
                }),
            );
    };

    const memberIds = new Set(segment.members?.map((m) => m.id));

    return (
        <AppLayout title={segment.name}>
            <Head title={segment.name} />
            <PageHeader
                title={segment.name}
                actions={
                    <a
                        href={route("crm.segments.index")}
                        className="flex items-center gap-2 text-sm text-slate-600"
                    >
                        <ArrowLeft size={16} /> {t("Back")}
                    </a>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add member */}
                {segment.type === "manual" && (
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-700 mb-4">
                            Add Customer
                        </h3>
                        <form onSubmit={add} className="space-y-3">
                            <select
                                value={data.customer_id}
                                onChange={(e) =>
                                    setData("customer_id", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">Select customer…</option>
                                {allCustomers
                                    .filter((c) => !memberIds.has(c.id))
                                    .map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                            </select>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
                            >
                                {t("Add to Segment")}
                            </button>
                        </form>
                    </div>
                )}

                {/* Members */}
                <div
                    className={
                        segment.type === "manual"
                            ? "lg:col-span-2"
                            : "lg:col-span-3"
                    }
                >
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200">
                            <h3 className="font-semibold text-slate-700">
                                {segment.members?.length ?? 0} Members
                            </h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase">
                                        {t("Name")}
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase">
                                        {t("Email")}
                                    </th>
                                    {segment.type === "manual" && (
                                        <th className="px-4 py-2"></th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {(segment.members ?? []).length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-6 text-center text-slate-400"
                                        >
                                            {t("No members yet.")}
                                        </td>
                                    </tr>
                                ) : (
                                    (segment.members ?? []).map((c) => (
                                        <tr
                                            key={c.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-2 font-medium text-slate-800">
                                                {c.name}
                                            </td>
                                            <td className="px-4 py-2 text-slate-500">
                                                {c.email || "—"}
                                            </td>
                                            {segment.type === "manual" && (
                                                <td className="px-4 py-2 text-right">
                                                    <button
                                                        onClick={() =>
                                                            remove(c.id)
                                                        }
                                                        className="text-slate-300 hover:text-red-500"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Star, Award } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const tierColors = {
    standard: "slate",
    bronze: "amber",
    silver: "gray",
    gold: "yellow",
};

export default function CustomerPoints({
    customer,
    program,
    balance,
    tier,
    history,
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, reset } = useForm({
        points: "",
        type: "adjusted",
        notes: "",
        loyalty_program_id: program?.id,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("sales.loyalty.adjust", customer.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout title={t("Loyalty Points")}>
            <Head title={t("Loyalty Points")} />
            <PageHeader title={`${customer.name} – Loyalty Points`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                        <Star
                            size={28}
                            className="mx-auto text-yellow-500 mb-2"
                            fill="currentColor"
                        />
                        <div className="text-4xl font-bold text-slate-800">
                            {balance.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                            Available Points
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                            (worth $
                            {(
                                balance * (program?.currency_per_point || 0)
                            ).toFixed(2)}
                            )
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                        <Award
                            size={24}
                            className="mx-auto mb-2 text-slate-500"
                        />
                        <div
                            className={`text-xl font-bold capitalize text-${tierColors[tier] || "slate"}-600`}
                        >
                            {tier}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                            Tier Level
                        </div>
                    </div>

                    {/* Adjust Points */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-700 mb-3 text-sm">
                            Adjust Points
                        </h3>
                        <form onSubmit={submit} className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-600">
                                    {t("Points (negative to deduct)")}
                                </label>
                                <input
                                    type="number"
                                    value={data.points}
                                    onChange={(e) =>
                                        setData("points", e.target.value)
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-600">
                                    {t("Notes")}
                                </label>
                                <input
                                    type="text"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
                            >
                                {t("Apply Adjustment")}
                            </button>
                        </form>
                    </div>
                </div>

                {/* History */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200">
                            <h3 className="font-semibold text-slate-700">
                                Points History
                            </h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    {[
                                        "Date",
                                        "Type",
                                        "Points",
                                        "Reference",
                                        "Notes",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-2 text-left text-xs text-slate-500 uppercase"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {history.data?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-6 text-center text-slate-400"
                                        >
                                            {t("No history.")}
                                        </td>
                                    </tr>
                                ) : (
                                    history.data?.map((h) => (
                                        <tr
                                            key={h.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-2 text-slate-500">
                                                {new Date(
                                                    h.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2 capitalize">
                                                <span
                                                    className={`px-2 py-0.5 rounded text-xs ${h.type === "earned" ? "bg-green-100 text-green-700" : h.type === "redeemed" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}
                                                >
                                                    {h.type}
                                                </span>
                                            </td>
                                            <td
                                                className={`px-4 py-2 font-semibold ${h.type === "earned" || (h.type === "adjusted" && h.points > 0) ? "text-green-600" : "text-red-600"}`}
                                            >
                                                {h.points > 0 ? "+" : ""}
                                                {h.points}
                                            </td>
                                            <td className="px-4 py-2 text-slate-400 text-xs">
                                                {h.reference_type
                                                    ? `${h.reference_type} #${h.reference_id}`
                                                    : "—"}
                                            </td>
                                            <td className="px-4 py-2 text-slate-500">
                                                {h.notes || "—"}
                                            </td>
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

import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Plus, Trash2, Gift, Star } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";

export default function LoyaltyIndex({ programs }) {
    const { confirm } = useDialog();
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        description: "",
        points_per_currency_unit: "1",
        currency_per_point: "0.01",
        min_redeem_points: "100",
        point_expiry_days: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("sales.loyalty.store"), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };
    const del = async (id) => {
        if (
            await confirm("Delete this loyalty program?", {
                title: "Delete?",
                confirmLabel: "Delete",
                intent: "danger",
            })
        )
            router.delete(route("sales.loyalty.destroy", id));
    };

    return (
        <AppLayout title="Loyalty Programs">
            <Head title="Loyalty Programs" />
            <PageHeader
                title="Loyalty Programs"
                subtitle="Reward customer loyalty and drive repeat sales"
                actions={
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        <Plus size={15} /> New Program
                    </button>
                }
            />

            {/* Create Form */}
            {showForm && (
                <form
                    onSubmit={submit}
                    className="bg-white rounded-xl border border-slate-200 p-6 mb-6 max-w-2xl"
                >
                    <h3 className="font-semibold text-slate-700 mb-4">
                        New Loyalty Program
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            ["name", "Program Name *", "text"],
                            [
                                "points_per_currency_unit",
                                "Points per $1 spent",
                                "number",
                            ],
                            [
                                "currency_per_point",
                                "Currency value per point",
                                "number",
                            ],
                            [
                                "min_redeem_points",
                                "Min points to redeem",
                                "number",
                            ],
                            [
                                "point_expiry_days",
                                "Point expiry (days, leave blank = never)",
                                "number",
                            ],
                        ].map(([key, lbl, type]) => (
                            <div
                                key={key}
                                className={key === "name" ? "col-span-2" : ""}
                            >
                                <label className="block text-xs text-slate-600 mb-1">
                                    {lbl}
                                </label>
                                <input
                                    type={type}
                                    step="any"
                                    value={data[key]}
                                    onChange={(e) =>
                                        setData(key, e.target.value)
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                />
                                {errors[key] && (
                                    <p className="text-red-500 text-xs">
                                        {errors[key]}
                                    </p>
                                )}
                            </div>
                        ))}
                        <div className="col-span-2">
                            <label className="block text-xs text-slate-600 mb-1">
                                Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={2}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Create Program
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="text-slate-500 text-sm px-4 py-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Programs List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {programs.length === 0 ? (
                    <div className="col-span-3 bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
                        <Gift
                            size={32}
                            className="mx-auto mb-2 text-slate-300"
                        />
                        No loyalty programs yet.
                    </div>
                ) : (
                    programs.map((p) => (
                        <div
                            key={p.id}
                            className="bg-white rounded-xl border border-slate-200 p-5"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Star
                                        size={16}
                                        className="text-yellow-500"
                                        fill="currentColor"
                                    />
                                    <h4 className="font-semibold text-slate-800">
                                        {p.name}
                                    </h4>
                                </div>
                                <div className="flex gap-1">
                                    <span
                                        className={`px-2 py-0.5 rounded text-xs ${p.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                                    >
                                        {p.is_active ? "Active" : "Inactive"}
                                    </span>
                                    <button
                                        onClick={() => del(p.id)}
                                        className="text-slate-300 hover:text-red-500 ml-1"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mb-3">
                                {p.description || "No description"}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-slate-50 rounded p-2">
                                    <div className="text-slate-400">
                                        Points per $1
                                    </div>
                                    <div className="font-semibold text-slate-700">
                                        {p.points_per_currency_unit}
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded p-2">
                                    <div className="text-slate-400">
                                        Value per point
                                    </div>
                                    <div className="font-semibold text-slate-700">
                                        ${p.currency_per_point}
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded p-2">
                                    <div className="text-slate-400">
                                        Min redeem
                                    </div>
                                    <div className="font-semibold text-slate-700">
                                        {p.min_redeem_points} pts
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded p-2">
                                    <div className="text-slate-400">
                                        Point expiry
                                    </div>
                                    <div className="font-semibold text-slate-700">
                                        {p.point_expiry_days
                                            ? `${p.point_expiry_days}d`
                                            : "Never"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AppLayout>
    );
}

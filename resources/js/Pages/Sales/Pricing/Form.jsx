import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft } from "lucide-react";

export default function PricingForm({ rule }) {
    const isEdit = !!rule;
    const { data, setData, post, put, processing, errors } = useForm({
        name: "",
        type: "percentage",
        applies_to: "all",
        applies_to_id: "",
        adjustment_value: "",
        adjustment_type: "percentage",
        start_date: "",
        end_date: "",
        priority: "0",
        ...(rule ?? {}),
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit
            ? put(route("sales.pricing-rules.update", rule.id))
            : post(route("sales.pricing-rules.store"));
    };

    return (
        <AppLayout title={isEdit ? "Edit Pricing Rule" : "New Pricing Rule"}>
            <Head title={isEdit ? "Edit Pricing Rule" : "New Pricing Rule"} />
            <PageHeader
                title={isEdit ? "Edit Pricing Rule" : "New Pricing Rule"}
                actions={
                    <Link
                        href={route("sales.pricing-rules.index")}
                        className="flex items-center gap-2 text-sm text-slate-600"
                    >
                        <ArrowLeft size={16} /> Back
                    </Link>
                }
            />

            <form onSubmit={submit} className="max-w-2xl">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Name *
                        </label>
                        <input
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Rule Type
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            >
                                {[
                                    "fixed",
                                    "percentage",
                                    "tiered",
                                    "dynamic",
                                ].map((t) => (
                                    <option key={t} value={t}>
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Applies To
                            </label>
                            <select
                                value={data.applies_to}
                                onChange={(e) =>
                                    setData("applies_to", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            >
                                {[
                                    "all",
                                    "category",
                                    "product",
                                    "customer",
                                    "segment",
                                ].map((t) => (
                                    <option key={t} value={t}>
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Adjustment Value *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.adjustment_value}
                                onChange={(e) =>
                                    setData("adjustment_value", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Adjustment Type
                            </label>
                            <select
                                value={data.adjustment_type}
                                onChange={(e) =>
                                    setData("adjustment_type", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="percentage">
                                    Percentage (%)
                                </option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData("start_date", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={data.end_date}
                                onChange={(e) =>
                                    setData("end_date", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Priority (higher = applied first)
                        </label>
                        <input
                            type="number"
                            value={data.priority}
                            onChange={(e) =>
                                setData("priority", e.target.value)
                            }
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm"
                    >
                        <Save size={16} /> {isEdit ? "Update" : "Create"} Rule
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

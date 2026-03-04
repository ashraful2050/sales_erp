import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import {
    ArrowLeft,
    Save,
    PackagePlus,
    PackageMinus,
    RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const inputCls =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const errCls = "text-xs text-red-500 mt-1";

const TYPE_CONFIG = {
    in: {
        label: "Stock In",
        icon: PackagePlus,
        color: "bg-green-50 border-green-200",
        iconColor: "text-green-600",
        desc: "Receive products into warehouse (purchase, return, opening stock)",
    },
    out: {
        label: "Stock Out",
        icon: PackageMinus,
        color: "bg-red-50 border-red-200",
        iconColor: "text-red-500",
        desc: "Remove products from warehouse (sales, damage, write-off)",
    },
    adjustment: {
        label: "Adjustment",
        icon: RefreshCw,
        color: "bg-amber-50 border-amber-200",
        iconColor: "text-amber-600",
        desc: "Correct stock quantity (physical count difference)",
    },
};

export default function StockMovementCreate({ products, warehouses }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        product_id: "",
        warehouse_id: "",
        movement_type: "in",
        quantity: "",
        unit_cost: "",
        movement_date: new Date().toISOString().slice(0, 10),
        reference_type: "",
        notes: "",
    });

    const selectedProduct = products.find(
        (p) => String(p.id) === String(data.product_id),
    );

    // Auto-fill unit_cost from product cost_price on stock_in
    useEffect(() => {
        if (selectedProduct && data.movement_type === "in" && !data.unit_cost) {
            setData("unit_cost", selectedProduct.cost_price ?? "");
        }
    }, [data.product_id, data.movement_type]);

    const cfg = TYPE_CONFIG[data.movement_type];
    const Icon = cfg.icon;

    const submit = (e) => {
        e.preventDefault();
        post(route("inventory.stock-movements.store"));
    };

    return (
        <AppLayout title={t("New Stock Entry")}>
            <Head title={t("New Stock Entry")} />
            <PageHeader
                title={t("New Stock Entry")}
                subtitle={t("Record stock in, stock out or adjustment")}
                actions={
                    <Link
                        href={route("inventory.stock-movements.index")}
                        className="flex items-center gap-2 text-slate-600 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> {t("Back")}
                    </Link>
                }
            />
            <form onSubmit={submit} className="max-w-2xl space-y-6">
                {/* Movement Type Selector */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">
                        {t("Movement Type")}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {Object.entries(TYPE_CONFIG).map(([type, c]) => {
                            const Ic = c.icon;
                            const active = data.movement_type === type;
                            return (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() =>
                                        setData("movement_type", type)
                                    }
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all ${active ? c.color + " " + c.iconColor + " border-current" : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"}`}
                                >
                                    <Ic size={22} />
                                    {c.label}
                                </button>
                            );
                        })}
                    </div>
                    <p
                        className={`mt-3 text-xs px-3 py-2 rounded-lg border ${cfg.color} ${cfg.iconColor}`}
                    >
                        <Icon size={12} className="inline mr-1 mb-0.5" />
                        {cfg.desc}
                    </p>
                </div>

                {/* Main Fields */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Product */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("Product")}{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.product_id}
                                onChange={(e) =>
                                    setData("product_id", e.target.value)
                                }
                                className={inputCls}
                            >
                                <option value="">-- Select Product --</option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} {p.code ? `(${p.code})` : ""}
                                    </option>
                                ))}
                            </select>
                            {errors.product_id && (
                                <p className={errCls}>{errors.product_id}</p>
                            )}
                        </div>

                        {/* Warehouse */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("Warehouse")}{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.warehouse_id}
                                onChange={(e) =>
                                    setData("warehouse_id", e.target.value)
                                }
                                className={inputCls}
                            >
                                <option value="">-- Select Warehouse --</option>
                                {warehouses.map((w) => (
                                    <option key={w.id} value={w.id}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                            {errors.warehouse_id && (
                                <p className={errCls}>{errors.warehouse_id}</p>
                            )}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("Date")}{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.movement_date}
                                onChange={(e) =>
                                    setData("movement_date", e.target.value)
                                }
                                className={inputCls}
                            />
                            {errors.movement_date && (
                                <p className={errCls}>{errors.movement_date}</p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Quantity <span className="text-red-500">*</span>
                                {data.movement_type === "out" && (
                                    <span className="text-xs text-red-400 ml-1">
                                        (units to remove)
                                    </span>
                                )}
                                {data.movement_type === "adjustment" && (
                                    <span className="text-xs text-amber-500 ml-1">
                                        (+ to add, use negative to reduce)
                                    </span>
                                )}
                            </label>
                            <input
                                type="number"
                                step="0.0001"
                                value={data.quantity}
                                onChange={(e) =>
                                    setData("quantity", e.target.value)
                                }
                                className={inputCls}
                                placeholder="0.00"
                            />
                            {errors.quantity && (
                                <p className={errCls}>{errors.quantity}</p>
                            )}
                        </div>

                        {/* Unit Cost (only for stock_in) */}
                        {data.movement_type === "in" && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {t("Unit Cost (BDT)")}
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.unit_cost}
                                    onChange={(e) =>
                                        setData("unit_cost", e.target.value)
                                    }
                                    className={inputCls}
                                    placeholder="0.00"
                                />
                                <p className="text-xs text-slate-400 mt-1">
                                    {t(
                                        "Used to calculate weighted average cost",
                                    )}
                                </p>
                                {errors.unit_cost && (
                                    <p className={errCls}>{errors.unit_cost}</p>
                                )}
                            </div>
                        )}

                        {/* Reference */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("Reference")}
                            </label>
                            <input
                                type="text"
                                value={data.reference_type}
                                onChange={(e) =>
                                    setData("reference_type", e.target.value)
                                }
                                className={inputCls}
                                placeholder="e.g. PO-001, GRN-005, Physical Count"
                            />
                            {errors.reference_type && (
                                <p className={errCls}>
                                    {errors.reference_type}
                                </p>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("Notes")}
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                rows={2}
                                className={inputCls}
                                placeholder={t("Optional remarks...")}
                            />
                        </div>
                    </div>

                    {/* Product info card */}
                    {selectedProduct && (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm grid grid-cols-3 gap-4">
                            <div>
                                <span className="text-slate-500">
                                    Cost Price:
                                </span>{" "}
                                <span className="font-medium ml-1">
                                    ৳
                                    {Number(
                                        selectedProduct.cost_price || 0,
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500">
                                    Sale Price:
                                </span>{" "}
                                <span className="font-medium ml-1">
                                    ৳
                                    {Number(
                                        selectedProduct.sale_price || 0,
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500">Code:</span>{" "}
                                <span className="font-medium ml-1">
                                    {selectedProduct.code || "—"}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <Link
                        href={route("inventory.stock-movements.index")}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className={`flex items-center gap-2 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 ${data.movement_type === "in" ? "bg-green-600 hover:bg-green-700" : data.movement_type === "out" ? "bg-red-600 hover:bg-red-700" : "bg-amber-500 hover:bg-amber-600"}`}
                    >
                        <Save size={16} />{" "}
                        {processing
                            ? "Saving..."
                            : `Record ${TYPE_CONFIG[data.movement_type].label}`}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

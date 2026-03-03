import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { useState } from "react";
import {
    Play,
    RotateCcw,
    TrendingUp,
    TrendingDown,
    DollarSign,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

function Slider({
    label,
    param,
    value,
    min,
    max,
    step,
    onChange,
    description,
}) {
    return (
        <div className="mb-5">
            <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700">
                    {label}
                </label>
                <span
                    className={`text-sm font-bold ${value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-slate-500"}`}
                >
                    {value > 0 ? "+" : ""}
                    {value}%
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(param, parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{min}%</span>
                <span className="text-slate-400">{description}</span>
                <span>+{max}%</span>
            </div>
        </div>
    );
}

function DeltaBadge({ value }) {
    if (value === 0)
        return <span className="text-slate-400 text-sm">{t("No change")}</span>;
    const isPos = value > 0;
    return (
        <span
            className={`flex items-center gap-1 text-sm font-semibold ${isPos ? "text-green-600" : "text-red-600"}`}
        >
            {isPos ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPos ? "+" : ""}${Number(Math.abs(value)).toLocaleString()}
        </span>
    );
}

export default function Simulation({ baseMetrics, simResult, params }) {
    const { t } = useTranslation();
    const [localParams, setLocalParams] = useState({
        teamSizeChange: params?.teamSizeChange ?? 0,
        priceChange: params?.priceChange ?? 0,
        convRateChange: params?.convRateChange ?? 0,
        inventoryChange: params?.inventoryChange ?? 0,
    });

    const handleChange = (key, val) =>
        setLocalParams((p) => ({ ...p, [key]: val }));

    const runSim = () => {
        router.get(route("ie.simulation"), localParams, {
            preserveState: true,
            replace: true,
        });
    };

    const resetSim = () => {
        const reset = {
            teamSizeChange: 0,
            priceChange: 0,
            convRateChange: 0,
            inventoryChange: 0,
        };
        setLocalParams(reset);
        router.get(route("ie.simulation"), reset, {
            preserveState: true,
            replace: true,
        });
    };

    const fmt = (n) => Number(n ?? 0).toLocaleString();

    return (
        <AppLayout>
            <Head title={t("Simulation & What-If Analysis")} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={t("Simulation & What-If Analysis Tool")}
                    subtitle={t("Strategic planning support using Operations Research & System Modeling")}
                />

                <div className="flex flex-wrap gap-2">
                    {[
                        "Operations Research",
                        "System Modeling",
                        "Scenario Planning",
                        "Sensitivity Analysis",
                    ].map((c) => (
                        <span
                            key={c}
                            className="text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700"
                        >
                            {c}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-5">
                            Simulation Parameters
                        </h3>

                        <Slider
                            label="Sales Team Size Change"
                            param="teamSizeChange"
                            value={localParams.teamSizeChange}
                            min={-50}
                            max={100}
                            step={5}
                            onChange={handleChange}
                            description="Impact on orders & cost"
                        />
                        <Slider
                            label="Pricing Strategy Change"
                            param="priceChange"
                            value={localParams.priceChange}
                            min={-30}
                            max={50}
                            step={5}
                            onChange={handleChange}
                            description="Direct revenue impact"
                        />
                        <Slider
                            label="Conversion Rate Change"
                            param="convRateChange"
                            value={localParams.convRateChange}
                            min={-50}
                            max={100}
                            step={5}
                            onChange={handleChange}
                            description="More leads → deals"
                        />
                        <Slider
                            label="Inventory Level Change"
                            param="inventoryChange"
                            value={localParams.inventoryChange}
                            min={-50}
                            max={100}
                            step={5}
                            onChange={handleChange}
                            description="Stock availability"
                        />

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={runSim}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-700 transition"
                            >
                                <Play size={14} /> {t("Run Simulation")}
                            </button>
                            <button
                                onClick={resetSim}
                                className="px-4 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 text-sm font-medium py-2.5 rounded-lg hover:bg-slate-200 transition"
                            >
                                <RotateCcw size={14} /> {t("Reset")}
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4">
                                Simulation Results
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    {
                                        label: "Simulated Revenue",
                                        base: baseMetrics?.revenue,
                                        sim: simResult?.revenue,
                                        icon: DollarSign,
                                        color: "green",
                                    },
                                    {
                                        label: "Simulated Cost",
                                        base: baseMetrics?.cost,
                                        sim: simResult?.cost,
                                        icon: TrendingDown,
                                        color: "red",
                                    },
                                    {
                                        label: "Simulated Profit",
                                        base: baseMetrics?.profit,
                                        sim: simResult?.profit,
                                        icon: TrendingUp,
                                        color: "blue",
                                    },
                                    {
                                        label: "Profit Change",
                                        base: 0,
                                        sim: simResult?.change,
                                        icon: TrendingUp,
                                        color:
                                            simResult?.change >= 0
                                                ? "green"
                                                : "red",
                                    },
                                ].map((r, i) => (
                                    <div
                                        key={i}
                                        className={`rounded-lg bg-${r.color}-50 p-4`}
                                    >
                                        <p
                                            className={`text-xl font-bold text-${r.color}-700`}
                                        >
                                            ${fmt(r.sim)}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {r.label}
                                        </p>
                                        {r.base !== 0 && (
                                            <p className="text-xs text-slate-400 mt-1">
                                                Base: ${fmt(r.base)}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Base vs Simulated */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4">
                                Base vs Simulated Comparison
                            </h3>
                            {[
                                {
                                    label: "Revenue",
                                    base: baseMetrics?.revenue,
                                    sim: simResult?.revenue,
                                },
                                {
                                    label: "Cost",
                                    base: baseMetrics?.cost,
                                    sim: simResult?.cost,
                                },
                                {
                                    label: "Profit",
                                    base: baseMetrics?.profit,
                                    sim: simResult?.profit,
                                },
                            ].map((r, i) => {
                                const max = Math.max(r.base, r.sim, 1);
                                const isGain = r.sim >= r.base;
                                return (
                                    <div key={i} className="mb-4">
                                        <div className="flex justify-between text-xs mb-1 text-slate-500">
                                            <span>{r.label}</span>
                                            <DeltaBadge
                                                value={
                                                    (r.sim ?? 0) - (r.base ?? 0)
                                                }
                                            />
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full">
                                                <div
                                                    className="h-2 bg-slate-400 rounded-full"
                                                    style={{
                                                        width: `${(r.base / max) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-1 items-center mt-0.5">
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full">
                                                <div
                                                    className={`h-2 rounded-full ${isGain ? "bg-green-500" : "bg-red-400"}`}
                                                    style={{
                                                        width: `${(r.sim / max) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                                            <span>Base: ${fmt(r.base)}</span>
                                            <span>Sim: ${fmt(r.sim)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-cyan-800 mb-1">
                        🔬 What-If Scenarios
                    </h4>
                    <p className="text-sm text-cyan-700">
                        Use the sliders to simulate strategic decisions: hiring
                        more sales reps, raising prices, improving lead
                        conversion, or adjusting inventory. Results are based on
                        your actual historical data using a simplified
                        operations research model.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

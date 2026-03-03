import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

const METHODS = [
    { value: "straight_line", label: "Straight Line" },
    { value: "declining_balance", label: "Declining Balance" },
    { value: "sum_of_years", label: "Sum of Years" },
];

const defaultData = {
    name: "",
    useful_life_years: 5,
    depreciation_rate: 20,
    depreciation_method: "straight_line",
};

export default function AssetCategoriesIndex({ categories }) {
    const { t } = useTranslation();
    const [editing, setEditing] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const addForm = useForm(defaultData);
    const editForm = useForm({ ...defaultData, is_active: true });

    const startEdit = (c) => {
        setEditing(c.id);
        editForm.setData({
            name: c.name,
            useful_life_years: c.useful_life_years,
            depreciation_rate: c.depreciation_rate,
            depreciation_method: c.depreciation_method,
            is_active: c.is_active,
        });
    };
    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post(route("assets.asset-categories.store"), {
            onSuccess: () => {
                addForm.reset();
                setShowAdd(false);
            },
        });
    };
    const submitEdit = (e, id) => {
        e.preventDefault();
        editForm.put(route("assets.asset-categories.update", id), {
            onSuccess: () => setEditing(null),
        });
    };
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(
                "Delete this asset category? This cannot be undone.",
                {
                    title: t("Delete Category"),
                    confirmLabel: t("Delete"),
                    intent: "danger",
                },
            )
        )
            router.delete(route("assets.asset-categories.destroy", id));
    };

    return (
        <AppLayout title={t("Asset Categories")}>
            <Head title={t("Asset Categories")} />
            <PageHeader
                title={t("Asset Categories")}
                subtitle={`${categories.length} ${t("categories")}`}
                actions={
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("Add Category")}
                    </button>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                {t("Category")}
                            </th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                {t("Useful Life (yrs)")}
                            </th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                {t("Dep. Rate (%)")}
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                {t("Method")}
                            </th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                {t("Status")}
                            </th>
                            <th className="px-4 py-3 w-24"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {showAdd && (
                            <tr className="bg-blue-50">
                                <td className="px-3 py-2">
                                    <input
                                        value={addForm.data.name}
                                        onChange={(e) =>
                                            addForm.setData(
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                        className="border rounded px-2 py-1 w-full text-sm"
                                        placeholder={t("Category name")}
                                    />
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <input
                                        type="number"
                                        value={addForm.data.useful_life_years}
                                        onChange={(e) =>
                                            addForm.setData(
                                                "useful_life_years",
                                                e.target.value,
                                            )
                                        }
                                        className="border rounded px-2 py-1 w-20 text-sm text-center"
                                    />
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <input
                                        type="number"
                                        value={addForm.data.depreciation_rate}
                                        onChange={(e) =>
                                            addForm.setData(
                                                "depreciation_rate",
                                                e.target.value,
                                            )
                                        }
                                        className="border rounded px-2 py-1 w-20 text-sm text-center"
                                    />
                                </td>
                                <td className="px-3 py-2">
                                    <select
                                        value={addForm.data.depreciation_method}
                                        onChange={(e) =>
                                            addForm.setData(
                                                "depreciation_method",
                                                e.target.value,
                                            )
                                        }
                                        className="border rounded px-2 py-1 text-sm"
                                    >
                                        {METHODS.map((m) => (
                                            <option
                                                key={m.value}
                                                value={m.value}
                                            >
                                                {m.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td></td>
                                <td className="px-3 py-2">
                                    <div className="flex gap-1">
                                        <button
                                            onClick={submitAdd}
                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                        >
                                            <Check size={15} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowAdd(false);
                                                addForm.reset();
                                            }}
                                            className="p-1.5 text-slate-400 rounded"
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {categories.length === 0 && !showAdd && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center text-slate-400"
                                >
                                    {t("No asset categories found.")}
                                </td>
                            </tr>
                        )}
                        {categories.map((c) => (
                            <tr
                                key={c.id}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                {editing === c.id ? (
                                    <>
                                        <td className="px-3 py-2">
                                            <input
                                                value={editForm.data.name}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                className="border rounded px-2 py-1 w-full text-sm"
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <input
                                                type="number"
                                                value={
                                                    editForm.data
                                                        .useful_life_years
                                                }
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "useful_life_years",
                                                        e.target.value,
                                                    )
                                                }
                                                className="border rounded px-2 py-1 w-20 text-sm text-center"
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <input
                                                type="number"
                                                value={
                                                    editForm.data
                                                        .depreciation_rate
                                                }
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "depreciation_rate",
                                                        e.target.value,
                                                    )
                                                }
                                                className="border rounded px-2 py-1 w-20 text-sm text-center"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <select
                                                value={
                                                    editForm.data
                                                        .depreciation_method
                                                }
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "depreciation_method",
                                                        e.target.value,
                                                    )
                                                }
                                                className="border rounded px-2 py-1 text-sm"
                                            >
                                                {METHODS.map((m) => (
                                                    <option
                                                        key={m.value}
                                                        value={m.value}
                                                    >
                                                        {m.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <select
                                                value={
                                                    editForm.data.is_active
                                                        ? "1"
                                                        : "0"
                                                }
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "is_active",
                                                        e.target.value === "1",
                                                    )
                                                }
                                                className="border rounded px-2 py-1 text-sm"
                                            >
                                                <option value="1">
                                                    Active
                                                </option>
                                                <option value="0">
                                                    Inactive
                                                </option>
                                            </select>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={(e) =>
                                                        submitEdit(e, c.id)
                                                    }
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                >
                                                    <Check size={15} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setEditing(null)
                                                    }
                                                    className="p-1.5 text-slate-400 rounded"
                                                >
                                                    <X size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {c.name}
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-600">
                                            {c.useful_life_years}
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-600">
                                            {c.depreciation_rate}%
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {
                                                METHODS.find(
                                                    (m) =>
                                                        m.value ===
                                                        c.depreciation_method,
                                                )?.label
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge
                                                color={
                                                    c.is_active
                                                        ? "green"
                                                        : "slate"
                                                }
                                            >
                                                {c.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => startEdit(c)}
                                                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => del(c.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";

export default function UnitsIndex({ units }) {
    const [editing, setEditing] = useState(null);
    const [showAdd, setShowAdd] = useState(false);

    const addForm = useForm({ name: "", abbreviation: "" });
    const editForm = useForm({ name: "", abbreviation: "", is_active: true });

    const startEdit = (u) => {
        setEditing(u.id);
        editForm.setData({
            name: u.name,
            abbreviation: u.abbreviation,
            is_active: u.is_active,
        });
    };

    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post(route("settings.units.store"), {
            onSuccess: () => {
                addForm.reset();
                setShowAdd(false);
            },
        });
    };

    const submitEdit = (e, id) => {
        e.preventDefault();
        editForm.put(route("settings.units.update", id), {
            onSuccess: () => setEditing(null),
        });
    };

    const { confirm: dlgConfirm } = useDialog();

    const del = async (id) => {
        if (
            await dlgConfirm("Delete this unit? This cannot be undone.", {
                title: "Delete Unit",
                confirmLabel: "Delete",
                intent: "danger",
            })
        )
            router.delete(route("settings.units.destroy", id));
    };

    return (
        <AppLayout title="Units of Measurement">
            <Head title="Units of Measurement" />
            <PageHeader
                title="Units of Measurement"
                subtitle={`${units.length} units`}
                actions={
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> Add Unit
                    </button>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Name
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Abbreviation
                            </th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 w-24"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {showAdd && (
                            <tr className="bg-blue-50">
                                <td className="px-4 py-2">
                                    <input
                                        value={addForm.data.name}
                                        onChange={(e) =>
                                            addForm.setData(
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                        className="border rounded px-2 py-1 w-full text-sm"
                                        placeholder="Unit name"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        value={addForm.data.abbreviation}
                                        onChange={(e) =>
                                            addForm.setData(
                                                "abbreviation",
                                                e.target.value,
                                            )
                                        }
                                        className="border rounded px-2 py-1 w-24 text-sm"
                                        placeholder="e.g. kg"
                                    />
                                </td>
                                <td></td>
                                <td className="px-4 py-2">
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
                                            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {units.length === 0 && !showAdd && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-6 py-12 text-center text-slate-400"
                                >
                                    No units found. Add your first unit above.
                                </td>
                            </tr>
                        )}
                        {units.map((u) => (
                            <tr
                                key={u.id}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                {editing === u.id ? (
                                    <>
                                        <td className="px-4 py-2">
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
                                        <td className="px-4 py-2">
                                            <input
                                                value={
                                                    editForm.data.abbreviation
                                                }
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "abbreviation",
                                                        e.target.value,
                                                    )
                                                }
                                                className="border rounded px-2 py-1 w-24 text-sm"
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
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
                                        <td className="px-4 py-2">
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={(e) =>
                                                        submitEdit(e, u.id)
                                                    }
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                >
                                                    <Check size={15} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setEditing(null)
                                                    }
                                                    className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"
                                                >
                                                    <X size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {u.name}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-slate-600 text-xs bg-slate-50 w-28">
                                            {u.abbreviation}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge
                                                color={
                                                    u.is_active
                                                        ? "green"
                                                        : "slate"
                                                }
                                            >
                                                {u.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => startEdit(u)}
                                                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => del(u.id)}
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

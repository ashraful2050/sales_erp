import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";

export default function DepartmentsIndex({ departments }) {
    const [editing, setEditing] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const addForm = useForm({ name: "", code: "", parent_id: "" });
    const editForm = useForm({
        name: "",
        code: "",
        parent_id: "",
        is_active: true,
    });

    const startEdit = (d) => {
        setEditing(d.id);
        editForm.setData({
            name: d.name,
            code: d.code ?? "",
            parent_id: d.parent_id ?? "",
            is_active: d.is_active,
        });
    };
    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post(route("hr.departments.store"), {
            onSuccess: () => {
                addForm.reset();
                setShowAdd(false);
            },
        });
    };
    const submitEdit = (e, id) => {
        e.preventDefault();
        editForm.put(route("hr.departments.update", id), {
            onSuccess: () => setEditing(null),
        });
    };
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm("Delete this department? This cannot be undone.", {
                title: "Delete Department",
                confirmLabel: "Delete",
                intent: "danger",
            })
        )
            router.delete(route("hr.departments.destroy", id));
    };

    const parentOptions = departments.filter((d) => d.id !== editing);

    return (
        <AppLayout title="Departments">
            <Head title="Departments" />
            <PageHeader
                title="Departments"
                subtitle={`${departments.length} departments`}
                actions={
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> Add Department
                    </button>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Department
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Code
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Parent
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
                                        placeholder="Department name"
                                    />
                                </td>
                                <td className="px-3 py-2">
                                    <input
                                        value={addForm.data.code}
                                        onChange={(e) =>
                                            addForm.setData(
                                                "code",
                                                e.target.value,
                                            )
                                        }
                                        className="border rounded px-2 py-1 w-24 text-sm"
                                        placeholder="Code"
                                    />
                                </td>
                                <td className="px-3 py-2">
                                    <select
                                        value={addForm.data.parent_id}
                                        onChange={(e) =>
                                            addForm.setData(
                                                "parent_id",
                                                e.target.value,
                                            )
                                        }
                                        className="border rounded px-2 py-1 text-sm w-full"
                                    >
                                        <option value="">— None —</option>
                                        {departments.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.name}
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
                                            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {departments.length === 0 && !showAdd && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center text-slate-400"
                                >
                                    No departments found.
                                </td>
                            </tr>
                        )}
                        {departments.map((d) => (
                            <tr
                                key={d.id}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                {editing === d.id ? (
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
                                        <td className="px-3 py-2">
                                            <input
                                                value={editForm.data.code}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "code",
                                                        e.target.value,
                                                    )
                                                }
                                                className="border rounded px-2 py-1 w-24 text-sm"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <select
                                                value={editForm.data.parent_id}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "parent_id",
                                                        e.target.value,
                                                    )
                                                }
                                                className="border rounded px-2 py-1 text-sm w-full"
                                            >
                                                <option value="">
                                                    — None —
                                                </option>
                                                {parentOptions.map((p) => (
                                                    <option
                                                        key={p.id}
                                                        value={p.id}
                                                    >
                                                        {p.name}
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
                                                        submitEdit(e, d.id)
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
                                            {d.name}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                            {d.code ?? "—"}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {d.parent?.name ?? "—"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge
                                                color={
                                                    d.is_active
                                                        ? "green"
                                                        : "slate"
                                                }
                                            >
                                                {d.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => startEdit(d)}
                                                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => del(d.id)}
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

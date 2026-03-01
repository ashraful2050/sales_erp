import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";

const TYPE_COLORS = { earning: "green", deduction: "red" };

export default function SalaryComponentsIndex({ components }) {
    const [editing, setEditing] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const addForm = useForm({
        name: "",
        type: "earning",
        is_taxable: false,
        is_pf_applicable: false,
    });
    const editForm = useForm({
        name: "",
        type: "earning",
        is_taxable: false,
        is_pf_applicable: false,
        is_active: true,
    });

    const startEdit = (c) => {
        setEditing(c.id);
        editForm.setData({
            name: c.name,
            type: c.type,
            is_taxable: c.is_taxable,
            is_pf_applicable: c.is_pf_applicable,
            is_active: c.is_active,
        });
    };
    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post(route("hr.salary-components.store"), {
            onSuccess: () => {
                addForm.reset();
                setShowAdd(false);
            },
        });
    };
    const submitEdit = (e, id) => {
        e.preventDefault();
        editForm.put(route("hr.salary-components.update", id), {
            onSuccess: () => setEditing(null),
        });
    };
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(
                "Delete this salary component? This cannot be undone.",
                {
                    title: "Delete Salary Component",
                    confirmLabel: "Delete",
                    intent: "danger",
                },
            )
        )
            router.delete(route("hr.salary-components.destroy", id));
    };

    const FormRow = ({ f, onChange, extra }) => (
        <>
            <td className="px-3 py-2">
                <input
                    value={f.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    className="border rounded px-2 py-1 w-full text-sm"
                    placeholder="Component name"
                />
            </td>
            <td className="px-3 py-2">
                <select
                    value={f.type}
                    onChange={(e) => onChange("type", e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                >
                    <option value="earning">Earning</option>
                    <option value="deduction">Deduction</option>
                </select>
            </td>
            <td className="px-3 py-2 text-center">
                <input
                    type="checkbox"
                    checked={f.is_taxable}
                    onChange={(e) => onChange("is_taxable", e.target.checked)}
                    className="w-4 h-4"
                />
            </td>
            <td className="px-3 py-2 text-center">
                <input
                    type="checkbox"
                    checked={f.is_pf_applicable}
                    onChange={(e) =>
                        onChange("is_pf_applicable", e.target.checked)
                    }
                    className="w-4 h-4"
                />
            </td>
            {extra}
        </>
    );

    return (
        <AppLayout title="Salary Components">
            <Head title="Salary Components" />
            <PageHeader
                title="Salary Components"
                subtitle={`${components.length} components`}
                actions={
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> Add Component
                    </button>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Component Name
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Type
                            </th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                Taxable
                            </th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                PF Applicable
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
                                <FormRow
                                    f={addForm.data}
                                    onChange={(k, v) => addForm.setData(k, v)}
                                    extra={
                                        <>
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
                                        </>
                                    }
                                />
                            </tr>
                        )}
                        {components.length === 0 && !showAdd && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center text-slate-400"
                                >
                                    No salary components found.
                                </td>
                            </tr>
                        )}
                        {components.map((c) => (
                            <tr
                                key={c.id}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                {editing === c.id ? (
                                    <FormRow
                                        f={editForm.data}
                                        onChange={(k, v) =>
                                            editForm.setData(k, v)
                                        }
                                        extra={
                                            <>
                                                <td className="px-3 py-2 text-center">
                                                    <select
                                                        value={
                                                            editForm.data
                                                                .is_active
                                                                ? "1"
                                                                : "0"
                                                        }
                                                        onChange={(e) =>
                                                            editForm.setData(
                                                                "is_active",
                                                                e.target
                                                                    .value ===
                                                                    "1",
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
                                                                submitEdit(
                                                                    e,
                                                                    c.id,
                                                                )
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
                                        }
                                    />
                                ) : (
                                    <>
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {c.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge color={TYPE_COLORS[c.type]}>
                                                {c.type
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    c.type.slice(1)}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {c.is_taxable ? (
                                                <span className="text-green-600 font-medium">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {c.is_pf_applicable ? (
                                                <span className="text-green-600 font-medium">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">
                                                    No
                                                </span>
                                            )}
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
                                        <td className="px-6 py-4">
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

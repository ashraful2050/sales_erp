import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

export default function LeaveTypesIndex({ leaveTypes }) {
    const { t } = useTranslation();
    const [editing, setEditing] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const addForm = useForm({ name: "" });
    const editForm = useForm({ name: "" });

    const startEdit = (lt) => {
        setEditing(lt.id);
        editForm.setData({ name: lt.name });
    };

    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post(route("hr.leave-types.store"), {
            onSuccess: () => {
                addForm.reset();
                setShowAdd(false);
            },
        });
    };
    const submitEdit = (e, id) => {
        e.preventDefault();
        editForm.put(route("hr.leave-types.update", id), {
            onSuccess: () => setEditing(null),
        });
    };
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(t("Delete this leave type? This cannot be undone."), {
                title: t("Delete Leave Type"),
                confirmLabel: t("Delete"),
                intent: "danger",
            })
        )
            router.delete(route("hr.leave-types.destroy", id));
    };

    return (
        <AppLayout title={t("Leave Types")}>
            <Head title={t("Leave Types")} />
            <PageHeader
                title={t("Leave Types")}
                subtitle={`${leaveTypes.length} ${t("types")}`}
                actions={
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} /> {t("Add Leave Type")}
                    </button>
                }
            />
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                                {t("Leave Type Name")}
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
                                        placeholder="e.g. Annual Leave, Sick Leave"
                                    />
                                </td>
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
                        {leaveTypes.length === 0 && !showAdd && (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="px-6 py-12 text-center text-slate-400"
                                >
                                    {t("No leave types found.")}
                                </td>
                            </tr>
                        )}
                        {leaveTypes.map((lt) => (
                            <tr
                                key={lt.id}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                {editing === lt.id ? (
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
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={(e) =>
                                                        submitEdit(e, lt.id)
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
                                            {lt.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() =>
                                                        startEdit(lt)
                                                    }
                                                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => del(lt.id)}
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

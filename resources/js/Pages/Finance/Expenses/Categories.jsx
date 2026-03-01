import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Plus, Pencil, Trash2, ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";

export default function ExpenseCategories({ categories }) {
    const { confirm: dlgConfirm } = useDialog();
    const [editing, setEditing] = useState(null);
    const add = useForm({ name: "", description: "" });
    const edit = useForm({ name: "", description: "", is_active: true });

    const delCat = async (id) => {
        if (
            await dlgConfirm(
                "Delete this expense category? This cannot be undone.",
                {
                    title: "Delete Category",
                    confirmLabel: "Delete",
                    intent: "danger",
                },
            )
        )
            router.delete(route("finance.expense-categories.destroy", id));
    };

    const startEdit = (cat) => {
        setEditing(cat.id);
        edit.setData({
            name: cat.name,
            description: cat.description ?? "",
            is_active: cat.is_active,
        });
    };

    return (
        <AppLayout title="Expense Categories">
            <Head title="Expense Categories" />
            <PageHeader
                title="Expense Categories"
                subtitle="Organise expenses by type"
                actions={
                    <Link
                        href={route("finance.expenses.index")}
                        className="flex items-center gap-2 text-slate-600 text-sm"
                    >
                        <ArrowLeft size={16} /> Back to Expenses
                    </Link>
                }
            />
            <div className="max-w-2xl space-y-6">
                {/* Add form */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">
                        Add New Category
                    </h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            add.post(
                                route("finance.expense-categories.store"),
                                { onSuccess: () => add.reset() },
                            );
                        }}
                        className="flex gap-3"
                    >
                        <input
                            value={add.data.name}
                            onChange={(e) =>
                                add.setData("name", e.target.value)
                            }
                            placeholder="Category name *"
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            value={add.data.description}
                            onChange={(e) =>
                                add.setData("description", e.target.value)
                            }
                            placeholder="Description (optional)"
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={add.processing}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            <Plus size={15} /> Add
                        </button>
                    </form>
                    {add.errors.name && (
                        <p className="mt-1 text-xs text-red-500">
                            {add.errors.name}
                        </p>
                    )}
                </div>

                {/* List */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {["Name", "Description", "Active", ""].map(
                                    (h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase"
                                        >
                                            {h}
                                        </th>
                                    ),
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center py-10 text-slate-400"
                                    >
                                        No categories yet.
                                    </td>
                                </tr>
                            )}
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-slate-50">
                                    {editing === cat.id ? (
                                        <>
                                            <td className="px-4 py-2">
                                                <input
                                                    value={edit.data.name}
                                                    onChange={(e) =>
                                                        edit.setData(
                                                            "name",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="border border-slate-200 rounded px-2 py-1 text-sm w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    value={
                                                        edit.data.description
                                                    }
                                                    onChange={(e) =>
                                                        edit.setData(
                                                            "description",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="border border-slate-200 rounded px-2 py-1 text-sm w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        edit.data.is_active
                                                    }
                                                    onChange={(e) =>
                                                        edit.setData(
                                                            "is_active",
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="px-4 py-2 flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        edit.put(
                                                            route(
                                                                "finance.expense-categories.update",
                                                                cat.id,
                                                            ),
                                                            {
                                                                onSuccess: () =>
                                                                    setEditing(
                                                                        null,
                                                                    ),
                                                            },
                                                        )
                                                    }
                                                    className="text-green-600 hover:text-green-700"
                                                >
                                                    <Save size={15} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setEditing(null)
                                                    }
                                                    className="text-slate-400 hover:text-slate-600 text-xs"
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3 font-medium">
                                                {cat.name}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {cat.description ?? "—"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`text-xs font-medium ${cat.is_active ? "text-green-600" : "text-slate-400"}`}
                                                >
                                                    {cat.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() =>
                                                            startEdit(cat)
                                                        }
                                                        className="text-slate-400 hover:text-blue-600"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            delCat(cat.id)
                                                        }
                                                        className="text-slate-400 hover:text-red-600"
                                                    >
                                                        <Trash2 size={14} />
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
            </div>
        </AppLayout>
    );
}

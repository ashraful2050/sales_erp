import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Plus, Pencil, Trash2, ShieldCheck, User } from "lucide-react";
import { fmtDate } from "@/utils/date";
import { useDialog } from "@/hooks/useDialog";

const roleBadge = {
    superadmin: "bg-purple-100 text-purple-700",
    admin: "bg-blue-100 text-blue-700",
    moderator: "bg-teal-100 text-teal-700",
    user: "bg-slate-100 text-slate-600",
};

export default function UsersIndex({ users }) {
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id, name) => {
        if (
            await dlgConfirm(`Deleting "${name}" cannot be undone.`, {
                title: `Delete User "${name}"?`,
                confirmLabel: "Delete",
                intent: "danger",
            })
        ) {
            router.delete(route("settings.users.destroy", id));
        }
    };

    return (
        <AppLayout title="User Management">
            <Head title="User Management" />
            <PageHeader
                title="User Management"
                subtitle="Manage team members and their roles"
                actions={
                    <Link
                        href={route("settings.users.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={15} /> Add User
                    </Link>
                }
            />

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-5 py-3 w-24"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users?.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-12 text-slate-400"
                                >
                                    No users found.
                                </td>
                            </tr>
                        )}
                        {users?.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50">
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <User size={15} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">
                                                {u.name}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {u.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3">
                                    <span
                                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${roleBadge[u.role] ?? "bg-slate-100 text-slate-600"}`}
                                    >
                                        <ShieldCheck size={11} /> {u.role}
                                    </span>
                                </td>
                                <td className="px-5 py-3">
                                    <span
                                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                                    >
                                        {u.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-slate-400 text-xs">
                                    {fmtDate(u.created_at)}
                                </td>
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-1 justify-end">
                                        <Link
                                            href={route(
                                                "settings.users.edit",
                                                u.id,
                                            )}
                                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                        >
                                            <Pencil size={14} />
                                        </Link>
                                        <button
                                            onClick={() => del(u.id, u.name)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}

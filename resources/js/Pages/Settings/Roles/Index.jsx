import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Plus, Pencil, Trash2, ShieldCheck, Users } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";

export default function RolesIndex({ roles, isAdminMode }) {
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id, name) => {
        if (
            await dlgConfirm(
                `Users with role "${name}" will lose their permissions.`,
                {
                    title: `Delete Role "${name}"?`,
                    confirmLabel: "Delete",
                    intent: "danger",
                },
            )
        ) {
            router.delete(route("settings.roles.destroy", id));
        }
    };

    return (
        <AppLayout
            title={isAdminMode ? "Moderator Roles" : "Roles & Permissions"}
        >
            <Head
                title={isAdminMode ? "Moderator Roles" : "Roles & Permissions"}
            />
            <PageHeader
                title={isAdminMode ? "Moderator Roles" : "Roles & Permissions"}
                subtitle={
                    isAdminMode
                        ? "Create roles for moderators — limited to your own granted permissions"
                        : "Define roles and control what each role can do"
                }
                actions={
                    <Link
                        href={route("settings.roles.create")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus size={15} /> New Role
                    </Link>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles?.length === 0 && (
                    <div className="col-span-3 text-center py-16 text-slate-400">
                        No roles found. Create your first role.
                    </div>
                )}
                {roles?.map((role) => {
                    const permCount = role.permissions
                        ? Object.values(role.permissions).filter(Boolean).length
                        : 0;
                    const totalPerms = role.permissions
                        ? Object.keys(role.permissions).length
                        : 0;

                    return (
                        <div
                            key={role.id}
                            className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 capitalize">
                                            {role.name}
                                        </h3>
                                        {role.is_system && (
                                            <span className="text-xs text-slate-400">
                                                System role
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Link
                                        href={route(
                                            "settings.roles.edit",
                                            role.id,
                                        )}
                                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                    >
                                        <Pencil size={14} />
                                    </Link>
                                    {!role.is_system && (
                                        <button
                                            onClick={() =>
                                                del(role.id, role.name)
                                            }
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Users size={13} /> {role.users_count}{" "}
                                    user(s)
                                </span>
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                    {permCount}/{totalPerms} permissions
                                </span>
                            </div>

                            {/* Permission bar */}
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all"
                                    style={{
                                        width:
                                            totalPerms > 0
                                                ? `${(permCount / totalPerms) * 100}%`
                                                : "0%",
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </AppLayout>
    );
}

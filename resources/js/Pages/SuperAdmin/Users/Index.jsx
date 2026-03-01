import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Search, UserX, Plus, Shield, X } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";

export default function UsersIndex({ users, filters, companies }) {
    const { confirm: dlgConfirm } = useDialog();
    const [search, setSearch] = useState(filters.search ?? "");
    const [companyId, setCompanyId] = useState(filters.company_id ?? "");
    const [showSuperAdminModal, setShowSuperAdminModal] = useState(false);

    const applyFilter = () => {
        router.get(
            route("superadmin.users.index"),
            { search, company_id: companyId },
            { preserveState: true, replace: true },
        );
    };

    const deactivate = async (userId) => {
        if (
            await dlgConfirm("This user will no longer be able to log in.", {
                title: "Deactivate User?",
                confirmLabel: "Deactivate",
                intent: "warning",
            })
        ) {
            router.delete(route("superadmin.users.destroy", userId));
        }
    };

    return (
        <SuperAdminLayout title="All Users">
            <Head title="Users — Super Admin" />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        All Tenant Users
                    </h2>
                    <p className="text-slate-400 text-sm mt-0.5">
                        {users.total} users across all tenants
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={route("superadmin.super-admins")}
                        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                        <Shield size={15} /> Super Admins
                    </Link>
                    <button
                        onClick={() => setShowSuperAdminModal(true)}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                        <Plus size={15} /> Add Super Admin
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 min-w-[200px]">
                    <Search size={15} className="text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyFilter()}
                        placeholder="Search users..."
                        className="bg-transparent text-slate-200 text-sm outline-none placeholder-slate-500 flex-1"
                    />
                </div>
                <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none"
                >
                    <option value="">All tenants</option>
                    {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={applyFilter}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                    Filter
                </button>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    Name
                                </th>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    Email
                                </th>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    Company
                                </th>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    Role
                                </th>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    Status
                                </th>
                                <th className="text-right text-slate-400 py-3 px-4 font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {users.data.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-slate-700/30"
                                >
                                    <td className="py-3 px-4 text-white">
                                        {user.name}
                                    </td>
                                    <td className="py-3 px-4 text-slate-400">
                                        {user.email}
                                    </td>
                                    <td className="py-3 px-4">
                                        {user.company ? (
                                            <Link
                                                href={route(
                                                    "superadmin.tenants.show",
                                                    user.company.id,
                                                )}
                                                className="text-violet-400 hover:text-violet-300 text-xs"
                                            >
                                                {user.company.name}
                                            </Link>
                                        ) : (
                                            <span className="text-slate-500 text-xs">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded-full text-xs">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs ${user.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}
                                        >
                                            {user.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        {user.is_active && (
                                            <button
                                                onClick={() =>
                                                    deactivate(user.id)
                                                }
                                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                                title="Deactivate"
                                            >
                                                <UserX size={15} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-12 text-center text-slate-500"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {users.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
                        <p className="text-sm text-slate-400">
                            Showing {users.from}–{users.to} of {users.total}
                        </p>
                        <div className="flex items-center gap-2">
                            {users.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || "#"}
                                    preserveScroll
                                    className={`px-3 py-1 text-xs rounded-md ${link.active ? "bg-violet-600 text-white" : link.url ? "bg-slate-700 text-slate-300" : "bg-slate-800 text-slate-600 cursor-not-allowed"}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showSuperAdminModal && (
                <CreateSuperAdminModal
                    onClose={() => setShowSuperAdminModal(false)}
                />
            )}
        </SuperAdminLayout>
    );
}

function CreateSuperAdminModal({ onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("superadmin.super-admins.store"), { onSuccess: onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">
                        Create Super Admin
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={submit} className="space-y-3">
                    {[
                        { key: "name", label: "Name", type: "text" },
                        { key: "email", label: "Email", type: "email" },
                        {
                            key: "password",
                            label: "Password",
                            type: "password",
                        },
                        {
                            key: "password_confirmation",
                            label: "Confirm Password",
                            type: "password",
                        },
                    ].map((f) => (
                        <div key={f.key}>
                            <label className="block text-slate-400 text-xs mb-1">
                                {f.label}
                            </label>
                            <input
                                type={f.type}
                                value={data[f.key]}
                                onChange={(e) => setData(f.key, e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none"
                            />
                            {errors[f.key] && (
                                <p className="text-red-400 text-xs mt-0.5">
                                    {errors[f.key]}
                                </p>
                            )}
                        </div>
                    ))}
                    <div className="flex gap-3 justify-end pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 text-sm text-white bg-violet-600 hover:bg-violet-700 rounded-lg disabled:opacity-60"
                        >
                            {processing ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

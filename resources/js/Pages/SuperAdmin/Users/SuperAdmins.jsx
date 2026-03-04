import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Shield, ArrowLeft, Plus, X, Users } from "lucide-react";
import { fmtDate } from "@/utils/date";
import { useTranslation } from "@/hooks/useTranslation";

export default function SuperAdmins({ admins }) {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);

    return (
        <SuperAdminLayout title="Super Admins">
            <Head title={t("Super Admins")} />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        href={route("superadmin.users.index")}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Shield size={20} className="text-violet-400" />
                            {t("Super Admins")}
                        </h2>
                        <p className="text-slate-400 text-sm mt-0.5">
                            {admins.length} super admin
                            {admins.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    <Plus size={15} /> {t("Add Super Admin")}
                </button>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    {t("Name")}
                                </th>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    {t("Email")}
                                </th>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    {t("Status")}
                                </th>
                                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                                    {t("Joined")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {admins.map((admin) => (
                                <tr
                                    key={admin.id}
                                    className="hover:bg-slate-700/30"
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-violet-400 font-semibold text-xs uppercase">
                                                {admin.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <span className="text-white font-medium">
                                                {admin.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-slate-400">
                                        {admin.email}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs ${admin.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}
                                        >
                                            {admin.is_active
                                                ? t("Active")
                                                : t("Inactive")}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-400 text-xs">
                                        {fmtDate(admin.created_at)}
                                    </td>
                                </tr>
                            ))}
                            {admins.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-12 text-center"
                                    >
                                        <Users
                                            size={32}
                                            className="mx-auto text-slate-600 mb-2"
                                        />
                                        <p className="text-slate-500">
                                            {t("No super admins found.")}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <CreateSuperAdminModal onClose={() => setShowModal(false)} />
            )}
        </SuperAdminLayout>
    );
}

function CreateSuperAdminModal({ onClose }) {
    const { t } = useTranslation();
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
                    <h3 className="text-white font-semibold flex items-center gap-2">
                        <Shield size={16} className="text-violet-400" />
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
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm outline-none focus:border-violet-500"
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
                            {t("Cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 text-sm text-white bg-violet-600 hover:bg-violet-700 rounded-lg disabled:opacity-60"
                        >
                            {processing ? t("Creating...") : t("Create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

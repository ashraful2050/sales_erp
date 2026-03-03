import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft, Info } from "lucide-react";

const Field = ({ label, error, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
        </label>
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);
const Input = ({ ...props }) => (
    <input
        {...props}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
);
const Select = ({ children, ...props }) => (
    <select
        {...props}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        {children}
    </select>
);

export default function UserForm({ editUser, roles, isAdminMode }) {
    const isEdit = !!editUser;
    const { data, setData, post, put, processing, errors } = useForm({
        name: editUser?.name ?? "",
        email: editUser?.email ?? "",
        password: "",
        password_confirmation: "",
        role: editUser?.role ?? roles?.[0]?.name ?? "moderator",
        phone: editUser?.phone ?? "",
        is_active: editUser?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit
            ? put(route("settings.users.update", editUser.id))
            : post(route("settings.users.store"));
    };

    const pageTitle = isAdminMode
        ? isEdit
            ? "Edit Moderator"
            : "Add Moderator"
        : isEdit
          ? "Edit User"
          : "Add User";

    return (
        <AppLayout title={pageTitle}>
            <Head title={pageTitle} />
            <PageHeader
                title={pageTitle}
                subtitle={
                    isEdit
                        ? `Editing: ${editUser.name}`
                        : isAdminMode
                          ? "Create a sub-user and assign a custom role limited to your granted permissions"
                          : "Create a new team member"
                }
                actions={
                    <Link
                        href={route("settings.users.index")}
                        className="flex items-center gap-2 text-slate-600 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> {t("Back")}
                    </Link>
                }
            />

            {isAdminMode && (
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800 mb-2">
                    <Info size={16} className="mt-0.5 shrink-0" />
                    <span>
                        As an <strong>{t("Admin")}</strong>, you can create{" "}
                        <strong>{t("Moderator")}</strong> accounts only. The role
                        assigned to a moderator can only include permissions
                        that you yourself have been granted by the SuperAdmin.
                    </span>
                </div>
            )}

            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        Account Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Full Name *" error={errors.name}>
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field label="Email *" error={errors.email}>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field
                            label={
                                isEdit
                                    ? "New Password (leave blank to keep)"
                                    : "Password *"
                            }
                            error={errors.password}
                        >
                            <Input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required={!isEdit}
                                autoComplete="new-password"
                            />
                        </Field>
                        <Field
                            label="Confirm Password"
                            error={errors.password_confirmation}
                        >
                            <Input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                required={!isEdit}
                                autoComplete="new-password"
                            />
                        </Field>
                        <Field label="Phone" error={errors.phone}>
                            <Input
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Role *" error={errors.role}>
                            <Select
                                value={data.role}
                                onChange={(e) =>
                                    setData("role", e.target.value)
                                }
                                required
                            >
                                {roles?.map((r) => (
                                    <option key={r.id} value={r.name}>
                                        {r.name.charAt(0).toUpperCase() +
                                            r.name.slice(1)}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData("is_active", e.target.checked)
                            }
                            className="w-4 h-4 rounded border-slate-300 text-blue-600"
                        />
                        <span className="text-sm text-slate-700">
                            {t("Active account")}
                        </span>
                    </label>
                </div>

                <div className="flex justify-end gap-3 pb-8">
                    <Link
                        href={route("settings.users.index")}
                        className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium"
                    >
                        <Save size={16} />{" "}
                        {isEdit ? "Update User" : "Create User"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

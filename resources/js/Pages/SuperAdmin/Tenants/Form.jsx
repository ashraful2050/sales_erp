import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Building2 } from "lucide-react";

const Field = ({ label, error, required, children }) => (
    <div>
        <label className="block text-slate-400 text-xs mb-1.5">
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {children}
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
);

const Input = ({ className = "", ...props }) => (
    <input
        {...props}
        className={`w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-200 text-sm outline-none focus:border-violet-500 transition-colors placeholder-slate-500 ${className}`}
    />
);

const Select = ({ children, ...props }) => (
    <select
        {...props}
        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-200 text-sm outline-none focus:border-violet-500 transition-colors"
    >
        {children}
    </select>
);

export default function TenantForm({ tenant, plans }) {
    const isEdit = !!tenant;

    const { data, setData, post, put, processing, errors } = useForm(
        isEdit
            ? {
                  name: tenant.name ?? "",
                  email: tenant.email ?? "",
                  phone: tenant.phone ?? "",
                  country: tenant.country ?? "",
                  status: tenant.status ?? "active",
                  suspension_reason: tenant.suspension_reason ?? "",
              }
            : {
                  company_name: "",
                  company_email: "",
                  company_phone: "",
                  company_country: "Bangladesh",
                  admin_name: "",
                  admin_email: "",
                  admin_password: "",
                  plan_id: plans[0]?.id ?? "",
                  billing_cycle: "trial",
              },
    );

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route("superadmin.tenants.update", tenant.id));
        } else {
            post(route("superadmin.tenants.store"));
        }
    };

    return (
        <SuperAdminLayout
            title={isEdit ? `Edit: ${tenant.name}` : "New Tenant"}
        >
            <Head title={isEdit ? "Edit Tenant" : "New Tenant"} />

            <Link
                href={
                    isEdit
                        ? route("superadmin.tenants.show", tenant.id)
                        : route("superadmin.tenants.index")
                }
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-5"
            >
                <ArrowLeft size={14} /> {isEdit ? tenant.name : "All Tenants"}
            </Link>

            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-violet-600/30 rounded-xl flex items-center justify-center">
                        <Building2 size={18} className="text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {isEdit ? "Edit Tenant" : "Create New Tenant"}
                        </h2>
                        <p className="text-slate-400 text-sm">
                            {isEdit
                                ? "Update company & status"
                                : "Set up a new company with admin user and subscription"}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Company Info */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                        <h3 className="text-white font-semibold mb-4">
                            Company Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field
                                label={isEdit ? "Company Name" : "Company Name"}
                                required
                                error={errors.company_name || errors.name}
                            >
                                <Input
                                    value={
                                        isEdit ? data.name : data.company_name
                                    }
                                    onChange={(e) =>
                                        setData(
                                            isEdit ? "name" : "company_name",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Acme Corp"
                                />
                            </Field>
                            <Field
                                label="Email"
                                required
                                error={errors.company_email || errors.email}
                            >
                                <Input
                                    type="email"
                                    value={
                                        isEdit ? data.email : data.company_email
                                    }
                                    onChange={(e) =>
                                        setData(
                                            isEdit ? "email" : "company_email",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="admin@acme.com"
                                />
                            </Field>
                            <Field
                                label="Phone"
                                error={errors.company_phone || errors.phone}
                            >
                                <Input
                                    value={
                                        isEdit ? data.phone : data.company_phone
                                    }
                                    onChange={(e) =>
                                        setData(
                                            isEdit ? "phone" : "company_phone",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="+880..."
                                />
                            </Field>
                            <Field
                                label="Country"
                                error={errors.company_country || errors.country}
                            >
                                <Input
                                    value={
                                        isEdit
                                            ? data.country
                                            : data.company_country
                                    }
                                    onChange={(e) =>
                                        setData(
                                            isEdit
                                                ? "country"
                                                : "company_country",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Bangladesh"
                                />
                            </Field>
                        </div>

                        {isEdit && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field
                                    label="Status"
                                    required
                                    error={errors.status}
                                >
                                    <Select
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                    >
                                        <option value="active">Active</option>
                                        <option value="suspended">
                                            Suspended
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                    </Select>
                                </Field>
                                <Field
                                    label="Suspension Reason"
                                    error={errors.suspension_reason}
                                >
                                    <Input
                                        value={data.suspension_reason}
                                        onChange={(e) =>
                                            setData(
                                                "suspension_reason",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Optional reason..."
                                    />
                                </Field>
                            </div>
                        )}
                    </div>

                    {/* Admin & Plan (only on create) */}
                    {!isEdit && (
                        <>
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                                <h3 className="text-white font-semibold mb-4">
                                    Admin User
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field
                                        label="Admin Name"
                                        required
                                        error={errors.admin_name}
                                    >
                                        <Input
                                            value={data.admin_name}
                                            onChange={(e) =>
                                                setData(
                                                    "admin_name",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="John Doe"
                                        />
                                    </Field>
                                    <Field
                                        label="Admin Email"
                                        required
                                        error={errors.admin_email}
                                    >
                                        <Input
                                            type="email"
                                            value={data.admin_email}
                                            onChange={(e) =>
                                                setData(
                                                    "admin_email",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="john@acme.com"
                                        />
                                    </Field>
                                    <Field
                                        label="Password"
                                        required
                                        error={errors.admin_password}
                                        className="sm:col-span-2"
                                    >
                                        <Input
                                            type="password"
                                            value={data.admin_password}
                                            onChange={(e) =>
                                                setData(
                                                    "admin_password",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Min. 8 characters"
                                        />
                                    </Field>
                                </div>
                            </div>

                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                                <h3 className="text-white font-semibold mb-4">
                                    Subscription Plan
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field
                                        label="Plan"
                                        required
                                        error={errors.plan_id}
                                    >
                                        <Select
                                            value={data.plan_id}
                                            onChange={(e) =>
                                                setData(
                                                    "plan_id",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {plans.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} — $
                                                    {p.price_monthly}/mo
                                                </option>
                                            ))}
                                        </Select>
                                    </Field>
                                    <Field
                                        label="Billing Cycle"
                                        required
                                        error={errors.billing_cycle}
                                    >
                                        <Select
                                            value={data.billing_cycle}
                                            onChange={(e) =>
                                                setData(
                                                    "billing_cycle",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="trial">Trial</option>
                                            <option value="monthly">
                                                Monthly
                                            </option>
                                            <option value="yearly">
                                                Yearly
                                            </option>
                                            <option value="lifetime">
                                                Lifetime
                                            </option>
                                        </Select>
                                    </Field>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                        >
                            {processing
                                ? "Saving..."
                                : isEdit
                                  ? "Update Tenant"
                                  : "Create Tenant"}
                        </button>
                        <Link
                            href={
                                isEdit
                                    ? route(
                                          "superadmin.tenants.show",
                                          tenant.id,
                                      )
                                    : route("superadmin.tenants.index")
                            }
                            className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}

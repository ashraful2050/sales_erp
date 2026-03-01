import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft } from "lucide-react";

export default function LeadForm({ lead, users }) {
    const isEdit = !!lead;
    const { data, setData, post, put, processing, errors } = useForm({
        title: lead?.title ?? "",
        contact_name: lead?.contact_name ?? "",
        contact_email: lead?.contact_email ?? "",
        contact_phone: lead?.contact_phone ?? "",
        company_name: lead?.company_name ?? "",
        source: lead?.source ?? "",
        status: lead?.status ?? "new",
        priority: lead?.priority ?? "medium",
        estimated_value: lead?.estimated_value ?? "",
        industry: lead?.industry ?? "",
        notes: lead?.notes ?? "",
        expected_close_date: lead?.expected_close_date ?? "",
        assigned_to: lead?.assigned_to ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit
            ? put(route("crm.leads.update", lead.id))
            : post(route("crm.leads.store"));
    };

    const field = (label, key, type = "text", opts = {}) => (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
            {type === "textarea" ? (
                <textarea
                    value={data[key]}
                    onChange={(e) => setData(key, e.target.value)}
                    rows={3}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            ) : type === "select" ? (
                <select
                    value={data[key]}
                    onChange={(e) => setData(key, e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {opts.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    value={data[key]}
                    onChange={(e) => setData(key, e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}
            {errors[key] && (
                <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
            )}
        </div>
    );

    return (
        <AppLayout title={isEdit ? "Edit Lead" : "New Lead"}>
            <Head title={isEdit ? "Edit Lead" : "New Lead"} />
            <PageHeader
                title={isEdit ? "Edit Lead" : "Create Lead"}
                actions={
                    <Link
                        href={route("crm.leads.index")}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
                    >
                        <ArrowLeft size={16} /> Back
                    </Link>
                }
            />

            <form onSubmit={submit} className="max-w-4xl">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-4">
                            Lead Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {field("Title *", "title")}
                            {field("Source", "source", "select", {
                                options: [
                                    { value: "", label: "Select source" },
                                    { value: "website", label: "Website" },
                                    {
                                        value: "social_media",
                                        label: "Social Media",
                                    },
                                    { value: "referral", label: "Referral" },
                                    { value: "cold_call", label: "Cold Call" },
                                    { value: "email", label: "Email" },
                                ],
                            })}
                            {field("Status *", "status", "select", {
                                options: [
                                    "new",
                                    "contacted",
                                    "qualified",
                                    "proposal",
                                    "negotiation",
                                    "won",
                                    "lost",
                                ].map((s) => ({
                                    value: s,
                                    label:
                                        s.charAt(0).toUpperCase() + s.slice(1),
                                })),
                            })}
                            {field("Priority *", "priority", "select", {
                                options: ["low", "medium", "high"].map((p) => ({
                                    value: p,
                                    label:
                                        p.charAt(0).toUpperCase() + p.slice(1),
                                })),
                            })}
                            {field(
                                "Estimated Value",
                                "estimated_value",
                                "number",
                            )}
                            {field(
                                "Expected Close Date",
                                "expected_close_date",
                                "date",
                            )}
                            {field("Industry", "industry")}
                            {field("Assigned To", "assigned_to", "select", {
                                options: [
                                    { value: "", label: "Unassigned" },
                                    ...(users || []).map((u) => ({
                                        value: u.id,
                                        label: u.name,
                                    })),
                                ],
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-4">
                            Contact Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {field("Contact Name", "contact_name")}
                            {field("Company Name", "company_name")}
                            {field("Email", "contact_email", "email")}
                            {field("Phone", "contact_phone", "tel")}
                        </div>
                    </div>

                    <div>{field("Notes", "notes", "textarea")}</div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                        <Save size={16} /> {isEdit ? "Update" : "Create"} Lead
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

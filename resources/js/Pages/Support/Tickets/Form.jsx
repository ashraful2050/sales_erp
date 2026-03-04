import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { useTranslation } from "@/hooks/useTranslation";

export default function TicketForm({ customers, users, ticket }) {
    const { t } = useTranslation();
    const isEdit = !!ticket;
    const { data, setData, post, put, processing, errors } = useForm({
        subject: ticket?.subject ?? "",
        description: ticket?.description ?? "",
        customer_id: ticket?.customer_id ?? "",
        customer_name: ticket?.customer_name ?? "",
        customer_email: ticket?.customer_email ?? "",
        channel: ticket?.channel ?? "email",
        priority: ticket?.priority ?? "medium",
        category: ticket?.category ?? "general_inquiry",
        assigned_to: ticket?.assigned_to ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) put(route("support.tickets.update", ticket.id));
        else post(route("support.tickets.store"));
    };

    return (
        <AppLayout title={isEdit ? t("Edit Ticket") : t("New Ticket")}>
            <Head title={isEdit ? t("Edit Ticket") : t("New Ticket")} />
            <PageHeader
                title={
                    isEdit
                        ? `${t("Edit Ticket")} ${ticket.ticket_number}`
                        : t("Create Support Ticket")
                }
                subtitle={t("Log a new customer support request")}
                actions={
                    <Link
                        href={route("support.tickets.index")}
                        className="text-slate-500 hover:text-slate-700 text-sm"
                    >
                        ← Back to Tickets
                    </Link>
                }
            />

            <div className="max-w-2xl">
                <form
                    onSubmit={submit}
                    className="bg-white rounded-xl border border-slate-200 p-6 space-y-4"
                >
                    <div>
                        <label className="text-xs font-medium text-slate-600">
                            {t("Subject")} *
                        </label>
                        <input
                            value={data.subject}
                            onChange={(e) => setData("subject", e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                        />
                        {errors.subject && (
                            <p className="text-red-500 text-xs mt-0.5">
                                {errors.subject}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-600">
                            {t("Description")} *
                        </label>
                        <textarea
                            rows={4}
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-0.5">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-slate-600">
                                {t("Customer")}
                            </label>
                            <select
                                value={data.customer_id}
                                onChange={(e) => {
                                    const c = customers?.find(
                                        (c) => c.id == e.target.value,
                                    );
                                    setData((d) => ({
                                        ...d,
                                        customer_id: e.target.value,
                                        customer_name:
                                            c?.name || d.customer_name,
                                        customer_email:
                                            c?.email || d.customer_email,
                                    }));
                                }}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            >
                                <option value="">
                                    {t("-- Select customer --")}
                                </option>
                                {customers?.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600">
                                {t("Customer Name")} *
                            </label>
                            <input
                                value={data.customer_name}
                                onChange={(e) =>
                                    setData("customer_name", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            />
                            {errors.customer_name && (
                                <p className="text-red-500 text-xs mt-0.5">
                                    {errors.customer_name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-slate-600">
                                {t("Customer Email")}
                            </label>
                            <input
                                type="email"
                                value={data.customer_email}
                                onChange={(e) =>
                                    setData("customer_email", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600">
                                {t("Channel")}
                            </label>
                            <select
                                value={data.channel}
                                onChange={(e) =>
                                    setData("channel", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            >
                                {[
                                    "email",
                                    "phone",
                                    "chat",
                                    "social_media",
                                    "in_person",
                                    "portal",
                                ].map((c) => {
                                    const label =
                                        c
                                            .replace("_", " ")
                                            .charAt(0)
                                            .toUpperCase() +
                                        c.replace("_", " ").slice(1);
                                    return (
                                        <option key={c} value={c}>
                                            {t(label)}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-medium text-slate-600">
                                {t("Priority")}
                            </label>
                            <select
                                value={data.priority}
                                onChange={(e) =>
                                    setData("priority", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            >
                                {[
                                    "low",
                                    "medium",
                                    "high",
                                    "urgent",
                                    "critical",
                                ].map((p) => (
                                    <option key={p} value={p}>
                                        {t(
                                            p.charAt(0).toUpperCase() +
                                                p.slice(1),
                                        )}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600">
                                {t("Category")}
                            </label>
                            <select
                                value={data.category}
                                onChange={(e) =>
                                    setData("category", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            >
                                {[
                                    "general_inquiry",
                                    "technical_support",
                                    "billing",
                                    "complaint",
                                    "feature_request",
                                    "returns",
                                    "other",
                                ].map((c) => {
                                    const label =
                                        c
                                            .replace("_", " ")
                                            .charAt(0)
                                            .toUpperCase() +
                                        c.replace("_", " ").slice(1);
                                    return (
                                        <option key={c} value={c}>
                                            {t(label)}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600">
                                {t("Assign To")}
                            </label>
                            <select
                                value={data.assigned_to}
                                onChange={(e) =>
                                    setData("assigned_to", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            >
                                <option value="">
                                    {t("-- Unassigned --")}
                                </option>
                                {users?.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm"
                        >
                            {isEdit ? t("Update Ticket") : t("Create Ticket")}
                        </button>
                        <Link
                            href={route("support.tickets.index")}
                            className="text-slate-500 text-sm py-2"
                        >
                            {t("Cancel")}
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import {
    ArrowLeft,
    Phone,
    Mail,
    Building,
    TrendingUp,
    Plus,
    CheckCircle,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const statusColors = {
    new: "blue",
    contacted: "yellow",
    qualified: "indigo",
    proposal: "purple",
    negotiation: "orange",
    won: "green",
    lost: "red",
};
const outcomeColors = { positive: "green", neutral: "yellow", negative: "red" };

export default function LeadShow({ lead }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        type: "call",
        subject: "",
        description: "",
        activity_at: new Date().toISOString().slice(0, 16),
        outcome: "neutral",
    });

    const submitActivity = (e) => {
        e.preventDefault();
        post(route("crm.leads.activities.store", lead.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout title={lead.title}>
            <Head title={lead.title} />
            <PageHeader
                title={lead.title}
                subtitle={lead.company_name || ""}
                actions={
                    <div className="flex gap-2">
                        <Link
                            href={route("crm.leads.edit", lead.id)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm"
                        >
                            Edit
                        </Link>
                        {!lead.customer_id && (
                            <button
                                onClick={() =>
                                    router.post(
                                        route("crm.leads.convert", lead.id),
                                    )
                                }
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                            >
                                <CheckCircle size={15} /> {t("Convert to Customer")}
                            </button>
                        )}
                        <Link
                            href={route("crm.leads.index")}
                            className="flex items-center gap-2 text-sm text-slate-600"
                        >
                            <ArrowLeft size={16} /> {t("Back")}
                        </Link>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lead Details */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-700 mb-4">
                            Lead Details
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">{t("Status")}</span>
                                <Badge
                                    color={statusColors[lead.status]}
                                    label={lead.status}
                                />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">{t("Priority")}</span>
                                <span className="font-medium capitalize">
                                    {lead.priority}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">{t("Source")}</span>
                                <span className="capitalize">
                                    {lead.source || "—"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">{t("Industry")}</span>
                                <span>{lead.industry || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Est. Value
                                </span>
                                <span className="font-medium text-green-600">
                                    $
                                    {Number(
                                        lead.estimated_value,
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    {t("Close Date")}
                                </span>
                                <span>{lead.expected_close_date || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    {t("Assigned To")}
                                </span>
                                <span>{lead.assigned_to?.name || "—"}</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Score */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={16} className="text-blue-600" />
                            <h3 className="font-semibold text-slate-700">
                                AI Lead Score
                            </h3>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600">
                                {lead.score}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                                out of 100
                            </div>
                            <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{ width: `${lead.score}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-700 mb-3">
                            Contact
                        </h3>
                        <div className="space-y-2 text-sm">
                            {lead.contact_name && (
                                <div className="flex items-center gap-2">
                                    <Building
                                        size={14}
                                        className="text-slate-400"
                                    />
                                    {lead.contact_name}
                                </div>
                            )}
                            {lead.contact_email && (
                                <div className="flex items-center gap-2">
                                    <Mail
                                        size={14}
                                        className="text-slate-400"
                                    />
                                    {lead.contact_email}
                                </div>
                            )}
                            {lead.contact_phone && (
                                <div className="flex items-center gap-2">
                                    <Phone
                                        size={14}
                                        className="text-slate-400"
                                    />
                                    {lead.contact_phone}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Activities */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Log Activity Form */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <Plus size={16} /> Log Activity
                        </h3>
                        <form onSubmit={submitActivity} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                >
                                    {[
                                        "call",
                                        "email",
                                        "meeting",
                                        "note",
                                        "task",
                                    ].map((t) => (
                                        <option key={t} value={t}>
                                            {t.charAt(0).toUpperCase() +
                                                t.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={data.outcome}
                                    onChange={(e) =>
                                        setData("outcome", e.target.value)
                                    }
                                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                >
                                    {["positive", "neutral", "negative"].map(
                                        (o) => (
                                            <option key={o} value={o}>
                                                {o.charAt(0).toUpperCase() +
                                                    o.slice(1)}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                            <input
                                placeholder={t("Subject")}
                                value={data.subject}
                                onChange={(e) =>
                                    setData("subject", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            />
                            <input
                                type="datetime-local"
                                value={data.activity_at}
                                onChange={(e) =>
                                    setData("activity_at", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            />
                            <textarea
                                placeholder={t("Description…")}
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={2}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                {t("Log Activity")}
                            </button>
                        </form>
                    </div>

                    {/* Activity Timeline */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-700 mb-4">
                            Activity Timeline
                        </h3>
                        {lead.activities?.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-4">
                                {t("No activities yet.")}
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {lead.activities?.map((act) => (
                                    <div
                                        key={act.id}
                                        className="flex gap-3 text-sm"
                                    >
                                        <div className="w-2 h-2 mt-2 rounded-full bg-blue-400 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-700 capitalize">
                                                    {act.type}
                                                </span>
                                                <Badge
                                                    color={
                                                        outcomeColors[
                                                            act.outcome
                                                        ]
                                                    }
                                                    label={act.outcome}
                                                />
                                                <span className="text-slate-400 text-xs ml-auto">
                                                    {new Date(
                                                        act.activity_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-slate-600">
                                                {act.subject}
                                            </p>
                                            {act.description && (
                                                <p className="text-slate-400 text-xs mt-0.5">
                                                    {act.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-400">
                                                by {act.user?.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    {lead.notes && (
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h3 className="font-semibold text-slate-700 mb-2">
                                Notes
                            </h3>
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                {lead.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

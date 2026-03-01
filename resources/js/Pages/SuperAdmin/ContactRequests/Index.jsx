import { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import {
    Search,
    Mail,
    Building2,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    X,
    ChevronRight,
    ChevronLeft,
    Key,
    RefreshCw,
} from "lucide-react";
import { fmtDate, fmtDateTime } from "@/utils/date";

const statusColors = {
    pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    approved: "bg-green-500/10 text-green-400 border border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const statusIcons = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
};

function generatePassword(len = 12) {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
    return Array.from(
        { length: len },
        () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
}

/* ─── Approve Modal ─────────────────────────────────────────────── */
function ApproveModal({ contact, plans, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        plan_id: plans[0]?.id ?? "",
        billing_cycle: "monthly",
        admin_password: "",
        admin_notes: "",
    });

    function submit(e) {
        e.preventDefault();
        post(route("superadmin.contact-requests.approve", contact.id), {
            onSuccess: () => onClose(),
        });
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div>
                        <h2 className="text-white font-semibold text-lg">
                            Approve & Create Tenant
                        </h2>
                        <p className="text-slate-400 text-sm mt-0.5">
                            {contact.name} · {contact.company_name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    {/* Plan */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">
                            Select Plan <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={data.plan_id}
                            onChange={(e) => setData("plan_id", e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
                        >
                            {plans.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} — ${p.price_monthly}/mo
                                </option>
                            ))}
                        </select>
                        {errors.plan_id && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.plan_id}
                            </p>
                        )}
                    </div>

                    {/* Billing Cycle */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">
                            Billing Cycle{" "}
                            <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {["monthly", "yearly", "trial", "lifetime"].map(
                                (c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() =>
                                            setData("billing_cycle", c)
                                        }
                                        className={`py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                                            data.billing_cycle === c
                                                ? "bg-violet-600 text-white"
                                                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                        }`}
                                    >
                                        {c}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">
                            Temporary Password
                            <span className="text-slate-500 ml-1 text-xs">
                                (leave blank to auto-generate)
                            </span>
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Key
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    type="text"
                                    value={data.admin_password}
                                    onChange={(e) =>
                                        setData(
                                            "admin_password",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Auto-generated if empty"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm font-mono placeholder-slate-500 focus:outline-none focus:border-violet-500"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setData(
                                        "admin_password",
                                        generatePassword(),
                                    )
                                }
                                title="Generate password"
                                className="px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
                            >
                                <RefreshCw size={14} />
                            </button>
                        </div>
                        {errors.admin_password && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.admin_password}
                            </p>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">
                            Internal Notes (optional)
                        </label>
                        <textarea
                            value={data.admin_notes}
                            onChange={(e) =>
                                setData("admin_notes", e.target.value)
                            }
                            rows={3}
                            placeholder="Any notes about this approval..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                        />
                    </div>

                    <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 text-xs text-violet-300">
                        A company account will be created for{" "}
                        <strong>{contact.company_name}</strong> and login
                        credentials will be emailed to{" "}
                        <strong>{contact.email}</strong>.
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            {processing ? (
                                <svg
                                    className="animate-spin h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
                                </svg>
                            ) : (
                                <CheckCircle size={14} />
                            )}
                            Approve & Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── Reject Modal ───────────────────────────────────────────────── */
function RejectModal({ contact, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        admin_notes: "",
    });

    function submit(e) {
        e.preventDefault();
        post(route("superadmin.contact-requests.reject", contact.id), {
            onSuccess: () => onClose(),
        });
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div>
                        <h2 className="text-white font-semibold text-lg">
                            Reject Request
                        </h2>
                        <p className="text-slate-400 text-sm mt-0.5">
                            {contact.name} · {contact.company_name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">
                            Reason for Rejection{" "}
                            <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={data.admin_notes}
                            onChange={(e) =>
                                setData("admin_notes", e.target.value)
                            }
                            rows={4}
                            placeholder="Enter the reason for rejection..."
                            autoFocus
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
                        />
                        {errors.admin_notes && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.admin_notes}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            {processing ? (
                                <svg
                                    className="animate-spin h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
                                </svg>
                            ) : (
                                <XCircle size={14} />
                            )}
                            Confirm Reject
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── Detail Drawer ──────────────────────────────────────────────── */
function DetailDrawer({ contact, plans, onClose, onApprove, onReject }) {
    if (!contact) return null;
    const StatusIcon = statusIcons[contact.status];

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-end"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900">
                    <h2 className="text-white font-semibold">
                        Contact Request Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    {/* Status */}
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[contact.status]}`}
                        >
                            <StatusIcon size={12} />
                            {contact.status}
                        </span>
                        <span className="text-slate-500 text-xs">
                            Submitted {fmtDate(contact.created_at)}
                        </span>
                    </div>

                    {/* Info Grid */}
                    <div className="bg-slate-800/50 rounded-xl divide-y divide-slate-700/50">
                        {[
                            { label: "Name", value: contact.name },
                            { label: "Email", value: contact.email },
                            { label: "Phone", value: contact.phone || "—" },
                            { label: "Company", value: contact.company_name },
                            {
                                label: "Company Size",
                                value: contact.company_size || "—",
                            },
                            {
                                label: "Industry",
                                value: contact.industry || "—",
                            },
                            {
                                label: "Plan Interest",
                                value: contact.plan_interest || "—",
                            },
                            {
                                label: "IP Address",
                                value: contact.ip_address || "—",
                            },
                        ].map(({ label, value }) => (
                            <div
                                key={label}
                                className="flex justify-between items-start px-4 py-3"
                            >
                                <span className="text-slate-500 text-xs">
                                    {label}
                                </span>
                                <span className="text-white text-xs font-medium text-right max-w-[60%]">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Message */}
                    {contact.message && (
                        <div>
                            <p className="text-slate-500 text-xs mb-2">
                                Message
                            </p>
                            <div className="bg-slate-800/50 rounded-xl px-4 py-3 text-slate-300 text-sm leading-relaxed">
                                {contact.message}
                            </div>
                        </div>
                    )}

                    {/* Admin Notes */}
                    {contact.admin_notes && (
                        <div>
                            <p className="text-slate-500 text-xs mb-2">
                                Admin Notes
                            </p>
                            <div className="bg-slate-800/50 rounded-xl px-4 py-3 text-slate-300 text-sm leading-relaxed">
                                {contact.admin_notes}
                            </div>
                        </div>
                    )}

                    {/* Approval/Rejection info */}
                    {contact.status === "approved" && contact.approved_at && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                            <p className="text-green-400 text-xs font-medium mb-1">
                                Approved
                            </p>
                            <p className="text-slate-400 text-xs">
                                {fmtDateTime(contact.approved_at)}
                            </p>
                            {contact.plan && (
                                <p className="text-slate-400 text-xs mt-1">
                                    Plan: {contact.plan.name}
                                </p>
                            )}
                        </div>
                    )}
                    {contact.status === "rejected" && contact.rejected_at && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                            <p className="text-red-400 text-xs font-medium mb-1">
                                Rejected
                            </p>
                            <p className="text-slate-400 text-xs">
                                {fmtDateTime(contact.rejected_at)}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    {contact.status === "pending" && (
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => onReject(contact)}
                                className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <XCircle size={14} />
                                Reject
                            </button>
                            <button
                                onClick={() => onApprove(contact)}
                                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <CheckCircle size={14} />
                                Approve
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function ContactRequestsIndex({
    contacts,
    counts,
    filters,
    plans,
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");
    const [selectedContact, setSelectedContact] = useState(null);
    const [approveTarget, setApproveTarget] = useState(null);
    const [rejectTarget, setRejectTarget] = useState(null);

    function applyFilters(newFilters) {
        router.get(route("superadmin.contact-requests.index"), newFilters, {
            preserveState: true,
            replace: true,
        });
    }

    function handleSearch(e) {
        e.preventDefault();
        applyFilters({ search, status: statusFilter });
    }

    function handleStatusChange(val) {
        setStatusFilter(val);
        applyFilters({ search, status: val });
    }

    const tabs = [
        {
            value: "",
            label: "All",
            count: counts.pending + counts.approved + counts.rejected,
        },
        { value: "pending", label: "Pending", count: counts.pending },
        { value: "approved", label: "Approved", count: counts.approved },
        { value: "rejected", label: "Rejected", count: counts.rejected },
    ];

    return (
        <SuperAdminLayout title="Contact Requests">
            {/* Modals */}
            {approveTarget && (
                <ApproveModal
                    contact={approveTarget}
                    plans={plans}
                    onClose={() => setApproveTarget(null)}
                />
            )}
            {rejectTarget && (
                <RejectModal
                    contact={rejectTarget}
                    onClose={() => setRejectTarget(null)}
                />
            )}
            {selectedContact && !approveTarget && !rejectTarget && (
                <DetailDrawer
                    contact={selectedContact}
                    plans={plans}
                    onClose={() => setSelectedContact(null)}
                    onApprove={(c) => {
                        setSelectedContact(null);
                        setApproveTarget(c);
                    }}
                    onReject={(c) => {
                        setSelectedContact(null);
                        setRejectTarget(c);
                    }}
                />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Contact Requests
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Manage incoming demo and subscription requests
                        </p>
                    </div>
                    {counts.pending > 0 && (
                        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-xl text-sm font-medium">
                            <Clock size={14} />
                            {counts.pending} pending review
                        </div>
                    )}
                </div>

                {/* Stat Chips */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        {
                            label: "Pending",
                            count: counts.pending,
                            color: "text-amber-400",
                            bg: "bg-amber-500/10  border-amber-500/20",
                        },
                        {
                            label: "Approved",
                            count: counts.approved,
                            color: "text-green-400",
                            bg: "bg-green-500/10  border-green-500/20",
                        },
                        {
                            label: "Rejected",
                            count: counts.rejected,
                            color: "text-red-400",
                            bg: "bg-red-500/10    border-red-500/20",
                        },
                    ].map(({ label, count, color, bg }) => (
                        <div
                            key={label}
                            className={`${bg} border rounded-xl px-4 py-3 text-center`}
                        >
                            <p className={`text-2xl font-bold ${color}`}>
                                {count}
                            </p>
                            <p className="text-slate-500 text-xs mt-0.5">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    {/* Status tabs */}
                    <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleStatusChange(tab.value)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                                    statusFilter === tab.value
                                        ? "bg-violet-600 text-white"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {tab.label}
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        statusFilter === tab.value
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-800 text-slate-400"
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <form
                        onSubmit={handleSearch}
                        className="flex gap-2 flex-1 max-w-sm ml-auto"
                    >
                        <div className="relative flex-1">
                            <Search
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name, email, company..."
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-violet-600 hover:bg-violet-500 text-white px-4 rounded-xl text-sm transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {contacts.data.length === 0 ? (
                        <div className="text-center py-16">
                            <Mail
                                size={32}
                                className="text-slate-700 mx-auto mb-3"
                            />
                            <p className="text-slate-500">
                                No contact requests found.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-800 text-left">
                                        <th className="px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wide">
                                            Contact
                                        </th>
                                        <th className="px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wide">
                                            Company
                                        </th>
                                        <th className="px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wide hidden md:table-cell">
                                            Industry
                                        </th>
                                        <th className="px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wide hidden lg:table-cell">
                                            Plan Interest
                                        </th>
                                        <th className="px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wide">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wide hidden sm:table-cell">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wide">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {contacts.data.map((contact) => {
                                        const StatusIcon =
                                            statusIcons[contact.status];
                                        return (
                                            <tr
                                                key={contact.id}
                                                className="hover:bg-slate-800/30 transition-colors"
                                            >
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="text-white text-sm font-medium">
                                                            {contact.name}
                                                        </p>
                                                        <p className="text-slate-500 text-xs">
                                                            {contact.email}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Building2
                                                            size={13}
                                                            className="text-slate-500 flex-shrink-0"
                                                        />
                                                        <span className="text-slate-300 text-sm">
                                                            {
                                                                contact.company_name
                                                            }
                                                        </span>
                                                    </div>
                                                    {contact.company_size && (
                                                        <p className="text-slate-500 text-xs mt-0.5 pl-5">
                                                            {
                                                                contact.company_size
                                                            }
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 hidden md:table-cell">
                                                    <span className="text-slate-400 text-sm">
                                                        {contact.industry ||
                                                            "—"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 hidden lg:table-cell">
                                                    {contact.plan_interest ? (
                                                        <span className="bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2 py-0.5 rounded-full text-xs capitalize">
                                                            {
                                                                contact.plan_interest
                                                            }
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-600 text-sm">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[contact.status]}`}
                                                    >
                                                        <StatusIcon size={10} />
                                                        {contact.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 hidden sm:table-cell">
                                                    <span className="text-slate-500 text-xs">
                                                        {fmtDate(
                                                            contact.created_at,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() =>
                                                                setSelectedContact(
                                                                    contact,
                                                                )
                                                            }
                                                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                                            title="View details"
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                        {contact.status ===
                                                            "pending" && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        setApproveTarget(
                                                                            contact,
                                                                        )
                                                                    }
                                                                    className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                                                    title="Approve"
                                                                >
                                                                    <CheckCircle
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        setRejectTarget(
                                                                            contact,
                                                                        )
                                                                    }
                                                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                                    title="Reject"
                                                                >
                                                                    <XCircle
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {contacts.last_page > 1 && (
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-slate-500 text-sm">
                            Showing {contacts.from}–{contacts.to} of{" "}
                            {contacts.total}
                        </p>
                        <div className="flex gap-2">
                            {contacts.prev_page_url && (
                                <button
                                    onClick={() =>
                                        router.get(contacts.prev_page_url)
                                    }
                                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-sm transition-colors"
                                >
                                    <ChevronLeft size={14} /> Prev
                                </button>
                            )}
                            {contacts.next_page_url && (
                                <button
                                    onClick={() =>
                                        router.get(contacts.next_page_url)
                                    }
                                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-sm transition-colors"
                                >
                                    Next <ChevronRight size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}

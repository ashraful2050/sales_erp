import { usePage, Link } from "@inertiajs/react";
import { AlertTriangle, Clock, X } from "lucide-react";
import { useState } from "react";

export default function SubscriptionBanner() {
    const { subscription, isImpersonating } = usePage().props;
    const [dismissed, setDismissed] = useState(false);

    if (dismissed || !subscription) return null;

    const {
        status,
        plan_name,
        days_left,
        is_trial,
        trial_ends_at,
        expires_at,
    } = subscription;

    // Active + healthy (> 7 days) — no banner
    if (status === "active" && days_left > 7) return null;

    // Build message
    let message = "";
    let urgency = "warning"; // warning | danger

    if (is_trial) {
        if (days_left <= 0) {
            message = "Your free trial has ended.";
            urgency = "danger";
        } else if (days_left <= 3) {
            message = `Your free trial expires in ${days_left} day${days_left !== 1 ? "s" : ""} on ${trial_ends_at}.`;
            urgency = "danger";
        } else {
            message = `Your free trial ends in ${days_left} days (${trial_ends_at}).`;
            urgency = "warning";
        }
    } else if (status === "expired") {
        message =
            "Your subscription has expired. Please renew to continue using all features.";
        urgency = "danger";
    } else if (status === "active" && days_left <= 7) {
        message = `Your ${plan_name} plan expires in ${days_left} day${days_left !== 1 ? "s" : ""} (${expires_at}).`;
        urgency = days_left <= 3 ? "danger" : "warning";
    } else if (status === "suspended") {
        message = "Your account has been suspended. Please contact support.";
        urgency = "danger";
    } else {
        return null;
    }

    const colors =
        urgency === "danger"
            ? "bg-red-50 border-red-200 text-red-800"
            : "bg-amber-50 border-amber-200 text-amber-800";

    const iconColor = urgency === "danger" ? "text-red-500" : "text-amber-500";

    // Don't show upgrade link if impersonating
    return (
        <div
            className={`border-b px-4 py-2.5 flex items-center justify-between ${colors}`}
        >
            <div className="flex items-center gap-2 text-sm">
                {urgency === "danger" ? (
                    <AlertTriangle size={15} className={iconColor} />
                ) : (
                    <Clock size={15} className={iconColor} />
                )}
                <span>{message}</span>
                {!isImpersonating && (
                    <Link
                        href="/pricing"
                        className="ml-2 font-semibold underline hover:no-underline"
                    >
                        Upgrade now →
                    </Link>
                )}
            </div>
            {isImpersonating && (
                <span className="text-xs bg-amber-200 text-amber-700 px-2 py-0.5 rounded-full ml-2">
                    Viewing as tenant
                </span>
            )}
            <button
                onClick={() => setDismissed(true)}
                className={`ml-4 p-1 rounded hover:bg-black/10 transition-colors ${iconColor}`}
            >
                <X size={13} />
            </button>
        </div>
    );
}

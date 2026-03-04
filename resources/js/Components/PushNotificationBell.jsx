import { useState, useEffect, useCallback } from "react";
import { Bell, BellOff, BellRing, Check, X } from "lucide-react";
import axios from "axios";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? "";

/** Convert a base64url VAPID public key to Uint8Array */
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function PushNotificationBell() {
    const [supported, setSupported] = useState(false);
    const [permission, setPermission] = useState("default");
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const ok =
            "serviceWorker" in navigator &&
            "PushManager" in window &&
            "Notification" in window &&
            VAPID_PUBLIC_KEY !== "";
        setSupported(ok);
        if (!ok) return;

        setPermission(Notification.permission);

        // Check if currently subscribed
        navigator.serviceWorker.ready
            .then((reg) => reg.pushManager.getSubscription())
            .then((sub) => setSubscribed(!!sub));
    }, []);

    const subscribe = useCallback(async () => {
        if (!supported || !VAPID_PUBLIC_KEY) return;
        setLoading(true);
        try {
            const perm = await Notification.requestPermission();
            setPermission(perm);
            if (perm !== "granted") {
                showToast("Notification permission denied.", "error");
                return;
            }

            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });

            await axios.post("/push-subscriptions", {
                endpoint: sub.endpoint,
                p256dh: btoa(
                    String.fromCharCode(
                        ...new Uint8Array(sub.getKey("p256dh")),
                    ),
                ),
                auth: btoa(
                    String.fromCharCode(...new Uint8Array(sub.getKey("auth"))),
                ),
            });

            setSubscribed(true);
            showToast("Push notifications enabled!");
        } catch (err) {
            console.error("Push subscribe error:", err);
            showToast("Could not enable notifications.", "error");
        } finally {
            setLoading(false);
            setMenuOpen(false);
        }
    }, [supported]);

    const unsubscribe = useCallback(async () => {
        setLoading(true);
        try {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.getSubscription();
            if (sub) {
                await sub.unsubscribe();
                await axios.delete("/push-subscriptions", {
                    data: { endpoint: sub.endpoint },
                });
            }
            setSubscribed(false);
            showToast("Push notifications disabled.");
        } catch (err) {
            console.error("Push unsubscribe error:", err);
            showToast("Could not disable notifications.", "error");
        } finally {
            setLoading(false);
            setMenuOpen(false);
        }
    }, []);

    // Notification bell icon — colour reflects state
    const BellIcon = subscribed
        ? BellRing
        : permission === "denied"
          ? BellOff
          : Bell;
    const bellColour = subscribed
        ? "text-blue-600"
        : permission === "denied"
          ? "text-slate-400"
          : "text-slate-500";

    if (!supported) {
        // Fallback: plain bell (no push support in this browser)
        return (
            <button className="relative text-slate-500 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100">
                <Bell size={20} />
            </button>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setMenuOpen((o) => !o)}
                className={`relative p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${bellColour}`}
                title={
                    subscribed
                        ? "Push notifications on"
                        : "Enable push notifications"
                }
            >
                <BellIcon size={20} />
                {subscribed && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white" />
                )}
                {loading && (
                    <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                    </span>
                )}
            </button>

            {/* Drop-down */}
            {menuOpen && !loading && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 text-sm">
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                        >
                            <X size={16} />
                        </button>
                        <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                            <Bell size={15} className="text-blue-600" /> Push
                            Notifications
                        </p>

                        {permission === "denied" ? (
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Notifications are blocked in your browser
                                settings. Open <strong>Site Settings</strong> to
                                allow them.
                            </p>
                        ) : subscribed ? (
                            <>
                                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                                    <Check
                                        size={13}
                                        className="text-green-500"
                                    />
                                    Notifications are enabled.
                                </p>
                                <button
                                    onClick={unsubscribe}
                                    className="w-full text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg px-3 py-2 font-medium transition-colors"
                                >
                                    Turn off notifications
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                                    Get instant alerts for invoices, approvals
                                    &amp; more — even when the app is closed.
                                </p>
                                <button
                                    onClick={subscribe}
                                    className="w-full text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-3 py-2 font-medium transition-colors"
                                >
                                    Enable notifications
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* Toast */}
            {toast && (
                <div
                    className={`fixed bottom-20 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg
                    ${
                        toast.type === "error"
                            ? "bg-red-600 text-white"
                            : "bg-green-600 text-white"
                    }`}
                >
                    {toast.msg}
                </div>
            )}
        </div>
    );
}

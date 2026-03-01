import {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
} from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, CheckCircle, Info, X } from "lucide-react";

/* ─── context ────────────────────────────────────────────── */
const DialogContext = createContext(null);

/* ─── types ──────────────────────────────────────────────── */
// type: "confirm" | "alert" | "danger"
// intent: "danger" | "warning" | "info" | "success"

const ICONS = {
    danger: { Icon: Trash2, ring: "bg-red-100", icon: "text-red-500" },
    warning: {
        Icon: AlertTriangle,
        ring: "bg-amber-100",
        icon: "text-amber-500",
    },
    info: { Icon: Info, ring: "bg-blue-100", icon: "text-blue-500" },
    success: {
        Icon: CheckCircle,
        ring: "bg-green-100",
        icon: "text-green-500",
    },
};

const CONFIRM_BTN = {
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    warning: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-400",
    info: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    success: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
};

/* ─── modal UI ───────────────────────────────────────────── */
function DialogModal({ dialog, onResolve }) {
    if (!dialog) return null;

    const {
        type = "confirm",
        intent = "danger",
        title,
        message,
        confirmLabel = "Confirm",
        cancelLabel = "Cancel",
    } = dialog;

    const { Icon, ring, icon } = ICONS[intent] ?? ICONS.danger;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
        >
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
                onClick={() => type !== "confirm" && onResolve(false)}
            />

            {/* panel */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-scale-in overflow-hidden">
                {/* top colour strip */}
                <div
                    className={`h-1 w-full ${
                        intent === "danger"
                            ? "bg-red-500"
                            : intent === "warning"
                              ? "bg-amber-400"
                              : intent === "success"
                                ? "bg-green-500"
                                : "bg-blue-500"
                    }`}
                />

                <div className="px-6 pt-6 pb-5">
                    {/* close × */}
                    <button
                        onClick={() => onResolve(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={18} />
                    </button>

                    {/* icon + title */}
                    <div className="flex items-start gap-4 mb-4">
                        <div
                            className={`shrink-0 w-11 h-11 ${ring} rounded-full flex items-center justify-center`}
                        >
                            <Icon size={22} className={icon} />
                        </div>
                        <div className="pt-0.5">
                            {title && (
                                <h3 className="text-base font-bold text-slate-900 mb-1">
                                    {title}
                                </h3>
                            )}
                            {message && (
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* buttons */}
                    <div
                        className={`flex gap-3 ${type === "alert" ? "justify-end" : "justify-end"}`}
                    >
                        {type !== "alert" && (
                            <button
                                onClick={() => onResolve(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
                            >
                                {cancelLabel}
                            </button>
                        )}
                        <button
                            autoFocus
                            onClick={() => onResolve(true)}
                            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${CONFIRM_BTN[intent] ?? CONFIRM_BTN.danger}`}
                        >
                            {type === "alert" ? "OK" : confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}

/* ─── provider ───────────────────────────────────────────── */
export function DialogProvider({ children }) {
    const [dialog, setDialog] = useState(null);
    const resolverRef = useRef(null);

    const open = useCallback((opts) => {
        return new Promise((resolve) => {
            resolverRef.current = resolve;
            setDialog(opts);
        });
    }, []);

    const handleResolve = useCallback((result) => {
        setDialog(null);
        resolverRef.current?.(result);
        resolverRef.current = null;
    }, []);

    // ── public API ──────────────────────────────────────────
    const confirm = useCallback(
        (message, opts = {}) =>
            open({
                type: "confirm",
                intent: opts.intent ?? "danger",
                title: opts.title ?? "Are you sure?",
                message,
                confirmLabel: opts.confirmLabel ?? "Confirm",
                cancelLabel: opts.cancelLabel ?? "Cancel",
            }),
        [open],
    );

    const alert = useCallback(
        (message, opts = {}) =>
            open({
                type: "alert",
                intent: opts.intent ?? "warning",
                title: opts.title ?? "Notice",
                message,
            }),
        [open],
    );

    return (
        <DialogContext.Provider value={{ confirm, alert }}>
            {children}
            <DialogModal dialog={dialog} onResolve={handleResolve} />
        </DialogContext.Provider>
    );
}

/* ─── hook ───────────────────────────────────────────────── */
export function useDialog() {
    const ctx = useContext(DialogContext);
    if (!ctx) throw new Error("useDialog must be used within <DialogProvider>");
    return ctx;
}

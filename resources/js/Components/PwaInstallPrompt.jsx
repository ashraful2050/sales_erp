import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";

const DISMISSED_KEY = "pwa_install_dismissed";

export default function PwaInstallPrompt() {
    const [installEvent, setInstallEvent] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIos, setIsIos] = useState(false);
    const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        const standalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true;
        setIsInStandaloneMode(standalone);

        if (standalone) return; // already installed — don't show anything

        // Already dismissed recently?
        const dismissed = localStorage.getItem(DISMISSED_KEY);
        if (dismissed) {
            const when = parseInt(dismissed, 10);
            // Re-show after 7 days
            if (Date.now() - when < 7 * 24 * 60 * 60 * 1000) return;
        }

        // Detect iOS
        const ios =
            /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
        setIsIos(ios);

        if (ios) {
            // On iOS, Safari doesn't fire beforeinstallprompt
            // Show manual instructions instead
            setShowPrompt(true);
            return;
        }

        // Chrome / Edge / Android — capture beforeinstallprompt
        const handler = (e) => {
            e.preventDefault();
            setInstallEvent(e);
            setShowPrompt(true);
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!installEvent) return;
        installEvent.prompt();
        const { outcome } = await installEvent.userChoice;
        if (outcome === "accepted") {
            setShowPrompt(false);
        }
        setInstallEvent(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    };

    if (!showPrompt || isInStandaloneMode) return null;

    return (
        <div
            className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto
                        bg-white rounded-2xl shadow-2xl border border-blue-100
                        p-4 flex items-start gap-3 animate-slide-up"
        >
            {/* App icon */}
            <img
                src="/logo-192.png"
                alt="AccounTech BD"
                className="w-12 h-12 rounded-xl shrink-0 shadow-sm"
            />

            <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm leading-tight">
                    Install AccounTech BD
                </p>

                {isIos ? (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Tap <strong>Share</strong> then{" "}
                        <strong>"Add to Home Screen"</strong> for the full app
                        experience.
                    </p>
                ) : (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Install for faster access, offline support &amp; push
                        notifications — no app store needed.
                    </p>
                )}

                {!isIos && (
                    <button
                        onClick={handleInstall}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5
                                   bg-blue-600 text-white text-xs font-semibold
                                   rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Download size={13} />
                        Install App
                    </button>
                )}
            </div>

            <button
                onClick={handleDismiss}
                className="shrink-0 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Dismiss"
            >
                <X size={18} />
            </button>
        </div>
    );
}

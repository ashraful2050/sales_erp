import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { DialogProvider } from "@/hooks/useDialog";

// ── PWA Service Worker ───────────────────────────────────────────────────────
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js", { scope: "/" })
            .then((reg) => {
                reg.update();
                reg.addEventListener("updatefound", () => {
                    const newSW = reg.installing;
                    newSW?.addEventListener("statechange", () => {
                        if (
                            newSW.state === "installed" &&
                            navigator.serviceWorker.controller
                        ) {
                            newSW.postMessage({ type: "SKIP_WAITING" });
                        }
                    });
                });
            })
            .catch((err) => console.warn("SW registration failed:", err));
    });
}

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <DialogProvider>
                <App {...props} />
            </DialogProvider>,
        );
    },
    progress: {
        color: "#4B5563",
    },
});

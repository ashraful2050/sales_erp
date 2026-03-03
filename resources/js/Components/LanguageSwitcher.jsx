import { useState, useRef, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * LanguageSwitcher – dropdown to switch the UI language.
 * Shows the current language flag + code and lists all active languages.
 */
export default function LanguageSwitcher({ className = "" }) {
    const { locale, languages } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const current = languages.find((l) => l.code === locale) ?? languages[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const switchTo = (code) => {
        if (code === locale) {
            setOpen(false);
            return;
        }
        router.post(
            route("language.switch"),
            { locale: code },
            { preserveScroll: true, preserveState: false },
        );
        setOpen(false);
    };

    if (!languages || languages.length <= 1) return null;

    return (
        <div className={`relative ${className}`} ref={ref}>
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                title="Switch Language"
            >
                <Globe size={15} className="opacity-70" />
                <span className="text-base leading-none">
                    {current?.flag ?? "🌐"}
                </span>
                <span className="hidden sm:inline uppercase text-xs font-semibold tracking-wide">
                    {current?.code ?? locale}
                </span>
                <ChevronDown
                    size={12}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => switchTo(lang.code)}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <span className="text-base leading-none">
                                {lang.flag ?? "🌐"}
                            </span>
                            <span className="flex-1 font-medium text-slate-700 dark:text-slate-200">
                                {lang.native_name || lang.name}
                            </span>
                            {lang.code === locale && (
                                <Check
                                    size={14}
                                    className="text-blue-600 dark:text-blue-400 shrink-0"
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

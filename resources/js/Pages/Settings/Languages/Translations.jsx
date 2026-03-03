import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState, useMemo } from "react";
import PageHeader from "@/Components/PageHeader";
import {
    Save,
    Search,
    ArrowLeft,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function Translations({ language, translations, english }) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [collapsedGroups, setCollapsedGroups] = useState({});

    // Build a mutable flat state: { "group.key": value }
    const initialValues = useMemo(() => {
        const flat = {};
        Object.entries(english || {}).forEach(([group, keys]) => {
            Object.keys(keys).forEach((key) => {
                flat[`${group}.${key}`] = translations?.[group]?.[key] ?? "";
            });
        });
        return flat;
    }, [translations, english]);

    const [values, setValues] = useState(initialValues);
    const [saving, setSaving] = useState(false);
    const [flash, setFlash] = useState(null);

    const updateValue = (group, key, val) => {
        setValues((prev) => ({ ...prev, [`${group}.${key}`]: val }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setSaving(true);

        // Rebuild grouped structure for payload
        const grouped = {};
        Object.entries(values).forEach(([dotKey, value]) => {
            const [group, ...rest] = dotKey.split(".");
            const key = rest.join(".");
            if (!grouped[group]) grouped[group] = {};
            grouped[group][key] = value;
        });

        fetch(route("settings.languages.translations.save", language.id), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN":
                    document.querySelector('meta[name="csrf-token"]')
                        ?.content ?? "",
            },
            body: JSON.stringify({ translations: grouped }),
        })
            .then((r) => r.json())
            .then(() => {
                setFlash({
                    type: "success",
                    msg: "Translations saved successfully.",
                });
                setTimeout(() => setFlash(null), 3000);
            })
            .catch(() => {
                setFlash({
                    type: "error",
                    msg: "Failed to save translations.",
                });
            })
            .finally(() => setSaving(false));
    };

    const toggleGroup = (group) =>
        setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));

    // Filter entries based on search
    const filteredGroups = useMemo(() => {
        const result = {};
        Object.entries(english || {}).forEach(([group, keys]) => {
            const filteredKeys = Object.entries(keys).filter(([key, enVal]) => {
                const q = searchQuery.toLowerCase();
                if (!q) return true;
                const translation = values[`${group}.${key}`] ?? "";
                return (
                    key.includes(q) ||
                    enVal.toLowerCase().includes(q) ||
                    translation.toLowerCase().includes(q)
                );
            });
            if (filteredKeys.length > 0) {
                result[group] = filteredKeys;
            }
        });
        return result;
    }, [english, searchQuery, values]);

    const totalKeys = Object.values(english || {}).reduce(
        (s, g) => s + Object.keys(g).length,
        0,
    );
    const filledKeys = Object.entries(values).filter(
        ([, v]) => v && v.trim() !== "",
    ).length;
    const pct = totalKeys > 0 ? Math.round((filledKeys / totalKeys) * 100) : 0;

    return (
        <AppLayout>
            <Head title={`Translations – ${language.name}`} />

            <PageHeader
                title={`${language.flag ?? "🌐"} ${language.name} – Translations`}
                description={`Translate all UI strings into ${language.name}. Empty fields fall back to English.`}
                actions={
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("settings.languages.index")}
                            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            <ArrowLeft size={15} /> {t("Back")}
                        </Link>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                        >
                            <Save size={15} />
                            {saving ? "Saving..." : "Save Translations"}
                        </button>
                    </div>
                }
            />

            <div className="p-6">
                {/* Flash */}
                {flash && (
                    <div
                        className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${flash.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}
                    >
                        {flash.msg}
                    </div>
                )}

                {/* Progress bar */}
                <div className="mb-5 bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="flex-1">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>{t("Translation progress")}</span>
                            <span>
                                {filledKeys} / {totalKeys} ({pct}%)
                            </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${pct === 100 ? "bg-green-500" : pct > 50 ? "bg-blue-500" : "bg-amber-500"}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-5">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("Search keys or values...")}
                        className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </div>

                {/* Translation Groups */}
                <form onSubmit={handleSave} className="space-y-4">
                    {Object.entries(filteredGroups).map(([group, keys]) => (
                        <div
                            key={group}
                            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                        >
                            {/* Group Header */}
                            <button
                                type="button"
                                onClick={() => toggleGroup(group)}
                                className="flex items-center gap-2 w-full px-5 py-3 bg-slate-50 border-b border-slate-200 hover:bg-slate-100 transition-colors"
                            >
                                {collapsedGroups[group] ? (
                                    <ChevronRight size={16} />
                                ) : (
                                    <ChevronDown size={16} />
                                )}
                                <span className="font-semibold text-slate-700 capitalize">
                                    {group}
                                </span>
                                <span className="ml-auto text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 font-medium">
                                    {
                                        keys.filter(([key]) =>
                                            values[`${group}.${key}`]?.trim(),
                                        ).length
                                    }{" "}
                                    / {keys.length}
                                </span>
                            </button>

                            {/* Rows */}
                            {!collapsedGroups[group] && (
                                <div className="divide-y divide-slate-50">
                                    <div className="grid grid-cols-3 gap-4 px-5 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide bg-slate-50/60">
                                        <span>{t("Key")}</span>
                                        <span>{t("English (Reference)")}</span>
                                        <span>
                                            {language.native_name ||
                                                language.name}
                                        </span>
                                    </div>
                                    {keys.map(([key, enVal]) => (
                                        <div
                                            key={key}
                                            className="grid grid-cols-3 gap-4 px-5 py-2.5 items-center hover:bg-slate-50/50 transition-colors"
                                        >
                                            <code className="text-xs text-slate-500 font-mono break-all">
                                                {group}.{key}
                                            </code>
                                            <span className="text-sm text-slate-600">
                                                {enVal}
                                            </span>
                                            <input
                                                value={
                                                    values[`${group}.${key}`] ??
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    updateValue(
                                                        group,
                                                        key,
                                                        e.target.value,
                                                    )
                                                }
                                                dir={
                                                    language.is_rtl
                                                        ? "rtl"
                                                        : "ltr"
                                                }
                                                placeholder={enVal}
                                                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-shadow"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {Object.keys(filteredGroups).length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            {t("No translations match your search.")}
                        </div>
                    )}

                    {/* Save button at bottom */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm"
                        >
                            <Save size={15} />
                            {saving ? "Saving..." : "Save All Translations"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

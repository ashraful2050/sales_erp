import { usePage } from "@inertiajs/react";

/**
 * useTranslation – access the current locale translations.
 *
 * Usage:
 *   const { t, locale, isRtl } = useTranslation();
 *   <span>{t('nav.dashboard')}</span>
 *   <span>{t('ui.save', { default: 'Save' })}</span>
 */
export function useTranslation() {
    const {
        translations = {},
        locale = "en",
        languages = [],
    } = usePage().props;

    const currentLanguage = languages.find((l) => l.code === locale);
    const isRtl = currentLanguage?.is_rtl ?? false;

    /**
     * Translate a key. Supports fallback via options.default.
     * Falls back to the key itself if no translation found.
     *
     * @param {string} key - e.g. "nav.dashboard" or "ui.save"
     * @param {object} options - { default: string, replace: {key: value} }
     */
    function t(key, options = {}) {
        let value = translations[key];

        // If not found by exact key, try "ui.{key}" (handles plain-text keys like
        // t("Manage") → ui.Manage) then "ui.{key.toLowerCase()}" (handles generic
        // UI calls like t("Save") → ui.save, t("Cancel") → ui.cancel).
        if (!value || value === "") {
            value = translations[`ui.${key}`];
        }
        if (!value || value === "") {
            value = translations[`ui.${key.toLowerCase()}`];
        }

        if (!value || value === "") {
            value = options.default ?? key;
        }

        // Simple variable replacement: t('hello.name', { replace: { name: 'John' } })
        if (options.replace) {
            Object.entries(options.replace).forEach(
                ([placeholder, replacement]) => {
                    value = value.replace(
                        new RegExp(`:${placeholder}`, "g"),
                        replacement,
                    );
                },
            );
        }

        return value;
    }

    return { t, locale, isRtl, currentLanguage, languages };
}

export default useTranslation;

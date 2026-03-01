/**
 * Format a date string as "YY-MM-DD".
 *
 * Accepts ISO datetime strings ("2026-02-24T00:00:00.000000Z"),
 * plain date strings ("2026-02-24"), or any string whose first 10
 * characters are "YYYY-MM-DD". Returns "—" for falsy values.
 *
 * @param {string|null|undefined} dateStr
 * @returns {string}
 */
export function fmtDate(dateStr) {
    if (!dateStr) return "—";
    const datePart = String(dateStr).slice(0, 10); // "YYYY-MM-DD"
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return dateStr;
    const [year, month, day] = datePart.split("-");
    return `${year.slice(2)}-${month}-${day}`;
}

/**
 * Format a datetime string as "YY-MM-DD HH:MM".
 *
 * @param {string|null|undefined} dateStr
 * @returns {string}
 */
export function fmtDateTime(dateStr) {
    if (!dateStr) return "—";
    const s = String(dateStr);
    const datePart = s.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return dateStr;
    const [year, month, day] = datePart.split("-");
    const timePart = s.slice(11, 16); // "HH:MM"
    const dateFormatted = `${year.slice(2)}-${month}-${day}`;
    return timePart ? `${dateFormatted} ${timePart}` : dateFormatted;
}

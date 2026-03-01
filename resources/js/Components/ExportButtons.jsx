/**
 * ExportButtons — CSV, Excel, PDF, Print
 *
 * Usage:
 *   <ExportButtons tableId="my-table" filename="invoices-2026" title="Invoice List" />
 *
 * tableId  : id of the <table> element to read data from
 * filename : downloaded file base name (no extension)
 * title    : shown in print header
 */
import { FileDown, FileSpreadsheet, FileText, Printer } from "lucide-react";

function getTableData(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return { headers: [], rows: [] };

    const headers = [];
    table.querySelectorAll("thead tr th").forEach((th) => {
        const txt = th.innerText.trim();
        if (txt) headers.push(txt);
    });

    const rows = [];
    table.querySelectorAll("tbody tr").forEach((tr) => {
        const cells = [];
        let hasContent = false;
        tr.querySelectorAll("td").forEach((td) => {
            // Skip action columns (those containing only buttons/links with icons)
            const txt = td.innerText.trim().replace(/\n+/g, " ");
            cells.push(txt);
            if (txt) hasContent = true;
        });
        if (hasContent) rows.push(cells);
    });

    return { headers, rows };
}

function escapeCSV(val) {
    if (val === null || val === undefined) return "";
    const str = String(val).replace(/"/g, '""');
    return /[",\n]/.test(str) ? `"${str}"` : str;
}

export default function ExportButtons({
    tableId = "export-table",
    filename = "export",
    title = "",
}) {
    const csvExport = () => {
        const { headers, rows } = getTableData(tableId);
        const lines = [
            headers.map(escapeCSV).join(","),
            ...rows.map((r) => r.map(escapeCSV).join(",")),
        ].join("\n");
        download(lines, `${filename}.csv`, "text/csv;charset=utf-8;");
    };

    const excelExport = () => {
        const { headers, rows } = getTableData(tableId);
        // Simple HTML-table trick that Excel understands
        let html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel'>
<head><meta charset="UTF-8"></head><body><table>`;
        html += `<tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>`;
        rows.forEach((r) => {
            html += `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`;
        });
        html += "</table></body></html>";
        download(html, `${filename}.xls`, "application/vnd.ms-excel");
    };

    const pdfPrint = (mode = "print") => {
        const table = document.getElementById(tableId);
        if (!table) return;
        const printWin = window.open("", "_blank", "width=900,height=700");
        printWin.document.write(`<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <title>${title || filename}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #1a1a2e; padding: 24px; }
    h2 { font-size: 18px; font-weight: 700; margin-bottom: 4px; color: #1e3a5f; }
    p.subtitle { font-size: 11px; color: #6b7280; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #1e3a5f; color: #fff; }
    thead th { padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; }
    tbody tr:nth-child(even) { background: #f5f7ff; }
    tbody td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; }
    tfoot td { padding: 7px 10px; font-weight: 600; background: #eef2ff; }
    @media print { body { padding: 0; } }
  </style>
</head><body>
  <h2>${title || filename}</h2>
  <p class="subtitle">Exported ${new Date().toLocaleDateString("sv").slice(2)}</p>
  ${table.outerHTML}
</body></html>`);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => {
            if (mode === "print") printWin.print();
            else {
                printWin.print();
            } // PDF = browser Save as PDF
        }, 300);
    };

    function download(content, name, mime) {
        const blob = new Blob(["\uFEFF" + content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
    }

    const btnCls =
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all";

    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            <button
                onClick={csvExport}
                className={`${btnCls} bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100`}
            >
                <FileDown size={13} /> CSV
            </button>
            <button
                onClick={excelExport}
                className={`${btnCls} bg-green-50 text-green-700 border-green-200 hover:bg-green-100`}
            >
                <FileSpreadsheet size={13} /> Excel
            </button>
            <button
                onClick={() => pdfPrint("pdf")}
                className={`${btnCls} bg-red-50 text-red-700 border-red-200 hover:bg-red-100`}
            >
                <FileText size={13} /> PDF
            </button>
            <button
                onClick={() => pdfPrint("print")}
                className={`${btnCls} bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100`}
            >
                <Printer size={13} /> Print
            </button>
        </div>
    );
}

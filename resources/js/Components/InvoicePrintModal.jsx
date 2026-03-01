/**
 * InvoicePrintModal
 * Shows 4 different invoice print templates.
 * Each template has its own print layout.
 *
 * Props: invoice, company, onClose
 */
import { useState } from "react";
import { X, Printer, ChevronLeft, ChevronRight } from "lucide-react";
import { fmtDate } from "@/utils/date";

const TEMPLATES = [
    { id: "classic", label: "Classic", desc: "Traditional professional" },
    { id: "modern", label: "Modern", desc: "Bold header design" },
    { id: "minimal", label: "Minimal", desc: "Clean & elegant" },
    { id: "pad", label: "Pad Print", desc: "Compact receipt style" },
];

const fmt = (v) =>
    Number(v || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 });
const curr = (v) => `৳${fmt(v)}`;

/* ─── Template 1: CLASSIC ─────────────────────────────────────── */
function TemplateClassic({ invoice, company }) {
    const sub =
        invoice.items?.reduce((s, i) => s + Number(i.subtotal ?? 0), 0) ?? 0;
    const tax =
        invoice.items?.reduce((s, i) => s + Number(i.tax_amount ?? 0), 0) ?? 0;
    const disc = Number(invoice.discount_amount ?? 0);
    const total = Number(invoice.total_amount ?? 0);
    const paid = Number(invoice.paid_amount ?? 0);
    return (
        <div className="bg-white font-sans text-gray-800 p-10 min-h-[297mm]">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">
                        {company?.name ?? "Your Company"}
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        {company?.address}
                    </p>
                    <p className="text-xs text-gray-500">
                        {company?.phone} · {company?.email}
                    </p>
                    {company?.bin_number && (
                        <p className="text-xs text-gray-500">
                            BIN: {company.bin_number}
                        </p>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-4xl font-black text-blue-200 uppercase tracking-widest">
                        INVOICE
                    </p>
                    <p className="text-lg font-bold text-gray-800 mt-1">
                        {invoice.invoice_number}
                    </p>
                    <span
                        className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold uppercase
                        ${invoice.status === "paid" ? "bg-green-100 text-green-700" : invoice.status === "overdue" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                    >
                        {invoice.status}
                    </span>
                </div>
            </div>

            {/* Dates + Bill To */}
            <div className="flex gap-8 mb-8">
                <div className="flex-1 bg-blue-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                        Bill To
                    </p>
                    <p className="font-bold text-gray-800">
                        {invoice.customer?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                        {invoice.customer?.address}
                    </p>
                    <p className="text-xs text-gray-500">
                        {invoice.customer?.phone}
                    </p>
                    <p className="text-xs text-gray-500">
                        {invoice.customer?.email}
                    </p>
                </div>
                <div className="w-48 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Invoice Date</span>
                        <span className="font-medium">
                            {fmtDate(invoice.invoice_date)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Due Date</span>
                        <span className="font-medium">
                            {fmtDate(invoice.due_date)}
                        </span>
                    </div>
                    {invoice.payment_terms && (
                        <div className="flex justify-between">
                            <span className="text-gray-500">Terms</span>
                            <span className="font-medium">
                                {invoice.payment_terms}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Items */}
            <table className="w-full text-sm border-collapse mb-6">
                <thead>
                    <tr className="bg-blue-700 text-white">
                        {[
                            "#",
                            "Product",
                            "Description",
                            "Qty",
                            "Unit Price",
                            "Tax",
                            "Amount",
                        ].map((h) => (
                            <th
                                key={h}
                                className="px-3 py-2.5 text-left text-xs font-semibold"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {invoice.items?.map((item, i) => (
                        <tr
                            key={i}
                            className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}
                        >
                            <td className="px-3 py-2 text-gray-400 text-xs">
                                {i + 1}
                            </td>
                            <td className="px-3 py-2 font-medium">
                                {item.product?.name ?? "—"}
                            </td>
                            <td className="px-3 py-2 text-gray-500 text-xs">
                                {item.description ?? "—"}
                            </td>
                            <td className="px-3 py-2">{item.quantity}</td>
                            <td className="px-3 py-2">
                                {curr(item.unit_price)}
                            </td>
                            <td className="px-3 py-2 text-xs">
                                {item.taxRate?.rate
                                    ? `${item.taxRate.rate}%`
                                    : "—"}
                            </td>
                            <td className="px-3 py-2 font-semibold text-right">
                                {curr(item.subtotal)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals + Notes */}
            <div className="flex justify-between items-start">
                <div className="max-w-xs text-sm text-gray-600">
                    {invoice.notes && (
                        <>
                            <p className="font-semibold text-gray-700 mb-1">
                                Notes
                            </p>
                            <p>{invoice.notes}</p>
                        </>
                    )}
                    <p className="mt-3 text-xs text-gray-400">
                        Thank you for your business!
                    </p>
                </div>
                <div className="w-60 text-sm space-y-1.5">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Subtotal</span>
                        <span>{curr(sub)}</span>
                    </div>
                    {tax > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-500">Tax</span>
                            <span>{curr(tax)}</span>
                        </div>
                    )}
                    {disc > 0 && (
                        <div className="flex justify-between text-red-500">
                            <span>Discount</span>
                            <span>-{curr(disc)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-2 text-blue-700">
                        <span>Total</span>
                        <span>{curr(total)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                        <span>Paid</span>
                        <span>{curr(paid)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-red-600 border-t border-gray-200 pt-2">
                        <span>Balance Due</span>
                        <span>{curr(total - paid)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Template 2: MODERN ──────────────────────────────────────── */
function TemplateModern({ invoice, company }) {
    const total = Number(invoice.total_amount ?? 0);
    const paid = Number(invoice.paid_amount ?? 0);
    return (
        <div className="bg-white font-sans text-gray-800 min-h-[297mm]">
            {/* Bold header */}
            <div className="bg-gradient-to-br from-indigo-700 to-purple-700 text-white px-10 pt-8 pb-12 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute right-24 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">
                            {company?.name ?? "Your Company"}
                        </h1>
                        <p className="text-indigo-200 text-xs mt-1">
                            {company?.address}
                        </p>
                        <p className="text-indigo-200 text-xs">
                            {company?.phone}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-5xl font-black opacity-30 uppercase">
                            INV
                        </p>
                        <p className="text-xl font-bold -mt-2">
                            {invoice.invoice_number}
                        </p>
                    </div>
                </div>
                {/* Status pill */}
                <div className="absolute bottom-0 left-10 translate-y-1/2">
                    <span className="bg-white text-indigo-700 font-bold text-sm px-4 py-1 rounded-full shadow-lg uppercase">
                        {invoice.status}
                    </span>
                </div>
            </div>

            <div className="px-10 pt-10 pb-8">
                {/* Bill to + dates */}
                <div className="flex gap-8 mb-8 mt-2">
                    <div className="flex-1">
                        <p className="text-xs text-indigo-600 font-semibold uppercase mb-1">
                            Bill To
                        </p>
                        <p className="font-bold text-gray-900 text-base">
                            {invoice.customer?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                            {invoice.customer?.address}
                        </p>
                        <p className="text-sm text-gray-500">
                            {invoice.customer?.phone}
                        </p>
                    </div>
                    <div className="space-y-1 text-sm">
                        <div className="flex gap-6 justify-between">
                            <span className="text-gray-400">Invoice Date</span>
                            <span className="font-semibold">
                                {fmtDate(invoice.invoice_date)}
                            </span>
                        </div>
                        <div className="flex gap-6 justify-between">
                            <span className="text-gray-400">Due Date</span>
                            <span className="font-semibold">
                                {fmtDate(invoice.due_date)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <table className="w-full text-sm mb-8">
                    <thead>
                        <tr className="border-b-2 border-indigo-600">
                            {[
                                "Product",
                                "Qty",
                                "Unit Price",
                                "Tax",
                                "Amount",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="pb-2 text-left text-xs font-semibold text-indigo-600 uppercase"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items?.map((item, i) => (
                            <tr key={i} className="border-b border-gray-100">
                                <td className="py-3">
                                    <p className="font-medium">
                                        {item.product?.name ?? "—"}
                                    </p>
                                    {item.description && (
                                        <p className="text-xs text-gray-400">
                                            {item.description}
                                        </p>
                                    )}
                                </td>
                                <td className="py-3 text-gray-600">
                                    {item.quantity}
                                </td>
                                <td className="py-3">
                                    {curr(item.unit_price)}
                                </td>
                                <td className="py-3 text-xs">
                                    {item.taxRate?.rate
                                        ? `${item.taxRate.rate}%`
                                        : "—"}
                                </td>
                                <td className="py-3 font-semibold text-right">
                                    {curr(item.subtotal)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals box */}
                <div className="flex justify-end">
                    <div className="w-72 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 space-y-2 text-sm">
                        {[
                            {
                                l: "Subtotal",
                                v:
                                    invoice.items?.reduce(
                                        (s, i) => s + Number(i.subtotal ?? 0),
                                        0,
                                    ) ?? 0,
                            },
                            {
                                l: "Tax",
                                v:
                                    invoice.items?.reduce(
                                        (s, i) => s + Number(i.tax_amount ?? 0),
                                        0,
                                    ) ?? 0,
                            },
                        ].map(
                            ({ l, v }) =>
                                v > 0 && (
                                    <div
                                        key={l}
                                        className="flex justify-between text-gray-600"
                                    >
                                        <span>{l}</span>
                                        <span>{curr(v)}</span>
                                    </div>
                                ),
                        )}
                        <div className="flex justify-between font-black text-lg text-indigo-700 border-t border-indigo-200 pt-3">
                            <span>Total</span>
                            <span>{curr(total)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>Paid</span>
                            <span>{curr(paid)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-red-600 border-t border-red-100 pt-2">
                            <span>Balance Due</span>
                            <span>{curr(total - paid)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Template 3: MINIMAL ─────────────────────────────────────── */
function TemplateMinimal({ invoice, company }) {
    const total = Number(invoice.total_amount ?? 0);
    const paid = Number(invoice.paid_amount ?? 0);
    return (
        <div className="bg-white font-sans text-gray-900 p-12 min-h-[297mm]">
            <div className="flex justify-between items-start mb-12">
                <div>
                    <p className="text-3xl font-black text-gray-900">
                        {company?.name ?? "Your Company"}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        {company?.address}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                        Invoice
                    </p>
                    <p className="text-2xl font-bold">
                        {invoice.invoice_number}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8 text-sm mb-10 pb-10 border-b border-gray-100">
                <div>
                    <p className="text-xs uppercase text-gray-400 mb-2 tracking-widest">
                        Billed To
                    </p>
                    <p className="font-semibold">{invoice.customer?.name}</p>
                    <p className="text-gray-500">{invoice.customer?.address}</p>
                    <p className="text-gray-500">{invoice.customer?.phone}</p>
                </div>
                <div>
                    <p className="text-xs uppercase text-gray-400 mb-2 tracking-widest">
                        Invoice Date
                    </p>
                    <p className="font-semibold">
                        {fmtDate(invoice.invoice_date)}
                    </p>
                </div>
                <div>
                    <p className="text-xs uppercase text-gray-400 mb-2 tracking-widest">
                        Due Date
                    </p>
                    <p className="font-semibold">{fmtDate(invoice.due_date)}</p>
                </div>
            </div>

            <table className="w-full text-sm mb-10">
                <thead>
                    <tr className="text-xs uppercase text-gray-400 tracking-widest border-b border-gray-200">
                        <th className="pb-3 text-left font-normal">
                            Description
                        </th>
                        <th className="pb-3 text-right font-normal">Qty</th>
                        <th className="pb-3 text-right font-normal">Price</th>
                        <th className="pb-3 text-right font-normal">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items?.map((item, i) => (
                        <tr key={i} className="border-b border-gray-50">
                            <td className="py-3">
                                <p className="font-medium">
                                    {item.product?.name ??
                                        item.description ??
                                        "—"}
                                </p>
                                {item.description && item.product && (
                                    <p className="text-xs text-gray-400">
                                        {item.description}
                                    </p>
                                )}
                            </td>
                            <td className="py-3 text-right text-gray-500">
                                {item.quantity}
                            </td>
                            <td className="py-3 text-right text-gray-500">
                                {curr(item.unit_price)}
                            </td>
                            <td className="py-3 text-right font-medium">
                                {curr(item.subtotal)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-end">
                <div className="text-sm text-gray-400 max-w-xs">
                    {invoice.notes && <p>{invoice.notes}</p>}
                </div>
                <div className="text-sm space-y-1 w-52">
                    {[
                        {
                            l: "Subtotal",
                            v:
                                invoice.items?.reduce(
                                    (s, i) => s + Number(i.subtotal ?? 0),
                                    0,
                                ) ?? 0,
                            cls: "text-gray-500",
                        },
                        {
                            l: "Tax",
                            v:
                                invoice.items?.reduce(
                                    (s, i) => s + Number(i.tax_amount ?? 0),
                                    0,
                                ) ?? 0,
                            cls: "text-gray-500",
                        },
                    ].map(
                        ({ l, v, cls }) =>
                            v > 0 && (
                                <div
                                    key={l}
                                    className={`flex justify-between ${cls}`}
                                >
                                    <span>{l}</span>
                                    <span>{curr(v)}</span>
                                </div>
                            ),
                    )}
                    <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-900">
                        <span>Total</span>
                        <span>{curr(total)}</span>
                    </div>
                    {paid > 0 && (
                        <div className="flex justify-between text-gray-400 text-xs">
                            <span>Paid</span>
                            <span>{curr(paid)}</span>
                        </div>
                    )}
                    {total - paid > 0 && (
                        <div className="flex justify-between font-bold text-red-500">
                            <span>Balance Due</span>
                            <span>{curr(total - paid)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Template 4: PAD PRINT (thermal receipt) ────────────────── */
function TemplatePad({ invoice, company }) {
    const total = Number(invoice.total_amount ?? 0);
    const paid = Number(invoice.paid_amount ?? 0);
    return (
        <div
            className="bg-white font-mono text-gray-800 mx-auto p-4 text-xs"
            style={{ maxWidth: 320 }}
        >
            <div className="text-center border-b-2 border-dashed border-gray-400 pb-3 mb-3">
                <p className="font-bold text-base uppercase">
                    {company?.name ?? "Company Name"}
                </p>
                <p className="text-gray-500">{company?.address}</p>
                <p className="text-gray-500">{company?.phone}</p>
                {company?.bin_number && <p>BIN: {company.bin_number}</p>}
            </div>

            <div className="border-b border-dashed border-gray-300 pb-2 mb-2">
                <p className="font-bold text-center text-sm uppercase tracking-widest">
                    Invoice
                </p>
                <div className="flex justify-between">
                    <span>No:</span>
                    <span className="font-bold">{invoice.invoice_number}</span>
                </div>
                <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{fmtDate(invoice.invoice_date)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Due:</span>
                    <span>{fmtDate(invoice.due_date)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-semibold">
                        {invoice.customer?.name}
                    </span>
                </div>
            </div>

            <table className="w-full border-b border-dashed border-gray-300 mb-2">
                <thead>
                    <tr className="border-b border-gray-300">
                        <th className="text-left pb-1">Item</th>
                        <th className="text-right pb-1">Qty</th>
                        <th className="text-right pb-1">Price</th>
                        <th className="text-right pb-1">Amt</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items?.map((item, i) => (
                        <tr key={i}>
                            <td className="py-0.5 truncate max-w-[90px]">
                                {item.product?.name ?? "—"}
                            </td>
                            <td className="text-right py-0.5">
                                {item.quantity}
                            </td>
                            <td className="text-right py-0.5">
                                {fmt(item.unit_price)}
                            </td>
                            <td className="text-right py-0.5 font-semibold">
                                {fmt(item.subtotal)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="space-y-0.5 border-b border-dashed border-gray-300 pb-2 mb-2">
                {[
                    {
                        l: "Subtotal",
                        v:
                            invoice.items?.reduce(
                                (s, i) => s + Number(i.subtotal ?? 0),
                                0,
                            ) ?? 0,
                    },
                    {
                        l: "Tax",
                        v:
                            invoice.items?.reduce(
                                (s, i) => s + Number(i.tax_amount ?? 0),
                                0,
                            ) ?? 0,
                    },
                    {
                        l: "Discount",
                        v: Number(invoice.discount_amount ?? 0),
                        minus: true,
                    },
                ].map(
                    ({ l, v, minus }) =>
                        v > 0 && (
                            <div key={l} className="flex justify-between">
                                <span>{l}</span>
                                <span>
                                    {minus ? "-" : ""}
                                    {fmt(v)}
                                </span>
                            </div>
                        ),
                )}
                <div className="flex justify-between font-bold text-sm border-t border-gray-400 pt-1">
                    <span>TOTAL</span>
                    <span>৳{fmt(total)}</span>
                </div>
                {paid > 0 && (
                    <div className="flex justify-between">
                        <span>Paid</span>
                        <span>৳{fmt(paid)}</span>
                    </div>
                )}
                {total - paid > 0 && (
                    <div className="flex justify-between font-bold">
                        <span>Balance</span>
                        <span>৳{fmt(total - paid)}</span>
                    </div>
                )}
            </div>

            <div className="text-center text-gray-400 text-xs mt-3 space-y-1">
                <p className="uppercase font-semibold">Thank You!</p>
                {invoice.notes && <p className="italic">{invoice.notes}</p>}
                <p>
                    Status:{" "}
                    <span className="font-bold uppercase">
                        {invoice.status}
                    </span>
                </p>
            </div>
        </div>
    );
}

/* ─── Main Modal Component ────────────────────────────────────── */
const RENDERED = {
    classic: TemplateClassic,
    modern: TemplateModern,
    minimal: TemplateMinimal,
    pad: TemplatePad,
};

export default function InvoicePrintModal({ invoice, company, onClose }) {
    const [active, setActive] = useState("classic");
    const Template = RENDERED[active];

    const doPrint = () => {
        const content = document.getElementById("invoice-print-area");
        const printWin = window.open("", "_blank", "width=900,height=700");
        printWin.document.write(`<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoice_number}</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @media print { body { margin: 0; } }
    body { font-family: 'Segoe UI', Arial, sans-serif; }
  </style>
</head><body>${content.innerHTML}</body></html>`);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => printWin.print(), 600);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl">
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Print Invoice
                        </h2>
                        <p className="text-xs text-slate-500">
                            Choose a template, then click Print
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={doPrint}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold"
                        >
                            <Printer size={16} /> Print / Save PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Template selector */}
                <div className="px-6 py-3 border-b border-slate-100 flex gap-2 overflow-x-auto">
                    {TEMPLATES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActive(t.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all
                                ${
                                    active === t.id
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300"
                                }`}
                        >
                            {t.label}
                            <span className="block text-xs font-normal opacity-70">
                                {t.desc}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Preview */}
                <div className="overflow-y-auto max-h-[72vh] bg-slate-100 p-4">
                    <div
                        id="invoice-print-area"
                        className="shadow-xl rounded-lg overflow-hidden ring-1 ring-black/10"
                    >
                        <Template invoice={invoice} company={company} />
                    </div>
                </div>
            </div>
        </div>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft, Plus, Trash2, AlertTriangle } from "lucide-react";

const Select = ({ error, children, ...props }) => (
    <select {...props} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-400" : "border-slate-200"}`}>{children}</select>
);
const Input = ({ error, className = "", ...props }) => (
    <input {...props} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${error ? "border-red-400" : "border-slate-200"} ${className}`} />
);

const emptyLine = () => ({ account_id: "", description: "", debit: "", credit: "" });

export default function JournalEntryForm({ entry, accounts }) {
    const isEdit = !!entry;
    const { data, setData, post, put, processing, errors } = useForm({
        voucher_number: entry?.voucher_number ?? "",
        type: entry?.type ?? "journal",
        date: entry?.date ?? new Date().toISOString().slice(0, 10),
        narration: entry?.narration ?? "",
        reference: entry?.reference ?? "",
        lines: entry?.lines?.length ? entry.lines : [emptyLine(), emptyLine()],
    });

    const updateLine = (idx, field, val) => {
        const lines = [...data.lines];
        lines[idx] = { ...lines[idx], [field]: val };
        // If user types in debit, clear credit and vice versa
        if (field === "debit" && val) lines[idx].credit = "";
        if (field === "credit" && val) lines[idx].debit = "";
        setData("lines", lines);
    };

    const addLine = () => setData("lines", [...data.lines, emptyLine()]);
    const removeLine = (idx) => { if (data.lines.length > 2) setData("lines", data.lines.filter((_, i) => i !== idx)); };

    const totalDebit = data.lines.reduce((s, l) => s + Number(l.debit || 0), 0);
    const totalCredit = data.lines.reduce((s, l) => s + Number(l.credit || 0), 0);
    const balanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(route("accounting.journal-entries.update", entry.id)) : post(route("accounting.journal-entries.store"));
    };

    return (
        <AppLayout title={isEdit ? "Edit Journal Entry" : "New Journal Entry"}>
            <Head title={isEdit ? "Edit Journal Entry" : "New Journal Entry"} />
            <PageHeader
                title={isEdit ? "Edit Journal Entry" : "New Journal Entry"}
                subtitle="Double-entry bookkeeping — debits must equal credits"
                actions={<Link href={route("accounting.journal-entries.index")} className="flex items-center gap-2 text-slate-600 text-sm font-medium"><ArrowLeft size={16} /> Back</Link>}
            />
            <form onSubmit={submit} className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Voucher Type</label>
                            <Select value={data.type} onChange={e => setData("type", e.target.value)}>
                                <option value="journal">Journal</option>
                                <option value="payment">Payment</option>
                                <option value="receipt">Receipt</option>
                                <option value="contra">Contra</option>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Entry Date *</label>
                            <Input type="date" value={data.date} onChange={e => setData("date", e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Voucher Number</label>
                            <Input value={data.voucher_number} onChange={e => setData("voucher_number", e.target.value)} placeholder="Auto-generated" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Reference</label>
                            <Input value={data.reference} onChange={e => setData("reference", e.target.value)} placeholder="Invoice/PO number…" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Narration *</label>
                        <textarea value={data.narration} onChange={e => setData("narration", e.target.value)} rows={2} required
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.narration && <p className="mt-1 text-xs text-red-500">{errors.narration}</p>}
                    </div>
                </div>

                {/* Double-entry lines */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Journal Lines</h3>
                        <button type="button" onClick={addLine} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                            <Plus size={15} /> Add Line
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">Account</th>
                                    <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">Description</th>
                                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 w-36">Debit (Dr)</th>
                                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 w-36">Credit (Cr)</th>
                                    <th className="w-8 px-2"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.lines.map((line, idx) => (
                                    <tr key={idx} className={line.debit > 0 ? "" : line.credit > 0 ? "bg-blue-50/30" : ""}>
                                        <td className="px-4 py-2 w-64">
                                            <Select value={line.account_id} onChange={e => updateLine(idx, "account_id", e.target.value)}>
                                                <option value="">— select account —</option>
                                                {accounts?.map(a => <option key={a.id} value={a.id}>{a.code} – {a.name}</option>)}
                                            </Select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input value={line.description} onChange={e => updateLine(idx, "description", e.target.value)} placeholder="Narration…" />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input type="number" step="0.01" min="0" value={line.debit}
                                                onChange={e => updateLine(idx, "debit", e.target.value)}
                                                className="text-right font-mono" placeholder="0.00" />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input type="number" step="0.01" min="0" value={line.credit}
                                                onChange={e => updateLine(idx, "credit", e.target.value)}
                                                className="text-right font-mono" placeholder="0.00" />
                                        </td>
                                        <td className="px-2 py-2">
                                            {data.lines.length > 2 && (
                                                <button type="button" onClick={() => removeLine(idx)} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                                <tr>
                                    <td className="px-4 py-3 text-sm font-semibold text-slate-700" colSpan={2}>Totals</td>
                                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800">৳{totalDebit.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800">৳{totalCredit.toFixed(2)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Balance indicator */}
                    <div className="px-6 py-3 border-t border-slate-100">
                        {balanced ? (
                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                Journal is balanced ✓
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                                <AlertTriangle size={15} />
                                Difference: ৳{Math.abs(totalDebit - totalCredit).toFixed(2)} — must balance before saving
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pb-8">
                    <Link href={route("accounting.journal-entries.index")} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</Link>
                    <button type="submit" disabled={processing || !balanced}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium">
                        <Save size={16} /> {isEdit ? "Update Entry" : "Post Entry"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

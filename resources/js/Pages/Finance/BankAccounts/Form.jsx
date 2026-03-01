import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft } from "lucide-react";

const Field = ({ label, error, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);
const Input = ({ error, ...props }) => (
    <input {...props} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-400" : "border-slate-200"}`} />
);
const Select = ({ error, children, ...props }) => (
    <select {...props} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-400" : "border-slate-200"}`}>{children}</select>
);

export default function BankAccountForm({ bankAccount, glAccounts }) {
    const isEdit = !!bankAccount;
    const { data, setData, post, put, processing, errors } = useForm({
        bank_name: bankAccount?.bank_name ?? "",
        account_number: bankAccount?.account_number ?? "",
        account_name: bankAccount?.account_name ?? "",
        branch_name: bankAccount?.branch_name ?? "",
        routing_number: bankAccount?.routing_number ?? "",
        swift_code: bankAccount?.swift_code ?? "",
        payment_method: bankAccount?.payment_method ?? "bank",
        currency_code: bankAccount?.currency_code ?? "BDT",
        opening_balance: bankAccount?.opening_balance ?? "0",
        account_id: bankAccount?.account_id ?? "",
        is_active: bankAccount?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(route("finance.bank-accounts.update", bankAccount.id)) : post(route("finance.bank-accounts.store"));
    };

    return (
        <AppLayout title={isEdit ? "Edit Bank Account" : "Add Bank Account"}>
            <Head title={isEdit ? "Edit Bank Account" : "Add Bank Account"} />
            <PageHeader
                title={isEdit ? "Edit Bank Account" : "Add Bank Account"}
                subtitle={isEdit ? `Editing: ${bankAccount.bank_name}` : "Link a new bank account"}
                actions={<Link href={route("finance.bank-accounts.index")} className="flex items-center gap-2 text-slate-600 text-sm font-medium"><ArrowLeft size={16} /> Back</Link>}
            />
            <form onSubmit={submit} className="max-w-3xl space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Bank Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Bank Name *" error={errors.bank_name}>
                            <Input value={data.bank_name} onChange={e => setData("bank_name", e.target.value)} required />
                        </Field>
                        <Field label="Account Number *" error={errors.account_number}>
                            <Input value={data.account_number} onChange={e => setData("account_number", e.target.value)} required />
                        </Field>
                        <Field label="Account Name" error={errors.account_name}>
                            <Input value={data.account_name} onChange={e => setData("account_name", e.target.value)} />
                        </Field>
                        <Field label="Branch" error={errors.branch_name}>
                            <Input value={data.branch_name} onChange={e => setData("branch_name", e.target.value)} />
                        </Field>
                        <Field label="Routing Number" error={errors.routing_number}>
                            <Input value={data.routing_number} onChange={e => setData("routing_number", e.target.value)} />
                        </Field>
                        <Field label="SWIFT Code" error={errors.swift_code}>
                            <Input value={data.swift_code} onChange={e => setData("swift_code", e.target.value)} />
                        </Field>
                        <Field label="Payment Method" error={errors.payment_method}>
                            <Select value={data.payment_method} onChange={e => setData("payment_method", e.target.value)}>
                                <option value="bank">Bank Transfer</option>
                                <option value="cash">Cash</option>
                                <option value="bkash">bKash</option>
                                <option value="nagad">Nagad</option>
                                <option value="rocket">Rocket</option>
                                <option value="upay">Upay</option>
                                <option value="other">Other</option>
                            </Select>
                        </Field>
                        <Field label="Currency" error={errors.currency_code}>
                            <Input value={data.currency_code} onChange={e => setData("currency_code", e.target.value)} />
                        </Field>
                        <Field label="Opening Balance (৳)" error={errors.opening_balance}>
                            <Input type="number" step="0.01" value={data.opening_balance} onChange={e => setData("opening_balance", e.target.value)} />
                        </Field>
                        <Field label="GL Account (Chart of Accounts)" error={errors.account_id}>
                            <Select value={data.account_id} onChange={e => setData("account_id", e.target.value)}>
                                <option value="">Select GL account…</option>
                                {glAccounts?.map(a => <option key={a.id} value={a.id}>{a.code} – {a.name}</option>)}
                            </Select>
                        </Field>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={data.is_active} onChange={e => setData("is_active", e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                        <span className="text-sm text-slate-700">Active account</span>
                    </label>
                </div>
                <div className="flex justify-end gap-3 pb-8">
                    <Link href={route("finance.bank-accounts.index")} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</Link>
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium">
                        <Save size={16} /> {isEdit ? "Update Bank Account" : "Add Bank Account"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

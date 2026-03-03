import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

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

export default function AccountForm({ account, groups }) {
    const { t } = useTranslation();
    const isEdit = !!account;
    const { data, setData, post, put, processing, errors } = useForm({
        code: account?.code ?? "",
        name: account?.name ?? "",
        name_bn: account?.name_bn ?? "",
        account_group_id: account?.account_group_id ?? "",
        type: account?.type ?? "asset",
        opening_balance: account?.opening_balance ?? "0",
        balance_type: account?.balance_type ?? "debit",
        description: account?.description ?? "",
        is_active: account?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(route("accounting.accounts.update", account.id)) : post(route("accounting.accounts.store"));
    };

    return (
        <AppLayout title={isEdit ? "Edit Account" : "New Account"}>
            <Head title={isEdit ? "Edit Account" : "New Account"} />
            <PageHeader
                title={isEdit ? "Edit Account" : "New Account"}
                subtitle={isEdit ? `Editing: ${account.name}` : "Add a new chart of accounts entry"}
                actions={<Link href={route("accounting.accounts.index")} className="flex items-center gap-2 text-slate-600 text-sm font-medium"><ArrowLeft size={16} /> {t("Back")}</Link>}
            />
            <form onSubmit={submit} className="max-w-3xl space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Account Code *" error={errors.code}>
                            <Input value={data.code} onChange={e => setData("code", e.target.value)} required placeholder="e.g. 1010" />
                        </Field>
                        <Field label="Account Type *" error={errors.type}>
                            <Select value={data.type} onChange={e => setData("type", e.target.value)}>
                                <option value="asset">{t("Asset")}</option>
                                <option value="liability">{t("Liability")}</option>
                                <option value="equity">{t("Equity")}</option>
                                <option value="revenue">{t("Revenue")}</option>
                                <option value="expense">{t("Expense")}</option>
                            </Select>
                        </Field>
                        <Field label="Account Name *" error={errors.name}>
                            <Input value={data.name} onChange={e => setData("name", e.target.value)} required />
                        </Field>
                        <Field label="Account Name (Bangla)" error={errors.name_bn}>
                            <Input value={data.name_bn} onChange={e => setData("name_bn", e.target.value)} />
                        </Field>
                        <Field label="Account Group" error={errors.account_group_id}>
                            <Select value={data.account_group_id} onChange={e => setData("account_group_id", e.target.value)}>
                                <option value="">Select group…</option>
                                {groups?.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </Select>
                        </Field>
                    </div>
                    <Field label="Description">
                        <textarea value={data.description} onChange={e => setData("description", e.target.value)} rows={2}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </Field>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Opening Balance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Opening Balance (৳)" error={errors.opening_balance}>
                            <Input type="number" step="0.01" value={data.opening_balance} onChange={e => setData("opening_balance", e.target.value)} />
                        </Field>
                        <Field label="Balance Type" error={errors.balance_type}>
                            <Select value={data.balance_type} onChange={e => setData("balance_type", e.target.value)}>
                                <option value="debit">Debit (Dr)</option>
                                <option value="credit">Credit (Cr)</option>
                            </Select>
                        </Field>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={data.is_active} onChange={e => setData("is_active", e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                        <span className="text-sm text-slate-700">{t("Active account")}</span>
                    </label>
                </div>

                <div className="flex justify-end gap-3 pb-8">
                    <Link href={route("accounting.accounts.index")} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</Link>
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium">
                        <Save size={16} /> {isEdit ? "Update Account" : "Create Account"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

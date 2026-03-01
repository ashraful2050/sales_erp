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

export default function CustomerForm({ customer }) {
    const isEdit = !!customer;
    const { data, setData, post, put, processing, errors } = useForm({
        name: customer?.name ?? "",
        name_bn: customer?.name_bn ?? "",
        email: customer?.email ?? "",
        phone: customer?.phone ?? "",
        mobile: customer?.mobile ?? "",
        bin_number: customer?.bin_number ?? "",
        tin_number: customer?.tin_number ?? "",
        address: customer?.address ?? "",
        city: customer?.city ?? "",
        credit_limit: customer?.credit_limit ?? "",
        credit_days: customer?.credit_days ?? "",
        opening_balance: customer?.opening_balance ?? "",
        is_active: customer?.is_active ?? true,
        notes: customer?.notes ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit
            ? put(route("sales.customers.update", customer.id))
            : post(route("sales.customers.store"));
    };

    return (
        <AppLayout title={isEdit ? "Edit Customer" : "New Customer"}>
            <Head title={isEdit ? "Edit Customer" : "New Customer"} />
            <PageHeader
                title={isEdit ? "Edit Customer" : "New Customer"}
                subtitle={isEdit ? `Editing: ${customer.name}` : "Add a new customer to your system"}
                actions={
                    <Link href={route("sales.customers.index")} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 text-sm font-medium">
                        <ArrowLeft size={16} /> Back
                    </Link>
                }
            />
            <form onSubmit={submit} className="max-w-4xl space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Basic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Customer Name (English) *" error={errors.name}>
                            <Input value={data.name} onChange={e => setData("name", e.target.value)} error={errors.name} required />
                        </Field>
                        <Field label="Customer Name (Bangla)" error={errors.name_bn}>
                            <Input value={data.name_bn} onChange={e => setData("name_bn", e.target.value)} />
                        </Field>
                        <Field label="Email" error={errors.email}>
                            <Input type="email" value={data.email} onChange={e => setData("email", e.target.value)} />
                        </Field>
                        <Field label="Phone" error={errors.phone}>
                            <Input value={data.phone} onChange={e => setData("phone", e.target.value)} />
                        </Field>
                        <Field label="Mobile" error={errors.mobile}>
                            <Input value={data.mobile} onChange={e => setData("mobile", e.target.value)} />
                        </Field>
                        <Field label="City" error={errors.city}>
                            <Input value={data.city} onChange={e => setData("city", e.target.value)} />
                        </Field>
                    </div>
                    <Field label="Address" error={errors.address}>
                        <textarea value={data.address} onChange={e => setData("address", e.target.value)} rows={2}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </Field>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Tax &amp; Compliance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="BIN Number" error={errors.bin_number}>
                            <Input value={data.bin_number} onChange={e => setData("bin_number", e.target.value)} />
                        </Field>
                        <Field label="TIN Number" error={errors.tin_number}>
                            <Input value={data.tin_number} onChange={e => setData("tin_number", e.target.value)} />
                        </Field>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Credit &amp; Financial</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Credit Limit (৳)" error={errors.credit_limit}>
                            <Input type="number" step="0.01" value={data.credit_limit} onChange={e => setData("credit_limit", e.target.value)} />
                        </Field>
                        <Field label="Credit Days" error={errors.credit_days}>
                            <Input type="number" value={data.credit_days} onChange={e => setData("credit_days", e.target.value)} />
                        </Field>
                        <Field label="Opening Balance (৳)" error={errors.opening_balance}>
                            <Input type="number" step="0.01" value={data.opening_balance} onChange={e => setData("opening_balance", e.target.value)} />
                        </Field>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Other</h3>
                    <Field label="Notes" error={errors.notes}>
                        <textarea value={data.notes} onChange={e => setData("notes", e.target.value)} rows={3}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </Field>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={data.is_active} onChange={e => setData("is_active", e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                        <span className="text-sm text-slate-700">Active customer</span>
                    </label>
                </div>

                <div className="flex justify-end gap-3 pb-8">
                    <Link href={route("sales.customers.index")}
                        className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50">
                        Cancel
                    </Link>
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium">
                        <Save size={16} /> {isEdit ? "Update Customer" : "Create Customer"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

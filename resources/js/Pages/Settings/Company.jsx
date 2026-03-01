import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save } from "lucide-react";

const InputField = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input id={id} {...props} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-400" : "border-slate-200"}`} />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

export default function CompanySettings({ company }) {
    const { data, setData, put, processing, errors } = useForm({
        name: company?.name ?? "",
        name_bn: company?.name_bn ?? "",
        bin_number: company?.bin_number ?? "",
        tin_number: company?.tin_number ?? "",
        address: company?.address ?? "",
        address_bn: company?.address_bn ?? "",
        phone: company?.phone ?? "",
        email: company?.email ?? "",
        website: company?.website ?? "",
        logo: company?.logo ?? "",
        currency_code: company?.currency_code ?? "BDT",
        fiscal_year_start: company?.fiscal_year_start ?? "07-01",
    });
    const save = (e) => { e.preventDefault(); put(route("settings.company.update")); };

    return (
        <AppLayout title="Company Settings">
            <Head title="Company Settings" />
            <PageHeader title="Company Settings" subtitle="Manage your company profile and preferences" />
            <form onSubmit={save} className="max-w-3xl space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Basic Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Company Name (English)" id="name" value={data.name} onChange={e => setData("name", e.target.value)} error={errors.name} required />
                        <InputField label="Company Name (Bangla)" id="name_bn" value={data.name_bn} onChange={e => setData("name_bn", e.target.value)} error={errors.name_bn} />
                        <InputField label="BIN Number" id="bin_number" value={data.bin_number} onChange={e => setData("bin_number", e.target.value)} error={errors.bin_number} />
                        <InputField label="TIN Number" id="tin_number" value={data.tin_number} onChange={e => setData("tin_number", e.target.value)} error={errors.tin_number} />
                        <InputField label="Phone" id="phone" value={data.phone} onChange={e => setData("phone", e.target.value)} error={errors.phone} />
                        <InputField label="Email" id="email" type="email" value={data.email} onChange={e => setData("email", e.target.value)} error={errors.email} />
                        <InputField label="Website" id="website" value={data.website} onChange={e => setData("website", e.target.value)} error={errors.website} />
                        <InputField label="Currency Code" id="currency_code" value={data.currency_code} onChange={e => setData("currency_code", e.target.value)} error={errors.currency_code} />
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Address (English)</label>
                            <textarea value={data.address} onChange={e => setData("address", e.target.value)} rows={3}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Address (Bangla)</label>
                            <textarea value={data.address_bn} onChange={e => setData("address_bn", e.target.value)} rows={3}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium">
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

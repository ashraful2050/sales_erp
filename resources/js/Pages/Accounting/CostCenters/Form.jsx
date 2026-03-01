import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";

export default function CostCenterForm({ costCenter, parents }) {
    const isEdit = !!costCenter;
    const { data, setData, post, put, processing, errors } = useForm({
        name: costCenter?.name ?? "",
        code: costCenter?.code ?? "",
        parent_id: costCenter?.parent_id ?? "",
        is_active: costCenter?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) put(route("accounting.cost-centers.update", costCenter.id));
        else post(route("accounting.cost-centers.store"));
    };

    return (
        <AppLayout title={isEdit ? "Edit Cost Center" : "New Cost Center"}>
            <Head title={isEdit ? "Edit Cost Center" : "New Cost Center"} />
            <PageHeader
                title={isEdit ? "Edit Cost Center" : "New Cost Center"}
                breadcrumbs={[
                    { label: "Cost Centers", href: route("accounting.cost-centers.index") },
                    { label: isEdit ? "Edit" : "New" },
                ]}
            />
            <form onSubmit={submit} className="max-w-lg bg-white rounded-xl border border-slate-200 p-6 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name <span className="text-red-500">*</span></label>
                    <input value={data.name} onChange={e => setData("name", e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Cost center name" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                    <input value={data.code} onChange={e => setData("code", e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="e.g. CC-001" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Parent Cost Center</label>
                    <select value={data.parent_id} onChange={e => setData("parent_id", e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                        <option value="">— None (Top Level) —</option>
                        {parents.map(p => <option key={p.id} value={p.id}>{p.name}{p.code ? ` (${p.code})` : ""}</option>)}
                    </select>
                </div>
                {isEdit && (
                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData("is_active", e.target.checked)} className="w-4 h-4 rounded" />
                        <label htmlFor="is_active" className="text-sm text-slate-700">Active</label>
                    </div>
                )}
                <div className="flex items-center gap-3 pt-2">
                    <button type="submit" disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                        {processing ? "Saving..." : (isEdit ? "Update" : "Create")} Cost Center
                    </button>
                    <Link href={route("accounting.cost-centers.index")} className="text-sm text-slate-500 hover:text-slate-700">Cancel</Link>
                </div>
            </form>
        </AppLayout>
    );
}

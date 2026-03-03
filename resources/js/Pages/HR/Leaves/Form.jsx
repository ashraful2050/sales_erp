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

export default function LeaveForm({ leave, leaveTypes, employees }) {
    const isEdit = !!leave;
    const { data, setData, post, put, processing, errors } = useForm({
        employee_id: leave?.employee_id ?? "",
        leave_type_id: leave?.leave_type_id ?? "",
        start_date: leave?.start_date ?? "",
        end_date: leave?.end_date ?? "",
        reason: leave?.reason ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(route("hr.leaves.update", leave.id)) : post(route("hr.leaves.store"));
    };

    return (
        <AppLayout title={isEdit ? "Edit Leave Request" : "Apply for Leave"}>
            <Head title={isEdit ? "Edit Leave Request" : "Apply for Leave"} />
            <PageHeader
                title={isEdit ? "Edit Leave Request" : "Apply for Leave"}
                subtitle={isEdit ? "Update leave request details" : "Submit a new leave application"}
                actions={<Link href={route("hr.leaves.index")} className="flex items-center gap-2 text-slate-600 text-sm font-medium"><ArrowLeft size={16} /> {t("Back")}</Link>}
            />
            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Employee *" error={errors.employee_id}>
                            <Select value={data.employee_id} onChange={e => setData("employee_id", e.target.value)} required>
                                <option value="">Select employee…</option>
                                {employees?.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Leave Type *" error={errors.leave_type_id}>
                            <Select value={data.leave_type_id} onChange={e => setData("leave_type_id", e.target.value)} required>
                                <option value="">Select leave type…</option>
                                {leaveTypes?.map(t => <option key={t.id} value={t.id}>{t.name} ({t.allowed_days} days/yr)</option>)}
                            </Select>
                        </Field>
                        <Field label="Start Date *" error={errors.start_date}>
                            <Input type="date" value={data.start_date} onChange={e => setData("start_date", e.target.value)} required />
                        </Field>
                        <Field label="End Date *" error={errors.end_date}>
                            <Input type="date" value={data.end_date} onChange={e => setData("end_date", e.target.value)} required />
                        </Field>
                    </div>
                    <Field label="Reason" error={errors.reason}>
                        <textarea value={data.reason} onChange={e => setData("reason", e.target.value)} rows={3} required
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </Field>
                </div>
                <div className="flex justify-end gap-3 pb-8">
                    <Link href={route("hr.leaves.index")} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</Link>
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium">
                        <Save size={16} /> {isEdit ? "Update Leave" : "Submit Application"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

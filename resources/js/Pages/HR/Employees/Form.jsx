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

export default function EmployeeForm({ employee, departments, designations }) {
    const isEdit = !!employee;
    const { data, setData, post, put, processing, errors } = useForm({
        employee_id: employee?.employee_id ?? "",
        name: employee?.name ?? "",
        name_bn: employee?.name_bn ?? "",
        email: employee?.email ?? "",
        phone: employee?.phone ?? "",
        mobile: employee?.mobile ?? "",
        nid_number: employee?.nid_number ?? "",
        tin_number: employee?.tin_number ?? "",
        gender: employee?.gender ?? "male",
        date_of_birth: employee?.date_of_birth ?? "",
        joining_date: employee?.joining_date ?? "",
        department_id: employee?.department_id ?? "",
        designation_id: employee?.designation_id ?? "",
        employment_type: employee?.employment_type ?? "permanent",
        basic_salary: employee?.basic_salary ?? "",
        salary_type: employee?.salary_type ?? "monthly",
        payment_method: employee?.payment_method ?? "cash",
        bank_account_name: employee?.bank_account_name ?? "",
        bank_account_number: employee?.bank_account_number ?? "",
        bank_name: employee?.bank_name ?? "",
        address: employee?.address ?? "",
        status: employee?.status ?? "active",
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(route("hr.employees.update", employee.id)) : post(route("hr.employees.store"));
    };

    return (
        <AppLayout title={isEdit ? "Edit Employee" : "New Employee"}>
            <Head title={isEdit ? "Edit Employee" : "New Employee"} />
            <PageHeader
                title={isEdit ? "Edit Employee" : "New Employee"}
                subtitle={isEdit ? `Editing: ${employee.name}` : "Register a new employee"}
                actions={<Link href={route("hr.employees.index")} className="flex items-center gap-2 text-slate-600 text-sm font-medium"><ArrowLeft size={16} /> Back</Link>}
            />
            <form onSubmit={submit} className="max-w-4xl space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Personal Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Employee ID" error={errors.employee_id}>
                            <Input value={data.employee_id} onChange={e => setData("employee_id", e.target.value)} placeholder="Auto-generate if blank" />
                        </Field>
                        <Field label="Full Name *" error={errors.name}>
                            <Input value={data.name} onChange={e => setData("name", e.target.value)} required />
                        </Field>
                        <Field label="Name (Bangla)" error={errors.name_bn}>
                            <Input value={data.name_bn} onChange={e => setData("name_bn", e.target.value)} />
                        </Field>
                        <Field label="Gender" error={errors.gender}>
                            <Select value={data.gender} onChange={e => setData("gender", e.target.value)}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Select>
                        </Field>
                        <Field label="Date of Birth" error={errors.date_of_birth}>
                            <Input type="date" value={data.date_of_birth} onChange={e => setData("date_of_birth", e.target.value)} />
                        </Field>
                        <Field label="NID Number" error={errors.nid_number}>
                            <Input value={data.nid_number} onChange={e => setData("nid_number", e.target.value)} />
                        </Field>
                        <Field label="TIN Number" error={errors.tin_number}>
                            <Input value={data.tin_number} onChange={e => setData("tin_number", e.target.value)} />
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
                    </div>
                    <Field label="Address">
                        <textarea value={data.address} onChange={e => setData("address", e.target.value)} rows={2}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </Field>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Employment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Department" error={errors.department_id}>
                            <Select value={data.department_id} onChange={e => setData("department_id", e.target.value)}>
                                <option value="">Select department…</option>
                                {departments?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Designation" error={errors.designation_id}>
                            <Select value={data.designation_id} onChange={e => setData("designation_id", e.target.value)}>
                                <option value="">Select designation…</option>
                                {designations?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Employment Type" error={errors.employment_type}>
                            <Select value={data.employment_type} onChange={e => setData("employment_type", e.target.value)}>
                                <option value="permanent">Permanent</option>
                                <option value="contract">Contract</option>
                                <option value="part_time">Part Time</option>
                                <option value="intern">Intern</option>
                            </Select>
                        </Field>
                        <Field label="Joining Date *" error={errors.joining_date}>
                            <Input type="date" value={data.joining_date} onChange={e => setData("joining_date", e.target.value)} required />
                        </Field>
                        <Field label="Basic Salary (৳) *" error={errors.basic_salary}>
                            <Input type="number" step="0.01" value={data.basic_salary} onChange={e => setData("basic_salary", e.target.value)} required />
                        </Field>
                        <Field label="Salary Type *" error={errors.salary_type}>
                            <Select value={data.salary_type} onChange={e => setData("salary_type", e.target.value)}>
                                <option value="monthly">Monthly</option>
                                <option value="weekly">Weekly</option>
                                <option value="daily">Daily</option>
                                <option value="hourly">Hourly</option>
                            </Select>
                        </Field>
                        <Field label="Payment Method *" error={errors.payment_method}>
                            <Select value={data.payment_method} onChange={e => setData("payment_method", e.target.value)}>
                                <option value="cash">Cash</option>
                                <option value="bank">Bank Transfer</option>
                                <option value="bkash">bKash</option>
                                <option value="nagad">Nagad</option>
                            </Select>
                        </Field>
                        <Field label="Status" error={errors.status}>
                            <Select value={data.status} onChange={e => setData("status", e.target.value)}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="terminated">Terminated</option>
                            </Select>
                        </Field>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Bank Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Bank Name">
                            <Input value={data.bank_name} onChange={e => setData("bank_name", e.target.value)} />
                        </Field>
                        <Field label="Account Name">
                            <Input value={data.bank_account_name} onChange={e => setData("bank_account_name", e.target.value)} />
                        </Field>
                        <Field label="Account Number">
                            <Input value={data.bank_account_number} onChange={e => setData("bank_account_number", e.target.value)} />
                        </Field>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pb-8">
                    <Link href={route("hr.employees.index")} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</Link>
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium">
                        <Save size={16} /> {isEdit ? "Update Employee" : "Create Employee"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

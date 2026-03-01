import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft } from "lucide-react";

const Field = ({ label, error, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
        </label>
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);
const Input = ({ error, ...props }) => (
    <input
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-400" : "border-slate-200"}`}
    />
);
const Select = ({ error, children, ...props }) => (
    <select
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-400" : "border-slate-200"}`}
    >
        {children}
    </select>
);

export default function PayrollCreatePeriod({ employees }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        start_date: "",
        end_date: "",
        payment_date: "",
        notes: "",
        include_all: true,
        employee_ids: [],
    });

    const toggleEmployee = (id) => {
        const ids = data.employee_ids.includes(id)
            ? data.employee_ids.filter((e) => e !== id)
            : [...data.employee_ids, id];
        setData("employee_ids", ids);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("hr.payroll.store"));
    };

    return (
        <AppLayout title="Create Payroll Period">
            <Head title="Create Payroll Period" />
            <PageHeader
                title="Create Payroll Period"
                subtitle="Generate a new payroll run for a period"
                actions={
                    <Link
                        href={route("hr.payroll.index")}
                        className="flex items-center gap-2 text-slate-600 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> Back
                    </Link>
                }
            />
            <form onSubmit={submit} className="max-w-3xl space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        Period Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Period Name *" error={errors.name}>
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="e.g. July 2025"
                                required
                            />
                        </Field>
                        <Field label="Payment Date" error={errors.payment_date}>
                            <Input
                                type="date"
                                value={data.payment_date}
                                onChange={(e) =>
                                    setData("payment_date", e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Period Start *" error={errors.start_date}>
                            <Input
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData("start_date", e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field label="Period End *" error={errors.end_date}>
                            <Input
                                type="date"
                                value={data.end_date}
                                onChange={(e) =>
                                    setData("end_date", e.target.value)
                                }
                                required
                            />
                        </Field>
                    </div>
                    <Field label="Notes">
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            rows={2}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Field>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        Employees
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.include_all}
                            onChange={(e) =>
                                setData("include_all", e.target.checked)
                            }
                            className="w-4 h-4 rounded border-slate-300 text-blue-600"
                        />
                        <span className="text-sm text-slate-700 font-medium">
                            Include all active employees
                        </span>
                    </label>
                    {!data.include_all && (
                        <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-64 overflow-y-auto">
                            {employees?.map((emp) => (
                                <label
                                    key={emp.id}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.employee_ids.includes(
                                            emp.id,
                                        )}
                                        onChange={() => toggleEmployee(emp.id)}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600"
                                    />
                                    <span className="text-sm text-slate-700">
                                        {emp.name}
                                    </span>
                                    <span className="text-xs text-slate-400 ml-auto">
                                        ৳
                                        {Number(
                                            emp.basic_salary,
                                        ).toLocaleString()}
                                        /mo
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                    <p className="text-xs text-slate-400">
                        Payroll will be calculated based on each employee's
                        basic salary and allowances. You can adjust individual
                        amounts after generation.
                    </p>
                </div>

                <div className="flex justify-end gap-3 pb-8">
                    <Link
                        href={route("hr.payroll.index")}
                        className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium"
                    >
                        <Save size={16} /> Generate Payroll
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

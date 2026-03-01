import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Edit, TrendingUp, TrendingDown } from "lucide-react";

export default function Show({ bankAccount }) {
    return (
        <AppLayout>
            <Head title={`Bank: ${bankAccount.account_name}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={bankAccount.account_name}
                    subtitle={bankAccount.bank_name ?? "Bank Account"}
                    actions={
                        <div className="flex gap-2">
                            <Link href={route("finance.bank-accounts.index")} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </Link>
                            <Link href={route("finance.bank-accounts.edit", bankAccount.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                                <Edit className="w-4 h-4" /> Edit
                            </Link>
                        </div>
                    }
                />

                {/* Balance Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 text-indigo-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">Current Balance</p>
                        <p className="text-2xl font-bold mt-1">৳{Number(bankAccount.current_balance ?? 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 text-blue-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">Opening Balance</p>
                        <p className="text-2xl font-bold mt-1">৳{Number(bankAccount.opening_balance ?? 0).toLocaleString()}</p>
                    </div>
                </div>

                {/* Account Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <dt className="text-xs text-gray-500">Account Number</dt>
                            <dd className="font-medium">{bankAccount.account_number ?? "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Bank Name</dt>
                            <dd className="font-medium">{bankAccount.bank_name ?? "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Branch</dt>
                            <dd className="font-medium">{bankAccount.branch_name ?? "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Currency</dt>
                            <dd className="font-medium">{bankAccount.currency ?? "BDT"}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500 mb-1">Status</dt>
                            <dd><Badge color={bankAccount.is_active ? "green" : "red"}>{bankAccount.is_active ? "Active" : "Inactive"}</Badge></dd>
                        </div>
                    </dl>
                </div>

                {/* Transactions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">Recent Transactions</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {["Date", "Type", "Description", "Amount", "Balance"].map((h) => (
                                        <th key={h} className={`px-4 py-3 ${h === "Amount" || h === "Balance" ? "text-right" : "text-left"}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bankAccount.transactions?.length ? bankAccount.transactions.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">{txn.transaction_date}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${txn.type === "credit" ? "text-green-700" : "text-red-700"}`}>
                                                {txn.type === "credit" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                {txn.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{txn.description ?? txn.reference ?? "—"}</td>
                                        <td className={`px-4 py-3 text-right font-medium ${txn.type === "credit" ? "text-green-700" : "text-red-700"}`}>
                                            {txn.type === "credit" ? "+" : "-"}৳{Number(txn.amount).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">৳{Number(txn.balance ?? 0).toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No transactions found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

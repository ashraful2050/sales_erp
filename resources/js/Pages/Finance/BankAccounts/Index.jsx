import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { Plus, Eye, Pencil, Trash2, Building, CreditCard } from "lucide-react";
import ExportButtons from "@/Components/ExportButtons";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

export default function BankAccountsIndex({ bankAccounts }) {
    const { t } = useTranslation();
    const { confirm: dlgConfirm } = useDialog();
    const del = async (id) => {
        if (
            await dlgConfirm(t("This bank account will be permanently removed."), {
                title: t("Delete Bank Account?"),
                confirmLabel: t("Delete"),
                intent: "danger",
            })
        )
            router.delete(route("finance.bank-accounts.destroy", id));
    };

    return (
        <AppLayout title={t("Bank Accounts")}>
            <Head title={t("Bank Accounts")} />
            <PageHeader
                title={t("Bank Accounts")}
                subtitle={`${bankAccounts.length} ${t("bank accounts")}`}
                actions={
                    <div className="flex items-center gap-2">
                        <ExportButtons
                            tableId="export-table"
                            filename="bank-accounts"
                            title="Bank Accounts"
                        />
                        <Link
                            href={route("finance.bank-accounts.create")}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            <Plus size={16} /> {t("Add Bank Account")}
                        </Link>
                    </div>
                }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {bankAccounts.length === 0 && (
                    <div className="col-span-3 bg-white rounded-xl border border-slate-200 py-12 text-center text-slate-400">
                        {t("No bank accounts configured.")}
                    </div>
                )}
                {bankAccounts.map((ba) => (
                    <div
                        key={ba.id}
                        className="bg-white rounded-xl border border-slate-200 p-5"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <Building
                                        size={20}
                                        className="text-blue-600"
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-800">
                                        {ba.account_name}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {ba.bank_name}
                                    </div>
                                </div>
                            </div>
                            <Badge color={ba.is_active ? "green" : "red"}>
                                {ba.is_active ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Account No.
                                </span>
                                <span className="font-mono text-slate-700">
                                    {ba.account_number}
                                </span>
                            </div>
                            {ba.branch_name && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        {t("Branch")}
                                    </span>
                                    <span className="text-slate-700">
                                        {ba.branch_name}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-slate-500">{t("Type")}</span>
                                <Badge color="indigo">{ba.account_type}</Badge>
                            </div>
                            <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
                                <span className="text-slate-500 font-medium">
                                    {t("Opening Balance")}
                                </span>
                                <span className="font-mono font-semibold text-slate-800">
                                    ৳
                                    {Number(
                                        ba.opening_balance ?? 0,
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4 pt-3 border-t border-slate-100">
                            <Link
                                href={route(
                                    "finance.bank-accounts.show",
                                    ba.id,
                                )}
                                className="flex-1 text-center py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                            >
                                View
                            </Link>
                            <Link
                                href={route(
                                    "finance.bank-accounts.edit",
                                    ba.id,
                                )}
                                className="flex-1 text-center py-1.5 text-sm text-amber-600 hover:bg-amber-50 rounded-lg font-medium"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => del(ba.id)}
                                className="flex-1 text-center py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium"
                            >
                                {t("Delete")}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}

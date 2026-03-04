import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Edit } from "lucide-react";
import { fmtDate } from "@/utils/date";
import { useTranslation } from "@/hooks/useTranslation";

export default function Show({ asset }) {
    const { t } = useTranslation();
    const totalDepreciation =
        asset.depreciations?.reduce(
            (s, d) => s + Number(d.depreciation_amount ?? 0),
            0,
        ) ?? 0;
    const bookValue = Number(asset.purchase_cost ?? 0) - totalDepreciation;

    return (
        <AppLayout>
            <Head title={`Asset: ${asset.name}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={asset.name}
                    subtitle={`Code: ${asset.asset_code ?? "—"}`}
                    actions={
                        <div className="flex gap-2">
                            <Link
                                href={route("assets.fixed-assets.index")}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> {t("Back")}
                            </Link>
                            <Link
                                href={route(
                                    "assets.fixed-assets.edit",
                                    asset.id,
                                )}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                            >
                                <Edit className="w-4 h-4" /> {t("Edit")}
                            </Link>
                        </div>
                    }
                />

                {/* Value Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 text-blue-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                            {t("Purchase Cost")}
                        </p>
                        <p className="text-2xl font-bold mt-1">
                            ৳{Number(asset.purchase_cost ?? 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-red-50 text-red-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                            {t("Accumulated Depreciation")}
                        </p>
                        <p className="text-2xl font-bold mt-1">
                            ৳{totalDepreciation.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-green-50 text-green-700 rounded-xl p-4">
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                            {t("Book Value")}
                        </p>
                        <p className="text-2xl font-bold mt-1">
                            ৳{bookValue.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Asset Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        Asset Information
                    </h3>
                    <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <dt className="text-xs text-gray-500">Category</dt>
                            <dd className="font-medium">
                                {asset.category?.name ?? "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">
                                Purchase Date
                            </dt>
                            <dd className="font-medium">
                                {fmtDate(asset.purchase_date)}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">
                                Useful Life
                            </dt>
                            <dd className="font-medium">
                                {asset.useful_life_years
                                    ? `${asset.useful_life_years} years`
                                    : "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">
                                Depreciation Method
                            </dt>
                            <dd className="font-medium capitalize">
                                {asset.depreciation_method ?? "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">
                                Salvage Value
                            </dt>
                            <dd className="font-medium">
                                ৳
                                {Number(
                                    asset.salvage_value ?? 0,
                                ).toLocaleString()}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500 mb-1">
                                Status
                            </dt>
                            <dd>
                                <Badge
                                    color={
                                        asset.status === "active"
                                            ? "green"
                                            : asset.status === "disposed"
                                              ? "red"
                                              : "yellow"
                                    }
                                >
                                    {asset.status}
                                </Badge>
                            </dd>
                        </div>
                        {asset.location && (
                            <div>
                                <dt className="text-xs text-gray-500">
                                    Location
                                </dt>
                                <dd className="font-medium">
                                    {asset.location}
                                </dd>
                            </div>
                        )}
                        {asset.serial_number && (
                            <div>
                                <dt className="text-xs text-gray-500">
                                    Serial Number
                                </dt>
                                <dd className="font-medium">
                                    {asset.serial_number}
                                </dd>
                            </div>
                        )}
                    </dl>
                    {asset.description && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <dt className="text-xs text-gray-500 mb-1">
                                Description
                            </dt>
                            <dd className="text-sm text-gray-700">
                                {asset.description}
                            </dd>
                        </div>
                    )}
                </div>

                {/* Depreciation Schedule */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Depreciation Schedule
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    {[
                                        "Date",
                                        "Amount",
                                        "Book Value Before",
                                        "Book Value After",
                                        "Notes",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {asset.depreciations?.length ? (
                                    asset.depreciations.map((dep, i) => {
                                        const cumulative = asset.depreciations
                                            .slice(i)
                                            .reduce(
                                                (s, d) =>
                                                    s +
                                                    Number(
                                                        d.depreciation_amount ??
                                                            0,
                                                    ),
                                                0,
                                            );
                                        return (
                                            <tr
                                                key={dep.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-3">
                                                    {fmtDate(
                                                        dep.depreciation_date,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    ৳
                                                    {Number(
                                                        dep.depreciation_amount,
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    ৳
                                                    {(
                                                        bookValue + cumulative
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    ৳
                                                    {(
                                                        bookValue +
                                                        cumulative -
                                                        Number(
                                                            dep.depreciation_amount,
                                                        )
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {dep.notes ?? "—"}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-gray-400"
                                        >
                                            No depreciation records
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Badge from "@/Components/Badge";
import { ArrowLeft, Truck } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";

const statusColors = { draft: "gray", dispatched: "blue", delivered: "green" };

export default function DeliveryNoteShow({ note }) {
    const { confirm: dlgConfirm } = useDialog();
    const markDelivered = async () => {
        if (
            await dlgConfirm(
                "This will mark the delivery as delivered and cannot be undone.",
                {
                    title: "Mark as Delivered?",
                    confirmLabel: "Mark Delivered",
                    intent: "success",
                },
            )
        ) {
            router.put(route("sales.delivery-notes.update", note.id), {
                status: "delivered",
            });
        }
    };

    return (
        <AppLayout title={`Delivery Note — ${note.note_number}`}>
            <Head title={`Delivery Note ${note.note_number}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={`Delivery Note — ${note.note_number}`}
                    subtitle={`Customer: ${note.customer?.name ?? "—"}`}
                    actions={
                        <div className="flex gap-2">
                            <Link
                                href={route("sales.delivery-notes.index")}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </Link>
                            {note.status === "dispatched" && (
                                <button
                                    onClick={markDelivered}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                >
                                    <Truck className="w-4 h-4" /> Mark Delivered
                                </button>
                            )}
                        </div>
                    }
                />

                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                Note Number
                            </p>
                            <p className="font-semibold font-mono">
                                {note.note_number}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                Dispatch Date
                            </p>
                            <p className="font-medium">{note.dispatch_date}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                Customer
                            </p>
                            <p className="font-medium">
                                {note.customer?.name ?? "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                Invoice
                            </p>
                            <p className="font-medium">
                                {note.invoice?.invoice_number ?? "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <Badge color={statusColors[note.status] ?? "gray"}>
                                {note.status}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                Vehicle
                            </p>
                            <p className="font-medium">
                                {note.vehicle_no ?? "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Driver</p>
                            <p className="font-medium">
                                {note.driver_name ?? "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                Created By
                            </p>
                            <p className="font-medium">
                                {note.creator?.name ?? "—"}
                            </p>
                        </div>
                    </div>
                    {note.delivery_address && (
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-gray-500 mb-1">
                                Delivery Address
                            </p>
                            <p className="text-sm whitespace-pre-line">
                                {note.delivery_address}
                            </p>
                        </div>
                    )}
                    {note.notes && (
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-gray-500 mb-1">Notes</p>
                            <p className="text-sm">{note.notes}</p>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-sm font-semibold">
                            Items Delivered
                        </h3>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                {["#", "Product", "Quantity", "Notes"].map(
                                    (h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left"
                                        >
                                            {h}
                                        </th>
                                    ),
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {note.items?.map((item, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-400">
                                        {i + 1}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {item.product?.name ?? "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {Number(item.quantity).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {item.notes ?? "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

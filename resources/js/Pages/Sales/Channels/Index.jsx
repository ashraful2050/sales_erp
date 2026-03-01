import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import { Plus, RefreshCw, Trash2, Globe } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";

const typeColors = {
    ecommerce: "blue",
    retail: "green",
    b2b: "purple",
    mobile: "orange",
    social_facebook: "indigo",
    social_instagram: "pink",
    social_linkedin: "sky",
};

export default function ChannelsIndex({ channels }) {
    const { confirm } = useDialog();
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        type: "ecommerce",
        platform: "",
        api_key: "",
        api_secret: "",
        webhook_url: "",
        auto_sync: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("sales.channels.store"), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };
    const del = async (id) => {
        if (
            await confirm("Remove this sales channel?", {
                title: "Remove Channel?",
                confirmLabel: "Remove",
                intent: "danger",
            })
        )
            router.delete(route("sales.channels.destroy", id));
    };

    return (
        <AppLayout title="Sales Channels">
            <Head title="Sales Channels" />
            <PageHeader
                title="Sales Channels"
                subtitle="Omnichannel sales integration"
                actions={
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        <Plus size={15} /> Add Channel
                    </button>
                }
            />

            {showForm && (
                <form
                    onSubmit={submit}
                    className="bg-white rounded-xl border border-slate-200 p-5 mb-6 max-w-2xl"
                >
                    <h3 className="font-semibold text-slate-700 mb-3">
                        New Sales Channel
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-600">
                                Channel Name *
                            </label>
                            <input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-600">
                                Type
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            >
                                {[
                                    "ecommerce",
                                    "retail",
                                    "b2b",
                                    "mobile",
                                    "social_facebook",
                                    "social_instagram",
                                    "social_linkedin",
                                ].map((t) => (
                                    <option key={t} value={t}>
                                        {t
                                            .replace("_", " ")
                                            .charAt(0)
                                            .toUpperCase() +
                                            t.replace("_", " ").slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-600">
                                Platform
                            </label>
                            <input
                                placeholder="e.g. Shopify, WooCommerce"
                                value={data.platform}
                                onChange={(e) =>
                                    setData("platform", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-600">
                                Webhook URL
                            </label>
                            <input
                                type="url"
                                value={data.webhook_url}
                                onChange={(e) =>
                                    setData("webhook_url", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-600">
                                API Key
                            </label>
                            <input
                                type="password"
                                value={data.api_key}
                                onChange={(e) =>
                                    setData("api_key", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-600">
                                API Secret
                            </label>
                            <input
                                type="password"
                                value={data.api_secret}
                                onChange={(e) =>
                                    setData("api_secret", e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <input
                            type="checkbox"
                            checked={data.auto_sync}
                            onChange={(e) =>
                                setData("auto_sync", e.target.checked)
                            }
                            className="rounded"
                        />
                        <span className="text-sm text-slate-700">
                            Enable Auto Sync
                        </span>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Add Channel
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="text-slate-500 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {channels.data?.length === 0 ? (
                    <div className="col-span-3 bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
                        <Globe
                            size={32}
                            className="mx-auto mb-2 text-slate-300"
                        />
                        No channels added yet.
                    </div>
                ) : (
                    channels.data?.map((ch) => (
                        <div
                            key={ch.id}
                            className="bg-white rounded-xl border border-slate-200 p-4"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="font-semibold text-slate-800">
                                        {ch.name}
                                    </h4>
                                    <p className="text-xs text-slate-400">
                                        {ch.platform || ch.type}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <Badge
                                        color={typeColors[ch.type] || "slate"}
                                        label={ch.type.replace("_", " ")}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                                <span>
                                    Status:{" "}
                                    <span
                                        className={
                                            ch.is_active
                                                ? "text-green-600"
                                                : "text-slate-400"
                                        }
                                    >
                                        {ch.is_active ? "Active" : "Inactive"}
                                    </span>
                                </span>
                                <span>
                                    Sync:{" "}
                                    <span
                                        className={
                                            ch.sync_status === "idle"
                                                ? "text-slate-400"
                                                : "text-blue-600"
                                        }
                                    >
                                        {ch.sync_status}
                                    </span>
                                </span>
                            </div>
                            {ch.last_sync_at && (
                                <p className="text-xs text-slate-400 mb-3">
                                    Last sync:{" "}
                                    {new Date(ch.last_sync_at).toLocaleString()}
                                </p>
                            )}
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        router.post(
                                            route("sales.channels.sync", ch.id),
                                        )
                                    }
                                    className="flex-1 flex items-center justify-center gap-1 border border-slate-200 hover:bg-slate-50 text-slate-600 py-1.5 rounded text-xs"
                                >
                                    <RefreshCw size={12} /> Sync
                                </button>
                                <button
                                    onClick={() => del(ch.id)}
                                    className="p-1.5 text-slate-300 hover:text-red-500 border border-slate-200 rounded"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AppLayout>
    );
}

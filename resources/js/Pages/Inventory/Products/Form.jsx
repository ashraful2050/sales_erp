import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader";
import { Save, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

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

export default function ProductForm({
    product,
    categories,
    warehouses,
    taxRates,
    units,
}) {
    const { t } = useTranslation();
    const isEdit = !!product;
    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name ?? "",
        name_bn: product?.name_bn ?? "",
        code: product?.code ?? "",
        barcode: product?.barcode ?? "",
        type: product?.type ?? "product",
        category_id: product?.category_id ?? "",
        unit_id: product?.unit_id ?? "",
        cost_price: product?.cost_price ?? "",
        sale_price: product?.sale_price ?? "",
        tax_rate_id: product?.tax_rate_id ?? "",
        reorder_level: product?.reorder_level ?? "",
        opening_stock: product?.opening_stock ?? "0",
        warehouse_id: product?.warehouse_id ?? "",
        description: product?.description ?? "",
        is_active: product?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit
            ? put(route("inventory.products.update", product.id))
            : post(route("inventory.products.store"));
    };

    return (
        <AppLayout title={isEdit ? "Edit Product" : "New Product"}>
            <Head title={isEdit ? "Edit Product" : "New Product"} />
            <PageHeader
                title={isEdit ? "Edit Product" : "New Product"}
                subtitle={
                    isEdit
                        ? `Editing: ${product.name}`
                        : "Add a new product or service"
                }
                actions={
                    <Link
                        href={route("inventory.products.index")}
                        className="flex items-center gap-2 text-slate-600 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> {t("Back")}
                    </Link>
                }
            />
            <form onSubmit={submit} className="max-w-4xl space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        Product Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Product Name *" error={errors.name}>
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field
                            label="Product Name (Bangla)"
                            error={errors.name_bn}
                        >
                            <Input
                                value={data.name_bn}
                                onChange={(e) =>
                                    setData("name_bn", e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Type *" error={errors.type}>
                            <Select
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                required
                            >
                                <option value="product">{t("Product")}</option>
                                <option value="service">{t("Service")}</option>
                                <option value="combo">{t("Combo")}</option>
                            </Select>
                        </Field>
                        <Field label="Category" error={errors.category_id}>
                            <Select
                                value={data.category_id}
                                onChange={(e) =>
                                    setData("category_id", e.target.value)
                                }
                            >
                                <option value="">Select category…</option>
                                {categories?.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                        <Field label="Code / SKU" error={errors.code}>
                            <Input
                                value={data.code}
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                                placeholder={t("Auto-generate if blank")}
                            />
                        </Field>
                        <Field label="Barcode" error={errors.barcode}>
                            <Input
                                value={data.barcode}
                                onChange={(e) =>
                                    setData("barcode", e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Unit of Measure" error={errors.unit_id}>
                            <Select
                                value={data.unit_id}
                                onChange={(e) =>
                                    setData("unit_id", e.target.value)
                                }
                            >
                                <option value="">— Select unit —</option>
                                {units?.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.abbreviation})
                                    </option>
                                ))}
                            </Select>
                        </Field>
                    </div>
                    <Field label="Description">
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows={2}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Field>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        Pricing &amp; Tax
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Cost Price (৳)" error={errors.cost_price}>
                            <Input
                                type="number"
                                step="0.01"
                                value={data.cost_price}
                                onChange={(e) =>
                                    setData("cost_price", e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label="Sale Price (৳) *"
                            error={errors.sale_price}
                        >
                            <Input
                                type="number"
                                step="0.01"
                                value={data.sale_price}
                                onChange={(e) =>
                                    setData("sale_price", e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field label="Tax Rate" error={errors.tax_rate_id}>
                            <Select
                                value={data.tax_rate_id}
                                onChange={(e) =>
                                    setData("tax_rate_id", e.target.value)
                                }
                            >
                                <option value="">{t("No Tax")}</option>
                                {taxRates?.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} ({t.rate}%)
                                    </option>
                                ))}
                            </Select>
                        </Field>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        Inventory
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field
                            label="Reorder Level"
                            error={errors.reorder_level}
                        >
                            <Input
                                type="number"
                                value={data.reorder_level}
                                onChange={(e) =>
                                    setData("reorder_level", e.target.value)
                                }
                            />
                        </Field>
                        {!isEdit && (
                            <>
                                <Field
                                    label="Opening Stock"
                                    error={errors.opening_stock}
                                >
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={data.opening_stock}
                                        onChange={(e) =>
                                            setData(
                                                "opening_stock",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>
                                <Field
                                    label="Warehouse"
                                    error={errors.warehouse_id}
                                >
                                    <Select
                                        value={data.warehouse_id}
                                        onChange={(e) =>
                                            setData(
                                                "warehouse_id",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select warehouse…
                                        </option>
                                        {warehouses?.map((w) => (
                                            <option key={w.id} value={w.id}>
                                                {w.name}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>
                            </>
                        )}
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData("is_active", e.target.checked)
                            }
                            className="w-4 h-4 rounded border-slate-300 text-blue-600"
                        />
                        <span className="text-sm text-slate-700">
                            {t("Active product")}
                        </span>
                    </label>
                </div>

                <div className="flex justify-end gap-3 pb-8">
                    <Link
                        href={route("inventory.products.index")}
                        className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium"
                    >
                        <Save size={16} />{" "}
                        {isEdit ? "Update Product" : "Create Product"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

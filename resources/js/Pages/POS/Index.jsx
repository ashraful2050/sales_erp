import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { useState, useMemo } from "react";
import {
    Search,
    Plus,
    Minus,
    Trash2,
    ShoppingCart,
    CheckCircle,
    User,
    CreditCard,
    AlertCircle,
} from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "@/hooks/useTranslation";

export default function PosIndex({ products, customers, errors = {} }) {
    const { t } = useTranslation();
    const { alert: dlgAlert } = useDialog();
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);
    const [customerId, setCustomerId] = useState("");
    const [discountAmt, setDiscountAmt] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [paidAmount, setPaidAmount] = useState("");
    const [success, setSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);

    const filtered = useMemo(
        () =>
            products.filter(
                (p) =>
                    p.name.toLowerCase().includes(search.toLowerCase()) ||
                    (p.code ?? "").toLowerCase().includes(search.toLowerCase()),
            ),
        [products, search],
    );

    const addToCart = (product) => {
        setCart((prev) => {
            const idx = prev.findIndex((i) => i.product_id === product.id);
            if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = {
                    ...updated[idx],
                    quantity: updated[idx].quantity + 1,
                    subtotal:
                        (updated[idx].quantity + 1) * updated[idx].unit_price,
                };
                return updated;
            }
            return [
                ...prev,
                {
                    product_id: product.id,
                    name: product.name,
                    unit_price: Number(product.sale_price),
                    quantity: 1,
                    subtotal: Number(product.sale_price),
                },
            ];
        });
    };

    const updateQty = (idx, delta) => {
        setCart((prev) => {
            const updated = [...prev];
            const newQty = Math.max(1, updated[idx].quantity + delta);
            updated[idx] = {
                ...updated[idx],
                quantity: newQty,
                subtotal: newQty * updated[idx].unit_price,
            };
            return updated;
        });
    };

    const removeItem = (idx) =>
        setCart((prev) => prev.filter((_, i) => i !== idx));

    const subtotal = cart.reduce((s, i) => s + i.subtotal, 0);
    const total = Math.max(0, subtotal - Number(discountAmt));
    const change = Math.max(0, Number(paidAmount) - total);

    const handlePay = async (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            await dlgAlert("Please add items to the cart before proceeding.", {
                title: t("Empty Cart"),
                intent: "warning",
            });
            return;
        }
        setProcessing(true);
        router.post(
            route("pos.sale"),
            {
                customer_id: customerId || null,
                items: cart,
                discount_amount: Number(discountAmt) || 0,
                paid_amount: Number(paidAmount),
                payment_method: paymentMethod,
            },
            {
                onSuccess: () => {
                    setCart([]);
                    setCustomerId("");
                    setDiscountAmt(0);
                    setPaidAmount("");
                    setSearch("");
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 3000);
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <AppLayout title={t("Point of Sale")}>
            <Head title={t("POS — Point of Sale")} />

            {success && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
                    <CheckCircle size={18} /> Sale completed successfully!
                </div>
            )}

            <div className="flex gap-4 h-[calc(100vh-8rem)]">
                {/* LEFT — Product Grid */}
                <div className="flex-1 flex flex-col gap-3 min-w-0">
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3">
                        <Search size={18} className="text-slate-400 shrink-0" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t("Search products by name or code…")}
                            className="flex-1 text-sm outline-none text-slate-700"
                            autoFocus
                        />
                    </div>
                    {/* Product grid */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {filtered.map((p) => {
                                const stockQty = p.stocks?.length
                                    ? p.stocks.reduce(
                                          (s, st) =>
                                              s + Number(st.quantity ?? 0),
                                          0,
                                      )
                                    : null;
                                const outOfStock =
                                    stockQty !== null && Number(stockQty) <= 0;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() =>
                                            !outOfStock && addToCart(p)
                                        }
                                        disabled={outOfStock}
                                        className={`bg-white border rounded-xl p-3 text-left transition-all hover:shadow-md hover:border-blue-300
                                            ${outOfStock ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-blue-50"}`}
                                    >
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                                            <ShoppingCart
                                                size={18}
                                                className="text-blue-600"
                                            />
                                        </div>
                                        <p className="text-xs font-semibold text-slate-700 leading-tight line-clamp-2">
                                            {p.name}
                                        </p>
                                        {p.code && (
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {p.code}
                                            </p>
                                        )}
                                        <p className="text-sm font-bold text-blue-600 mt-1">
                                            ৳
                                            {Number(
                                                p.sale_price,
                                            ).toLocaleString()}
                                        </p>
                                        {stockQty !== null && (
                                            <p
                                                className={`text-xs mt-0.5 ${outOfStock ? "text-red-500" : "text-green-600"}`}
                                            >
                                                {outOfStock
                                                    ? "Out of Stock"
                                                    : `Stock: ${Number(stockQty).toLocaleString()}`}
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                            {filtered.length === 0 && (
                                <div className="col-span-4 text-center py-16 text-slate-400">
                                    {t("No products found.")}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT — Cart & Checkout */}
                <div className="w-80 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0">
                    {/* Cart header */}
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <span className="font-semibold text-slate-700 text-sm">
                            {t("Cart")}
                        </span>
                        <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {cart.length}
                        </span>
                    </div>

                    {/* Cart items */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                        {cart.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm py-12">
                                <ShoppingCart
                                    size={32}
                                    className="mb-2 opacity-40"
                                /> {t("Cart is empty")}
                            </div>
                        )}
                        {cart.map((item, i) => (
                            <div key={i} className="px-4 py-3">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-xs font-medium text-slate-700 leading-tight flex-1 mr-2">
                                        {item.name}
                                    </p>
                                    <button
                                        onClick={() => removeItem(i)}
                                        className="text-slate-300 hover:text-red-500 shrink-0"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => updateQty(i, -1)}
                                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                                        >
                                            <Minus size={11} />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQty(i, 1)}
                                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                                        >
                                            <Plus size={11} />
                                        </button>
                                    </div>
                                    <span className="text-sm font-semibold text-blue-700">
                                        ৳{item.subtotal.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    ৳{item.unit_price.toLocaleString()} each
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Checkout panel */}
                    <form
                        onSubmit={handlePay}
                        className="border-t border-slate-200 p-4 space-y-3 bg-slate-50"
                    >
                        {/* Customer */}
                        <div className="flex items-center gap-2">
                            <User
                                size={14}
                                className="text-slate-400 shrink-0"
                            />
                            <select
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
                            >
                                <option value="">Walk-in Customer</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                        {c.phone ? ` — ${c.phone}` : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Totals */}
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>{t("Subtotal")}</span>
                                <span className="font-mono">
                                    ৳{subtotal.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600">
                                <span>{t("Discount")}</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-slate-400 text-xs">
                                        ৳
                                    </span>
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        value={discountAmt}
                                        onChange={(e) =>
                                            setDiscountAmt(e.target.value)
                                        }
                                        className="w-20 text-right border border-slate-200 rounded px-2 py-0.5 text-xs font-mono"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between font-bold text-base border-t pt-1 mt-1">
                                <span>{t("Total")}</span>
                                <span className="font-mono text-blue-700">
                                    ৳{total.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Payment method */}
                        <div className="flex items-center gap-2">
                            <CreditCard
                                size={14}
                                className="text-slate-400 shrink-0"
                            />
                            <select
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                                className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
                            >
                                <option value="cash">{t("Cash")}</option>
                                <option value="bank">{t("Bank Transfer")}</option>
                                <option value="bkash">bKash</option>
                                <option value="nagad">{t("Nagad")}</option>
                                <option value="rocket">{t("Rocket")}</option>
                                <option value="upay">{t("Upay")}</option>
                                <option value="cheque">{t("Cheque")}</option>
                            </select>
                        </div>

                        {/* Paid amount */}
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">
                                Amount Received (৳)
                            </label>
                            <input
                                type="number"
                                step="any"
                                min="0"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                                className={`w-full border rounded-lg px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.paid_amount
                                        ? "border-red-400 bg-red-50"
                                        : "border-slate-200"
                                }`}
                            />
                            {errors.paid_amount && (
                                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle size={11} />{" "}
                                    {errors.paid_amount}
                                </p>
                            )}
                        </div>

                        {Number(paidAmount) > 0 && (
                            <div
                                className={`flex justify-between text-sm font-semibold rounded-lg px-3 py-2 ${change > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
                            >
                                <span>{change > 0 ? "Change" : "Due"}</span>
                                <span className="font-mono">
                                    ৳{Math.abs(change).toLocaleString()}
                                </span>
                            </div>
                        )}

                        {errors.items && (
                            <p className="text-xs text-red-600 flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                <AlertCircle size={11} /> {errors.items}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={processing || cart.length === 0}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={18} />{" "}
                            {processing ? "Processing…" : "Complete Sale"}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

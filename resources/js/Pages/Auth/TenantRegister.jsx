import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    Check,
    Shield,
    Building2,
    Mail,
    Phone,
    Globe,
    User,
    Lock,
    ChevronRight,
    ArrowLeft,
    Sparkles,
    Zap,
    Star,
} from "lucide-react";

const FEATURES_LABELS = {
    accounting: "Accounting & GL",
    sales: "Sales & Invoicing",
    purchase: "Purchase Orders",
    inventory: "Inventory Management",
    hr: "HR & Payroll",
    assets: "Fixed Assets",
    pos: "Point of Sale",
    reports: "Advanced Reports",
    multi_warehouse: "Multi Warehouse",
    api_access: "API Access",
};

const PLAN_ACCENTS = [
    {
        from: "from-violet-500",
        to: "to-purple-600",
        ring: "ring-violet-500/40",
        text: "text-violet-400",
        bg: "bg-violet-500/10",
        badge: "bg-violet-500",
    },
    {
        from: "from-blue-500",
        to: "to-cyan-500",
        ring: "ring-blue-500/40",
        text: "text-blue-400",
        bg: "bg-blue-500/10",
        badge: "bg-blue-500",
    },
    {
        from: "from-emerald-500",
        to: "to-teal-500",
        ring: "ring-emerald-500/40",
        text: "text-emerald-400",
        bg: "bg-emerald-500/10",
        badge: "bg-emerald-500",
    },
    {
        from: "from-orange-500",
        to: "to-pink-500",
        ring: "ring-orange-500/40",
        text: "text-orange-400",
        bg: "bg-orange-500/10",
        badge: "bg-orange-500",
    },
];

function InputField({ label, icon: Icon, error, ...props }) {
    return (
        <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"
                    />
                )}
                <input
                    {...props}
                    className={`w-full bg-slate-800/60 border rounded-xl text-slate-200 text-sm outline-none transition-all placeholder-slate-600
                        focus:border-violet-500 focus:bg-slate-800 focus:ring-2 focus:ring-violet-500/20
                        ${Icon ? "pl-9 pr-3 py-2.5" : "px-3 py-2.5"}
                        ${error ? "border-red-500/60" : "border-slate-700"}`}
                />
            </div>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default function TenantRegister({ plans, selectedPlan, affiliateCode }) {
    const [step, setStep] = useState(1);
    const [chosenPlan, setChosenPlan] = useState(
        selectedPlan ?? plans[0] ?? null,
    );

    const { data, setData, post, processing, errors } = useForm({
        company_name: "",
        company_email: "",
        company_phone: "",
        company_country: "Bangladesh",
        admin_name: "",
        admin_email: "",
        password: "",
        password_confirmation: "",
        plan_id: chosenPlan?.id ?? "",
        agreed: false,
        affiliate_code: affiliateCode ?? "",
    });

    const selectPlan = (plan) => {
        setChosenPlan(plan);
        setData("plan_id", plan.id);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("tenant.register.submit"));
    };

    const savings =
        chosenPlan?.price_monthly > 0
            ? Math.round(
                  (1 -
                      chosenPlan.price_yearly /
                          (chosenPlan.price_monthly * 12)) *
                      100,
              )
            : 0;

    return (
        <>
            <Head title="Start Free Trial" />

            {/* Full-page dark background */}
            <div className="min-h-screen bg-[#0a0a14] text-white relative overflow-hidden">
                {/* Animated blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
                    <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[120px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px]" />
                    {/* Grid overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)",
                            backgroundSize: "60px 60px",
                        }}
                    />
                </div>

                <div className="relative z-10 flex flex-col min-h-screen">
                    {/* Top nav */}
                    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 group"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-700 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all">
                                <Shield size={15} className="text-white" />
                            </div>
                            <span className="font-bold text-white text-sm group-hover:text-violet-300 transition-colors">
                                SalesERP
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm hidden sm:block">
                            Already have an account?{" "}
                            <Link
                                href={route("login")}
                                className="text-violet-400 font-medium hover:text-violet-300 transition-colors"
                            >
                                Sign in{" "}
                                <ChevronRight size={13} className="inline" />
                            </Link>
                        </p>
                    </nav>

                    {/* Main content */}
                    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16 pt-4">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
                                <Sparkles size={12} />
                                No credit card required
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight">
                                {step === 1
                                    ? "Choose Your Plan"
                                    : "Create Your Account"}
                            </h1>
                            <p className="text-slate-400 mt-3 text-base max-w-lg mx-auto">
                                {step === 1
                                    ? "Pick the plan that fits your business. Start with a free trial."
                                    : `You're signing up for the ${chosenPlan?.name} plan. Fill in your details below.`}
                            </p>
                        </div>

                        {/* Step indicator */}
                        <div className="flex items-center gap-2 mb-10">
                            {["Choose Plan", "Create Account"].map((s, i) => (
                                <div
                                    key={s}
                                    className="flex items-center gap-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                                ${
                                                    step > i + 1
                                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                                        : step === i + 1
                                                          ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30 ring-4 ring-violet-500/20"
                                                          : "bg-slate-800 border border-slate-700 text-slate-500"
                                                }`}
                                        >
                                            {step > i + 1 ? (
                                                <Check size={12} />
                                            ) : (
                                                i + 1
                                            )}
                                        </div>
                                        <span
                                            className={`text-sm font-medium ${step === i + 1 ? "text-white" : "text-slate-500"}`}
                                        >
                                            {s}
                                        </span>
                                    </div>
                                    {i < 1 && (
                                        <div
                                            className={`w-12 h-px mx-2 transition-colors ${step > 1 ? "bg-emerald-500" : "bg-slate-700"}`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* â”€â”€ STEP 1: Plan Selection â”€â”€ */}
                        {step === 1 && (
                            <div className="w-full max-w-6xl">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                                    {plans.map((plan, idx) => {
                                        const accent =
                                            PLAN_ACCENTS[
                                                idx % PLAN_ACCENTS.length
                                            ];
                                        const isChosen =
                                            chosenPlan?.id === plan.id;
                                        const isPopular =
                                            plan.slug === "business";
                                        return (
                                            <button
                                                key={plan.id}
                                                type="button"
                                                onClick={() => selectPlan(plan)}
                                                className={`relative text-left rounded-2xl p-5 border transition-all duration-200 group
                                                    ${
                                                        isChosen
                                                            ? `bg-slate-800/80 border-violet-500 ring-2 ${accent.ring} shadow-2xl shadow-violet-500/10`
                                                            : "bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60 hover:shadow-xl"
                                                    }`}
                                            >
                                                {isPopular && (
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-violet-500/40">
                                                            <Star
                                                                size={9}
                                                                fill="currentColor"
                                                            />{" "}
                                                            Most Popular
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Plan icon + selected indicator */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div
                                                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accent.from} ${accent.to} flex items-center justify-center shadow-lg`}
                                                    >
                                                        <Zap
                                                            size={16}
                                                            className="text-white"
                                                        />
                                                    </div>
                                                    <div
                                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                            isChosen
                                                                ? "bg-violet-600 border-violet-600"
                                                                : "border-slate-600 group-hover:border-slate-400"
                                                        }`}
                                                    >
                                                        {isChosen && (
                                                            <Check
                                                                size={10}
                                                                className="text-white"
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                <h3 className="font-bold text-white text-base mb-0.5">
                                                    {plan.name}
                                                </h3>
                                                {plan.description && (
                                                    <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                                                        {plan.description}
                                                    </p>
                                                )}

                                                {/* Price */}
                                                <div className="mb-3">
                                                    <div className="flex items-end gap-1">
                                                        <span className="text-3xl font-extrabold text-white">
                                                            $
                                                            {plan.price_monthly}
                                                        </span>
                                                        <span className="text-slate-400 text-xs mb-1">
                                                            /mo
                                                        </span>
                                                    </div>
                                                    {plan.price_yearly > 0 && (
                                                        <p
                                                            className={`text-xs font-medium ${accent.text}`}
                                                        >
                                                            ${plan.price_yearly}
                                                            /yr &middot; save{" "}
                                                            {Math.round(
                                                                (1 -
                                                                    plan.price_yearly /
                                                                        (plan.price_monthly *
                                                                            12)) *
                                                                    100,
                                                            )}
                                                            %
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Limits */}
                                                <div className="space-y-1.5 text-xs text-slate-400 mb-3 border-t border-slate-700/60 pt-3">
                                                    {[
                                                        {
                                                            icon: "",
                                                            v: plan.max_users,
                                                            l: "users",
                                                        },
                                                        {
                                                            icon: "",
                                                            v: plan.max_invoices_per_month,
                                                            l: "invoices/mo",
                                                        },
                                                        {
                                                            icon: "",
                                                            v: plan.max_products,
                                                            l: "products",
                                                        },
                                                        {
                                                            icon: "",
                                                            v: plan.max_employees,
                                                            l: "employees",
                                                        },
                                                    ].map((r) => (
                                                        <div
                                                            key={r.l}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <span>
                                                                {r.icon} {r.l}
                                                            </span>
                                                            <span className="text-slate-300 font-medium">
                                                                {r.v}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Features */}
                                                {plan.features?.length > 0 && (
                                                    <div className="space-y-1">
                                                        {plan.features.map(
                                                            (f) => (
                                                                <div
                                                                    key={f}
                                                                    className="flex items-center gap-1.5 text-[11px] text-slate-300"
                                                                >
                                                                    <Check
                                                                        size={
                                                                            11
                                                                        }
                                                                        className={`${accent.text} shrink-0`}
                                                                    />
                                                                    {FEATURES_LABELS[
                                                                        f
                                                                    ] ?? f}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {errors.plan_id && (
                                    <p className="text-red-400 text-sm mb-4 text-center">
                                        {errors.plan_id}
                                    </p>
                                )}

                                <div className="text-center">
                                    <button
                                        onClick={() => {
                                            if (chosenPlan) setStep(2);
                                        }}
                                        disabled={!chosenPlan}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-10 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-violet-500/50 hover:-translate-y-0.5"
                                    >
                                        Continue with{" "}
                                        {chosenPlan?.name ?? "Selected Plan"}
                                        <ChevronRight size={16} />
                                    </button>
                                    <p className="text-slate-500 text-xs mt-3">
                                        No credit card required &middot; Cancel
                                        anytime
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* â”€â”€ STEP 2: Registration Form â”€â”€ */}
                        {step === 2 && (
                            <div className="w-full max-w-5xl">
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                    {/* Left: Form */}
                                    <div className="lg:col-span-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                                        <form
                                            onSubmit={submit}
                                            className="space-y-5"
                                        >
                                            {/* Company */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-6 h-6 bg-violet-500/20 rounded-lg flex items-center justify-center">
                                                        <Building2
                                                            size={12}
                                                            className="text-violet-400"
                                                        />
                                                    </div>
                                                    <h3 className="text-white font-semibold text-sm">
                                                        Company Details
                                                    </h3>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <InputField
                                                        label="Company Name *"
                                                        icon={Building2}
                                                        value={
                                                            data.company_name
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "company_name",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Acme Corp"
                                                        error={
                                                            errors.company_name
                                                        }
                                                    />
                                                    <InputField
                                                        label="Company Email *"
                                                        icon={Mail}
                                                        type="email"
                                                        value={
                                                            data.company_email
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "company_email",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="info@acme.com"
                                                        error={
                                                            errors.company_email
                                                        }
                                                    />
                                                    <InputField
                                                        label="Phone"
                                                        icon={Phone}
                                                        value={
                                                            data.company_phone
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "company_phone",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="+880..."
                                                        error={
                                                            errors.company_phone
                                                        }
                                                    />
                                                    <InputField
                                                        label="Country"
                                                        icon={Globe}
                                                        value={
                                                            data.company_country
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "company_country",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Bangladesh"
                                                        error={
                                                            errors.company_country
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="border-t border-slate-800" />

                                            {/* Admin User */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-6 h-6 bg-violet-500/20 rounded-lg flex items-center justify-center">
                                                        <User
                                                            size={12}
                                                            className="text-violet-400"
                                                        />
                                                    </div>
                                                    <h3 className="text-white font-semibold text-sm">
                                                        Your Admin Account
                                                    </h3>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <InputField
                                                        label="Full Name *"
                                                        icon={User}
                                                        value={data.admin_name}
                                                        onChange={(e) =>
                                                            setData(
                                                                "admin_name",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="John Doe"
                                                        error={
                                                            errors.admin_name
                                                        }
                                                    />
                                                    <InputField
                                                        label="Email Address *"
                                                        icon={Mail}
                                                        type="email"
                                                        value={data.admin_email}
                                                        onChange={(e) =>
                                                            setData(
                                                                "admin_email",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="john@acme.com"
                                                        error={
                                                            errors.admin_email
                                                        }
                                                    />
                                                    <InputField
                                                        label="Password *"
                                                        icon={Lock}
                                                        type="password"
                                                        value={data.password}
                                                        onChange={(e) =>
                                                            setData(
                                                                "password",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Min. 8 characters"
                                                        error={errors.password}
                                                    />
                                                    <InputField
                                                        label="Confirm Password *"
                                                        icon={Lock}
                                                        type="password"
                                                        value={
                                                            data.password_confirmation
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "password_confirmation",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Repeat password"
                                                        error={
                                                            errors.password_confirmation
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* Referral Code */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-800 pt-5">
                                                <div>
                                                    <label className="block text-slate-400 text-xs font-medium mb-1.5">
                                                        Referral Code{" "}
                                                        <span className="text-slate-600">
                                                            (optional)
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            data.affiliate_code
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "affiliate_code",
                                                                e.target.value.toUpperCase(),
                                                            )
                                                        }
                                                        placeholder="e.g. ABCD1234"
                                                        className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 text-sm font-mono outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder-slate-600"
                                                    />
                                                    {errors.affiliate_code && (
                                                        <p className="text-red-400 text-xs mt-1">
                                                            {
                                                                errors.affiliate_code
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Terms */}
                                            <div className="flex items-start gap-3">
                                                <div className="relative flex items-center justify-center mt-0.5">
                                                    <input
                                                        id="agreed"
                                                        type="checkbox"
                                                        checked={data.agreed}
                                                        onChange={(e) =>
                                                            setData(
                                                                "agreed",
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="w-4 h-4 accent-violet-600 cursor-pointer"
                                                    />
                                                </div>
                                                <label
                                                    htmlFor="agreed"
                                                    className="text-slate-400 text-xs cursor-pointer leading-relaxed"
                                                >
                                                    I agree to the{" "}
                                                    <a
                                                        href="#"
                                                        className="text-violet-400 hover:text-violet-300"
                                                    >
                                                        Terms of Service
                                                    </a>{" "}
                                                    and{" "}
                                                    <a
                                                        href="#"
                                                        className="text-violet-400 hover:text-violet-300"
                                                    >
                                                        Privacy Policy
                                                    </a>
                                                </label>
                                            </div>
                                            {errors.agreed && (
                                                <p className="text-red-400 text-xs -mt-3">
                                                    {errors.agreed}
                                                </p>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-3 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                                                >
                                                    <ArrowLeft
                                                        size={14}
                                                        className="inline"
                                                    />{" "}
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <svg
                                                                className="animate-spin h-4 w-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                />
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                                />
                                                            </svg>
                                                            Creating your
                                                            account...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles
                                                                size={14}
                                                            />
                                                            Get Started
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Right: Plan summary */}
                                    <div className="lg:col-span-2 space-y-4">
                                        {/* Chosen plan card */}
                                        <div className="bg-gradient-to-br from-violet-600/20 to-purple-700/10 border border-violet-500/30 rounded-2xl p-5">
                                            <p className="text-violet-300 text-xs font-semibold uppercase tracking-widest mb-3">
                                                Selected Plan
                                            </p>
                                            <h3 className="text-white text-xl font-extrabold mb-1">
                                                {chosenPlan?.name}
                                            </h3>
                                            {chosenPlan?.description && (
                                                <p className="text-slate-400 text-xs mb-3">
                                                    {chosenPlan.description}
                                                </p>
                                            )}
                                            <div className="flex items-end gap-1 mb-1">
                                                <span className="text-3xl font-extrabold text-white">
                                                    ${chosenPlan?.price_monthly}
                                                </span>
                                                <span className="text-slate-400 text-xs mb-1">
                                                    /month
                                                </span>
                                            </div>
                                            {chosenPlan?.price_yearly > 0 && (
                                                <p className="text-emerald-400 text-xs font-medium mb-3">
                                                    ${chosenPlan.price_yearly}
                                                    /year &middot; save{" "}
                                                    {savings}%
                                                </p>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="text-violet-400 text-xs hover:text-violet-300 transition-colors"
                                            >
                                                <ArrowLeft
                                                    size={12}
                                                    className="inline mr-0.5"
                                                />{" "}
                                                Change plan
                                            </button>
                                        </div>

                                        {/* Limits */}
                                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
                                                Limits
                                            </p>
                                            <div className="space-y-2">
                                                {[
                                                    {
                                                        icon: "",
                                                        l: "Users",
                                                        v: chosenPlan?.max_users,
                                                    },
                                                    {
                                                        icon: "",
                                                        l: "Invoices/month",
                                                        v: chosenPlan?.max_invoices_per_month,
                                                    },
                                                    {
                                                        icon: "",
                                                        l: "Products",
                                                        v: chosenPlan?.max_products,
                                                    },
                                                    {
                                                        icon: "",
                                                        l: "Employees",
                                                        v: chosenPlan?.max_employees,
                                                    },
                                                ].map((r) => (
                                                    <div
                                                        key={r.l}
                                                        className="flex items-center justify-between text-sm"
                                                    >
                                                        <span className="text-slate-400">
                                                            {r.icon} {r.l}
                                                        </span>
                                                        <span className="text-white font-semibold">
                                                            {r.v}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Features */}
                                        {chosenPlan?.features?.length > 0 && (
                                            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
                                                    Included Features
                                                </p>
                                                <div className="space-y-1.5">
                                                    {chosenPlan.features.map(
                                                        (f) => (
                                                            <div
                                                                key={f}
                                                                className="flex items-center gap-2 text-xs text-slate-300"
                                                            >
                                                                <Check
                                                                    size={12}
                                                                    className="text-emerald-400 shrink-0"
                                                                />
                                                                {FEATURES_LABELS[
                                                                    f
                                                                ] ?? f}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Trust badges */}
                                        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4">
                                            <div className="space-y-2">
                                                {[
                                                    "SSL-secured, your data is safe",
                                                    "Set up in under 2 minutes",
                                                    "Cancel anytime, no contracts",
                                                    "24/7 support included",
                                                ].map((t) => (
                                                    <p
                                                        key={t}
                                                        className="text-slate-400 text-xs"
                                                    >
                                                        {t}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

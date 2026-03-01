import { useForm, Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Building2,
    Mail,
    Phone,
    User,
    MessageSquare,
    ChevronRight,
    CheckCircle,
    ArrowLeft,
    Zap,
    Star,
    Rocket,
    Shield,
    Sparkles,
    Lock,
    Clock,
    HeadphonesIcon,
} from "lucide-react";

const planIcons = { starter: Zap, business: Star, enterprise: Rocket };
const industryOptions = [
    "Retail / E-commerce",
    "Manufacturing",
    "Services",
    "Construction",
    "Healthcare",
    "Education",
    "Real Estate",
    "Food & Beverage",
    "Technology",
    "Other",
];
const companySizes = [
    "1–10 employees",
    "11–50 employees",
    "51–200 employees",
    "201–500 employees",
    "500+ employees",
];

function Field({ label, required, error, children }) {
    return (
        <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            {children}
            {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
        </div>
    );
}

function InputIcon({ icon: Icon, error, children }) {
    return (
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none z-10">
                <Icon size={15} className="text-slate-400" />
            </span>
            {children}
        </div>
    );
}

const inputCls = (error) =>
    `w-full bg-slate-800/80 border text-white text-sm rounded-xl pl-10 pr-4 py-3 placeholder-slate-500 outline-none transition-all duration-150 ${
        error
            ? "border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/60"
    }`;

export default function ContactUs({ plans }) {
    const { flash } = usePage().props;
    const [submitted, setSubmitted] = useState(!!flash?.success);

    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        name: "",
        email: "",
        phone: "",
        company_name: "",
        company_size: "",
        industry: "",
        plan_interest: "",
        message: "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("contact.submit"), {
            onSuccess: () => setSubmitted(true),
        });
    }

    // ── Success screen ──────────────────────────────────────────────────────
    if (submitted || wasSuccessful) {
        return (
            <>
                <Head title="Request Received" />
                <div
                    className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
                    style={{ backgroundColor: "#0a0a14" }}
                >
                    <div
                        className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
                        }}
                    />
                    <div
                        className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
                        }}
                    />
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.04]"
                        style={{
                            backgroundImage:
                                "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                        }}
                    />
                    <div className="relative max-w-md w-full text-center">
                        <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle
                                className="text-emerald-400"
                                size={38}
                            />
                        </div>
                        <h1 className="text-3xl font-extrabold text-white mb-3">
                            Thank You!
                        </h1>
                        <p className="text-slate-300 text-lg mb-2">
                            Your request has been received.
                        </p>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            Our team will review your application and reach out
                            within 1–2 business days. If approved, you'll
                            receive an email with your login credentials.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/30"
                        >
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    // ── Main form ───────────────────────────────────────────────────────────
    return (
        <>
            <Head title="Contact Us" />

            <div
                className="min-h-screen text-white relative overflow-hidden"
                style={{ backgroundColor: "#0a0a14" }}
            >
                {/* Blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
                    <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[120px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px]" />
                    {/* Grid */}
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
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm transition-colors group"
                        >
                            <ArrowLeft
                                size={14}
                                className="group-hover:-translate-x-0.5 transition-transform"
                            />
                            Back to Home
                        </Link>
                    </nav>

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center px-4 pb-16 pt-6">
                        {/* Hero */}
                        <div className="text-center mb-10 max-w-2xl w-full">
                            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
                                <Sparkles size={12} />
                                Get in Touch
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight">
                                Request a Demo
                            </h1>
                            <p className="text-slate-400 mt-3 text-base max-w-lg mx-auto">
                                Fill in your details and our team will set up
                                your account and get you started fast.
                            </p>
                        </div>

                        {/* Grid */}
                        <div className="w-full max-w-5xl grid lg:grid-cols-5 gap-6">
                            {/* ── Form card ── */}
                            <div className="lg:col-span-3 bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-3xl p-7 shadow-2xl shadow-black/40">
                                <h2 className="text-white font-bold text-xl mb-6">
                                    Contact Information
                                </h2>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    {/* Name + Email */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Field
                                            label="Full Name"
                                            required
                                            error={errors.name}
                                        >
                                            <InputIcon
                                                icon={User}
                                                error={errors.name}
                                            >
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "name",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="John Doe"
                                                    className={inputCls(
                                                        errors.name,
                                                    )}
                                                />
                                            </InputIcon>
                                        </Field>

                                        <Field
                                            label="Email Address"
                                            required
                                            error={errors.email}
                                        >
                                            <InputIcon
                                                icon={Mail}
                                                error={errors.email}
                                            >
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            "email",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="you@company.com"
                                                    className={inputCls(
                                                        errors.email,
                                                    )}
                                                />
                                            </InputIcon>
                                        </Field>
                                    </div>

                                    {/* Company + Phone */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Field
                                            label="Company Name"
                                            required
                                            error={errors.company_name}
                                        >
                                            <InputIcon
                                                icon={Building2}
                                                error={errors.company_name}
                                            >
                                                <input
                                                    type="text"
                                                    value={data.company_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "company_name",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Acme Ltd."
                                                    className={inputCls(
                                                        errors.company_name,
                                                    )}
                                                />
                                            </InputIcon>
                                        </Field>

                                        <Field
                                            label="Phone Number"
                                            error={errors.phone}
                                        >
                                            <InputIcon
                                                icon={Phone}
                                                error={errors.phone}
                                            >
                                                <input
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            "phone",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="+880 1234 567890"
                                                    className={inputCls(
                                                        errors.phone,
                                                    )}
                                                />
                                            </InputIcon>
                                        </Field>
                                    </div>

                                    {/* Company Size + Industry */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Field
                                            label="Company Size"
                                            error={errors.company_size}
                                        >
                                            <select
                                                value={data.company_size}
                                                onChange={(e) =>
                                                    setData(
                                                        "company_size",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/60 appearance-none"
                                            >
                                                <option value="">
                                                    Select size...
                                                </option>
                                                {companySizes.map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>

                                        <Field
                                            label="Industry"
                                            error={errors.industry}
                                        >
                                            <select
                                                value={data.industry}
                                                onChange={(e) =>
                                                    setData(
                                                        "industry",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/60 appearance-none"
                                            >
                                                <option value="">
                                                    Select industry...
                                                </option>
                                                {industryOptions.map((i) => (
                                                    <option key={i} value={i}>
                                                        {i}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                    </div>

                                    {/* Message */}
                                    <Field
                                        label="Message / Requirements"
                                        error={errors.message}
                                    >
                                        <div className="relative">
                                            <span className="absolute top-3.5 left-3.5 pointer-events-none z-10">
                                                <MessageSquare
                                                    size={15}
                                                    className="text-slate-400"
                                                />
                                            </span>
                                            <textarea
                                                value={data.message}
                                                onChange={(e) =>
                                                    setData(
                                                        "message",
                                                        e.target.value,
                                                    )
                                                }
                                                rows={4}
                                                placeholder="Tell us about your business needs..."
                                                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/60 resize-none transition-all duration-150"
                                            />
                                        </div>
                                    </Field>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-violet-500/30 transition-all duration-200 active:scale-[0.98]"
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
                                                        d="M4 12a8 8 0 018-8v8H4z"
                                                    />
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={14} />
                                                Submit Request
                                                <ChevronRight size={15} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* ── Sidebar ── */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Plan selector */}
                                <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-3xl p-5 shadow-2xl shadow-black/40">
                                    <p className="text-violet-300 text-xs font-semibold uppercase tracking-widest mb-1">
                                        Plan Interest
                                    </p>
                                    <p className="text-slate-500 text-xs mb-4">
                                        Select the plan you're interested in
                                        (optional)
                                    </p>
                                    <div className="space-y-3">
                                        {plans.map((plan) => {
                                            const IconComp =
                                                planIcons[plan.slug] || Star;
                                            const selected =
                                                data.plan_interest ===
                                                plan.slug;
                                            return (
                                                <button
                                                    key={plan.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            "plan_interest",
                                                            selected
                                                                ? ""
                                                                : plan.slug,
                                                        )
                                                    }
                                                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 ${
                                                        selected
                                                            ? "border-violet-500 bg-violet-500/10 ring-1 ring-violet-500/40 shadow-lg shadow-violet-500/10"
                                                            : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800/80"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${selected ? "bg-gradient-to-br from-violet-600 to-purple-700 shadow-lg shadow-violet-500/30" : "bg-slate-700"}`}
                                                        >
                                                            <IconComp
                                                                size={15}
                                                                className="text-white"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-white text-sm font-semibold">
                                                                    {plan.name}
                                                                </span>
                                                                {selected && (
                                                                    <CheckCircle
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-violet-400"
                                                                    />
                                                                )}
                                                            </div>
                                                            <p className="text-slate-400 text-xs mt-0.5">
                                                                $
                                                                {
                                                                    plan.price_monthly
                                                                }
                                                                /mo &middot;{" "}
                                                                {plan.max_users}{" "}
                                                                users
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Trust signals */}
                                <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-3xl p-5 shadow-2xl shadow-black/40 space-y-3.5">
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">
                                        Why Choose Us
                                    </p>
                                    {[
                                        {
                                            icon: Lock,
                                            text: "Your data is secure & private",
                                        },
                                        {
                                            icon: Clock,
                                            text: "Account setup within 24 hours",
                                        },
                                        {
                                            icon: Mail,
                                            text: "Credentials sent directly to your email",
                                        },
                                        {
                                            icon: HeadphonesIcon,
                                            text: "Dedicated onboarding support",
                                        },
                                    ].map(({ icon: Icon, text }) => (
                                        <div
                                            key={text}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                                                <Icon
                                                    size={14}
                                                    className="text-violet-400"
                                                />
                                            </div>
                                            <span className="text-slate-400 text-sm">
                                                {text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

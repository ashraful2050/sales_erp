import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Eye,
    EyeOff,
    Lock,
    Mail,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { useTranslation } from "@/hooks/useTranslation";

export default function Login({ status, canResetPassword }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title={t("Sign In")} />

            <div
                className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
                style={{ backgroundColor: "#0a0a14" }}
            >
                {/* Background blobs */}
                <div
                    className="absolute top-[-120px] left-[-120px] w-[520px] h-[520px] rounded-full opacity-20 blur-3xl pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
                    }}
                />
                <div
                    className="absolute bottom-[-100px] right-[-100px] w-[440px] h-[440px] rounded-full opacity-15 blur-3xl pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
                    }}
                />

                {/* Grid overlay */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Card */}
                <div className="relative w-full max-w-md">
                    {/* Back to home */}
                    <div className="mb-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm transition-colors group"
                        >
                            <ArrowLeft
                                size={14}
                                className="group-hover:-translate-x-0.5 transition-transform"
                            /> {t("Back to home")}
                        </Link>
                    </div>
                    {/* Logo + heading */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-5">
                            <ApplicationLogo className="h-14 w-14 rounded-2xl shadow-xl shadow-violet-500/30 mx-auto" />
                        </Link>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-slate-400 text-sm mt-2">
                            {t("Sign in to your account to continue")}
                        </p>
                    </div>

                    {/* Status message */}
                    {status && (
                        <div className="mb-5 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-xl">
                            <ShieldCheck size={15} className="shrink-0" />
                            {status}
                        </div>
                    )}

                    {/* Form card */}
                    <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/40">
                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                                    {t("Email address")}
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none z-10">
                                        <Mail
                                            size={15}
                                            className="text-slate-400"
                                        />
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="you@company.com"
                                        className={`w-full bg-slate-800/80 border text-white text-sm rounded-xl pl-10 pr-4 py-3 placeholder-slate-500 outline-none transition-all duration-150
                                            ${errors.email ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/60"}`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-400 text-xs mt-1.5">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-slate-300 text-sm font-medium">
                                        {t("Password")}
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-violet-400 text-xs hover:text-violet-300 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none z-10">
                                        <Lock
                                            size={15}
                                            className="text-slate-400"
                                        />
                                    </span>
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                                        className={`w-full bg-slate-800/80 border text-white text-sm rounded-xl pl-10 pr-10 py-3 placeholder-slate-500 outline-none transition-all duration-150
                                            ${errors.password ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/60"}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-300 transition-colors z-10"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={15} />
                                        ) : (
                                            <Eye size={15} />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-xs mt-1.5">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember me */}
                            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-violet-600 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer"
                                />
                                <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                                    {t("Remember me")}
                                </span>
                            </label>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-violet-500/30 transition-all duration-200 active:scale-[0.98]"
                            >
                                <Sparkles size={14} />
                                {processing ? "Signing in..." : "Sign In"}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-slate-500 text-sm mt-6">
                        Don&apos;t have an account?{" "}
                        <Link
                            href={route("tenant.register")}
                            className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                        >
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

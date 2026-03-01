import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Building2,
    Package,
    Users,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
    ChevronDown,
    Bell,
    User,
    ArrowLeft,
    Mail,
    MailCheck,
    HandCoins,
} from "lucide-react";

const navItems = [
    { label: "Dashboard", href: "superadmin.dashboard", icon: LayoutDashboard },
    { label: "Tenants", href: "superadmin.tenants.index", icon: Building2 },
    {
        label: "Contact Requests",
        href: "superadmin.contact-requests.index",
        icon: Mail,
    },
    {
        label: "Email Logs",
        href: "superadmin.email-logs.index",
        icon: MailCheck,
    },
    { label: "Plans", href: "superadmin.plans.index", icon: Package },
    {
        label: "Affiliates",
        href: "superadmin.affiliates.index",
        icon: HandCoins,
    },
    { label: "All Users", href: "superadmin.users.index", icon: Users },
    { label: "Super Admins", href: "superadmin.super-admins", icon: Shield },
];

export default function SuperAdminLayout({ children, title }) {
    const { auth, flash, isImpersonating, pendingContactRequests } =
        usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (routeName) =>
        route().current(routeName + "*") || route().current(routeName);

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800">
                    <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                        <Shield size={16} className="text-white" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-bold leading-none">
                            Super Admin
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5">
                            SaaS Control Panel
                        </p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto lg:hidden text-slate-400 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const showBadge =
                            item.href === "superadmin.contact-requests.index" &&
                            pendingContactRequests > 0;
                        return (
                            <Link
                                key={item.href}
                                href={route(item.href)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                                    ${
                                        isActive(item.href)
                                            ? "bg-violet-600 text-white"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    }`}
                            >
                                <item.icon size={16} />
                                <span className="flex-1">{item.label}</span>
                                {showBadge && (
                                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                        {pendingContactRequests}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom: Back to main app */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 space-y-2">
                    <Link
                        href={route("dashboard")}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to App
                    </Link>
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-slate-400 hover:text-white"
                        >
                            <Menu size={20} />
                        </button>
                        {title && (
                            <h1 className="text-white font-semibold text-lg">
                                {title}
                            </h1>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center">
                                <User size={14} className="text-white" />
                            </div>
                            <span className="hidden sm:block text-white">
                                {auth.user?.name}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Impersonation Banner */}
                {isImpersonating && (
                    <div className="bg-amber-500 text-amber-950 text-sm px-4 py-2 flex items-center justify-between">
                        <span>⚠️ You are impersonating a tenant user.</span>
                        <Link
                            href={route("superadmin.stop-impersonating")}
                            method="post"
                            as="button"
                            className="font-bold underline ml-4"
                        >
                            Stop Impersonating
                        </Link>
                    </div>
                )}

                {/* Flash */}
                {flash?.success && (
                    <div className="mx-4 mt-4 bg-emerald-900/60 border border-emerald-700 text-emerald-300 text-sm px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-4 mt-4 bg-red-900/60 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg">
                        {flash.error}
                    </div>
                )}

                {/* Content */}
                <main className="flex-1 overflow-auto p-4 lg:p-6 text-slate-100">
                    {children}
                </main>
            </div>
        </div>
    );
}

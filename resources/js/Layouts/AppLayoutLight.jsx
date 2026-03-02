import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import SubscriptionBanner from "@/Components/SubscriptionBanner";
import { nav } from "./navConfig";
import {
    ChevronDown,
    ChevronRight,
    LogOut,
    User,
    Bell,
    Menu,
    X,
    Shield,
} from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────
function safeRoute(name) {
    try {
        return route(name);
    } catch {
        return "#";
    }
}

function isRouteActive(routeName) {
    try {
        return route().current(routeName) || route().current(routeName + ".*");
    } catch {
        return false;
    }
}

// ── Light NavItem ─────────────────────────────────────────────────────────────
function NavItem({ item, permissions, isSuperAdmin, isAdmin }) {
    const hasAccess = !item.perm || permissions?.[item.perm] || isSuperAdmin;
    if (!hasAccess) return null;

    const hasChildren = item.children?.length > 0;
    const active = item.route ? isRouteActive(item.route) : false;
    const childActive = item.children?.some((c) => isRouteActive(c.route));
    const [open, setOpen] = useState(childActive);

    useEffect(() => {
        if (childActive) setOpen(true);
    }, [childActive]);

    const Icon = item.icon;

    if (!hasChildren) {
        return (
            <li>
                <Link
                    href={safeRoute(item.href)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                        active
                            ? "bg-indigo-50 text-indigo-700 font-semibold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                >
                    {Icon && (
                        <Icon
                            size={16}
                            className={
                                active ? "text-indigo-600" : "text-slate-400"
                            }
                        />
                    )}
                    <span>{item.label}</span>
                </Link>
            </li>
        );
    }

    return (
        <li>
            <button
                onClick={() => setOpen((o) => !o)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    childActive
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
            >
                {Icon && (
                    <Icon
                        size={16}
                        className={
                            childActive ? "text-indigo-600" : "text-slate-400"
                        }
                    />
                )}
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown
                    size={13}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && (
                <ul className="mt-0.5 ml-6 border-l border-slate-200 pl-3 space-y-0.5">
                    {item.children
                        .filter(
                            (c) =>
                                (!c.superAdminOnly || isSuperAdmin) &&
                                (!c.adminOrSuperAdmin ||
                                    isSuperAdmin ||
                                    isAdmin),
                        )
                        .map((child) => {
                            const childActive2 = isRouteActive(child.route);
                            return (
                                <li key={child.label}>
                                    <Link
                                        href={safeRoute(child.href)}
                                        className={`block py-1.5 pl-2 pr-3 rounded-md text-xs transition-all ${
                                            childActive2
                                                ? "text-indigo-700 font-semibold bg-indigo-50"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        {child.label}
                                    </Link>
                                </li>
                            );
                        })}
                </ul>
            )}
        </li>
    );
}

// ── Light Layout ──────────────────────────────────────────────────────────────
export default function AppLayoutLight({ children, title }) {
    const {
        auth,
        isSuperAdmin,
        isAdmin,
        flash,
        permissions = {},
    } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [flashMsg, setFlashMsg] = useState(null);

    useEffect(() => {
        const msg = flash?.error
            ? { type: "error", text: flash.error }
            : flash?.success
              ? { type: "success", text: flash.success }
              : flash?.warning
                ? { type: "warning", text: flash.warning }
                : null;
        if (msg) {
            setFlashMsg(msg);
            const t = setTimeout(() => setFlashMsg(null), 4000);
            return () => clearTimeout(t);
        }
    }, [flash?.error, flash?.success, flash?.warning]);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar — white, clean */}
            <aside
                className={`
                fixed lg:static inset-y-0 left-0 z-30 flex flex-col w-60 bg-white border-r border-slate-200
                transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 shrink-0">
                    <Link
                        href={safeRoute("dashboard")}
                        className="flex items-center gap-2.5"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-xs">
                                ERP
                            </span>
                        </div>
                        <div className="leading-tight">
                            <div className="text-slate-800 font-bold text-sm">
                                AccounTech
                            </div>
                            <div className="text-indigo-500 text-[10px] font-medium">
                                BD ERP
                            </div>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-slate-600"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-3 px-2">
                    <ul className="space-y-0.5">
                        {nav.map((item) => (
                            <NavItem
                                key={item.label}
                                item={item}
                                permissions={permissions}
                                isSuperAdmin={isSuperAdmin}
                                isAdmin={isAdmin}
                            />
                        ))}
                    </ul>
                </nav>

                {/* User section */}
                <div className="border-t border-slate-200 p-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-700 font-bold text-xs">
                                {auth?.user?.name?.[0]?.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-700 text-xs font-semibold truncate">
                                {auth?.user?.name}
                            </p>
                            <p className="text-slate-400 text-[10px] truncate">
                                {auth?.user?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden text-slate-500 hover:text-slate-700"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        {title && (
                            <h1 className="text-sm font-semibold text-slate-700 hidden sm:block">
                                {title}
                            </h1>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100">
                            <Bell size={18} />
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen((o) => !o)}
                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 text-sm"
                            >
                                <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {auth?.user?.name?.[0]?.toUpperCase()}
                                </div>
                                <span className="hidden sm:block text-slate-700 font-medium text-sm">
                                    {auth?.user?.name}
                                </span>
                                <ChevronDown
                                    size={13}
                                    className="text-slate-400"
                                />
                            </button>
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        <User size={14} /> Profile
                                    </Link>
                                    {isSuperAdmin && (
                                        <Link
                                            href={safeRoute(
                                                "superadmin.dashboard",
                                            )}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-violet-700 hover:bg-violet-50"
                                        >
                                            <Shield size={14} /> Super Admin
                                        </Link>
                                    )}
                                    <hr className="my-1 border-slate-100" />
                                    <Link
                                        href={safeRoute("logout")}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={14} /> Log out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <SubscriptionBanner />

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50">
                    {flashMsg && (
                        <div
                            className={`mb-4 flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-sm ${
                                flashMsg.type === "error"
                                    ? "bg-red-50 border border-red-200 text-red-700"
                                    : flashMsg.type === "warning"
                                      ? "bg-amber-50 border border-amber-200 text-amber-700"
                                      : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                            }`}
                        >
                            <span>{flashMsg.text}</span>
                            <button
                                onClick={() => setFlashMsg(null)}
                                className="shrink-0 opacity-60 hover:opacity-100 text-lg leading-none"
                            >
                                &times;
                            </button>
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}

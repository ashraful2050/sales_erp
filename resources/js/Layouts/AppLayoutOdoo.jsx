import { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import SubscriptionBanner from "@/Components/SubscriptionBanner";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import PwaInstallPrompt from "@/Components/PwaInstallPrompt";
import PushNotificationBell from "@/Components/PushNotificationBell";
import { getNav } from "./navConfig";
import { useTranslation } from "@/hooks/useTranslation";
import {
    ChevronDown,
    LogOut,
    User,
    Shield,
    X,
    Menu,
    LayoutGrid,
    ChevronRight,
} from "lucide-react";

// ── Brand colors ──────────────────────────────────────────────────────────────
const ODOO_PURPLE = "#714B67";
const ODOO_PURPLE_LIGHT = "#F3EDF1";
const ODOO_BG = "#F0EEEB";

// ── Helpers ───────────────────────────────────────────────────────────────────
function safeRoute(name) {
    try {
        return route(name);
    } catch {
        return "#";
    }
}

function isActive(routeName, url) {
    if (!routeName) return false;
    try {
        const parts = routeName.split(".");
        const actions = [
            "index",
            "create",
            "edit",
            "show",
            "store",
            "update",
            "destroy",
        ];
        const trimmed = actions.includes(parts[parts.length - 1])
            ? parts.slice(0, -1)
            : parts;
        const base = "/" + trimmed.join("/");
        return url === base || url.startsWith(base + "/");
    } catch {
        return false;
    }
}

// ── Sidebar nav item ──────────────────────────────────────────────────────────
function SidebarItem({ child, url, isSuperAdmin, isAdmin }) {
    if (child.superAdminOnly && !isSuperAdmin) return null;
    if (child.adminOrSuperAdmin && !isSuperAdmin && !isAdmin) return null;

    const active = isActive(child.route, url);

    return (
        <Link
            href={safeRoute(child.href)}
            className={`flex items-center gap-2 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all ${
                active
                    ? "text-[#714B67] bg-[#F3EDF1]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
        >
            {active && (
                <span
                    className="w-[3px] h-[14px] rounded-full shrink-0"
                    style={{ background: ODOO_PURPLE }}
                />
            )}
            <span className={active ? "" : "ml-[7px]"}>{child.label}</span>
        </Link>
    );
}

// ── App tile in app-switcher drawer ───────────────────────────────────────────
function AppTile({ item, url, onClose, permissions }) {
    if (item.perm && !permissions?.[item.perm]) return null;

    const firstHref = item.route
        ? safeRoute(item.route)
        : item.children?.[0]?.href
          ? safeRoute(item.children[0].href)
          : "#";

    const moduleActive = item.route
        ? isActive(item.route, url)
        : item.children?.some((c) => isActive(c.route, url));

    const Icon = item.icon;

    return (
        <Link
            href={firstHref}
            onClick={onClose}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all cursor-pointer group ${
                moduleActive
                    ? "bg-[#F3EDF1] ring-2 ring-[#714B67]/30"
                    : "hover:bg-slate-100"
            }`}
        >
            <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105"
                style={{
                    background: moduleActive
                        ? ODOO_PURPLE
                        : "linear-gradient(135deg,#64748b,#334155)",
                }}
            >
                {Icon && <Icon size={22} className="text-white" />}
            </div>
            <span
                className={`text-[11px] font-medium text-center leading-tight ${
                    moduleActive ? "text-[#714B67]" : "text-slate-600"
                }`}
            >
                {item.label}
            </span>
        </Link>
    );
}

// ── App-Switcher Drawer ───────────────────────────────────────────────────────
function AppSwitcher({ nav, url, permissions, onClose }) {
    return (
        <div className="fixed inset-0 z-[60] flex">
            {/* Drawer panel */}
            <div className="w-[300px] sm:w-[360px] bg-white h-full shadow-2xl flex flex-col">
                {/* Header */}
                <div
                    className="flex items-center justify-between px-5 py-4 shrink-0"
                    style={{ background: ODOO_PURPLE }}
                >
                    <div className="flex items-center gap-2.5">
                        <img
                            src="/logo.svg"
                            alt=""
                            className="w-7 h-7 rounded-lg"
                            onError={(e) => (e.target.style.display = "none")}
                        />
                        <div>
                            <div className="text-white font-bold text-sm leading-tight">
                                AccounTech BD ERP
                            </div>
                            <div className="text-white/60 text-[11px]">
                                All Applications
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Divider + search hint */}
                <div className="px-4 pt-3 pb-1">
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
                        Applications
                    </p>
                </div>

                {/* App grid */}
                <div className="flex-1 overflow-y-auto px-3 pb-4">
                    <div className="grid grid-cols-3 gap-1">
                        {nav.map((item) => (
                            <AppTile
                                key={item.label}
                                item={item}
                                url={url}
                                permissions={permissions}
                                onClose={onClose}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            <div
                className="flex-1 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
        </div>
    );
}

// ── Left Sidebar ──────────────────────────────────────────────────────────────
function Sidebar({
    activeModule,
    url,
    isSuperAdmin,
    isAdmin,
    onClose,
    mobile,
}) {
    const visibleItems =
        activeModule?.children?.filter(
            (c) =>
                (!c.superAdminOnly || isSuperAdmin) &&
                (!c.adminOrSuperAdmin || isSuperAdmin || isAdmin),
        ) ?? [];

    const Icon = activeModule?.icon;

    return (
        <aside className="w-[220px] bg-white border-r border-slate-200 flex flex-col overflow-hidden shrink-0">
            {/* Module header */}
            <div className="flex items-center gap-2.5 px-3 py-3 border-b border-slate-100 shrink-0">
                {Icon && (
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{ background: ODOO_PURPLE }}
                    >
                        <Icon size={15} className="text-white" />
                    </div>
                )}
                <span className="text-sm font-semibold text-slate-800 truncate flex-1">
                    {activeModule?.label}
                </span>
                {mobile && (
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded"
                    >
                        <X size={15} />
                    </button>
                )}
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
                {visibleItems.map((child) => (
                    <SidebarItem
                        key={child.label}
                        child={child}
                        url={url}
                        isSuperAdmin={isSuperAdmin}
                        isAdmin={isAdmin}
                    />
                ))}
            </nav>
        </aside>
    );
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export default function AppLayoutOdoo({ children, title }) {
    const {
        auth,
        isSuperAdmin,
        isAdmin,
        flash,
        permissions = {},
    } = usePage().props;
    const { url } = usePage();

    const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [flashMsg, setFlashMsg] = useState(null);
    const userMenuRef = useRef(null);

    const { t } = useTranslation();
    const nav = getNav(t);

    // Find the active top-level module
    const activeModule = nav.find((item) =>
        item.route
            ? isActive(item.route, url)
            : item.children?.some((c) => isActive(c.route, url)),
    );

    const hasSidebar =
        activeModule?.children?.length > 0 &&
        activeModule?.children?.some(
            (c) =>
                (!c.superAdminOnly || isSuperAdmin) &&
                (!c.adminOrSuperAdmin || isSuperAdmin || isAdmin),
        );

    // Flash messages
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
            const timer = setTimeout(() => setFlashMsg(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash?.error, flash?.success, flash?.warning]);

    // Close user menu on outside click
    useEffect(() => {
        function handler(e) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target))
                setUserMenuOpen(false);
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div
            className="flex flex-col h-screen overflow-hidden"
            style={{ background: ODOO_BG }}
        >
            {/* ── App Switcher Overlay ── */}
            {appSwitcherOpen && (
                <AppSwitcher
                    nav={nav}
                    url={url}
                    permissions={permissions}
                    onClose={() => setAppSwitcherOpen(false)}
                />
            )}

            {/* ── Top Navigation Bar ── */}
            <header
                className="h-[46px] flex items-center gap-1 px-2 shrink-0 z-40 shadow-md select-none"
                style={{ background: ODOO_PURPLE }}
            >
                {/* App switcher button */}
                <button
                    onClick={() => setAppSwitcherOpen(true)}
                    title="Applications"
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-white/90 hover:bg-white/10 hover:text-white transition-colors shrink-0"
                >
                    <LayoutGrid size={17} />
                    <span className="hidden sm:block text-sm font-bold tracking-tight">
                        AccounTech
                    </span>
                </button>

                {/* Divider */}
                <div className="w-px h-5 bg-white/20 mx-1 shrink-0" />

                {/* Active module breadcrumb */}
                {activeModule && (
                    <div className="hidden md:flex items-center gap-1 text-white/70 text-sm">
                        <ChevronRight size={14} className="opacity-50" />
                        <span className="font-medium text-white/90">
                            {activeModule.label}
                        </span>
                    </div>
                )}

                {/* Mobile sidebar toggle */}
                {hasSidebar && (
                    <button
                        onClick={() => setMobileNavOpen(true)}
                        className="md:hidden ml-1 text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <Menu size={17} />
                    </button>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Right actions */}
                <div className="flex items-center gap-0.5">
                    <div className="text-white/80 [&_button]:text-white/80 [&_button:hover]:text-white [&_button]:hover:bg-white/10 [&_button]:rounded-lg [&_button]:p-1.5 [&_button]:transition-colors">
                        <LanguageSwitcher />
                    </div>
                    <div className="text-white/80 [&_button]:text-white/80 [&_button:hover]:text-white [&_button]:hover:bg-white/10 [&_button]:rounded-lg [&_button]:p-1.5 [&_button]:transition-colors">
                        <PushNotificationBell />
                    </div>

                    {/* User menu */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setUserMenuOpen((o) => !o)}
                            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-white/90 hover:bg-white/10 hover:text-white transition-colors ml-1"
                        >
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/25 text-white text-xs font-bold">
                                {auth?.user?.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="hidden sm:block text-sm font-medium">
                                {auth?.user?.name}
                            </span>
                            <ChevronDown size={12} className="opacity-60" />
                        </button>

                        {userMenuOpen && (
                            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-50">
                                {/* User info */}
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow"
                                            style={{ background: ODOO_PURPLE }}
                                        >
                                            {auth?.user?.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate">
                                                {auth?.user?.name}
                                            </p>
                                            <p className="text-[11px] text-slate-400 truncate">
                                                {auth?.user?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                    onClick={() => setUserMenuOpen(false)}
                                >
                                    <User
                                        size={14}
                                        className="text-slate-400"
                                    />
                                    {t("nav.profile", {
                                        default: "My Profile",
                                    })}
                                </Link>

                                {isSuperAdmin && (
                                    <Link
                                        href={safeRoute("superadmin.dashboard")}
                                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-violet-700 hover:bg-violet-50 transition-colors"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <Shield size={14} />
                                        {t("nav.super_admin_panel", {
                                            default: "Super Admin",
                                        })}
                                    </Link>
                                )}

                                <div className="my-1 border-t border-slate-100" />

                                <Link
                                    href={safeRoute("logout")}
                                    method="post"
                                    as="button"
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={14} />
                                    {t("nav.logout", { default: "Log out" })}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Body ── */}
            <div className="flex flex-1 overflow-hidden">
                {/* Desktop sidebar */}
                {hasSidebar && (
                    <div className="hidden md:flex">
                        <Sidebar
                            activeModule={activeModule}
                            url={url}
                            isSuperAdmin={isSuperAdmin}
                            isAdmin={isAdmin}
                            mobile={false}
                        />
                    </div>
                )}

                {/* Mobile sidebar overlay */}
                {hasSidebar && mobileNavOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-50 bg-black/30 md:hidden"
                            onClick={() => setMobileNavOpen(false)}
                        />
                        <div className="fixed top-0 left-0 h-full z-50 md:hidden">
                            <Sidebar
                                activeModule={activeModule}
                                url={url}
                                isSuperAdmin={isSuperAdmin}
                                isAdmin={isAdmin}
                                mobile
                                onClose={() => setMobileNavOpen(false)}
                            />
                        </div>
                    </>
                )}

                {/* Main content */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <SubscriptionBanner />

                    {/* Page title bar */}
                    {title && (
                        <div className="bg-white border-b border-slate-200 px-5 py-2.5 flex items-center gap-3 shrink-0 shadow-sm">
                            {/* Mobile menu button when no sidebar */}
                            {!hasSidebar && (
                                <button
                                    onClick={() => setAppSwitcherOpen(true)}
                                    className="md:hidden text-slate-400 hover:text-slate-600 mr-1"
                                >
                                    <Menu size={18} />
                                </button>
                            )}
                            <nav
                                className="flex items-center gap-1.5 text-sm"
                                aria-label="Breadcrumb"
                            >
                                {activeModule && (
                                    <>
                                        <span className="text-slate-400 font-medium">
                                            {activeModule.label}
                                        </span>
                                        <ChevronRight
                                            size={13}
                                            className="text-slate-300"
                                        />
                                    </>
                                )}
                                <span className="text-slate-700 font-semibold">
                                    {t(title, { default: title })}
                                </span>
                            </nav>
                        </div>
                    )}

                    {/* Scrollable content */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                        {/* Flash messages */}
                        {flashMsg && (
                            <div
                                className={`mb-4 flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-sm ${
                                    flashMsg.type === "error"
                                        ? "bg-red-50 border border-red-200 text-red-700"
                                        : flashMsg.type === "warning"
                                          ? "bg-amber-50 border border-amber-200 text-amber-700"
                                          : "bg-green-50 border border-green-200 text-green-700"
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
                    </div>
                </main>
            </div>

            <PwaInstallPrompt />
        </div>
    );
}

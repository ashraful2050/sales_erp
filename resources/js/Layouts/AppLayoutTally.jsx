import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import SubscriptionBanner from "@/Components/SubscriptionBanner";
import { getNav } from "./navConfig";
import { useTranslation } from "@/hooks/useTranslation";
import {
    ChevronRight,
    LogOut,
    User,
    Shield,
    X,
    Menu,
    LayoutDashboard,
    BookOpen,
    ShoppingCart,
    Truck,
    Landmark,
    Package,
    Users,
    Factory,
    BarChart2,
    Settings,
    ShoppingBag,
    HelpCircle,
    Brain,
    Headphones,
    CheckSquare,
    UserCheck,
} from "lucide-react";

// Tally Prime colour palette
const TALLY_BG = "#1a3c2c"; // deep green top bar
const TALLY_ACCENT = "#4caf6e"; // bright green accent
const TALLY_PANEL = "#f0f4f0"; // light greenish panel bg
const TALLY_BORDER = "#c8d8c8"; // subtle green border

function safeRoute(name) {
    try {
        return route(name);
    } catch {
        return "#";
    }
}

function isActive(routeName) {
    try {
        return route().current(routeName) || route().current(routeName + ".*");
    } catch {
        return false;
    }
}

// ── Module tile for the gateway panel ────────────────────────────────────────
function GatewayTile({ item, isSuperAdmin, permissions, onSelect, selected }) {
    const hasAccess = !item.perm || permissions?.[item.perm] || isSuperAdmin;
    if (!hasAccess) return null;

    const Icon = item.icon;
    const childActive = item.children?.some((c) => isActive(c.route));
    const selfActive = item.route ? isActive(item.route) : false;
    const active = selfActive || childActive || selected;

    return (
        <button
            onClick={() => {
                if (!item.children) {
                    window.location.href = safeRoute(item.href);
                } else {
                    onSelect(item.label === selected ? null : item.label);
                }
            }}
            className={`group w-full flex items-center gap-3 px-3 py-2 text-left border-b transition-all
                ${
                    active
                        ? "bg-[#2d6b47] text-white border-[#4caf6e]/40"
                        : "text-[#b8d4b8] hover:bg-[#24503a] hover:text-white border-transparent"
                }`}
            style={{ fontSize: 13 }}
        >
            {Icon && (
                <Icon
                    size={14}
                    className={
                        active
                            ? "text-[#4caf6e]"
                            : "text-[#6aaa80] group-hover:text-[#4caf6e]"
                    }
                />
            )}
            <span className="flex-1 font-medium">{item.label}</span>
            {item.children && <ChevronRight size={12} className="opacity-50" />}
        </button>
    );
}

// ── Sub-menu panel (right of gateway) ────────────────────────────────────────
function SubMenuPanel({ item, isSuperAdmin, isAdmin }) {
    if (!item?.children) return null;
    return (
        <div
            className="w-56 flex flex-col bg-white border-r"
            style={{ borderColor: TALLY_BORDER }}
        >
            <div
                className="px-4 py-3 text-xs font-bold uppercase tracking-widest border-b"
                style={{
                    backgroundColor: TALLY_BG,
                    color: TALLY_ACCENT,
                    borderColor: "#2d6b47",
                }}
            >
                {item.label}
            </div>
            <div className="flex-1 overflow-y-auto py-1">
                {item.children
                    .filter(
                        (c) =>
                            (!c.superAdminOnly || isSuperAdmin) &&
                            (!c.adminOrSuperAdmin || isSuperAdmin || isAdmin),
                    )
                    .map((child) => {
                        const active = isActive(child.route);
                        return (
                            <Link
                                key={child.label}
                                href={safeRoute(child.href)}
                                className={`flex items-center gap-2 px-4 py-2 text-[12px] border-b transition-all ${
                                    active
                                        ? "bg-emerald-50 text-emerald-800 font-semibold border-emerald-100"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800 border-slate-100"
                                }`}
                            >
                                {active && (
                                    <span className="w-1 h-3 bg-emerald-500 rounded-full shrink-0" />
                                )}
                                {child.label}
                            </Link>
                        );
                    })}
            </div>
        </div>
    );
}

// ── Tally Layout ──────────────────────────────────────────────────────────────
export default function AppLayoutTally({ children, title }) {
    const {
        auth,
        isSuperAdmin,
        isAdmin,
        flash,
        permissions = {},
    } = usePage().props;
    const [selectedModule, setSelectedModule] = useState(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [flashMsg, setFlashMsg] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { t: tr } = useTranslation();
    const nav = getNav(tr);

    // Auto-select the module that has an active child
    useEffect(() => {
        const active = nav.find(
            (item) =>
                item.children?.some((c) => isActive(c.route)) ||
                (item.route && isActive(item.route)),
        );
        if (active?.children) setSelectedModule(active.label);
    }, []);

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

    const selectedItem = nav.find((n) => n.label === selectedModule);

    const fkeys = [
        { key: "F1", label: "Help" },
        { key: "F2", label: "Date" },
        { key: "F3", label: "Company" },
        { key: "F4", label: "New Co." },
        { key: "F5", label: "Sales" },
        { key: "F6", label: "Purchase" },
        { key: "F7", label: "Journal" },
        { key: "F8", label: "Sales VO" },
        { key: "F9", label: "Purch.VO" },
        { key: "F10", label: "Reports" },
        { key: "F11", label: "Features" },
        { key: "F12", label: "Settings" },
    ];

    return (
        <div
            className="flex flex-col h-screen overflow-hidden"
            style={{ fontFamily: "'Courier New', monospace" }}
        >
            {/* ── Top bar (Tally Prime green bar) ── */}
            <header
                className="shrink-0 flex items-center justify-between px-4 h-10"
                style={{ backgroundColor: TALLY_BG }}
            >
                <div className="flex items-center gap-3">
                    <button
                        className="lg:hidden text-[#4caf6e]"
                        onClick={() => setMobileOpen((o) => !o)}
                    >
                        <Menu size={18} />
                    </button>
                    <Link
                        href={safeRoute("dashboard")}
                        className="flex items-center gap-2"
                    >
                        <span
                            style={{
                                color: TALLY_ACCENT,
                                fontWeight: "bold",
                                fontSize: 15,
                                letterSpacing: 1,
                            }}
                        >
                            AccounTech ERP
                        </span>
                        <span className="text-[#6aaa80] text-xs hidden sm:inline">
                            &nbsp;|&nbsp;
                            {auth?.auth?.company?.name || "ERP System"}
                        </span>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#6aaa80] text-xs hidden sm:block">
                        {new Date().toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen((o) => !o)}
                            className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs hover:bg-[#2d6b47] transition-all"
                            style={{ color: "#b8d4b8" }}
                        >
                            <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                                style={{
                                    backgroundColor: TALLY_ACCENT,
                                    color: TALLY_BG,
                                }}
                            >
                                {auth?.user?.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="hidden sm:block">
                                {auth?.user?.name}
                            </span>
                        </button>
                        {userMenuOpen && (
                            <div
                                className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                                >
                                    <User size={13} /> Profile
                                </Link>
                                {isSuperAdmin && (
                                    <Link
                                        href={safeRoute("superadmin.dashboard")}
                                        className="flex items-center gap-2 px-3 py-2 text-xs text-violet-700 hover:bg-violet-50"
                                    >
                                        <Shield size={13} /> Super Admin
                                    </Link>
                                )}
                                <hr className="my-1 border-slate-100" />
                                <Link
                                    href={safeRoute("logout")}
                                    method="post"
                                    as="button"
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                                >
                                    <LogOut size={13} /> Log out
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Title bar ── */}
            <div
                className="shrink-0 flex items-center px-4 h-7 text-xs font-bold uppercase tracking-widest"
                style={{
                    backgroundColor: "#143020",
                    color: "#4caf6e",
                    letterSpacing: 2,
                }}
            >
                {title
                    ? tr(title, { default: title })
                    : tr("Gateway of Tally", { default: "Gateway of Tally" })}
            </div>

            <SubscriptionBanner />

            {/* ── Body ── */}
            <div
                className="flex flex-1 overflow-hidden"
                style={{ backgroundColor: TALLY_PANEL }}
            >
                {/* Mobile overlay */}
                {mobileOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-black/40 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}

                {/* ── Left: Gateway menu ── */}
                <div
                    className={`
                    ${mobileOpen ? "fixed z-30 inset-y-0 left-0" : "hidden lg:flex"}
                    flex-col w-44 shrink-0 overflow-y-auto border-r
                `}
                    style={{
                        backgroundColor: TALLY_BG,
                        borderColor: "#2d6b47",
                    }}
                >
                    {mobileOpen && (
                        <div
                            className="flex items-center justify-between px-3 py-2 border-b"
                            style={{ borderColor: "#2d6b47" }}
                        >
                            <span
                                style={{
                                    color: TALLY_ACCENT,
                                    fontSize: 11,
                                    fontWeight: "bold",
                                }}
                            >
                                MENU
                            </span>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="text-[#6aaa80]"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    <div
                        className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest border-b"
                        style={{ color: "#4caf6e99", borderColor: "#2d6b47" }}
                    >
                        Modules
                    </div>
                    {nav.map((item) => (
                        <GatewayTile
                            key={item.label}
                            item={item}
                            isSuperAdmin={isSuperAdmin}
                            permissions={permissions}
                            onSelect={setSelectedModule}
                            selected={selectedModule}
                        />
                    ))}
                </div>

                {/* ── Centre: Sub-menu (if module has children) ── */}
                {selectedItem?.children && (
                    <SubMenuPanel
                        item={selectedItem}
                        isSuperAdmin={isSuperAdmin}
                        isAdmin={isAdmin}
                    />
                )}

                {/* ── Right: Content ── */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto p-4">
                        {flashMsg && (
                            <div
                                className={`mb-3 flex items-center justify-between gap-3 rounded px-4 py-2.5 text-sm font-medium border ${
                                    flashMsg.type === "error"
                                        ? "bg-red-50 border-red-200 text-red-700"
                                        : flashMsg.type === "warning"
                                          ? "bg-amber-50 border-amber-200 text-amber-700"
                                          : "bg-emerald-50 border-emerald-200 text-emerald-700"
                                }`}
                                style={{ fontFamily: "system-ui, sans-serif" }}
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
                        <div style={{ fontFamily: "system-ui, sans-serif" }}>
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* ── Bottom bar: Function key hints ── */}
            <div
                className="shrink-0 flex items-center h-8 px-2 gap-0.5 border-t overflow-x-auto"
                style={{ backgroundColor: "#143020", borderColor: "#2d6b47" }}
            >
                {fkeys.map(({ key, label }) => (
                    <div
                        key={key}
                        className="flex items-center shrink-0 rounded overflow-hidden text-[10px] mr-1"
                    >
                        <span
                            className="px-1.5 py-0.5 font-bold"
                            style={{
                                backgroundColor: "#4caf6e",
                                color: TALLY_BG,
                            }}
                        >
                            {key}
                        </span>
                        <span
                            className="px-1.5 py-0.5"
                            style={{
                                color: "#6aaa80",
                                backgroundColor: "#1a3c2c",
                            }}
                        >
                            {label}
                        </span>
                    </div>
                ))}
                <div
                    className="ml-auto text-[10px] shrink-0"
                    style={{ color: "#4caf6e50" }}
                >
                    © AccounTech ERP
                </div>
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { cn, getInitials } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import {
  DashboardSquare01Icon,
  File01Icon,
  Wallet01Icon,
  Settings01Icon,
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";

interface NavItem {
  label: string;
  href: string;
  icon: typeof DashboardSquare01Icon;
  matchExact?: boolean;
}

const founderNav: NavItem[] = [
  { label: "Dashboard", href: "/founder/dashboard", icon: DashboardSquare01Icon, matchExact: true },
  { label: "My Ideas",  href: "/founder/ideas",     icon: File01Icon },
  { label: "Wallet",    href: "/founder/wallet",     icon: Wallet01Icon,   matchExact: true },
  { label: "Settings",  href: "/founder/settings",   icon: Settings01Icon, matchExact: true },
];

const earnerNav: NavItem[] = [
  { label: "Dashboard", href: "/earner/dashboard", icon: DashboardSquare01Icon, matchExact: true },
  { label: "Survey",    href: "/earner/surveys",   icon: File01Icon },
  { label: "Wallet",    href: "/earner/wallet",    icon: Wallet01Icon,   matchExact: true },
  { label: "Settings",  href: "/earner/settings",  icon: Settings01Icon, matchExact: true },
];

/* ─── Tiqra SVG Logo ─────────────────────────────────────────────────────── */
function TiqraLogo() {
  return (
    <svg width="120" height="36" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 28L16 8L28 28H20L16 20L12 28H4Z" fill="white" fillOpacity="0.95" />
      <path d="M12 28L16 20L20 28" fill="white" fillOpacity="0.5" />
      <text x="36" y="26" fontFamily="inherit" fontSize="22" fontWeight="700" fill="white" letterSpacing="-0.5">
        Tiqra
      </text>
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname() || "";
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isFounder = user?.role === "founder" || pathname.startsWith("/founder");
  const navItems = isFounder ? founderNav : earnerNav;

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: "#9F4EF5" }}
        onClick={() => setMobileOpen(true)}
      >
        <HugeiconsIcon icon={Menu01Icon} size={22} className="text-white" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — Figma: 324px wide, solid #9F4EF5, box-shadow 4px 4px 32px rgba(0,0,0,0.16) */}
      <aside
        className={cn(
          "w-[324px] min-h-screen flex flex-col fixed top-0 left-0 z-50 transition-transform duration-300",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{
          background: "#9F4EF5",
          boxShadow: "4px 4px 32px 0px rgba(0, 0, 0, 0.16)",
        }}
      >
        {/* ── Logo area — Figma: logo image top-left, ~y=60, x=57 ─────── */}
        <div className="flex items-center justify-between px-8 pt-[60px] pb-6">
          <Link href="/" className="block">
            <TiqraLogo />
          </Link>
          {/* Mobile close */}
          <button
            className="lg:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} className="text-white" />
          </button>
        </div>

        {/* ── Nav — Figma: starts at y=218, gap=12px ───────────────────── */}
        <nav className="flex flex-col gap-3 flex-1" style={{ paddingTop: 0 }}>
          {navItems.map((item) => {
            const isActive = item.matchExact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="relative flex items-center gap-2.5 px-6 py-4 text-white text-[18px] font-normal transition-all duration-200"
                style={
                  isActive
                    ? {
                        background: "rgba(237, 233, 254, 0.4)",
                        borderRight: "3px solid #EDE9FE",
                      }
                    : {}
                }
              >
                <HugeiconsIcon icon={item.icon} size={24} className="text-white flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Divider — Figma: at y=878, stroke brand color/Background ── */}
        <div style={{ margin: "0 3px", borderTop: "1px solid #EDE9FE", opacity: 0.4 }} />

        {/* ── User footer — Figma: y=910, gap=42px / 66px ─────────── */}
        {(() => {
          const isSettings = pathname.includes("/settings");
          return (
            <div 
              className="flex items-center" 
              style={{ 
                gap: isSettings ? "66px" : "42px",
                paddingLeft: isSettings ? 21 : 18,
                paddingRight: isSettings ? 21 : 18,
                paddingTop: 20,
                paddingBottom: 20
              }}
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: isSettings ? 60 : 80,
                    height: isSettings ? 60 : 80,
                    background: "#F8F9FC",
                    borderRadius: isSettings ? 40 : 16,
                  }}
                >
                  <span
                    style={{
                      color: "#9F4EF5",
                      fontFamily: "Geist, sans-serif",
                      fontWeight: 600,
                      fontSize: isSettings ? 24 : 32,
                      lineHeight: "1.5em",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {user ? getInitials(user.name) : "HA"}
                  </span>
                </div>
                {/* Name + role */}
                <div style={{ width: 104 }}>
                  <p className="text-white text-[18px] font-normal truncate">
                    {user?.name?.split(" ")[0] || "Haleemah"}{". "}
                    {user?.name?.split(" ")[1]?.charAt(0) || "A"}
                  </p>
                  <p className="text-white text-[14px] font-normal capitalize opacity-80">
                    {user?.role || "Earner"}
                  </p>
                </div>
              </div>

              {/* Logout/Menu Button */}
              <button
                onClick={logout}
                title="Sign out"
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: isSettings ? 40 : 50,
                  height: isSettings ? 40 : 50,
                  background: isSettings ? "rgba(248, 249, 252, 0.5)" : "#9F4EF5",
                  borderRadius: isSettings ? 8 : 999,
                  border: isSettings ? "1px solid #E5E7EB" : "none",
                  boxShadow: isSettings ? "none" : "4px 4px 32px 0px rgba(0, 0, 0, 0.2)",
                }}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16 17 21 12 16 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          );
        })()}
      </aside>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard, Lightbulb, Wallet, Settings, LogOut, FileText,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  matchExact?: boolean;
}

const founderNav: NavItem[] = [
  { label: "Dashboard", href: "/founder/dashboard", icon: <LayoutDashboard size={22} />, matchExact: true },
  { label: "My Ideas", href: "/founder/ideas", icon: <Lightbulb size={22} /> },
  { label: "Wallet", href: "/founder/wallet", icon: <Wallet size={22} />, matchExact: true },
  { label: "Settings", href: "/founder/settings", icon: <Settings size={22} />, matchExact: true },
];

const earnerNav: NavItem[] = [
  { label: "Dashboard", href: "/earner/dashboard", icon: <LayoutDashboard size={22} />, matchExact: true },
  { label: "Surveys", href: "/earner/surveys", icon: <FileText size={22} /> },
  { label: "Wallet", href: "/earner/wallet", icon: <Wallet size={22} />, matchExact: true },
  { label: "Settings", href: "/earner/settings", icon: <Settings size={22} />, matchExact: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  
  const isFounder = user?.role === "founder" || pathname.startsWith("/founder");
  const navItems = isFounder ? founderNav : earnerNav;

  return (
    <aside
      className="w-[324px] min-h-screen flex flex-col fixed top-0 left-0 z-40"
      style={{
        background: "linear-gradient(180deg, #9F4EF5 0%, #7C3ACD 100%)",
        boxShadow: "4px 0 32px rgba(159, 78, 245, 0.25)",
      }}
    >
      {/* Logo */}
      <div className="px-8 pt-10 pb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[12px] bg-white/20 flex items-center justify-center flex-shrink-0 border border-white/20">
          <span className="text-white font-bold text-[20px] leading-none">T</span>
        </div>
        <div>
          <p className="text-white font-bold text-[22px] tracking-tight leading-none">Tiqra</p>
          <p className="text-white/40 text-[10px] tracking-[0.12em] uppercase mt-0.5">
            {isFounder ? "Founder" : "Earner"} Panel
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/15 mx-8 mb-6" />

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-4 flex-1">
        {navItems.map((item) => {
          const isActive = item.matchExact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[17px] font-normal transition-all duration-200 relative group",
                isActive
                  ? "bg-white/20 text-white font-medium"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              )}
            >
              <span className={cn("flex-shrink-0", isActive ? "text-white" : "text-white/60 group-hover:text-white")}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {/* Active right indicator */}
              {isActive && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-white/80 rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="h-px bg-white/15 mx-8 mt-6" />

      {/* User profile */}
      <div className="px-5 py-5 flex items-center gap-3">
        {/* Avatar */}
        <div className="w-[52px] h-[52px] rounded-[14px] bg-white/20 border border-white/15 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-[18px]">
            {user ? getInitials(user.name) : "HA"}
          </span>
        </div>

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-[15px] font-medium leading-tight truncate">
            {user?.name || "Haleemah A."}
          </p>
          <p className="text-white/45 text-[12px] capitalize mt-0.5">
            {user?.role || "Founder"}
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign out"
          className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
        >
          <LogOut size={18} className="text-white/65" />
        </button>
      </div>
    </aside>
  );
}

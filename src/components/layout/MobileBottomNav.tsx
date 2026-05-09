"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon, DashboardSquare01Icon, File01Icon, Wallet01Icon, Settings01Icon, AiContentGenerator01Icon } from "@hugeicons/core-free-icons";

const founderNav = [
  { label: "Dashboard", href: "/founder/dashboard", icon: DashboardSquare01Icon, matchExact: true },
  { label: "Ideas", href: "/founder/ideas", icon: AiContentGenerator01Icon },
  { label: "Wallet", href: "/founder/wallet", icon: Wallet01Icon, matchExact: true },
  { label: "Settings", href: "/founder/settings", icon: Settings01Icon, matchExact: true },
];

const earnerNav = [
  { label: "Dashboard", href: "/earner/dashboard", icon: DashboardSquare01Icon, matchExact: true },
  { label: "Surveys", href: "/earner/surveys", icon: File01Icon },
  { label: "Wallet", href: "/earner/wallet", icon: Wallet01Icon, matchExact: true },
  { label: "Settings", href: "/earner/settings", icon: Settings01Icon, matchExact: true },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Don't show on auth pages
  if (pathname.startsWith("/auth") || pathname === "/splash" || pathname === "/onboarding") {
    return null;
  }

  const isFounder = user?.role === "founder" || pathname.startsWith("/founder");
  const navItems = isFounder ? founderNav : earnerNav;

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const isActive = item.matchExact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(item.href + "/");

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("mobile-nav-item", isActive && "active")}
          >
            <HugeiconsIcon icon={Icon}
              size={22}
              className={isActive ? "text-brand-primary" : "text-[#9CA3AF]"}
            />
            <span className={cn(
              "text-[11px] font-medium",
              isActive ? "text-brand-primary" : "text-[#9CA3AF]"
            )}>
              {item.label}
            </span>
            {isActive && (
              <span className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

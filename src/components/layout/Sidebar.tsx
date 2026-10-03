"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Note01Icon,
  File01Icon,
  Wallet01Icon,
  Settings01Icon,
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: typeof DashboardSquare01Icon;
  matchExact?: boolean;
}

const founderNav: NavItem[] = [
  { label: "Dashboard", href: "/founder/dashboard", icon: DashboardSquare01Icon, matchExact: true },
  { label: "Ideas", href: "/founder/ideas", icon: Note01Icon },
  { label: "Wallet", href: "/founder/wallet", icon: Wallet01Icon },
  { label: "Settings", href: "/founder/settings", icon: Settings01Icon },
];

const earnerNav: NavItem[] = [
  { label: "Dashboard", href: "/earner/dashboard", icon: DashboardSquare01Icon, matchExact: true },
  { label: "Survey", href: "/earner/surveys", icon: File01Icon },
  { label: "Wallet", href: "/earner/wallet", icon: Wallet01Icon },
  { label: "Settings", href: "/earner/settings", icon: Settings01Icon },
];

export default function Sidebar() {
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = pathname.startsWith("/founder") ? founderNav : earnerNav;

  return (
    <>
      <button
        aria-label="Open menu"
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F46E5] lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <HugeiconsIcon icon={Menu01Icon} size={22} className="text-white" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Figma: 250px wide, #F8F9FC, logo at top, nav pills 186px wide */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex min-h-screen w-[250px] flex-col bg-[#F8F9FC] px-8 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between pb-[52px] pt-10">
          <Link href={navItems[0].href}>
            <Image src="/logo.png" alt="Tiqra" width={128} height={56} priority className="h-auto w-[128px]" />
          </Link>
          <button
            aria-label="Close menu"
            className="rounded-lg p-1.5 hover:bg-[#E0E7FF] lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} className="text-[#111827]" />
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          {navItems.map((item) => {
            const isActive = item.matchExact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex h-12 items-center gap-2.5 rounded-xl px-4 text-[16px] tracking-[-0.02em] transition-colors",
                  isActive ? "bg-[#4F46E5] text-white" : "text-[#6B7280] hover:bg-[#EEF2FF]"
                )}
              >
                <HugeiconsIcon icon={item.icon} size={22} className="flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

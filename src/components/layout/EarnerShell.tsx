"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import AppHeader from "@/components/layout/AppHeader";

// Answering a survey and setting up the profile are full-screen, without the app chrome.
const FOCUS_ROUTES = [/^\/earner\/surveys\/[^/]+/, /^\/earner\/profile/];

export default function EarnerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  if (FOCUS_ROUTES.some((r) => r.test(pathname))) {
    return <main className="min-h-screen bg-[#FEFEFE]">{children}</main>;
  }
  return (
    <div className="flex min-h-screen bg-[#FEFEFE]">
      <Sidebar />
      <main className="min-h-screen flex-1 pb-24 lg:ml-[250px] lg:pb-16">
        <div className="w-full max-w-[1070px] px-4 pt-4 lg:pl-12 lg:pr-0 lg:pt-9">
          <AppHeader />
          {children}
        </div>
      </main>
    </div>
  );
}

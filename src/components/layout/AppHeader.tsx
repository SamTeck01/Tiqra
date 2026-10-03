"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDataTransferHorizontalIcon, Notification01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { getInitials } from "@/lib/utils";

/** Figma top bar: search pill left, bell + profile right, on a #F8F9FC strip. */
export default function AppHeader() {
  const { user } = useAuthStore();
  const name = user?.name || "Haleemah Abdulazeez";
  const roleLabel = user?.role === "founder" ? "Founder" : "Earner";

  return (
    <header className="flex items-center justify-between gap-4 rounded-2xl bg-[#F8F9FC] px-4 py-3 pl-16 lg:pl-4">
      <label className="flex h-12 w-full max-w-[332px] items-center gap-3 rounded-full bg-white px-4">
        <HugeiconsIcon icon={Search01Icon} size={20} className="flex-shrink-0 text-[#111827]" />
        <input
          type="search"
          placeholder="Search"
          className="w-full bg-transparent text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
        />
      </label>

      <div className="flex flex-shrink-0 items-center gap-4">
        <Link
          href={user?.role === "founder" ? "/earner/dashboard" : "/founder/dashboard"}
          className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] text-[#4F46E5] hover:bg-[#EEF2FF] md:inline-flex"
        >
          <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={16} />
          Switch to {user?.role === "founder" ? "Earner" : "Founder"}
        </Link>
        <button
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] hover:bg-[#EEF2FF]"
        >
          <HugeiconsIcon icon={Notification01Icon} size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5] text-[14px] font-semibold text-white">
            {getInitials(name)}
          </span>
          <div className="hidden sm:block">
            <p className="text-[16px] leading-tight tracking-[-0.02em] text-[#111827]">{name}</p>
            <p className="text-[12px] text-[#6B7280]">{roleLabel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

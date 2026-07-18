"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { getInitials } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Notification01Icon } from "@hugeicons/core-free-icons";

interface TopBarProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function TopBar({ title, subtitle, action }: TopBarProps) {
  const { user } = useAuthStore();
  const [showNotifs, setShowNotifs] = useState(false);

  const NOTIFICATIONS = [
    { id: 1, text: "Your survey 'AI Resume Builder' hit 50% responses", time: "2m ago", read: false },
    { id: 2, text: "New survey available – earn ₦800",                  time: "15m ago", read: false },
    { id: 3, text: "AI Report ready for 'Freelancer Tools'",             time: "1h ago",  read: true },
  ];
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="tiqra-topbar sticky top-0 z-30 mobile-page-header">
      {/* Left: title + subtitle */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <h1 className="text-[20px] lg:text-[28px] font-bold text-[#111827] leading-tight tracking-[-0.03em] truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] lg:text-[15px] text-[#6B7280] hidden sm:block tracking-[-0.01em]">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: search + bell + action + avatar */}
      <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">

        {/* Search — hidden on mobile */}
        <div className="hidden md:flex items-center gap-2.5 bg-[#F8F9FC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 w-[180px] lg:w-[220px] hover:border-[#9F4EF5] transition-colors cursor-pointer">
          <HugeiconsIcon icon={Search01Icon} size={18} className="text-[#6B7280] flex-shrink-0" />
          <span className="text-[15px] text-[#9CA3AF]">Search...</span>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] flex items-center justify-center hover:bg-[#EDE9FE] hover:border-[#9F4EF5] transition-all"
          >
            <HugeiconsIcon icon={Notification01Icon} size={20} className="text-[#6B7280]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#FEFEFE]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotifs && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
              <div className="absolute right-0 top-14 z-50 w-72 lg:w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
                  <h3 className="text-[16px] font-semibold text-[#111827]">Notifications</h3>
                  <button className="text-sm text-[#9F4EF5] hover:underline">Mark all read</button>
                </div>
                <div className="flex flex-col divide-y divide-[#F3F4F6]">
                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className="flex gap-3 px-5 py-4 hover:bg-[#F8F9FC] transition-colors cursor-pointer"
                    >
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-[#9F4EF5] flex-shrink-0 mt-1.5" />
                      )}
                      <div className={!n.read ? "" : "pl-5"}>
                        <p className="text-sm text-[#111827] leading-snug">{n.text}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-[#F3F4F6]">
                  <button className="text-sm text-[#9F4EF5] hover:underline w-full text-center">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action slot (e.g. Fund Wallet / New Idea button) */}
        {action}

        {/* User avatar chip — matches Figma topbar profile pill */}
        <div className="hidden lg:flex items-center gap-2.5 bg-[#F8F9FC] border border-[#E5E7EB] rounded-xl px-3 py-2 cursor-pointer hover:border-[#9F4EF5] transition-colors">
          <div className="w-7 h-7 rounded-lg bg-[#9F4EF5] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[11px] font-semibold leading-none">
              {user ? getInitials(user.name) : "HA"}
            </span>
          </div>
          <span className="text-[14px] font-medium text-[#111827] max-w-[100px] truncate">
            {user?.name?.split(" ")[0] || "Haleemah"}
          </span>
        </div>
      </div>
    </div>
  );
}

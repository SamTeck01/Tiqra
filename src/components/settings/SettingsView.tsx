"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  BubbleChatIcon,
  HelpCircleIcon,
  Logout02Icon,
  Notification01Icon,
  SecurityLockIcon,
  UserIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { primaryBtn } from "@/components/ui/Primitives";
import { cn, getInitials } from "@/lib/utils";

type Role = "founder" | "earner";
type Section = "personal" | "interests" | "wallet" | "notifications" | "security" | "help";

const NOTIFICATIONS: Record<Role, { id: string; label: string }[]> = {
  founder: [
    { id: "live", label: "My survey goes live" },
    { id: "milestones", label: "Response milestones (25%, 50%, 75%, 100%)" },
    { id: "report", label: "Validation report is ready" },
    { id: "balance", label: "Wallet balance is low" },
  ],
  earner: [
    { id: "new", label: "A survey matching my profile goes live" },
    { id: "approved", label: "A response is approved and paid" },
    { id: "withdrawal", label: "Withdrawal updates" },
  ],
};

const FAQ: [string, string][] = [
  ["How does Tiqra price a survey?", "Each answered question pays the respondent ₦30. A 10-question survey costs ₦300 per respondent, plus a 15% platform fee on the free plan."],
  ["When do earners get paid?", "Rewards show as pending once you submit and move to your balance after the response passes the Truth Layer and the survey is approved."],
  ["What is the minimum withdrawal?", "You can withdraw from ₦100 to any verified Nigerian bank account."],
];

const field = "h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-[14px] text-[#111827] focus:border-[#4F46E5] focus:outline-none";

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between gap-4 py-2 text-[14px] text-[#111827]">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={cn("relative h-6 w-11 flex-shrink-0 rounded-full transition-colors", on ? "bg-[#4F46E5]" : "bg-[#E5E7EB]")}
      >
        <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white transition-all", on ? "left-6" : "left-1")} />
      </button>
    </label>
  );
}

function PersonalPanel() {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.name ?? "");
  const [saved, setSaved] = useState(false);
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await updateProfile({ name: name.trim() });
        setSaved(true);
      }}
    >
      <label className="flex flex-col gap-1 text-[14px] text-[#111827]">
        Full name
        <input value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} className={field} />
      </label>
      <label className="flex flex-col gap-1 text-[14px] text-[#111827]">
        Email
        <input value={user?.email ?? ""} disabled className={cn(field, "bg-[#F8F9FC] text-[#6B7280]")} />
      </label>
      <div className="flex items-center gap-3">
        <button disabled={!name.trim()} className={cn(primaryBtn, "h-11")}>Save changes</button>
        {saved && <span className="text-[14px] text-[#16A34A]">Saved</span>}
      </div>
    </form>
  );
}

function SecurityPanel() {
  const { changePassword } = useAuthStore();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await changePassword(current, next);
          setStatus({ ok: true, text: "Password updated" });
          setCurrent("");
          setNext("");
        } catch (err) {
          setStatus({ ok: false, text: err instanceof Error ? err.message : "Could not update password" });
        }
      }}
    >
      <label className="flex flex-col gap-1 text-[14px] text-[#111827]">
        Current password
        <input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={field} />
      </label>
      <label className="flex flex-col gap-1 text-[14px] text-[#111827]">
        New password
        <input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="At least 8 characters" className={field} />
      </label>
      <div className="flex items-center gap-3">
        <button disabled={!current || next.length < 8} className={cn(primaryBtn, "h-11")}>Update password</button>
        {status && <span className={cn("text-[14px]", status.ok ? "text-[#16A34A]" : "text-[#DC2626]")}>{status.text}</span>}
      </div>
    </form>
  );
}

export default function SettingsView({ role }: { role: Role }) {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState<Section | null>(null);
  const [notifs, setNotifs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATIONS[role].map((n) => [n.id, true]))
  );

  const name = user?.name ?? "";
  const complete = role === "founder" || user?.demographics ? 100 : 33;

  const rows: { key: Section; title: string; subtitle: string; icon: typeof UserIcon; body: React.ReactNode }[] = [
    { key: "personal", title: "Personal information", subtitle: "Update your personal details", icon: UserIcon, body: <PersonalPanel /> },
    ...(role === "earner"
      ? [{
          key: "interests" as const,
          title: "Interest & survey preferences",
          subtitle: "Manage your interest and survey settings",
          icon: BubbleChatIcon,
          body: (
            <div className="text-[14px] text-[#6B7280]">
              <p>Your interests: <b className="font-medium text-[#111827]">{user?.demographics?.interests.join(", ") || "Not set yet"}</b></p>
              <Link href="/earner/profile" className={cn(primaryBtn, "mt-3 h-11")}>Update interests</Link>
            </div>
          ),
        }]
      : []),
    {
      key: "wallet",
      title: role === "earner" ? "Wallet & payouts" : "Wallet & payments",
      subtitle: role === "earner" ? "Manage your balance and withdrawals" : "Manage your balance, cards and withdrawals",
      icon: Wallet01Icon,
      body: (
        <div className="flex flex-wrap gap-2">
          <Link href={`/${role}/wallet`} className={cn(primaryBtn, "h-11")}>Open wallet</Link>
          <Link href={`/${role}/wallet/payment-methods`} className="inline-flex h-11 items-center rounded-xl border border-[#E5E7EB] px-5 text-[14px] text-[#111827] hover:bg-[#F8F9FC]">
            Bank accounts
          </Link>
        </div>
      ),
    },
    {
      key: "notifications",
      title: "Notifications",
      subtitle: "Manage how you stay updated",
      icon: Notification01Icon,
      body: (
        <div>
          {NOTIFICATIONS[role].map((n) => (
            <Toggle key={n.id} label={n.label} on={notifs[n.id]} onChange={(v) => setNotifs({ ...notifs, [n.id]: v })} />
          ))}
        </div>
      ),
    },
    { key: "security", title: "Security & privacy", subtitle: "Keep your account and data safe", icon: SecurityLockIcon, body: <SecurityPanel /> },
    {
      key: "help",
      title: "Help & Support",
      subtitle: "Get help and find answers",
      icon: HelpCircleIcon,
      body: (
        <div className="flex flex-col gap-3">
          {FAQ.map(([q, a]) => (
            <div key={q}>
              <p className="text-[14px] font-medium text-[#111827]">{q}</p>
              <p className="text-[14px] text-[#6B7280]">{a}</p>
            </div>
          ))}
          <a href="mailto:support@tiqra.com" className="text-[14px] text-[#4F46E5]">Contact support@tiqra.com</a>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 pt-8">
      <div>
        <h1 className="text-[28px] font-medium tracking-[-0.03em] text-[#111827] lg:text-[32px]">Settings</h1>
        <p className="mt-1 text-[16px] text-[#6B7280]">Manage your profile and preferences.</p>
      </div>

      <div className="flex max-w-[825px] items-center gap-4 rounded-[20px] bg-[#4F46E5] px-5 py-4 text-white">
        <span className="flex h-[74px] w-[74px] flex-shrink-0 items-center justify-center rounded-full bg-white text-[24px] font-semibold text-[#4F46E5]">
          {getInitials(name || "?")}
        </span>
        <div className="flex-1">
          <p className="text-[22px] font-medium tracking-[-0.02em] sm:text-[28px]">{name}</p>
          <p className="text-[15px] capitalize text-[#E0E7FF]">{role}</p>
        </div>
        <div className="text-center">
          <p className="text-[28px] font-semibold">{complete}%</p>
          <p className="text-[14px] text-[#E0E7FF]">Profile Complete</p>
        </div>
      </div>

      <section className="rounded-[24px] bg-[#F8F9FC] p-3">
        <p className="px-1 py-3 text-[16px] uppercase text-[#6B7280]">Account</p>
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <div key={r.key} className="rounded-2xl bg-white">
              <button
                onClick={() => setOpen(open === r.key ? null : r.key)}
                aria-expanded={open === r.key}
                className="flex w-full items-center gap-4 px-3 py-3 text-left"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E0E7FF] text-[#4F46E5]">
                  <HugeiconsIcon icon={r.icon} size={20} />
                </span>
                <span className="flex-1">
                  <span className="block text-[16px] text-[#111827]">{r.title}</span>
                  <span className="block text-[12px] text-[#6B7280]">{r.subtitle}</span>
                </span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} className={cn("text-[#111827] transition-transform", open === r.key && "rotate-90")} />
              </button>
              {open === r.key && <div className="border-t border-[#F3F4F6] px-4 py-4 sm:pl-[64px]">{r.body}</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] bg-[#F8F9FC] p-3">
        <p className="px-1 py-3 text-[16px] uppercase text-[#6B7280]">Account actions</p>
        <button onClick={logout} className="flex w-full items-center gap-4 rounded-2xl bg-white px-3 py-3 text-left text-[16px] text-[#DC2626]">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FEE2E2]">
            <HugeiconsIcon icon={Logout02Icon} size={20} />
          </span>
          Sign Out
        </button>
      </section>
    </div>
  );
}

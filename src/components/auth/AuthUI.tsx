"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { primaryBtn } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

/** Form on the left, photo panel on the right (hidden on small screens). */
export function AuthSplit({ audience, children }: { audience: "founder" | "earner"; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FEFEFE]">
      <div className="flex flex-1 items-start justify-center px-4 py-10 lg:items-center">
        <div className="w-full max-w-[370px]">{children}</div>
      </div>
      <div className="hidden w-[50%] max-w-[700px] items-center py-10 pr-4 lg:flex">
        <Image
          src={audience === "earner" ? "/auth-earner.jpg" : "/auth-founder.jpg"}
          alt={audience === "earner" ? "For earners: answer surveys and earn money" : "For founders: validate ideas with real feedback"}
          width={694}
          height={939}
          priority
          className="h-auto max-h-[92vh] w-full object-contain"
        />
      </div>
    </div>
  );
}

const inputBase =
  "h-12 w-full rounded-xl bg-[#F8F9FC] pl-11 pr-11 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30";

export function AuthField({
  label,
  icon,
  type = "text",
  ...props
}: { label: string; icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[14px] text-[#111827]">{label}</span>
      <span className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">{icon}</span>
        <input type={isPassword && show ? "text" : type} className={inputBase} {...props} />
        {isPassword && (
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#111827]"
          >
            <HugeiconsIcon icon={show ? ViewIcon : ViewOffSlashIcon} size={20} />
          </button>
        )}
      </span>
    </label>
  );
}

export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-4 text-[14px] text-[#111827]">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#E5E7EB]" />
      OR
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#E5E7EB]" />
    </div>
  );
}

export function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto flex h-12 w-full max-w-[240px] items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] text-[14px] text-[#111827] hover:bg-[#F8F9FC]"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
      Continue with Google
    </button>
  );
}

/** Full-screen purple confirmation used after sign up and log in. */
export function AuthSuccess({ title, message, href }: { title: string; message: React.ReactNode; href: string }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#6366F1] px-4">
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" viewBox="0 0 900 640" preserveAspectRatio="none" aria-hidden>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M-50 ${60 + i * 110} C 200 ${-40 + i * 110}, 420 ${200 + i * 110}, 950 ${20 + i * 110}`} stroke="#4F46E5" strokeWidth="46" fill="none" />
        ))}
      </svg>
      <div className="relative w-full max-w-[375px] rounded-xl bg-white px-6 py-8 text-center">
        <span className="mx-auto flex h-[75px] w-[75px] items-center justify-center rounded-full bg-[#16A34A]">
          <HugeiconsIcon icon={Tick02Icon} size={38} className="text-white" />
        </span>
        <h1 className="mt-4 text-[22px] font-semibold tracking-[-0.02em] text-[#111827]">{title}</h1>
        <p className="mt-2 text-[13px] text-[#6B7280]">{message}</p>
        <Link href={href} className={cn(primaryBtn, "mt-10 h-[35px] w-full text-[12px]")}>Proceed to Dashboard</Link>
      </div>
    </div>
  );
}

export function AuthTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-[#111827]">{title}</h1>
      <p className="mt-1 text-[13px] text-[#6B7280]">{subtitle}</p>
    </div>
  );
}

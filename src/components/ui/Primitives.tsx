import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export function BackLink({ href, label = "Back to ideas", onClick }: { href?: string; label?: string; onClick?: () => void }) {
  const cls = "inline-flex items-center gap-2 text-[16px] tracking-[-0.02em] text-[#6B7280] hover:text-[#111827]";
  const body = (
    <>
      <HugeiconsIcon icon={ArrowLeft02Icon} size={22} />
      {label}
    </>
  );
  return href ? (
    <Link href={href} className={cls}>{body}</Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>{body}</button>
  );
}

/** The three segmented bars at the top of the new idea flow. */
export function FlowProgress({ step, total = 3 }: { step: number; total?: number }) {
  return (
    <div className="mt-5 flex gap-2">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cn("h-1 flex-1 rounded-full", i < step ? "bg-[#4F46E5]" : "bg-[#F3F4F6]")} />
      ))}
    </div>
  );
}

export function PageTitle({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={className}>
      <h1 className="text-[28px] font-medium leading-tight tracking-[-0.03em] text-[#111827] lg:text-[32px]">{title}</h1>
      {subtitle && <p className="mt-1 text-[16px] tracking-[-0.02em] text-[#6B7280]">{subtitle}</p>}
    </div>
  );
}

export const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-6 text-[16px] tracking-[-0.02em] text-white transition-colors hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-50";
export const outlineBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#4F46E5] bg-white px-6 text-[16px] tracking-[-0.02em] text-[#4F46E5] transition-colors hover:bg-[#EEF2FF]";
export const ghostBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F8F9FC] px-6 text-[16px] tracking-[-0.02em] text-[#111827] transition-colors hover:bg-[#F3F4F6]";

/** Circular score ring (confidence / feasibility). */
export function Ring({
  value,
  size = 160,
  stroke = 14,
  color = "#4F46E5",
  track = "#EEF2FF",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(100, Math.max(0, value)) / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

export function Bar({ value, color = "#4F46E5", track = "#E0E7FF", className }: { value: number; color?: string; track?: string; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full", className)} style={{ background: track }}>
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }} />
    </div>
  );
}

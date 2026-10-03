import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Cancel01Icon, Shield01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { ghostBtn, primaryBtn } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

type Action = { label: string; href?: string; onClick?: () => void };

function ActionButton({ action, primary }: { action: Action; primary?: boolean }) {
  const cls = cn(primary ? primaryBtn : ghostBtn, "h-[47px] w-full", !primary && "mt-2");
  const body = (
    <>
      {action.label} {primary && <HugeiconsIcon icon={ArrowRight02Icon} size={20} />}
    </>
  );
  return action.href ? <Link href={action.href} className={cls}>{body}</Link> : <button onClick={action.onClick} className={cls}>{body}</button>;
}

/** Success / failure screen used after payments and withdrawals. */
export default function ResultScreen({
  ok,
  title,
  subtitle,
  rows,
  note,
  children,
  primary,
  secondary,
}: {
  ok: boolean;
  title: string;
  subtitle: string;
  rows?: [string, string][];
  note?: string;
  children?: React.ReactNode;
  primary: Action;
  secondary?: Action;
}) {
  return (
    <div className="mx-auto flex max-w-[473px] flex-col items-center py-14 text-center">
      <span className="flex h-[124px] w-[124px] items-center justify-center rounded-full" style={{ background: ok ? "#E8F8EE" : "#FEE2E2" }}>
        <span className="flex h-[84px] w-[84px] items-center justify-center rounded-full" style={{ background: ok ? "#16A34A" : "#DC2626" }}>
          <HugeiconsIcon icon={ok ? Tick02Icon : Cancel01Icon} size={40} className="text-white" />
        </span>
      </span>
      <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.03em] text-[#111827]">{title}</h1>
      <p className="mt-2 text-[16px] text-[#6B7280]">{subtitle}</p>

      {rows && (
        <div className="mt-6 w-full rounded-[24px] px-5 py-3" style={{ background: ok ? "#F8F9FC" : "#FEF2F2" }}>
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-3">
              <span className="text-[14px] text-[#6B7280]">{k}</span>
              <span className="text-right text-[16px] text-[#111827]">{v}</span>
            </div>
          ))}
        </div>
      )}
      {children}
      {note && (
        <p
          className="mt-5 flex w-full items-center gap-3 rounded-xl px-5 py-3 text-left text-[14px]"
          style={{ background: ok ? "#E8F8EE" : "#FEF2F2", color: ok ? "#16A34A" : "#DC2626" }}
        >
          <HugeiconsIcon icon={Shield01Icon} size={20} className="flex-shrink-0" /> {note}
        </p>
      )}
      <div className="mt-6 w-full">
        <ActionButton action={primary} primary />
        {secondary && <ActionButton action={secondary} />}
      </div>
    </div>
  );
}

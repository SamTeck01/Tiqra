"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { formatNairaFull } from "@/lib/utils";

/** Available balance with a show/hide toggle. "solid" is the earner style, "soft" the founder style. */
export default function BalanceCard({ balance, variant, children }: { balance: number; variant: "soft" | "solid"; children?: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const solid = variant === "solid";
  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-[24px] px-5 py-6"
      style={{ background: solid ? "#4F46E5" : "#E0E7FF" }}
    >
      {solid && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-10" viewBox="0 0 360 130" preserveAspectRatio="none" aria-hidden>
          <path d="M-10 40 C80 0 160 90 370 20" stroke="white" strokeWidth="22" fill="none" />
          <path d="M-10 110 C90 60 180 150 370 80" stroke="white" strokeWidth="14" fill="none" />
        </svg>
      )}
      <p className="relative flex items-center gap-2 text-[15px]" style={{ color: solid ? "#E0E7FF" : "#6B7280" }}>
        <HugeiconsIcon icon={Wallet01Icon} size={16} /> Available Balance
      </p>
      <div className="relative mt-2 flex items-center gap-3">
        <p className="text-[34px] font-semibold tracking-[-0.03em]" style={{ color: solid ? "white" : "#111827" }}>
          {hidden ? "₦ • • • • • •" : formatNairaFull(balance)}
        </p>
        <button aria-label={hidden ? "Show balance" : "Hide balance"} onClick={() => setHidden(!hidden)} style={{ color: solid ? "white" : "#111827" }}>
          <HugeiconsIcon icon={hidden ? ViewIcon : ViewOffSlashIcon} size={20} />
        </button>
      </div>
      {children && <div className="relative mt-6 grid w-full grid-cols-2 gap-2">{children}</div>}
    </div>
  );
}

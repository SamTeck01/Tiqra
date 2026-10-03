"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download04Icon } from "@hugeicons/core-free-icons";
import { BackLink } from "@/components/ui/Primitives";

export default function ReportHeader({ switchHref, switchLabel }: { switchHref: string; switchLabel: string }) {
  return (
    <div className="flex items-center justify-between gap-3 print:hidden">
      <BackLink href="/founder/ideas" />
      <div className="flex items-center gap-2">
        <Link href={switchHref} className="hidden h-12 items-center rounded-lg px-4 text-[14px] text-[#4F46E5] hover:bg-[#EEF2FF] sm:inline-flex">
          {switchLabel}
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex h-12 items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 text-[14px] text-[#111827] hover:bg-[#F8F9FC]"
        >
          Export PDF <HugeiconsIcon icon={Download04Icon} size={20} />
        </button>
      </div>
    </div>
  );
}

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown02Icon, ArrowUp02Icon, ChartIncreaseIcon, Coins01Icon } from "@hugeicons/core-free-icons";
import { Transaction } from "@/lib/types";
import { formatDateTime, formatNairaFull } from "@/lib/utils";

function describe(tx: Transaction) {
  if (tx.type === "escrow" || tx.type === "debit") {
    return { title: "Validation Payment", detail: `Paid for validation: ${tx.description}`, credit: false, icon: ChartIncreaseIcon, color: "#F59E0B", bg: "#FEF3E2" };
  }
  if (tx.type === "withdrawal") {
    return { title: "Withdrawal", detail: tx.description, credit: false, icon: ArrowDown02Icon, color: "#DC2626", bg: "#FEE2E2" };
  }
  if (tx.description.startsWith("Reward")) {
    return { title: "Survey Reward", detail: tx.description, credit: true, icon: Coins01Icon, color: "#16A34A", bg: "#DCFCE7" };
  }
  return { title: "Add Funds", detail: tx.description, credit: true, icon: ArrowUp02Icon, color: "#4F46E5", bg: "#EEF2FF" };
}

/** One wallet movement: funding, validation payment, survey reward or withdrawal. */
export default function TransactionRow({ tx }: { tx: Transaction }) {
  const d = describe(tx);
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl bg-white px-4 py-4 sm:grid-cols-[auto_1.3fr_1fr_auto]">
      <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full" style={{ background: d.bg }}>
        <HugeiconsIcon icon={d.icon} size={24} color={d.color} />
      </span>
      <div className="min-w-0">
        <p className="text-[18px] tracking-[-0.02em] text-[#111827]">{d.title}</p>
        <p className="truncate text-[14px] text-[#6B7280]">{d.detail}</p>
      </div>
      <p className="hidden text-[16px] text-[#6B7280] sm:block">{formatDateTime(tx.createdAt)}</p>
      <div className="text-right">
        <p className="text-[18px]" style={{ color: d.credit ? "#16A34A" : "#DC2626" }}>
          {d.credit ? "+" : "-"}
          {formatNairaFull(tx.amount)}
        </p>
        {tx.balanceAfter !== undefined && (
          <p className="text-[14px] text-[#6B7280]">Balance: {formatNairaFull(tx.balanceAfter)}</p>
        )}
      </div>
    </div>
  );
}

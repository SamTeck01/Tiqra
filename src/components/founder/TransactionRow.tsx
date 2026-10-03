import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp02Icon, ChartIncreaseIcon } from "@hugeicons/core-free-icons";
import { Transaction } from "@/lib/types";
import { formatDateTime, formatNairaFull } from "@/lib/utils";

/** Wallet movement row: "Add Funds" (credit) or "Validation Payment" (escrow/debit). */
export default function TransactionRow({ tx }: { tx: Transaction }) {
  const isCredit = tx.type === "credit";
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl bg-white px-4 py-4 sm:grid-cols-[auto_1.3fr_1fr_auto]">
      <span
        className="flex h-[60px] w-[60px] items-center justify-center rounded-full"
        style={{ background: isCredit ? "#EEF2FF" : "#FEF3E2" }}
      >
        <HugeiconsIcon icon={isCredit ? ArrowUp02Icon : ChartIncreaseIcon} size={24} color={isCredit ? "#4F46E5" : "#F59E0B"} />
      </span>
      <div className="min-w-0">
        <p className="text-[18px] tracking-[-0.02em] text-[#111827]">{isCredit ? "Add Funds" : "Validation Payment"}</p>
        <p className="truncate text-[14px] text-[#6B7280]">
          {isCredit ? tx.description : `Paid for validation: ${tx.description}`}
        </p>
      </div>
      <p className="hidden text-[16px] text-[#6B7280] sm:block">{formatDateTime(tx.createdAt)}</p>
      <div className="text-right">
        <p className="text-[18px]" style={{ color: isCredit ? "#16A34A" : "#DC2626" }}>
          {isCredit ? "+" : "-"}
          {formatNairaFull(tx.amount)}
        </p>
        {tx.balanceAfter !== undefined && (
          <p className="text-[14px] text-[#6B7280]">Balance: {formatNairaFull(tx.balanceAfter)}</p>
        )}
      </div>
    </div>
  );
}

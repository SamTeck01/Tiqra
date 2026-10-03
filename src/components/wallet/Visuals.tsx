import { cn } from "@/lib/utils";

export const BANKS: { name: string; color: string; text?: string }[] = [
  { name: "GTBank", color: "#E05206" },
  { name: "Opay", color: "#1DCF9F" },
  { name: "Access Bank", color: "#F7931E" },
  { name: "UBA", color: "#D42E12" },
  { name: "FCMB", color: "#5C2D91" },
  { name: "First Bank", color: "#0E3B6F" },
  { name: "Kuda", color: "#40196D" },
  { name: "Zenith Bank", color: "#E30613" },
  { name: "Moniepoint", color: "#0357EE" },
];

export function BankLogo({ name, size = 44 }: { name: string; size?: number }) {
  const bank = BANKS.find((b) => b.name === name);
  const label = name === "GTBank" ? "GTBank" : name.split(" ")[0].slice(0, 5);
  return (
    <span
      className="flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, background: bank?.color ?? "#6B7280", fontSize: size / 4.4 }}
    >
      {label}
    </span>
  );
}

export function CardBrand({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex h-6 w-9 flex-shrink-0", className)} aria-label="Card">
      <span className="absolute left-0 top-0 h-6 w-6 rounded-full bg-[#EB001B]" />
      <span className="absolute left-3 top-0 h-6 w-6 rounded-full bg-[#F79E1B] mix-blend-multiply" />
    </span>
  );
}

export function SummaryCard({ title, rows, footer }: { title: string; rows: [string, string][]; footer?: React.ReactNode }) {
  return (
    <div className="rounded-[24px] bg-[#F8F9FC]">
      <p className="border-b border-[#E5E7EB] px-4 py-4 text-[20px] font-medium tracking-[-0.02em] text-[#111827]">{title}</p>
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between gap-4 px-4 py-3">
          <span className="text-[15px] text-[#6B7280]">{k}</span>
          <span className="text-right text-[18px] tracking-[-0.02em] text-[#111827]">{v}</span>
        </div>
      ))}
      {footer}
    </div>
  );
}

export function AmountChips({ amounts, value, onPick }: { amounts: number[]; value: number; onPick: (n: number) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {amounts.map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => onPick(a)}
          className={cn(
            "h-[50px] rounded-xl border text-[16px] text-[#111827] transition-colors",
            value === a ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]" : "border-[#E5E7EB] hover:bg-[#F8F9FC]"
          )}
        >
          ₦{a.toLocaleString()}
        </button>
      ))}
    </div>
  );
}

"use client";

import { CardBrand } from "./Visuals";

export interface CardInput {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

export const EMPTY_CARD: CardInput = { number: "", expiry: "", cvv: "", name: "" };

function luhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

export function cardError(c: CardInput): string | null {
  const digits = c.number.replace(/\D/g, "");
  if (digits.length < 15 || !luhn(digits)) return "Enter a valid card number";
  const [mm, yy] = c.expiry.split("/").map(Number);
  const now = new Date();
  const expired = !mm || mm > 12 || !yy || 2000 + yy < now.getFullYear() || (2000 + yy === now.getFullYear() && mm < now.getMonth() + 1);
  if (expired) return "Enter a valid expiry date";
  if (!/^\d{3,4}$/.test(c.cvv)) return "Enter the 3-digit CVV";
  if (!c.name.trim()) return "Enter the name on the card";
  return null;
}

const field = "h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#4F46E5] focus:outline-none";

/** Card entry. Only the last four digits and expiry are ever saved; the full number and CVV go to the payment processor. */
export default function CardForm({ value, onChange }: { value: CardInput; onChange: (c: CardInput) => void }) {
  const set = (k: keyof CardInput, v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-[14px] text-[#111827]">Card number</span>
        <span className="relative">
          <input
            inputMode="numeric"
            autoComplete="cc-number"
            value={value.number}
            onChange={(e) => set("number", e.target.value.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 "))}
            placeholder="0000 0000 0000 0000"
            className={field}
          />
          <CardBrand className="absolute right-3 top-1/2 -translate-y-1/2" />
        </span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] text-[#111827]">Expiry date</span>
          <input
            inputMode="numeric"
            autoComplete="cc-exp"
            value={value.expiry}
            onChange={(e) => {
              const d = e.target.value.replace(/\D/g, "").slice(0, 4);
              set("expiry", d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
            }}
            placeholder="MM/YY"
            className={field}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[14px] text-[#111827]">CVV</span>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            value={value.cvv}
            onChange={(e) => set("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="•••"
            className={field}
          />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-[14px] text-[#111827]">Name on card</span>
        <input autoComplete="cc-name" value={value.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g John Doe" className={field} />
      </label>
    </div>
  );
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNairaShort(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function calculateSurveyCost(
  respondents: number,
  payoutPerResponse: number,
  platformFeePercent: number = 0.15
): { respondentPayout: number; platformFee: number; total: number } {
  const respondentPayout = respondents * payoutPerResponse;
  const platformFee = respondentPayout * platformFeePercent;
  const total = respondentPayout + platformFee;
  return { respondentPayout, platformFee, total };
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

import { Verdict } from "./types";

// Verdict labels and colours as designed in Figma.
export const VERDICTS: Record<
  Verdict,
  { short: string; headline: string; level: string; color: string; soft: string; tint: string }
> = {
  go: { short: "Go", headline: "Go Build It", level: "HIGH", color: "#16A34A", soft: "#DCFCE7", tint: "#E8F8EE" },
  pivot: { short: "Pivot", headline: "Reshape", level: "Low", color: "#F59E0B", soft: "#FEF3C7", tint: "#FDF0DC" },
  kill: { short: "Kill", headline: "Move On", level: "Low", color: "#DC2626", soft: "#FEE2E2", tint: "#FDDCDC" },
};

export type Strength = "Strong" | "Moderate" | "Weak";

export function strengthOf(score: number): Strength {
  if (score >= 65) return "Strong";
  if (score >= 45) return "Moderate";
  return "Weak";
}

export const STRENGTH_COLOR: Record<Strength, { color: string; soft: string }> = {
  Strong: { color: "#16A34A", soft: "#DCFCE7" },
  Moderate: { color: "#F59E0B", soft: "#FEF3C7" },
  Weak: { color: "#DC2626", soft: "#FEE2E2" },
};

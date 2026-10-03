"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

/** Centered dialog over a blurred backdrop, as used throughout the Figma flows. */
export default function Modal({
  open,
  onClose,
  className,
  children,
}: {
  open: boolean;
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#D9D9D9]/60 p-4 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn("max-h-[90vh] w-full overflow-y-auto rounded-[32px] bg-white", className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/** "Understanding your idea" / "Processing your payment" style loader dialog. */
export function LoadingModal({ open, title, subtitle }: { open: boolean; title: string; subtitle: string }) {
  return (
    <Modal open={open} className="max-w-[416px] rounded-[24px] px-8 py-6 text-center">
      <div className="mx-auto h-[66px] w-[66px] animate-spin rounded-full border-[7px] border-[#E0E7FF] border-t-[#4F46E5]" />
      <p className="mt-5 text-[18px] tracking-[-0.02em] text-[#111827]">{title}</p>
      <p className="mt-1 text-[14px] text-[#6B7280]">{subtitle}</p>
    </Modal>
  );
}

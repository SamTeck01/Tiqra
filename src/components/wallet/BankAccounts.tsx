"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, CheckmarkCircle02Icon, Delete02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { useWalletStore } from "@/store/wallet.store";
import { BANKS, BankLogo } from "./Visuals";
import Modal from "@/components/ui/Modal";
import { BackLink, PageTitle, ghostBtn, primaryBtn } from "@/components/ui/Primitives";
import { PaymentMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Saved bank accounts: set the default, remove one, or add another. */
export function BankAccountList({ basePath }: { basePath: string }) {
  const { user } = useAuthStore();
  const { methods, fetchMethods, setDefaultMethod, removeMethod } = useWalletStore();
  const [removing, setRemoving] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    if (user?.$id) fetchMethods(user.$id);
  }, [user?.$id, fetchMethods]);

  const banks = methods.filter((m) => m.kind === "bank");

  return (
    <div className="flex max-w-[640px] flex-col pt-10 sm:px-4">
      <BackLink href={basePath} label="Back to wallet" />
      <div className="mt-8 flex items-start justify-between gap-4">
        <PageTitle title="Payment methods" subtitle={`${banks.length} account${banks.length === 1 ? "" : "s"} saved`} />
        <Link href={`${basePath}/payment-methods/add`} className={cn(primaryBtn, "h-12 px-10")}>Add new account</Link>
      </div>

      <div className="mt-6 flex flex-col gap-2 rounded-[24px] bg-[#F8F9FC] p-3">
        {banks.length === 0 && <p className="py-10 text-center text-[14px] text-[#6B7280]">No bank accounts yet.</p>}
        {banks.map((b) => (
          <div key={b.$id} className="rounded-2xl bg-white p-3">
            <div className="flex items-start gap-4">
              <BankLogo name={b.provider} size={40} />
              <div>
                <p className="flex items-center gap-2 text-[16px] text-[#111827]">
                  {b.provider}
                  {b.isDefault && <span className="rounded-full bg-[#E0E7FF] px-2 text-[11px] text-[#4F46E5]">Default</span>}
                </p>
                <p className="text-[13px] text-[#6B7280]">*** *** {b.last4}</p>
                <p className="text-[13px] text-[#111827]">{b.holderName}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                disabled={b.isDefault}
                onClick={() => user && setDefaultMethod(user.$id, b.$id)}
                className={cn(
                  "flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-[14px]",
                  b.isDefault ? "bg-[#E0E7FF] text-[#4F46E5]" : "bg-[#F8F9FC] text-[#111827] hover:bg-[#F3F4F6]"
                )}
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /> {b.isDefault ? "Default Account" : "Set as default"}
              </button>
              <button aria-label={`Remove ${b.provider} account`} onClick={() => setRemoving(b)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#111827] hover:bg-[#FEF2F2]">
                <HugeiconsIcon icon={Delete02Icon} size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!removing} onClose={() => setRemoving(null)} className="max-w-[460px] px-6 py-8 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF3E2]">
          <HugeiconsIcon icon={Alert02Icon} size={22} color="#F59E0B" />
        </span>
        <p className="mt-4 text-[20px] text-[#111827]">Remove this account?</p>
        <p className="mt-1 text-[13px] text-[#6B7280]">
          {removing?.provider} •••• {removing?.last4} will be removed from your payment methods.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={() => setRemoving(null)} className={cn(ghostBtn, "h-11")}>Cancel</button>
          <button
            onClick={() => user && removing && removeMethod(user.$id, removing.$id).then(() => setRemoving(null))}
            className={cn(primaryBtn, "h-11 bg-[#DC2626] hover:bg-[#B91C1C]")}
          >
            Remove
          </button>
        </div>
      </Modal>
    </div>
  );
}

/** Add a bank account: account number + bank, verify the account name, then save. */
export function AddBankAccount({ basePath }: { basePath: string }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addMethod } = useWalletStore();
  const [number, setNumber] = useState("");
  const [bank, setBank] = useState("");
  const [search, setSearch] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<{ name: string; at: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const verify = async () => {
    setVerifying(true);
    // Account name lookup (Paystack "resolve account number" in production).
    await new Promise((r) => setTimeout(r, 1500));
    setVerified({ name: user?.name ?? "Account holder", at: new Date().toISOString() });
    setVerifying(false);
  };

  const save = async () => {
    if (!user || !verified) return;
    setSaving(true);
    await addMethod({ userId: user.$id, kind: "bank", provider: bank, last4: number.slice(-4), holderName: verified.name });
    router.push(`${basePath}/payment-methods`);
  };

  const banks = BANKS.filter((b) => b.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div className="flex max-w-[640px] flex-col pt-10 sm:px-4">
      <BackLink href={`${basePath}/payment-methods`} label="Back" />
      <PageTitle className="mt-8" title="Add payment method" subtitle="Withdrawals go directly to your bank account." />

      {verified ? (
        <>
          <p className="mt-6 flex items-center gap-2 rounded-xl bg-[#E8F8EE] px-5 py-3 text-[14px] text-[#16A34A]">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} /> Account verified successfully
          </p>
          <p className="mt-6 text-[14px] uppercase text-[#6B7280]">Account details</p>
          <div className="mt-2 flex items-center gap-3">
            <BankLogo name={bank} />
            <div>
              <p className="text-[16px] text-[#111827]">{verified.name}</p>
              <p className="text-[13px] text-[#6B7280]">{bank}</p>
            </div>
          </div>
          <div className="mt-4 rounded-[24px] bg-[#F8F9FC] px-6 py-3">
            {[
              ["Bank", bank],
              ["Account number", number],
              ["Account name", verified.name],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 text-[14px]">
                <span className="text-[#6B7280]">{k}</span>
                <span className="text-[#111827]">{v}</span>
              </div>
            ))}
          </div>
          <button disabled={saving} onClick={save} className={cn(primaryBtn, "mx-auto mt-5 h-12 w-full max-w-[400px]")}>Add this account</button>
          <button onClick={() => { setVerified(null); setNumber(""); setBank(""); }} className={cn(ghostBtn, "mx-auto mt-2 h-12 w-full max-w-[400px] border-0")}>
            Use a different account
          </button>
        </>
      ) : (
        <>
          <label className="mt-6 flex flex-col gap-2">
            <span className="text-[14px] text-[#111827]">Account number</span>
            <span className="relative">
              <input
                inputMode="numeric"
                value={number}
                onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="000 000 0000"
                className="h-12 w-full rounded-xl bg-[#F8F9FC] px-3 text-[14px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#6B7280]">({number.length}/10)</span>
            </span>
          </label>
          <p className="mt-5 text-[14px] text-[#111827]">Select bank</p>
          <label className="mt-2 flex h-11 items-center gap-2 rounded-xl bg-[#F8F9FC] px-3">
            <HugeiconsIcon icon={Search01Icon} size={18} className="text-[#6B7280]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your bank" className="w-full bg-transparent text-[14px] focus:outline-none" />
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2 rounded-2xl bg-[#F8F9FC] p-2">
            {banks.map((b) => (
              <button
                key={b.name}
                onClick={() => setBank(b.name)}
                className={cn("flex flex-col items-center gap-2 rounded-xl bg-white py-3 text-[13px] text-[#111827]", bank === b.name && "ring-2 ring-[#4F46E5]")}
              >
                <BankLogo name={b.name} size={32} />
                {b.name}
              </button>
            ))}
          </div>
          <button
            disabled={number.length !== 10 || !bank || verifying}
            onClick={verify}
            className={cn(primaryBtn, "mx-auto mt-5 h-12 w-full max-w-[400px]")}
          >
            Verify Account
          </button>
        </>
      )}

      <Modal open={verifying} className="max-w-[380px] px-6 py-8 text-center">
        <span className="mx-auto flex h-[90px] w-[90px] items-center justify-center rounded-2xl bg-[#4F46E5]">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
        </span>
        <p className="mt-5 text-[18px] text-[#111827]">Verifying account</p>
        <p className="mt-1 text-[13px] text-[#6B7280]">Checking {bank} •••• {number.slice(-4)}</p>
      </Modal>
    </div>
  );
}

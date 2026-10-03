"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { MIN_WITHDRAWAL, useWalletStore } from "@/store/wallet.store";
import { AmountChips, BankLogo, SummaryCard } from "./Visuals";
import ResultScreen from "./ResultScreen";
import { LoadingModal } from "@/components/ui/Modal";
import { BackLink, PageTitle, ghostBtn, primaryBtn } from "@/components/ui/Primitives";
import { Transaction } from "@/lib/types";
import { cn, formatNairaShort } from "@/lib/utils";

function when(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}

/** Withdraw wallet balance to a saved bank account. basePath is the role's wallet route. */
export default function WithdrawFlow({ basePath }: { basePath: string }) {
  const { user } = useAuthStore();
  const { wallet, methods, fetchWallet, fetchMethods, withdraw } = useWalletStore();
  const [step, setStep] = useState(1);
  const [amountInput, setAmountInput] = useState("");
  const [accountId, setAccountId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState<Transaction | null>(null);
  const [failure, setFailure] = useState<{ reason: string; at: string } | null>(null);

  useEffect(() => {
    if (!user?.$id) return;
    fetchWallet(user.$id);
    fetchMethods(user.$id);
  }, [user?.$id, fetchWallet, fetchMethods]);

  const banks = methods.filter((m) => m.kind === "bank");
  useEffect(() => {
    if (!accountId && banks.length) setAccountId((banks.find((b) => b.isDefault) ?? banks[0]).$id);
  }, [banks, accountId]);

  const balance = wallet?.balance ?? 0;
  const amount = Number(amountInput.replace(/\D/g, "")) || 0;
  const account = banks.find((b) => b.$id === accountId);
  const amountError = amount && amount < MIN_WITHDRAWAL ? `Minimum withdrawal is ${formatNairaShort(MIN_WITHDRAWAL)}` : amount > balance ? "Amount is more than your available balance" : "";

  const confirm = async () => {
    if (!user || !account) return;
    setProcessing(true);
    try {
      setDone(await withdraw(user.$id, amount, account));
    } catch (e) {
      setFailure({ reason: e instanceof Error ? e.message : "Withdrawal failed", at: new Date().toISOString() });
    } finally {
      setProcessing(false);
    }
  };

  if (done && account) {
    return (
      <ResultScreen
        ok
        title="Withdrawal Successful!"
        subtitle="Your money has been sent successfully."
        rows={[
          ["Amount", formatNairaShort(done.amount)],
          ["Bank", `${account.provider} *** *** ${account.last4}`],
          ["Reference ID", done.reference ?? "—"],
          ["Date & Time", when(done.createdAt)],
        ]}
        note="The amount should reflect in your account within 5-10 minutes"
        primary={{ label: "Back to Wallet", href: basePath }}
      />
    );
  }

  if (failure && account) {
    return (
      <ResultScreen
        ok={false}
        title="Withdrawal Failed"
        subtitle="We couldn't process your withdrawal."
        rows={[
          ["Amount", formatNairaShort(amount)],
          ["Bank", `${account.provider} *** *** ${account.last4}`],
          ["Date & Time", when(failure.at)],
        ]}
        note={`Reason: ${failure.reason}`}
        primary={{ label: "Try Again", onClick: () => { setFailure(null); setStep(1); } }}
        secondary={{ label: "Back to Wallet", href: basePath }}
      />
    );
  }

  return (
    <div className="flex max-w-[640px] flex-col pt-10 sm:px-4">
      <BackLink href={step === 1 ? basePath : undefined} onClick={step === 2 ? () => setStep(1) : undefined} label={step === 1 ? "Back to wallet" : "Back"} />
      <PageTitle className="mt-8" title="Withdraw Funds" />
      <p className="text-[14px] text-[#6B7280]">
        Available balance: <b className="font-semibold text-[#111827]">{formatNairaShort(balance)}</b>
      </p>

      {step === 1 ? (
        <>
          <label className="mt-6 flex flex-col gap-2">
            <span className="text-[14px] text-[#111827]">Amounts</span>
            <input
              inputMode="numeric"
              value={amountInput ? `₦${amountInput}` : ""}
              onChange={(e) => {
                const d = e.target.value.replace(/\D/g, "");
                setAmountInput(d ? Number(d).toLocaleString() : "");
              }}
              placeholder={`Minimum withdraw is ${formatNairaShort(MIN_WITHDRAWAL)}`}
              className="h-12 rounded-xl bg-[#F8F9FC] px-3 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
            />
            {amountError && <span className="text-[13px] text-[#DC2626]">{amountError}</span>}
          </label>
          <div className="mt-3">
            <AmountChips amounts={[10000, 25000, 50000, 100000]} value={amount} onPick={(n) => setAmountInput(n.toLocaleString())} />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <p className="text-[20px] tracking-[-0.02em] text-[#111827]">Account</p>
            <Link href={`${basePath}/payment-methods`} className="text-[14px] text-[#4F46E5]">Manage Account</Link>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {banks.length === 0 && (
              <Link href={`${basePath}/payment-methods/add`} className="rounded-xl border border-dashed border-[#4F46E5] py-6 text-center text-[14px] text-[#4F46E5]">
                Add a bank account to withdraw
              </Link>
            )}
            {banks.map((b) => (
              <label key={b.$id} className={cn("flex cursor-pointer items-center gap-4 rounded-2xl border px-3 py-4", accountId === b.$id ? "border-[#4F46E5]" : "border-[#E5E7EB]")}>
                <BankLogo name={b.provider} />
                <div className="flex-1">
                  <p className="flex items-center gap-2 text-[16px] text-[#111827]">
                    {b.provider}
                    {b.isDefault && <span className="rounded-full bg-[#E0E7FF] px-2 text-[11px] text-[#4F46E5]">Default</span>}
                  </p>
                  <p className="text-[13px] text-[#6B7280]">*** *** {b.last4} . {b.holderName.split(" ")[0]}</p>
                </div>
                <input type="radio" name="account" checked={accountId === b.$id} onChange={() => setAccountId(b.$id)} className="h-5 w-5 accent-[#4F46E5]" />
              </label>
            ))}
          </div>
          <button
            disabled={!amount || !!amountError || !account}
            onClick={() => setStep(2)}
            className={cn(primaryBtn, "mx-auto mt-5 h-[48px] w-full max-w-[350px]")}
          >
            Continue <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
          </button>
        </>
      ) : (
        account && (
          <>
            <div className="mt-6">
              <SummaryCard
                title="Summary"
                rows={[
                  ["Amount to withdraw", formatNairaShort(amount)],
                  ["Destination", `**** **** ${account.last4}`],
                  ["Account name", account.holderName],
                  ["Processing fees", "₦0.00"],
                  ["Estimated arrival", "10 minutes"],
                ]}
              />
            </div>
            <div className="mt-4 grid grid-cols-[0.6fr_1fr] gap-2">
              <button onClick={() => setStep(1)} className={cn(ghostBtn, "h-[46px]")}>
                Edit <HugeiconsIcon icon={PencilEdit02Icon} size={18} />
              </button>
              <button disabled={processing} onClick={confirm} className={cn(primaryBtn, "h-[46px]")}>
                Confirm <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
              </button>
            </div>
          </>
        )
      )}

      <LoadingModal open={processing} title="Processing your withdrawal" subtitle={`Sending ${formatNairaShort(amount)} to your bank account`} />
    </div>
  );
}

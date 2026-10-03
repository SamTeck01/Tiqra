"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { MIN_TOPUP, useWalletStore } from "@/store/wallet.store";
import CardForm, { CardInput, EMPTY_CARD, cardError } from "@/components/wallet/CardForm";
import { AmountChips, CardBrand, SummaryCard } from "@/components/wallet/Visuals";
import ResultScreen from "@/components/wallet/ResultScreen";
import { LoadingModal } from "@/components/ui/Modal";
import { BackLink, FlowProgress, PageTitle, primaryBtn } from "@/components/ui/Primitives";
import { PaymentMethod } from "@/lib/types";
import { cn, formatNairaFull, formatNairaShort } from "@/lib/utils";

type Result = { ok: true; ref: string } | { ok: false; reason: string };

export default function FundWalletPage() {
  const { user } = useAuthStore();
  const { wallet, methods, fetchWallet, fetchMethods, addMethod, fundWallet } = useWalletStore();
  const [step, setStep] = useState(1);
  const [amountInput, setAmountInput] = useState("");
  const [selected, setSelected] = useState<string>("new");
  const [card, setCard] = useState<CardInput>(EMPTY_CARD);
  const [cardErr, setCardErr] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user?.$id) return;
    fetchWallet(user.$id);
    fetchMethods(user.$id);
  }, [user?.$id, fetchWallet, fetchMethods]);

  const cards = methods.filter((m) => m.kind === "card");
  useEffect(() => {
    const def = cards.find((c) => c.isDefault) ?? cards[0];
    if (def && selected === "new") setSelected(def.$id);
    // Only pick a default once the saved cards load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length]);

  const amount = Number(amountInput.replace(/\D/g, "")) || 0;
  const balance = wallet?.balance ?? 0;
  const savedCard = cards.find((c) => c.$id === selected);

  const toReview = () => {
    if (selected === "new") {
      const err = cardError(card);
      if (err) return setCardErr(err);
    }
    setCardErr("");
    setStep(3);
  };

  const pay = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      let method: PaymentMethod | undefined = savedCard;
      if (!method) {
        const digits = card.number.replace(/\D/g, "");
        // Test decline: cards ending in 0002 are refused, mirroring Paystack's test cards.
        if (digits.endsWith("0002")) throw new Error("Card declined . CODE ERR . INSUFF - 4012");
        method = await addMethod({ userId: user.$id, kind: "card", provider: "Mastercard", last4: digits.slice(-4), holderName: card.name.trim(), expiry: card.expiry });
      }
      const ref = await fundWallet(user.$id, amount, method);
      setResult({ ok: true, ref });
    } catch (e) {
      setResult({ ok: false, reason: e instanceof Error ? e.message : "Payment failed" });
    } finally {
      setProcessing(false);
    }
  };

  if (result?.ok) {
    return (
      <div className="pt-6">
        <div className="mx-auto max-w-[495px] rounded-[24px] bg-white px-6 shadow-[0_4px_24px_rgba(17,24,39,0.06)]">
          <ResultScreen
            ok
            title="Funds added!!!"
            subtitle="Your wallet has been topped up successfully. Funds are available immediately."
            primary={{ label: "Go to wallet", href: "/founder/wallet" }}
            secondary={{ label: "Launch a validation", href: "/founder/ideas/new" }}
          >
            <div className="mt-6 flex w-full items-center justify-between rounded-xl border border-[#E5E7EB] px-3 py-3 text-left">
              <div>
                <p className="text-[12px] text-[#6B7280]">Transaction REF</p>
                <p className="text-[15px] text-[#111827]">{result.ref}</p>
              </div>
              <button
                onClick={() => navigator.clipboard?.writeText(result.ref).then(() => setCopied(true))}
                className="text-[14px] text-[#4F46E5]"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="mt-5 w-full text-left">
              <p className="text-[13px] uppercase text-[#4F46E5]">What&apos;s next</p>
              {["Launch a new validation", "Fund an existing idea that's waiting for payment"].map((t, i) => (
                <p key={t} className="mt-2 flex items-center gap-3 text-[14px] text-[#6B7280]">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-[#4F46E5] text-[11px] text-white">{i + 1}</span>
                  {t}
                </p>
              ))}
            </div>
          </ResultScreen>
        </div>
      </div>
    );
  }

  if (result && !result.ok) {
    return (
      <div className="pt-6">
        <div className="mx-auto max-w-[495px] rounded-[24px] bg-white px-6 shadow-[0_4px_24px_rgba(17,24,39,0.06)]">
          <ResultScreen
            ok={false}
            title="Payment failed"
            subtitle="Your card was declined. No money was charged. This is usually due to insufficient funds or a card restriction."
            primary={{
              label: "Try a different card",
              onClick: () => {
                setResult(null);
                setSelected("new");
                setCard(EMPTY_CARD);
                setStep(2);
              },
            }}
          >
            <p className="mt-6 w-full rounded-xl border border-[#E5E7EB] px-3 py-3 text-left text-[14px] text-[#6B7280]">Reason: {result.reason}</p>
            <div className="mt-5 w-full text-left">
              <p className="text-[13px] uppercase text-[#DC2626]">What may have happened</p>
              {["Insufficient funds in your account", "Your bank blocked the transaction", "Card details entered incorrectly"].map((t, i) => (
                <p key={t} className="mt-2 flex items-center gap-3 text-[14px] text-[#6B7280]">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-[#FEE2E2] text-[11px] text-[#DC2626]">{i + 1}</span>
                  {t}
                </p>
              ))}
            </div>
          </ResultScreen>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-8">
      <BackLink href="/founder/wallet" label={step === 1 ? "Back to wallet" : "Back"} onClick={step > 1 ? () => setStep(step - 1) : undefined} />
      <FlowProgress step={step} />

      {step === 1 && (
        <>
          <PageTitle className="mt-8" title="Add amount" subtitle="Enter amount" />
          <div className="mt-8 flex flex-col gap-4 sm:px-4">
            <p className="text-[16px] uppercase text-[#111827]">Quick amount</p>
            <AmountChips amounts={[10000, 25000, 50000, 100000]} value={amount} onPick={(n) => setAmountInput(n.toLocaleString())} />
            <label className="mt-2 flex flex-col gap-2">
              <span className="text-[16px] text-[#111827]">Enter Amount</span>
              <input
                inputMode="numeric"
                value={amountInput ? `₦${amountInput}` : ""}
                onChange={(e) => {
                  const d = e.target.value.replace(/\D/g, "");
                  setAmountInput(d ? Number(d).toLocaleString() : "");
                }}
                placeholder="₦0"
                className="h-12 rounded-xl border border-[#E5E7EB] px-3 text-[14px] text-[#111827] focus:border-[#4F46E5] focus:outline-none"
              />
              <span className={cn("text-[12px]", amount && amount < MIN_TOPUP ? "text-[#DC2626]" : "text-[#6B7280]")}>
                Minimum top-up is {formatNairaShort(MIN_TOPUP)}
              </span>
            </label>
            <SummaryCard
              title="Summary"
              rows={[
                ["Amount to be added", formatNairaShort(amount)],
                ["Processing fees", "₦0.00"],
                ["Total", formatNairaShort(amount)],
              ]}
            />
          </div>
          <button disabled={amount < MIN_TOPUP} onClick={() => setStep(2)} className={cn(primaryBtn, "mx-auto mt-4 h-[52px] w-full max-w-[400px]")}>
            Proceed to Card Details <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <PageTitle className="mt-8" title="Card details" subtitle="Payment information" />
          <div className="mt-8 flex flex-col gap-3 sm:px-4">
            {cards.map((c) => (
              <label key={c.$id} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3", selected === c.$id ? "border-[#4F46E5] bg-[#EEF2FF]" : "border-[#E5E7EB]")}>
                <input type="radio" name="card" checked={selected === c.$id} onChange={() => setSelected(c.$id)} className="accent-[#4F46E5]" />
                <CardBrand />
                <span className="flex-1 text-[15px] text-[#111827]">**** **** **** {c.last4}</span>
                <span className="text-[13px] text-[#6B7280]">Exp {c.expiry}</span>
              </label>
            ))}
            {cards.length > 0 && (
              <label className={cn("flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3", selected === "new" ? "border-[#4F46E5] bg-[#EEF2FF]" : "border-[#E5E7EB]")}>
                <input type="radio" name="card" checked={selected === "new"} onChange={() => setSelected("new")} className="accent-[#4F46E5]" />
                <span className="text-[15px] text-[#111827]">Use a new card</span>
              </label>
            )}
            {selected === "new" && <CardForm value={card} onChange={setCard} />}
            {cardErr && <p className="text-[14px] text-[#DC2626]">{cardErr}</p>}
          </div>
          <button onClick={toReview} className={cn(primaryBtn, "mx-auto mt-6 h-[46px] w-full max-w-[350px]")}>
            Save and review payment <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <PageTitle className="mt-8" title="Review & confirm" subtitle="Confirm your payment" />
          <div className="mt-8 flex flex-col gap-4 sm:px-4">
            <div className="rounded-[24px] bg-[#F8F9FC]">
              <p className="border-b border-[#E5E7EB] px-4 py-4 text-[20px] font-medium tracking-[-0.02em] text-[#111827]">Payment Method</p>
              <div className="flex items-center gap-3 px-4 py-4">
                <CardBrand />
                <div className="flex-1">
                  <p className="text-[15px] text-[#111827]">**** **** **** {savedCard?.last4 ?? card.number.replace(/\D/g, "").slice(-4)}</p>
                  <p className="text-[14px] text-[#6B7280]">
                    {savedCard?.holderName ?? card.name} . Exp {savedCard?.expiry ?? card.expiry}
                  </p>
                </div>
                <button onClick={() => setStep(2)} className="text-[14px] text-[#4F46E5]">Change</button>
              </div>
            </div>
            <SummaryCard
              title="Summary"
              rows={[
                ["Amount to be added", formatNairaShort(amount)],
                ["Processing fees", "₦0.00"],
                ["Current balance", formatNairaFull(balance)],
                ["Total", formatNairaFull(balance + amount)],
              ]}
            />
          </div>
          <button disabled={processing} onClick={pay} className={cn(primaryBtn, "mx-auto mt-4 h-[52px] w-full max-w-[400px]")}>
            Confirm and pay <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
          </button>
        </>
      )}

      <LoadingModal
        open={processing}
        title="Processing your payment"
        subtitle={`Please wait while we securely process your ${formatNairaShort(amount)} top-up`}
      />
    </div>
  );
}

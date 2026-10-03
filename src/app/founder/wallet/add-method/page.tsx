"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useWalletStore } from "@/store/wallet.store";
import CardForm, { CardInput, EMPTY_CARD, cardError } from "@/components/wallet/CardForm";
import { BackLink, PageTitle, primaryBtn } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

export default function AddCardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addMethod } = useWalletStore();
  const [card, setCard] = useState<CardInput>(EMPTY_CARD);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!user) return;
    const err = cardError(card);
    if (err) return setError(err);
    setSaving(true);
    const digits = card.number.replace(/\D/g, "");
    await addMethod({ userId: user.$id, kind: "card", provider: "Mastercard", last4: digits.slice(-4), holderName: card.name.trim(), expiry: card.expiry });
    router.push("/founder/wallet");
  };

  return (
    <div className="flex flex-col pt-8">
      <BackLink href="/founder/wallet" label="Back to wallet" />
      <PageTitle className="mt-8" title="Add payment method" subtitle="Save a card to fund your wallet faster." />
      <div className="mt-8 max-w-[640px] sm:px-4">
        <CardForm value={card} onChange={setCard} />
        {error && <p className="mt-3 text-[14px] text-[#DC2626]">{error}</p>}
      </div>
      <button disabled={saving} onClick={save} className={cn(primaryBtn, "mt-6 h-[52px] w-full max-w-[400px] sm:ml-4")}>
        {saving ? "Saving..." : "Save card"}
      </button>
    </div>
  );
}

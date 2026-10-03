"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BubbleChatIcon, SentIcon } from "@hugeicons/core-free-icons";
import { api } from "@/lib/api";
import type { ChatMessage } from "@/lib/ai/types";
import { cn } from "@/lib/utils";

const SUGGESTIONS = ["Should I build this?", "What do people think about the price?", "What's the weakest signal?"];

/** Chat with your dashboard: questions about this survey's results. */
export default function DashboardChat({ surveyId, aiConnected }: { surveyId: string; aiConnected: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    const history: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(history);
    setInput("");
    setBusy(true);
    try {
      const { reply } = await api("dashboardChat", { surveyId, history });
      setMessages([...history, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...history, { role: "assistant", content: e instanceof Error ? e.message : "Something went wrong." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-8 rounded-[24px] border border-[#E5E7EB] p-4 print:hidden">
      <p className="flex items-center gap-2 text-[16px] text-[#111827]">
        <HugeiconsIcon icon={BubbleChatIcon} size={20} className="text-[#4F46E5]" /> Chat with your dashboard
      </p>
      {!aiConnected && <p className="mt-1 text-[12px] text-[#9CA3AF]">Basic answers from your numbers. Full answers arrive when the AI provider is connected.</p>}
      <div className="mt-4 flex max-h-[360px] flex-col gap-3 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full bg-[#EEF2FF] px-3 py-1.5 text-[13px] text-[#4F46E5] hover:bg-[#E0E7FF]">
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <p
            key={i}
            className={cn(
              "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-[14px]",
              m.role === "user" ? "self-end bg-[#4F46E5] text-white" : "self-start bg-[#F8F9FC] text-[#111827]"
            )}
          >
            {m.content}
          </p>
        ))}
        {busy && <p className="self-start text-[13px] text-[#6B7280]">Thinking…</p>}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-4 flex items-center rounded-xl border border-[#E5E7EB] px-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your results…"
          className="h-12 flex-1 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
        />
        <button type="submit" aria-label="Send" disabled={busy}>
          <HugeiconsIcon icon={SentIcon} size={20} className="text-[#4F46E5]" />
        </button>
      </form>
    </section>
  );
}

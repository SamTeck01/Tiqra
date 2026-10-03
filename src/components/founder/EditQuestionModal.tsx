"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
  LeftToRightListBulletIcon,
  SentIcon,
  SparklesIcon,
  TextIcon,
} from "@hugeicons/core-free-icons";
import Modal from "@/components/ui/Modal";
import { ghostBtn, primaryBtn } from "@/components/ui/Primitives";
import { QUESTION_TYPE_LABEL } from "@/lib/survey";
import { api } from "@/lib/api";
import { Question, QuestionType } from "@/lib/types";
import { cn } from "@/lib/utils";

const MAX_LEN = 200;

export default function EditQuestionModal({
  question,
  onClose,
  onSave,
}: {
  question: Question | null;
  onClose: () => void;
  onSave: (q: Question) => void;
}) {
  const [text, setText] = useState("");
  const [type, setType] = useState<QuestionType>("multiple_choice");
  const [options, setOptions] = useState<string[]>([]);
  const [instruction, setInstruction] = useState("");
  const [assisting, setAssisting] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!question) return;
    setText(question.text);
    setType(question.type);
    setOptions(question.options ?? []);
    setInstruction("");
  }, [question]);

  const assist = async (how: string) => {
    if (!how.trim()) return;
    setAssisting(true);
    try {
      setText((await api("rewriteQuestion", { text, instruction: how })).text.slice(0, MAX_LEN));
    } catch {
      // Keep the current text if the AI call fails.
    }
    setInstruction("");
    setAssisting(false);
  };

  const move = (to: number) => {
    if (dragIndex === null || dragIndex === to) return;
    const next = [...options];
    const [item] = next.splice(dragIndex, 1);
    next.splice(to, 0, item);
    setOptions(next);
    setDragIndex(to);
  };

  const save = () => {
    if (!question) return;
    const cleaned = options.map((o) => o.trim()).filter(Boolean);
    onSave({ ...question, text: text.trim(), type, options: type === "multiple_choice" ? cleaned : undefined });
  };

  const canSave = text.trim() && (type !== "multiple_choice" || options.filter((o) => o.trim()).length >= 2);

  return (
    <Modal open={!!question} onClose={onClose} className="max-w-[630px] px-5 py-6 sm:px-6">
      <h2 className="text-[24px] font-medium tracking-[-0.02em] text-[#111827]">Edit Question</h2>

      <label className="mt-6 block text-[16px] text-[#111827]">Question</label>
      <div className="mt-2 rounded-xl border border-[#4F46E5] p-4">
        <textarea
          value={text}
          maxLength={MAX_LEN}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full resize-none text-[14px] text-[#111827] focus:outline-none"
        />
        <p className="text-right text-[11px] text-[#6B7280]">
          {text.length}/{MAX_LEN}
        </p>
      </div>

      <label className="mt-4 block text-[16px] text-[#111827]">Answer Type</label>
      <div className="relative mt-2">
        <HugeiconsIcon
          icon={type === "multiple_choice" ? LeftToRightListBulletIcon : TextIcon}
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#4F46E5]"
        />
        <select
          value={type}
          onChange={(e) => {
            const t = e.target.value as QuestionType;
            setType(t);
            if (t === "multiple_choice" && options.length === 0) setOptions(["", ""]);
          }}
          className="h-12 w-full appearance-none rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-4 text-[14px] text-[#111827] focus:border-[#4F46E5] focus:outline-none"
        >
          {(Object.keys(QUESTION_TYPE_LABEL) as QuestionType[]).map((t) => (
            <option key={t} value={t}>{QUESTION_TYPE_LABEL[t]}</option>
          ))}
        </select>
      </div>

      {type === "multiple_choice" && (
        <>
          <label className="mt-4 block text-[16px] text-[#111827]">Options</label>
          <div className="mt-2 overflow-hidden rounded-xl border border-[#E5E7EB]">
            {options.map((opt, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragEnter={() => move(i)}
                onDragEnd={() => setDragIndex(null)}
                onDragOver={(e) => e.preventDefault()}
                className={cn("flex items-center gap-3 border-b border-[#E5E7EB] px-3 py-2", dragIndex === i && "bg-[#EEF2FF]")}
              >
                <HugeiconsIcon icon={DragDropVerticalIcon} size={18} className="cursor-grab text-[#111827]" />
                <input
                  value={opt}
                  onChange={(e) => setOptions(options.map((o, j) => (j === i ? e.target.value : o)))}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 text-[14px] text-[#111827] focus:outline-none"
                />
                <button aria-label="Remove option" onClick={() => setOptions(options.filter((_, j) => j !== i))}>
                  <HugeiconsIcon icon={Delete02Icon} size={20} color="#DC2626" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setOptions([...options, ""])}
              className="flex w-full items-center gap-3 px-3 py-3 text-[14px] text-[#4F46E5]"
            >
              <HugeiconsIcon icon={Add01Icon} size={18} /> Add option
            </button>
          </div>
        </>
      )}

      <div className="mt-6 flex items-center gap-2 text-[16px] text-[#111827]">
        <HugeiconsIcon icon={SparklesIcon} size={20} className="text-[#4F46E5]" /> AI Assist
      </div>
      <p className="mt-1 text-[14px] text-[#6B7280]">Improve your question with AI suggestions</p>
      <div className="mt-4 flex gap-2">
        <button disabled={assisting} onClick={() => assist("simpler")} className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 py-2 text-[14px] text-[#111827] hover:bg-[#F8F9FC]">
          <HugeiconsIcon icon={SparklesIcon} size={18} className="text-[#4F46E5]" /> Make simpler
        </button>
        <button disabled={assisting} onClick={() => assist("shorter")} className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 py-2 text-[14px] text-[#111827] hover:bg-[#F8F9FC]">
          <HugeiconsIcon icon={TextIcon} size={18} className="text-[#4F46E5]" /> Make it shorter
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          assist(instruction);
        }}
        className="mt-4 flex items-center rounded-xl border border-[#E5E7EB] px-3"
      >
        <input
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder={assisting ? "Rewriting..." : "Or tell AI what to change...."}
          className="h-12 flex-1 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
        />
        <button type="submit" aria-label="Send to AI" disabled={assisting}>
          <HugeiconsIcon icon={SentIcon} size={20} className="text-[#4F46E5]" />
        </button>
      </form>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button onClick={onClose} className={cn(ghostBtn, "h-[52px]")}>Cancel</button>
        <button disabled={!canSave} onClick={save} className={cn(primaryBtn, "h-[52px]")}>Save changes</button>
      </div>
    </Modal>
  );
}

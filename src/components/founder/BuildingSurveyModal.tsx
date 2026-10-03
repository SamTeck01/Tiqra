import Modal from "@/components/ui/Modal";

export default function BuildingSurveyModal({ open }: { open: boolean }) {
  return (
    <Modal open={open} className="max-w-[500px] px-6 py-10 text-center">
      <div className="mx-auto flex h-[124px] w-[124px] items-center justify-center rounded-full bg-[#E0E7FF]">
        <div className="flex h-[104px] w-[104px] animate-pulse items-center justify-center rounded-full bg-[#C7D2FE]">
          <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#4F46E5] text-[24px] font-semibold text-white">
            AI
          </span>
        </div>
      </div>
      <p className="mt-5 text-[18px] tracking-[-0.02em] text-[#111827]">TIQRA AI is building your survey</p>
      <p className="mt-2 text-[12px] text-[#6B7280]">
        Analysing your idea and crafting questions to test problem, demand, behaviour and willingness to pay
      </p>
    </Modal>
  );
}

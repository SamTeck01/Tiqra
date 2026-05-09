import Sidebar from "@/components/layout/Sidebar";

export default function EarnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FEFEFE]">
      <Sidebar />
      <main className="tiqra-main flex-1">
        {children}
      </main>
    </div>
  );
}

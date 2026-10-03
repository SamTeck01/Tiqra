import Sidebar from "@/components/layout/Sidebar";
import AppHeader from "@/components/layout/AppHeader";
import AuthGuard from "@/components/auth/AuthGuard";

export default function FounderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FEFEFE]">
      <Sidebar />
      <main className="min-h-screen flex-1 pb-24 lg:ml-[250px] lg:pb-16">
        <AuthGuard allowedRole="founder">
          <div className="w-full max-w-[1070px] px-4 pt-4 lg:pl-12 lg:pr-0 lg:pt-9">
            <AppHeader />
            {children}
          </div>
        </AuthGuard>
      </main>
    </div>
  );
}

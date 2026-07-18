"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/lib/types";

export default function AuthGuard({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: UserRole;
}) {
  const router = useRouter();
  const { isAuthenticated, user, isHydrated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for the store to hydrate if you're using persist middleware
    if (!isHydrated) return;

    if (!isAuthenticated || !user) {
      router.replace("/auth/login");
    } else if (user.role !== allowedRole) {
      router.replace(`/${user.role}/dashboard`);
    } else {
      setIsReady(true);
    }
  }, [isAuthenticated, user, isHydrated, allowedRole, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}

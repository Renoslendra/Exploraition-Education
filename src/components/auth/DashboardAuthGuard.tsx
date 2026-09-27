"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function DashboardAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Tunggu NextAuth selesai memeriksa sesi
    if (status === "loading") {
      return;
    }

    // 2. Jika login via NextAuth (Google)
    if (status === "authenticated" || Boolean((session as any)?.user)) {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    // 3. Periksa tanda sesi lokal yang sah
    const loggedInFlag = typeof window !== "undefined" ? localStorage.getItem("modulin_logged_in") : null;
    const savedName = typeof window !== "undefined" ? localStorage.getItem("modulin_user_name") : null;
    if (loggedInFlag === "true" && savedName) {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    // 4. Periksa Supabase Auth
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (data?.user) {
          setAuthorized(true);
          setChecking(false);
        } else {
          setAuthorized(false);
          setChecking(false);
          const callback = encodeURIComponent(pathname || "/dashboard");
          router.replace(`/login?callbackUrl=${callback}`);
        }
      })
      .catch(() => {
        setAuthorized(false);
        setChecking(false);
        const callback = encodeURIComponent(pathname || "/dashboard");
        router.replace(`/login?callbackUrl=${callback}`);
      });
  }, [status, session, pathname, router]);

  if (checking) {
    return (
      <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-[#2a7d6e] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-[#6b6862]">Memeriksa sesi akun...</span>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}

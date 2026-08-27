"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountDisabledPage() {
  const supabase = createClient();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="p-6 text-center space-y-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-3xl text-red-600 dark:bg-red-950/50 dark:text-red-400">
        🚫
      </div>

      <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
        Account Disabled
      </h1>

      <p className="text-sm text-neutral-600 dark:text-gray-300 leading-relaxed max-w-sm mx-auto">
        Your account has been deactivated or disabled by an administrator. You currently do not have permission to access Mizan Track.
      </p>

      <div className="rounded-xl bg-neutral-100 p-3.5 text-xs text-neutral-500 dark:bg-gray-800/80 dark:text-gray-400">
        If you believe this is a mistake, please contact your system administrator.
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        className="w-full rounded-xl bg-primary-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 active:scale-[0.99]"
      >
        Sign Out & Return to Login
      </button>
    </div>
  );
}

import { DashboardShell } from "@/component";
import { UserProvider } from "@/component/UserProvider";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { id: user_id, user_metadata } = user;

  // Fetch user profile from database with safe fallback
  let profile = null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, role, is_disabled, avatar_url")
      .eq("id", user_id)
      .maybeSingle();

    if (!error && data) {
      profile = data;
    } else {
      const fallback = await supabase
        .from("profiles")
        .select("full_name, role, is_disabled")
        .eq("id", user_id)
        .maybeSingle();
      profile = fallback.data ? { ...fallback.data, avatar_url: null } : null;
    }
  } catch {
    profile = null;
  }

  // If user profile record does not exist in public.profiles, create it safely
  if (!profile) {
    try {
      const { data: newProfile } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user_id,
            email: user.email || "",
            full_name:
              user_metadata?.name || user.email?.split("@")[0] || "User",
            role: "user",
            is_disabled: false,
          },
          { onConflict: "id" }
        )
        .select("full_name, role, is_disabled")
        .maybeSingle();

      profile = newProfile ? { ...newProfile, avatar_url: null } : null;
    } catch {
      // Ignore
    }
  }

  // If user account has been disabled by an admin, redirect to disabled notice
  if (profile?.is_disabled) {
    redirect("/account-disabled");
  }

  const userName =
    profile?.full_name ||
    user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  const role = profile?.role ?? "user";
  const is_disabled = profile?.is_disabled ?? false;
  const avatarUrl = profile?.avatar_url || user_metadata?.avatar_url || null;

  return (
    <UserProvider
      user_id={user_id}
      userName={userName}
      avatarUrl={avatarUrl}
      role={role}
      is_disabled={is_disabled}
    >
      <DashboardShell>{children}</DashboardShell>
    </UserProvider>
  );
}

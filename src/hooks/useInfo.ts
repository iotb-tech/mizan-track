import { createClient } from "@/lib/supabase/server";
import { UserData } from "@/lib/UserDataContext";
import { redirect } from "next/navigation";

export const getInfo = async (): Promise<UserData> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { id: user_id, user_metadata, email } = user;

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

  const userName =
    profile?.full_name || user_metadata?.name || email?.split("@")[0] || "User";
  const role = profile?.role ?? "user";
  const is_disabled = profile?.is_disabled ?? false;
  const isAdmin = role === "admin";
  const avatarUrl = profile?.avatar_url || user_metadata?.avatar_url || null;

  return { user_id, userName, avatarUrl, role, is_disabled, isAdmin };
};

   
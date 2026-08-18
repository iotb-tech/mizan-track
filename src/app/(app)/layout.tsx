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
  const userName = user_metadata?.name || user.email?.split("@")[0] || "User";

  return (
    <UserProvider user_id={user_id} userName={userName}>
      <DashboardShell>{children}</DashboardShell>
    </UserProvider>
  );
}

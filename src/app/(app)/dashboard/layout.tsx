import { DashboardShell } from "@/component";
import { UserProvider } from "@/component/UserProvider";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export default async function DashboardLayOut({children}: {children : React.ReactNode}) {
    const supabase = await createClient();
            const {
              data: { user },
            } = await supabase.auth.getUser();
    
            if (!user) redirect("/login");
    
            const { id: user_id, user_metadata } = user;
            const { name: userName } = user_metadata;

    return(
        <div>
            <UserProvider user_id={user_id} userName={userName}>
            <DashboardShell>{children}</DashboardShell>
            </UserProvider>
        </div>
    )
}
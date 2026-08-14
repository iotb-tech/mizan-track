
import { DashboardShell } from "@/component";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayOut({children}: {children : React.ReactNode}) {
    const supabase = await createClient();
    const { data: {user} } = await supabase.auth.getUser();

    if(!user) redirect("/login");

    // console.log(user)

    return(
        <div>
            <DashboardShell>{children}</DashboardShell>
        </div>
    )
}
import { DashboardNav } from "@/component/nav-bar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayOut({children}: {children : React.ReactNode}) {
    const supabase = await createClient();
    const { data: {user} } = await supabase.auth.getUser();

    if(!user) redirect("/login");

    console.log(user)

    return(
        <div>
            <DashboardNav name={user.user_metadata['name'] ?? 'signed in'} />
            <main>{children}</main>
        </div>
    )
}
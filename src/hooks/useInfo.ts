import { createClient } from "@/lib/supabase/server";
import { UserData } from "@/lib/UserDataContext";
import { redirect } from "next/navigation";

 export const getInfo = async():Promise<UserData> =>  {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) redirect("/login");

        const { id: user_id, user_metadata, email } = user;
        const userName = user_metadata?.name || email?.split("@")[0] || "User";

        return { user_id, userName };
    }

   
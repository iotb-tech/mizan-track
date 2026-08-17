import { createClient } from "@/lib/supabase/server";
import { UserData } from "@/lib/UserDataContext";
import { redirect } from "next/navigation";

 export const getInfo = async():Promise<UserData> =>  {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) redirect("/login");

        const { id: user_id, email, user_metadata } = user;
        const { name: userName } = user_metadata;

        return { user_id, userName}
    }

   
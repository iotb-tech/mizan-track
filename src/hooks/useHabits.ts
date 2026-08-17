import { fetchHabits } from "@/lib/api/habit";
import { createClient } from "@/lib/supabase/client";
import { habitKeys } from "@/lib/validation/queryKey";
import { Habit } from "@/types/database";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useHabit(userId:string){
    const supabase = createClient();
    const queryClient = useQueryClient();
    const query = useQuery<Habit[]>(
        {
          queryKey: habitKeys.list(userId),
          queryFn: async() => fetchHabits(supabase, userId)  
        }
    )
    return query;
}
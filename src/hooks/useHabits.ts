import { fetchHabits } from "@/lib/api/habit";
import { createClient } from "@/lib/supabase/client";
import { habitKeys } from "@/lib/validation/queryKey";
import { HabitWithStats } from "@/types/database";
import { useQuery } from "@tanstack/react-query";

export function useHabits(userId: string) {
  const supabase = createClient();
  const query = useQuery<HabitWithStats[]>({
    queryKey: habitKeys.list(userId),
    queryFn: async () => fetchHabits(supabase, userId),
    enabled: Boolean(userId),
  });
  return query;
}

export const useHabit = useHabits;
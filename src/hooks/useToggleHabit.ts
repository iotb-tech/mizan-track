"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { HabitLogs } from "@/types/database";
import { toggleHabitLog } from "@/lib/api/habit";
import { habitKeys } from "@/lib/validation/queryKey";

type ToggleHabitParams = {
  habitId: string;
  targetCompleted: boolean;
  logDate?: string;
};

export function useToggleHabit(userId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<HabitLogs, Error, ToggleHabitParams>({
    mutationFn: ({ habitId, targetCompleted, logDate }) =>
      toggleHabitLog(supabase, habitId, targetCompleted, logDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.list(userId) });
    },
  });
}

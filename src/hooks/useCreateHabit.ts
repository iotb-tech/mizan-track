"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Habit } from "@/types/database";
import { CreateHabitInput } from "@/lib/validation/input";
import { createHabit } from "@/lib/api/habit";
import { habitKeys } from "@/lib/validation/queryKey";

export function useCreateHabit(userId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  return useMutation<Habit, Error, CreateHabitInput>({
    mutationFn: (input: CreateHabitInput) =>
      createHabit(supabase, userId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.list(userId) });
    },
  });
}

"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { deleteHabit } from "@/lib/api/habit";
import { habitKeys } from "@/lib/validation/queryKey";

export function useDeleteHabit(userId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (habitId: string) => deleteHabit(supabase, habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.list(userId) });
    },
  });
}

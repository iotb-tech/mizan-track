"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { deleteExpense } from "@/lib/api/expense";
import { expenseKeys } from "@/lib/validation/queryKey";

export function useDeleteExpense(userId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (expenseId: string) =>
      deleteExpense(supabase, userId, expenseId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: expenseKeys.list(userId),
      });
    },
  });
}
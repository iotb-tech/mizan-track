"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Expense } from "@/types/database";
import { CreateExpenseInput } from "@/lib/validation/input";
import { updateExpense } from "@/lib/api/expense";
import { expenseKeys } from "@/lib/validation/queryKey";

export function useUpdateExpense(userId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    Expense,
    Error,
    { expenseId: string; input: CreateExpenseInput }
  >({
    mutationFn: ({ expenseId, input }) =>
      updateExpense(supabase, userId, expenseId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: expenseKeys.list(userId),
      });
    },
  });
}

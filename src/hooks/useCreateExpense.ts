"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Expense } from "@/types/database";
import { CreateExpenseInput } from "@/lib/validation/input";
import { createExpense } from "@/lib/api/expense";
import { expenseKeys } from "@/lib/validation/queryKey";

export function useCreateExpense(userId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<Expense, Error, CreateExpenseInput>({
    mutationFn: (input: CreateExpenseInput) =>
      createExpense(supabase, userId, input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: expenseKeys.list(userId),
      });
    },
  });
}
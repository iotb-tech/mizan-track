import { fetchExpenses } from "@/lib/api/expense";
import { createClient } from "@/lib/supabase/client";
import { expenseKeys } from "@/lib/validation/queryKey";
import { Expense } from "@/types/database";
import { useQuery } from "@tanstack/react-query";

export function useExpenses(userId: string) {
  const supabase = createClient();

  const query = useQuery<Expense[]>({
    queryKey: expenseKeys.list(userId),
    queryFn: async () => fetchExpenses(supabase, userId),
    enabled: Boolean(userId),
  });

  return query;
}
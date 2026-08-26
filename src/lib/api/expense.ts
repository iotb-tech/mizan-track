import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Expense } from "@/types/database";
import type { CreateExpenseInput } from "@/lib/validation/input";


export async function fetchExpenses(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data;
}


export async function createExpense(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CreateExpenseInput,
): Promise<Expense> {
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      user_id: userId,
      amount: input.amount,
      category: input.category,
      date: input.date,
      note: input.note || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteExpense(
  supabase: SupabaseClient<Database>,
  userId: string,
  expenseId: string
) {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}

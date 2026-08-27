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


async function ensureProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && user.id === userId) {
      await supabase.from("profiles").upsert(
        {
          id: userId,
          email: user.email || "",
          full_name:
            user.user_metadata?.name || user.email?.split("@")[0] || "User",
          role: "user",
          is_disabled: false,
        },
        { onConflict: "id" },
      );
    }
  } catch {
    // Ignore upsert errors
  }
}

export async function createExpense(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CreateExpenseInput,
): Promise<Expense> {
  let { data, error } = await supabase
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

  if (error && error.message.includes("violates foreign key constraint")) {
    await ensureProfile(supabase, userId);
    const retry = await supabase
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
    data = retry.data;
    error = retry.error;
  }

  if (error) throw new Error(error.message);
  return data!;
}



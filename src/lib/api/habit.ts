import type { SupabaseClient } from "@supabase/supabase-js";
import { Database, Habit } from "@/types/database";
import { CreateHabitInput } from "@/lib/validation/input";

export async function fetchHabits(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<Habit[]> {
  void supabase;
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data returned from fetchhabits");

  return data;
}

export async function createHabit(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CreateHabitInput,
): Promise<Habit> {
  void supabase;
  void userId;
  void input;
  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: userId,
      name: input.name,
      category: input.category,
      frequency_type: input.frequency,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

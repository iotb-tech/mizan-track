import type { SupabaseClient } from "@supabase/supabase-js";
import { Database, Habit, HabitLogs, HabitWithStats } from "@/types/database";
import { CreateHabitInput } from "@/lib/validation/input";

export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDateStrOffset(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateStreak(logs: HabitLogs[] = []): number {
  if (!logs || logs.length === 0) return 0;

  const completedDates = new Set(
    logs.filter((log) => log.completed).map((log) => log.log_date),
  );

  const todayStr = getTodayDateStr();
  const yesterdayStr = getDateStrOffset(-1);

  let streak = 0;
  let checkOffset = 0;

  // Check if completed today; if not, streak could still be alive if completed yesterday
  if (completedDates.has(todayStr)) {
    checkOffset = 0;
  } else if (completedDates.has(yesterdayStr)) {
    checkOffset = -1;
  } else {
    return 0;
  }

  // Count backwards consecutively
  while (true) {
    const targetDate = getDateStrOffset(checkOffset);
    if (completedDates.has(targetDate)) {
      streak++;
      checkOffset--;
    } else {
      break;
    }
  }

  return streak;
}

export function isDoneToday(logs: HabitLogs[] = []): boolean {
  if (!logs || logs.length === 0) return false;
  const todayStr = getTodayDateStr();
  return logs.some((log) => log.log_date === todayStr && log.completed);
}

export function getLast7DaysProgress(logs: HabitLogs[] = []): boolean[] {
  const completedDates = new Set(
    (logs || []).filter((log) => log.completed).map((log) => log.log_date),
  );

  // 6 days ago up to today (total 7 days)
  const result: boolean[] = [];
  for (let offset = -6; offset <= 0; offset++) {
    const dateStr = getDateStrOffset(offset);
    result.push(completedDates.has(dateStr));
  }
  return result;
}

export async function fetchHabits(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<HabitWithStats[]> {
  const { data, error } = await supabase
    .from("habits")
    .select("*, habits_log(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data.map((habit) => {
    const logs = (habit.habits_log as unknown as HabitLogs[]) || [];
    return {
      ...habit,
      streak: calculateStreak(logs),
      doneToday: isDoneToday(logs),
      recentHistory: getLast7DaysProgress(logs),
      habits_log: logs,
    };
  });
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

export async function createHabit(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CreateHabitInput,
): Promise<Habit> {
  let { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: userId,
      name: input.name,
      category: input.category || null,
      frequency_type: input.frequency || "daily",
    })
    .select()
    .single();

  if (error && error.message.includes("habits_user_id_fkey")) {
    await ensureProfile(supabase, userId);
    const retry = await supabase
      .from("habits")
      .insert({
        user_id: userId,
        name: input.name,
        category: input.category || null,
        frequency_type: input.frequency || "daily",
      })
      .select()
      .single();
    data = retry.data;
    error = retry.error;
  }

  if (error) throw new Error(error.message);
  return data!;
}

export async function toggleHabitLog(
  supabase: SupabaseClient<Database>,
  habitId: string,
  targetCompleted: boolean,
  logDate?: string,
): Promise<HabitLogs> {
  const dateStr = logDate || getTodayDateStr();

  const { data, error } = await supabase
    .from("habits_log")
    .upsert(
      {
        habit_id: habitId,
        log_date: dateStr,
        completed: targetCompleted,
      },
      {
        onConflict: "habit_id,log_date",
      },
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteHabit(
  supabase: SupabaseClient<Database>,
  habitId: string,
): Promise<void> {
  const { error } = await supabase.from("habits").delete().eq("id", habitId);
  if (error) throw new Error(error.message);
}

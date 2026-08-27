import { NextResponse } from "next/server";
import { getAuthenticatedAdmin, verifyAdminSession } from "@/lib/adminAuth";
import { createClient } from "@/lib/supabase/server";
import {
  calculateStreak,
  isDoneToday,
  getLast7DaysProgress,
} from "@/lib/api/habit";
import { HabitLogs, HabitWithStats } from "@/types/database";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminAuth = await getAuthenticatedAdmin();
  if (!adminAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isVerified = await verifyAdminSession(adminAuth.user.id);
  if (!isVerified) {
    return NextResponse.json(
      { error: "Admin verification required" },
      { status: 403 }
    );
  }

  const { id: targetUserId } = await params;
  const supabase = await createClient();

  // Fetch profile
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", targetUserId)
    .single();

  if (profileErr || !profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Fetch habits with logs and expenses
  const [{ data: habitsData, error: habitsErr }, { data: expenses, error: expensesErr }] =
    await Promise.all([
      supabase
        .from("habits")
        .select("*, habits_log(*)")
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: false }),
      supabase
        .from("expenses")
        .select("*")
        .eq("user_id", targetUserId)
        .order("date", { ascending: false }),
    ]);

  if (habitsErr || expensesErr) {
    console.error("Error fetching user data:", habitsErr || expensesErr);
    return NextResponse.json(
      { error: "Failed to retrieve user records" },
      { status: 500 }
    );
  }

  // Calculate habit stats (read-only)
  const habits: HabitWithStats[] = (habitsData || []).map((habit) => {
    const logs = (habit.habits_log as unknown as HabitLogs[]) || [];
    return {
      ...habit,
      streak: calculateStreak(logs),
      doneToday: isDoneToday(logs),
      recentHistory: getLast7DaysProgress(logs),
      habits_log: logs,
    };
  });

  // Calculate metrics
  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => h.doneToday).length;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak), 0) : 0;
  const totalSpent = (expenses || []).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const monthlySpent = (expenses || [])
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    })
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return NextResponse.json({
    profile,
    habits,
    expenses: expenses || [],
    metrics: {
      totalHabits,
      completedToday,
      maxStreak,
      totalSpent,
      monthlySpent,
      expensesCount: expenses?.length || 0,
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminAuth = await getAuthenticatedAdmin();
  if (!adminAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isVerified = await verifyAdminSession(adminAuth.user.id);
  if (!isVerified) {
    return NextResponse.json(
      { error: "Admin verification required" },
      { status: 403 }
    );
  }

  const { id: targetUserId } = await params;
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { role, is_disabled } = body;

    const updates: Record<string, unknown> = {};

    if (role !== undefined) {
      if (role !== "user" && role !== "admin") {
        return NextResponse.json(
          { error: "Invalid role value. Must be 'user' or 'admin'." },
          { status: 400 }
        );
      }
      updates.role = role;
    }

    if (is_disabled !== undefined) {
      if (typeof is_disabled !== "boolean") {
        return NextResponse.json(
          { error: "Invalid is_disabled value. Must be a boolean." },
          { status: 400 }
        );
      }
      // Protect against self-disable
      if (targetUserId === adminAuth.user.id && is_disabled === true) {
        return NextResponse.json(
          { error: "You cannot disable your own admin account." },
          { status: 400 }
        );
      }
      updates.is_disabled = is_disabled;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update." },
        { status: 400 }
      );
    }

    const { data: updatedProfile, error: updateErr } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", targetUserId)
      .select()
      .single();

    if (updateErr) {
      console.error("Error updating user:", updateErr);
      return NextResponse.json(
        { error: "Failed to update user profile." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: "User updated successfully.",
    });
  } catch (err) {
    console.error("PATCH user error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminAuth = await getAuthenticatedAdmin();
  if (!adminAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isVerified = await verifyAdminSession(adminAuth.user.id);
  if (!isVerified) {
    return NextResponse.json(
      { error: "Admin verification required" },
      { status: 403 }
    );
  }

  const { id: targetUserId } = await params;

  if (targetUserId === adminAuth.user.id) {
    return NextResponse.json(
      { error: "You cannot delete your own admin account." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Delete profile (cascades delete on habits, logs, expenses in postgres)
  const { error: delErr } = await supabase
    .from("profiles")
    .delete()
    .eq("id", targetUserId);

  if (delErr) {
    console.error("Error deleting user:", delErr);
    return NextResponse.json(
      { error: "Failed to delete user profile and records." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "User account and all associated records deleted.",
  });
}

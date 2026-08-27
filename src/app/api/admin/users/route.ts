import { NextResponse } from "next/server";
import { getAuthenticatedAdmin, verifyAdminSession } from "@/lib/adminAuth";
import { createClient } from "@/lib/supabase/server";
import { AdminUserSummary } from "@/types/database";

export async function GET() {
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

  const supabase = await createClient();

  // Fetch all profiles
  const { data: profiles, error: profileErr } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_disabled, created_at")
    .order("created_at", { ascending: false });

  if (profileErr) {
    console.error("Error fetching profiles:", profileErr);
    return NextResponse.json(
      { error: "Failed to fetch user list" },
      { status: 500 }
    );
  }

  // Fetch all habits and expenses for statistics calculation
  const [{ data: habits }, { data: expenses }] = await Promise.all([
    supabase.from("habits").select("id, user_id"),
    supabase.from("expenses").select("id, user_id, amount"),
  ]);

  const habitsByUser = new Map<string, number>();
  (habits || []).forEach((h) => {
    habitsByUser.set(h.user_id, (habitsByUser.get(h.user_id) || 0) + 1);
  });

  const expensesCountByUser = new Map<string, number>();
  const expensesAmountByUser = new Map<string, number>();
  (expenses || []).forEach((e) => {
    expensesCountByUser.set(
      e.user_id,
      (expensesCountByUser.get(e.user_id) || 0) + 1
    );
    expensesAmountByUser.set(
      e.user_id,
      (expensesAmountByUser.get(e.user_id) || 0) + (Number(e.amount) || 0)
    );
  });

  const users: AdminUserSummary[] = (profiles || []).map((p) => ({
    id: p.id,
    email: p.email,
    full_name: p.full_name,
    role: p.role,
    is_disabled: p.is_disabled,
    created_at: p.created_at,
    habits_count: habitsByUser.get(p.id) || 0,
    expenses_count: expensesCountByUser.get(p.id) || 0,
    total_expenses_amount: expensesAmountByUser.get(p.id) || 0,
    best_streak: 0,
  }));

  return NextResponse.json({ users });
}

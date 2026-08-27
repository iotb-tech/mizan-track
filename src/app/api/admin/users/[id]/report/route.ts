import { NextResponse } from "next/server";
import { getAuthenticatedAdmin, verifyAdminSession } from "@/lib/adminAuth";
import { createClient } from "@/lib/supabase/server";
import { calculateStreak, isDoneToday } from "@/lib/api/habit";
import { HabitLogs } from "@/types/database";

export async function GET(
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
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "csv";

  const supabase = await createClient();

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", targetUserId)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Fetch habits and expenses
  const [{ data: habitsData }, { data: expensesData }] = await Promise.all([
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

  const habits = (habitsData || []).map((h) => {
    const logs = (h.habits_log as unknown as HabitLogs[]) || [];
    const completedLogs = logs.filter((l) => l.completed).length;
    return {
      name: h.name,
      category: h.category || "General",
      frequency: h.frequency_type,
      streak: calculateStreak(logs),
      doneToday: isDoneToday(logs) ? "Yes" : "No",
      completedLogs,
      targetCount: h.target_count || "N/A",
      created_at: new Date(h.created_at).toLocaleDateString(),
    };
  });

  const expenses = (expensesData || []).map((e) => ({
    date: e.date,
    category: e.category,
    amount: Number(e.amount) || 0,
    note: (e.note || "").replace(/"/g, '""'),
  }));

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (format === "json") {
    return NextResponse.json({
      user: profile,
      habits,
      expenses,
      summary: {
        totalHabits: habits.length,
        totalExpenses: expenses.length,
        totalSpent,
        generatedAt: new Date().toISOString(),
      },
    });
  }

  // Build CSV
  const sanitizedName = (profile.full_name || profile.email)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_");
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `mizan_report_${sanitizedName}_${dateStr}.csv`;

  const csvRows: string[] = [];

  // Section 1: User Profile Header
  csvRows.push("========================================");
  csvRows.push("MIZAN TRACK - USER AUDIT & PROGRESS REPORT");
  csvRows.push("========================================");
  csvRows.push(`Report Date,${new Date().toLocaleString()}`);
  csvRows.push(`User Full Name,"${profile.full_name || "N/A"}"`);
  csvRows.push(`Email Address,${profile.email}`);
  csvRows.push(`Account Role,${profile.role.toUpperCase()}`);
  csvRows.push(`Account Status,${profile.is_disabled ? "DISABLED" : "ACTIVE"}`);
  csvRows.push(`Joined Date,${new Date(profile.created_at).toLocaleDateString()}`);
  csvRows.push("");

  // Section 2: Summary Stats
  csvRows.push("========================================");
  csvRows.push("SUMMARY METRICS");
  csvRows.push("========================================");
  csvRows.push(`Total Habits Tracked,${habits.length}`);
  csvRows.push(`Total Expense Records,${expenses.length}`);
  csvRows.push(`Total Spending (NGN),${totalSpent}`);
  csvRows.push("");

  // Section 3: Habits Table
  csvRows.push("========================================");
  csvRows.push("HABITS & CONSISTENCY RECORDS");
  csvRows.push("========================================");
  csvRows.push("Habit Name,Category,Frequency,Current Streak (Days),Done Today,Completed Days Count,Target Count,Date Created");
  habits.forEach((h) => {
    csvRows.push(
      `"${h.name.replace(/"/g, '""')}","${h.category}","${h.frequency}",${h.streak},"${h.doneToday}",${h.completedLogs},"${h.targetCount}","${h.created_at}"`
    );
  });
  csvRows.push("");

  // Section 4: Expenses Table
  csvRows.push("========================================");
  csvRows.push("EXPENSE TRANSACTIONS");
  csvRows.push("========================================");
  csvRows.push("Date,Category,Amount (NGN),Note");
  expenses.forEach((e) => {
    csvRows.push(
      `"${e.date}","${e.category}",${e.amount},"${e.note}"`
    );
  });

  const csvString = csvRows.join("\n");

  return new NextResponse(csvString, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

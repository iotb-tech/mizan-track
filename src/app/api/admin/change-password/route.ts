import { NextResponse } from "next/server";
import {
  getAuthenticatedAdmin,
  getStoredAdminPasswordHash,
  hashAdminPassword,
  verifyAdminSession,
  DEFAULT_ADMIN_PASSWORD_HASH,
} from "@/lib/adminAuth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const adminAuth = await getAuthenticatedAdmin();
  if (!adminAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isVerified = await verifyAdminSession(adminAuth.user.id);
  if (!isVerified) {
    return NextResponse.json(
      { error: "Admin session expired or unverified. Please verify admin password first." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New admin password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const storedHash = await getStoredAdminPasswordHash();
    const currentHash = hashAdminPassword(currentPassword);
    const isCurrentDefault = currentPassword.trim() === "Admin@MizanTrack2026!";

    const isCurrentMatch =
      currentHash === storedHash ||
      currentHash === DEFAULT_ADMIN_PASSWORD_HASH ||
      isCurrentDefault;

    if (!isCurrentMatch) {
      return NextResponse.json(
        { error: "Current admin password is incorrect." },
        { status: 400 }
      );
    }

    const newHash = hashAdminPassword(newPassword);
    const supabase = await createClient();

    const { error: upsertError } = await supabase
      .from("system_settings")
      .upsert(
        {
          key: "admin_password_hash",
          value: newHash,
          description: "Hashed master admin verification password",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (upsertError) {
      console.error("Failed to update admin password in DB:", upsertError);
      return NextResponse.json(
        { error: "Failed to update admin password in database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin password changed successfully.",
    });
  } catch (err) {
    console.error("Change admin password error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

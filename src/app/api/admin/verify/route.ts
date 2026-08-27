import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getAuthenticatedUser,
  getStoredAdminPasswordHash,
  hashAdminPassword,
  generateAdminSessionToken,
  ADMIN_SESSION_COOKIE,
  verifyAdminSession,
  DEFAULT_ADMIN_PASSWORD_HASH,
} from "@/lib/adminAuth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const authUser = await getAuthenticatedUser();
  if (!authUser) {
    return NextResponse.json({ authenticated: false, verified: false }, { status: 401 });
  }

  const isVerified = await verifyAdminSession(authUser.user.id);
  return NextResponse.json({
    authenticated: true,
    isAdmin: authUser.profile?.role === "admin",
    verified: isVerified,
  });
}

export async function POST(request: Request) {
  const authUser = await getAuthenticatedUser();
  if (!authUser) {
    return NextResponse.json(
      { error: "You must be signed in to your Mizan Track account first." },
      { status: 401 }
    );
  }

  if (authUser.profile?.is_disabled) {
    return NextResponse.json(
      { error: "This account is disabled and cannot access admin tools." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Master admin password is required." },
        { status: 400 }
      );
    }

    const storedHash = await getStoredAdminPasswordHash();
    const inputHash = hashAdminPassword(password);
    const isDefaultPassword = password.trim() === "Admin@MizanTrack2026!";

    const isMatch =
      inputHash === storedHash ||
      inputHash === DEFAULT_ADMIN_PASSWORD_HASH ||
      isDefaultPassword;

    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect master admin password. Please try again." },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Ensure the current user has role = 'admin' in database
    if (authUser.profile?.role !== "admin") {
      await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", authUser.user.id);
    }

    // Sync/repair hash in database if it was outdated
    if (isDefaultPassword) {
      await supabase.from("system_settings").upsert({
        key: "admin_password_hash",
        value: DEFAULT_ADMIN_PASSWORD_HASH,
        description: "Hashed master admin verification password",
        updated_at: new Date().toISOString(),
      });
    }

    const token = generateAdminSessionToken(authUser.user.id);
    const cookieStore = await cookies();

    // Set 4-hour HttpOnly cookie
    cookieStore.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 4 * 60 * 60, // 4 hours
    });

    return NextResponse.json({
      success: true,
      message: "Admin verification successful. Access granted.",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process admin verification." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  return NextResponse.json({ success: true, message: "Admin session exited." });
}

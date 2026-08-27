import { createHash } from "crypto";
import { cookies } from "next/headers";
import { createClient } from "./supabase/server";

export const ADMIN_SESSION_COOKIE = "mizan_admin_session";
const ADMIN_PASSWORD_SETTING_KEY = "admin_password_hash";

// Default admin password is "Admin@MizanTrack2026!"
// SHA-256: 15d6ef77c23d37b18d48f5ad4c6d8286ab65ad0b6f42eb9da208000d1e588464
export const DEFAULT_ADMIN_PASSWORD_HASH =
  "15d6ef77c23d37b18d48f5ad4c6d8286ab65ad0b6f42eb9da208000d1e588464";

/**
 * Computes SHA-256 hex digest for a password string.
 */
export function hashAdminPassword(password: string): string {
  return createHash("sha256").update(password.trim()).digest("hex");
}

/**
 * Creates a signed admin verification session token.
 */
export function generateAdminSessionToken(userId: string): string {
  const timestamp = Date.now();
  const signature = createHash("sha256")
    .update(`${userId}:${timestamp}:${DEFAULT_ADMIN_PASSWORD_HASH}`)
    .digest("hex");

  return Buffer.from(
    JSON.stringify({ userId, timestamp, signature })
  ).toString("base64url");
}

/**
 * Verifies if the incoming admin session cookie is valid (within 4 hours).
 */
export async function verifyAdminSession(userId: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!cookie?.value) return false;

    const payload = JSON.parse(
      Buffer.from(cookie.value, "base64url").toString("utf-8")
    );

    if (payload.userId !== userId) return false;

    // Session valid for 4 hours (14,400,000 ms)
    const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
    if (Date.now() - payload.timestamp > FOUR_HOURS_MS) {
      return false;
    }

    const expectedSig = createHash("sha256")
      .update(`${userId}:${payload.timestamp}:${DEFAULT_ADMIN_PASSWORD_HASH}`)
      .digest("hex");

    return payload.signature === expectedSig;
  } catch {
    return false;
  }
}

/**
 * Retrieves the currently authenticated user and their profile.
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile };
}

/**
 * Verifies if the currently logged-in user is an active admin.
 */
export async function getAuthenticatedAdmin() {
  const authUser = await getAuthenticatedUser();
  if (!authUser || !authUser.user) return null;

  const { user, profile } = authUser;
  if (profile?.is_disabled) {
    return null;
  }

  const isSessionVerified = await verifyAdminSession(user.id);
  const isRoleAdmin = profile?.role === "admin";

  if (!isSessionVerified && !isRoleAdmin) {
    return null;
  }

  // If verified via master password, ensure role in DB is admin
  if (isSessionVerified && profile && profile.role !== "admin") {
    const supabase = await createClient();
    await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", user.id);
    profile.role = "admin";
  }

  return { user, profile };
}

/**
 * Retrieves the stored admin password hash from system_settings,
 * falling back to DEFAULT_ADMIN_PASSWORD_HASH if not yet initialized.
 */
export async function getStoredAdminPasswordHash(): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", ADMIN_PASSWORD_SETTING_KEY)
    .maybeSingle();

  return data?.value || DEFAULT_ADMIN_PASSWORD_HASH;
}

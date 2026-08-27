"use client";
import { UserContext } from "@/lib/UserDataContext";
import { UserRole } from "@/types/database";

export function UserProvider({
  user_id,
  userName,
  avatarUrl = null,
  role = "user",
  is_disabled = false,
  children,
}: {
  user_id: string;
  userName: string;
  avatarUrl?: string | null;
  role?: UserRole;
  is_disabled?: boolean;
  children: React.ReactNode;
}) {
  const isAdmin = role === "admin";

  return (
    <UserContext.Provider
      value={{ user_id, userName, avatarUrl, role, is_disabled, isAdmin }}
    >
      {children}
    </UserContext.Provider>
  );
}


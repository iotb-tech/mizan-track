"use client";
import { UserContext } from "@/lib/UserDataContext";

export function UserProvider({
  user_id,
  userName,
  children,
}: {
  user_id: string;
  userName: string;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user_id, userName }}>
      {children}
    </UserContext.Provider>
  );
}

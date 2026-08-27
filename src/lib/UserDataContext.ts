"use client";
import { createContext, useContext } from "react";
import { UserRole } from "@/types/database";

export interface UserData {
  user_id: string;
  userName: string;
  avatarUrl?: string | null;
  role: UserRole;
  is_disabled: boolean;
  isAdmin: boolean;
}

export const UserContext = createContext<UserData | null>(null);

export const useData = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useData must be used within a UserProvider");

  return context;
};
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AdminUserSummary } from "@/types/database";
import { useData } from "@/lib/UserDataContext";

export default function AdminUsersPage() {
  const { user_id: currentAdminId } = useData();

  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user" | "disabled">("all");

  // Action states for modal confirmations
  const [pendingAction, setPendingAction] = useState<{
    type: "role" | "disable" | "delete";
    user: AdminUserSummary;
    targetValue?: string | boolean;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  async function loadUsers() {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load users");
      }
      setUsers(data.users || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load user list");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function showFeedback(text: string, type: "success" | "error" = "success") {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 3500);
  }

  async function executePendingAction() {
    if (!pendingAction) return;
    const { type, user, targetValue } = pendingAction;
    setActionLoading(true);

    try {
      if (type === "role") {
        const res = await fetch(`/api/admin/users/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: targetValue }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, role: targetValue as "admin" | "user" } : u
          )
        );
        showFeedback(
          targetValue === "admin"
            ? `✓ Elevated ${user.full_name || user.email} to Admin.`
            : `✓ Role for ${user.full_name || user.email} changed to Standard User.`
        );
      } else if (type === "disable") {
        const res = await fetch(`/api/admin/users/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_disabled: targetValue }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, is_disabled: Boolean(targetValue) } : u
          )
        );
        showFeedback(
          targetValue
            ? `✓ Account for ${user.full_name || user.email} has been disabled.`
            : `✓ Account for ${user.full_name || user.email} has been enabled.`
        );
      } else if (type === "delete") {
        const res = await fetch(`/api/admin/users/${user.id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        showFeedback(`✓ Permanently deleted account for ${user.full_name || user.email}.`);
      }
    } catch (err: unknown) {
      showFeedback(
        err instanceof Error ? err.message : "Action failed. Please try again.",
        "error"
      );
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  }

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (roleFilter === "admin") return u.role === "admin";
      if (roleFilter === "user") return u.role === "user";
      if (roleFilter === "disabled") return u.is_disabled;
      return true;
    });
  }, [users, searchQuery, roleFilter]);

  // Aggregate metrics
  const totalUsersCount = users.length;
  const totalAdminsCount = users.filter((u) => u.role === "admin").length;
  const totalDisabledCount = users.filter((u) => u.is_disabled).length;
  const totalHabitsCount = users.reduce((sum, u) => sum + u.habits_count, 0);
  const totalSpentAll = users.reduce((sum, u) => sum + u.total_expenses_amount, 0);

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-2xl px-5 py-3 text-sm font-semibold shadow-2xl transition-all ${
            feedbackMessage.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {feedbackMessage.text}
        </div>
      )}

      {/* Overview Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Users
          </p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {totalUsersCount}
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            {totalAdminsCount} admin{totalAdminsCount === 1 ? "" : "s"} • {totalDisabledCount} disabled
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Platform Habits
          </p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {totalHabitsCount}
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            Tracked across all accounts
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Platform Spending
          </p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            ₦{totalSpentAll.toLocaleString("en-NG")}
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            Total recorded expenditures
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Admin Accounts
          </p>
          <h3 className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {totalAdminsCount}
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            Authorized administrators
          </p>
        </div>
      </section>

      {/* Directory & Controls */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {/* Search & Filter Header */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#1976e8] focus:ring-1 focus:ring-[#1976e8]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRoleFilter("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                roleFilter === "all"
                  ? "bg-[#0f4788] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              All ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("admin")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                roleFilter === "admin"
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Admins ({totalAdminsCount})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("user")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                roleFilter === "user"
                  ? "bg-[#1976e8] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Users ({users.length - totalAdminsCount})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("disabled")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                roleFilter === "disabled"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Disabled ({totalDisabledCount})
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-16 text-center text-gray-500 dark:text-gray-400">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0f4788] border-r-transparent" />
              <p className="mt-3 text-sm font-medium">Loading user directory...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">
              <p className="text-sm font-medium">{error}</p>
              <button
                type="button"
                onClick={loadUsers}
                className="mt-3 rounded-lg bg-red-100 px-4 py-1.5 text-xs font-bold text-red-700 hover:bg-red-200 dark:bg-red-950/60 dark:text-red-300"
              >
                Retry
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <p className="text-base font-semibold">No matching users found.</p>
              <p className="mt-1 text-xs">Try adjusting your search query or filter.</p>
            </div>
          ) : (
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/60 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Habits</th>
                  <th className="px-6 py-4">Expenses</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredUsers.map((u) => {
                  const isSelf = u.id === currentAdminId;

                  return (
                    <tr
                      key={u.id}
                      className="transition hover:bg-gray-50/60 dark:hover:bg-gray-800/40"
                    >
                      {/* User details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-[#0f4788] dark:bg-blue-900/50 dark:text-blue-200">
                            {(u.full_name || u.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {u.full_name || "Unnamed User"}
                              </p>
                              {isSelf && (
                                <span className="rounded bg-gray-200 px-1.5 py-0.2 text-[10px] font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        {u.role === "admin" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            User
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {u.is_disabled ? (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/60 dark:text-red-300">
                            Disabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-950/60 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Habits count */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {u.habits_count} habit{u.habits_count === 1 ? "" : "s"}
                      </td>

                      {/* Expenses count & sum */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          ₦{u.total_expenses_amount.toLocaleString("en-NG")}
                        </p>
                        <p className="text-xs text-gray-400">
                          {u.expenses_count} transaction{u.expenses_count === 1 ? "" : "s"}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Records (Audit) */}
                          <Link
                            href={`/admin/users/${u.id}`}
                            className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#1976e8] transition hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900"
                            title="Audit user habits, expenses, and records (Read-Only)"
                          >
                            View Records
                          </Link>

                          {/* Elevate / Demote Role */}
                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() =>
                                setPendingAction({
                                  type: "role",
                                  user: u,
                                  targetValue: u.role === "admin" ? "user" : "admin",
                                })
                              }
                              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                                u.role === "admin"
                                  ? "border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                  : "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:hover:bg-amber-900"
                              }`}
                              title={
                                u.role === "admin"
                                  ? "Demote to standard user"
                                  : "Elevate to administrator"
                              }
                            >
                              {u.role === "admin" ? "Demote" : "Make Admin"}
                            </button>
                          )}

                          {/* Disable / Enable Account */}
                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() =>
                                setPendingAction({
                                  type: "disable",
                                  user: u,
                                  targetValue: !u.is_disabled,
                                })
                              }
                              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                                u.is_disabled
                                  ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/60 dark:text-green-300"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-950/60 dark:text-yellow-300"
                              }`}
                              title={
                                u.is_disabled
                                  ? "Enable user account"
                                  : "Disable user account"
                              }
                            >
                              {u.is_disabled ? "Enable" : "Disable"}
                            </button>
                          )}

                          {/* Delete Account */}
                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() =>
                                setPendingAction({
                                  type: "delete",
                                  user: u,
                                })
                              }
                              className="rounded-lg p-1.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50"
                              title="Delete user account permanently"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Confirmation Modal */}
      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {pendingAction.type === "role" &&
                (pendingAction.targetValue === "admin"
                  ? "Elevate User to Admin?"
                  : "Demote User to Regular User?")}
              {pendingAction.type === "disable" &&
                (pendingAction.targetValue === true
                  ? "Disable User Account?"
                  : "Re-enable User Account?")}
              {pendingAction.type === "delete" && "Permanently Delete Account?"}
            </h3>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {pendingAction.type === "role" &&
                `Are you sure you want to change the role of ${
                  pendingAction.user.full_name || pendingAction.user.email
                } to ${pendingAction.targetValue?.toString().toUpperCase()}? Admins have full access to management tools.`}

              {pendingAction.type === "disable" &&
                `Are you sure you want to ${
                  pendingAction.targetValue ? "disable" : "enable"
                } the account for ${
                  pendingAction.user.full_name || pendingAction.user.email
                }? ${
                  pendingAction.targetValue
                    ? "They will not be able to log in or use the application until re-enabled."
                    : "They will regain access immediately."
                }`}

              {pendingAction.type === "delete" &&
                `This action is irreversible. All habits, completion history, and expense records belonging to ${
                  pendingAction.user.full_name || pendingAction.user.email
                } will be permanently removed.`}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                disabled={actionLoading}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={executePendingAction}
                disabled={actionLoading}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
                  pendingAction.type === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : pendingAction.type === "disable" && pendingAction.targetValue === true
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-[#0f4788] hover:bg-[#1976e8]"
                }`}
              >
                {actionLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

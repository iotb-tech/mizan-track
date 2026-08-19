"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Dashboard from "@/component/dashboard/dashboard";

type UserProfile = {
  name: string;
  email: string;
  createdAt: string;
};

export default function ProfilePage() {
  const supabase = createClient();

  const [profile, setProfile] = useState<UserProfile>({
    name: "User",
    email: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const name =
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          "User";

        setProfile({
          name,
          email: user.email || "",
          createdAt: user.created_at
            ? new Date(user.created_at).toLocaleDateString()
            : "",
        });
      }

      setLoading(false);
    }

    getProfile();
  }, [supabase]);

  return (
    <div>
      <main className="min-h-screen bg-[#f5f8fc] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Profile
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage your account information.
            </p>
          </div>

          {/* Profile Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-slate-500">
                  Loading profile...
                </p>
              </div>
            ) : (
              <>
                {/* Profile Header */}
                <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
                  {/* Avatar */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#1976e8] text-2xl font-bold text-white">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {profile.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {profile.email}
                    </p>
                  </div>
                </div>

                {/* Account Information */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Account Information
                  </h3>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {/* Name */}
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Name
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {profile.name}
                      </p>
                    </div>

                    {/* Email */}
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Email
                      </p>

                      <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                        {profile.email}
                      </p>
                    </div>

                    {/* Account Created */}
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Account Created
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {profile.createdAt || "Not available"}
                      </p>
                    </div>

                    {/* Account Status */}
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Account Status
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                        <p className="text-sm font-semibold text-slate-800">
                          Active
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
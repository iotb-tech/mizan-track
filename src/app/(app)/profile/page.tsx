"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  role: string;
};

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "User",
    email: "",
    avatarUrl: null,
    createdAt: "",
    role: "user",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  function showNotification(message: string, type: "success" | "error" = "success") {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  }

  useEffect(() => {
    async function loadProfileData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profileRow } = await supabase
            .from("profiles")
            .select("full_name, role, avatar_url")
            .eq("id", user.id)
            .maybeSingle();

          const name =
            profileRow?.full_name ||
            user.user_metadata?.name ||
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User";

          const avatarUrl =
            profileRow?.avatar_url || user.user_metadata?.avatar_url || null;

          setProfile({
            id: user.id,
            name,
            email: user.email || "",
            avatarUrl,
            createdAt: user.created_at
              ? new Date(user.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "",
            role: profileRow?.role || "user",
          });
          setNewName(name);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();
  }, [supabase]);

  // Compress image to crisp WebP/JPEG data URL for fast loading & storage
  function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 512;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context failed"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Export high quality image data URL
          const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("Failed to load image file"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  async function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showNotification("Please select a valid image file (JPEG, PNG, WebP, etc.)", "error");
      return;
    }

    // Strict file size limit: Maximum 2MB
    const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
    if (file.size > MAX_FILE_SIZE_BYTES) {
      showNotification("Image file size cannot be greater than 2MB. Please select a smaller image.", "error");
      return;
    }

    setUploading(true);

    try {
      // Process and compress image
      const compressedDataUrl = await compressImage(file);

      let finalAvatarUrl = compressedDataUrl;

      // Try uploading to Supabase Storage if avatars bucket is available
      try {
        const fileExt = file.name.split(".").pop() || "jpg";
        const filePath = `${profile.id}/avatar-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, { upsert: true });

        if (!uploadErr && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);
          if (publicUrlData?.publicUrl) {
            finalAvatarUrl = publicUrlData.publicUrl;
          }
        }
      } catch {
        // If storage bucket is not configured, fall back to compressedDataUrl
      }

      // Update database profile safely
      try {
        const { error: dbErr } = await supabase
          .from("profiles")
          .update({ avatar_url: finalAvatarUrl })
          .eq("id", profile.id);
        if (dbErr) {
          console.warn("Profiles avatar_url update notice:", dbErr.message);
        }
      } catch {
        // Ignore if column missing from schema cache
      }

      // Update auth user metadata (always works)
      await supabase.auth.updateUser({
        data: { avatar_url: finalAvatarUrl },
      });

      setProfile((prev) => ({ ...prev, avatarUrl: finalAvatarUrl }));
      showNotification("Profile picture updated successfully!");
      router.refresh();
    } catch (err) {
      console.error("Avatar upload error:", err);
      showNotification(
        err instanceof Error ? err.message : "Failed to update profile picture",
        "error"
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemoveAvatar() {
    if (!profile.avatarUrl) return;

    setUploading(true);

    try {
      try {
        await supabase
          .from("profiles")
          .update({ avatar_url: null })
          .eq("id", profile.id);
      } catch {
        // Ignore
      }

      await supabase.auth.updateUser({
        data: { avatar_url: null },
      });

      setProfile((prev) => ({ ...prev, avatarUrl: null }));
      showNotification("Profile picture removed.");
      router.refresh();
    } catch {
      showNotification("Failed to remove profile picture", "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveName() {
    if (!newName.trim()) {
      showNotification("Name cannot be empty", "error");
      return;
    }

    setSavingName(true);

    try {
      const { error: dbErr } = await supabase
        .from("profiles")
        .update({ full_name: newName.trim() })
        .eq("id", profile.id);

      if (dbErr) throw new Error(dbErr.message);

      await supabase.auth.updateUser({
        data: { name: newName.trim(), full_name: newName.trim() },
      });

      setProfile((prev) => ({ ...prev, name: newName.trim() }));
      setIsEditingName(false);
      showNotification("Name updated successfully!");
      router.refresh();
    } catch (err) {
      showNotification(
        err instanceof Error ? err.message : "Failed to update name",
        "error"
      );
    } finally {
      setSavingName(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Toast Notification */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-xl transition-all animate-bounce ${
            feedback.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          <span>{feedback.type === "success" ? "✅" : "⚠️"}</span>
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Profile Management
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          View and manage your account details and profile picture.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0f4788] border-r-transparent" />
          </div>
        ) : (
          <>
            {/* Profile Header & Avatar Upload Section */}
            <div className="flex flex-col gap-6 border-b border-slate-100 pb-8 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* Avatar Container with Upload Trigger */}
                <div className="relative group shrink-0">
                  <div className="relative flex h-24 w-24 overflow-hidden rounded-full border-2 border-slate-200 bg-blue-100 text-3xl font-bold text-[#0f4788] shadow-md dark:border-gray-700 dark:bg-blue-950 dark:text-blue-200">
                    {profile.avatarUrl ? (
                      <Image
                        src={profile.avatarUrl}
                        alt={profile.name}
                        width={96}
                        height={96}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        {profile.name.charAt(0).toUpperCase()}
                      </span>
                    )}

                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-r-transparent" />
                      </div>
                    )}
                  </div>

                  {/* Camera Upload Button Badge */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    title="Upload profile photo (maximum file size: 2MB)"
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#1976e8] text-white shadow-lg transition hover:bg-[#0f4788] hover:scale-105 disabled:opacity-50"
                  >
                    📷
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {profile.name}
                    </h2>
                    {profile.role === "admin" && (
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                        Admin
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                    {profile.email}
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
                    Maximum file size: 2MB (JPEG, PNG, WebP).
                  </p>
                </div>
              </div>

              {/* Avatar Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="rounded-xl bg-[#0f4788] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1976e8] active:scale-[0.99] disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload New Photo"}
                </button>

                {profile.avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={uploading}
                    className="rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            {/* Account Details */}
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Account Details
                </h3>

                {!isEditingName && (
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="text-xs font-bold text-[#1976e8] hover:underline"
                  >
                    ✏️ Edit Name
                  </button>
                )}
              </div>

              {/* Editable Name Field */}
              {isEditingName ? (
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
                  <label
                    htmlFor="edit-name"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300"
                  >
                    Full Name
                  </label>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      id="edit-name"
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter your full name..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-[#1976e8] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleSaveName}
                        disabled={savingName}
                        className="rounded-xl bg-[#0f4788] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1976e8] disabled:opacity-50"
                      >
                        {savingName ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewName(profile.name);
                          setIsEditingName(false);
                        }}
                        disabled={savingName}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Full Name */}
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800/60">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-gray-400">
                    Full Name
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-800 dark:text-white">
                    {profile.name}
                  </p>
                </div>

                {/* Email Address */}
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800/60">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-gray-400">
                    Email Address
                  </p>
                  <p className="mt-1.5 break-all text-sm font-semibold text-slate-800 dark:text-white">
                    {profile.email}
                  </p>
                </div>

                {/* Account Created */}
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800/60">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-gray-400">
                    Account Created
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-800 dark:text-white">
                    {profile.createdAt || "Not available"}
                  </p>
                </div>

                {/* Account Status */}
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800/60">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-gray-400">
                    Account Status
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
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
  );
}
"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAuthInput, createAuthSchema } from "@/lib/validation/input";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export function RegisterForm() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateAuthInput>({
    resolver: zodResolver(createAuthSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Compress image client-side to ensure crisp quality & small memory footprint
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
            reject(new Error("Canvas context error"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError("");

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select a valid image file (JPEG, PNG, WebP, etc.)");
      return;
    }

    // Strict 2MB max file size check
    const MAX_2MB = 2 * 1024 * 1024;
    if (file.size > MAX_2MB) {
      setAvatarError("Image file size cannot be greater than 2MB.");
      return;
    }

    setAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  }

  function handleRemoveAvatar() {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const onSubmit = async (data: CreateAuthInput) => {
    const { name, email, password } = data;

    let finalAvatarUrl: string | null = null;

    // Process avatar image if selected
    if (avatarFile) {
      try {
        const compressedDataUrl = await compressImage(avatarFile);
        finalAvatarUrl = compressedDataUrl;

        // Try uploading to Supabase Storage avatars bucket
        try {
          const fileExt = avatarFile.name.split(".").pop() || "jpg";
          const filePath = `public/avatar-${Date.now()}.${fileExt}`;

          const { data: uploadData, error: uploadErr } = await supabase.storage
            .from("avatars")
            .upload(filePath, avatarFile, { upsert: true });

          if (!uploadErr && uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from("avatars")
              .getPublicUrl(filePath);
            if (publicUrlData?.publicUrl) {
              finalAvatarUrl = publicUrlData.publicUrl;
            }
          }
        } catch {
          // Fall back to compressedDataUrl
        }
      } catch {
        // Ignore avatar processing error and proceed with registration
      }
    }

    // Sign up with Supabase Auth
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          full_name: name,
          avatar_url: finalAvatarUrl?.startsWith("http") ? finalAvatarUrl : null,
        },
      },
    });

    if (error) {
      setError("root", {
        message: error.message,
      });
      return;
    }

    if (!authData.user) {
      setError("root", {
        message: "Unable to create account. Please try again.",
      });
      return;
    }

    // Upsert into public.profiles table so avatar_url and profile details are saved
    if (authData.user) {
      try {
        await supabase.from("profiles").upsert(
          {
            id: authData.user.id,
            email,
            full_name: name,
            role: "user",
            is_disabled: false,
            avatar_url: finalAvatarUrl,
          },
          { onConflict: "id" }
        );
      } catch {
        // Ignore if profiles table has minor schema mismatch
      }
    }

    window.location.href = "/dashboard";
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full px-3 py-1 space-y-4"
    >
      {/* Profile Picture Upload Section */}
      <div className="flex flex-col items-center justify-center pt-1 pb-2">
        <div className="relative group">
          <div className="relative flex h-20 w-20 overflow-hidden rounded-full border-2 border-dashed border-neutral-300 bg-neutral-100 text-neutral-400 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Profile Preview"
                width={80}
                height={80}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-xs text-neutral-500">
                <span className="text-xl">📷</span>
                <span className="text-[10px] font-semibold mt-0.5">Photo</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload profile picture (max 2MB)"
            className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#1976e8] text-white shadow-md transition hover:bg-[#0f4788] active:scale-95"
          >
            ✏️
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="mt-2 text-center">
          <div className="flex items-center gap-2 justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold text-primary-600 hover:underline"
            >
              {avatarPreview ? "Change Photo" : "+ Add Profile Photo"}
            </button>
            {avatarPreview && (
              <>
                <span className="text-neutral-300">•</span>
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="text-xs font-medium text-red-500 hover:underline"
                >
                  Remove
                </button>
              </>
            )}
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Optional • Max file size: 2MB
          </p>
        </div>

        {avatarError && (
          <p className="mt-1 text-xs text-red-600 font-medium" role="alert">
            {avatarError}
          </p>
        )}
      </div>

      {/* Full Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
        >
          Full Name
        </label>

        <input
          id="name"
          type="text"
          placeholder="e.g. Alex Johnson"
          autoComplete="name"
          {...register("name")}
          className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />

        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Address */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
          className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            {...register("password")}
            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4.5 w-4.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4.5 w-4.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {errors.root && (
        <p className="text-xs font-semibold text-red-600" role="alert">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-xl bg-primary-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}

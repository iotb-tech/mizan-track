import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url({
    message: "must be your supabse project URL",
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(20, { message: "look too short 'NEXT_PUBLISHABLE__KEY'" }),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});

if(!parsed.success){
    const problems = parsed.error.issues.map((issue) =>`  • ${issue.path.join('.')}: ${issue.message}`).join("\n");

    throw new Error(
      `\n\n❌ Environment is not configured.\n\n${problems}\n\n` +
        `Fix it:\n` +
        `  1. cp .env.example .env.local\n` +
        `  2. Supabase dashboard → Project Settings → API\n` +
        `  3. Paste the Project URL and the anon/publishable key\n` +
        `  4. Restart the dev server — Next.js only reads env files at startup\n`,
    );
}

export const env = parsed.data
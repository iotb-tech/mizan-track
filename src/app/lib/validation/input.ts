import { email, z } from "zod";

export const createAuthSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 character")
    .max(120, "Name must be 120 character or fewer")
    .optional().or(z.literal('')),
  email: z.email({ pattern: z.regexes.html5Email }),
  password: z.string().min(8, "Password must be least 8 character")
});

export type CreateAuthInput = z.infer<typeof createAuthSchema>
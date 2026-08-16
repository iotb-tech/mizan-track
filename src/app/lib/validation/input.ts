import { Frequency } from "@/types/database";
import { z } from "zod";

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


export const createHabitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 character")
    .max(120, "Name must be 120 character or fewer"),
    category: z.string().trim().max(120, "Category must be  120 character or fewers").min(3, "Category must be at least 3 character").optional().or(z.literal('')), 
    frequency: z.enum(Frequency)
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
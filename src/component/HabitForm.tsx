"use client";
import { Field, Input, Select } from ".";
import { useForm } from "react-hook-form";
import { CreateHabitInput, createHabitSchema } from "@/lib/validation/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateHabit } from "@/hooks/useCreateHabit";
import { useData } from "@/lib/UserDataContext";

const defaultCategories = [
  "Personal",
  "Health",
  "Learning",
  "Spiritual",
  "Productivity",
  "Fitness",
  "Other",
];

export function Form({
  setIsOpen,
}: {
  setIsOpen: (val: boolean) => void;
}) {
  const { user_id } = useData();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateHabitInput>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      name: "",
      category: "Personal",
      frequency: "daily",
    },
  });

  const createHabit = useCreateHabit(user_id);

  async function onSubmit(value: CreateHabitInput) {
    try {
      await createHabit.mutateAsync(value);
      reset();
      setIsOpen(false);
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error ? error?.message : "Could not save the habit",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4 mt-2"
    >
      {errors.root && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errors.root.message}
        </div>
      )}

      <Field
        label="Habit name"
        htmlFor="habit-name"
        error={errors.name?.message}
      >
        <Input
          type="text"
          id="habit-name"
          placeholder="e.g. Read 20 pages, Daily Coding Practice"
          {...register("name")}
          aria-invalid={Boolean(errors.name)}
        />
      </Field>

      <Field
        label="Category"
        htmlFor="category"
        error={errors.category?.message}
      >
        <div className="mt-1">
          <Select
            id="category"
            {...register("category")}
            className="w-full rounded-lg border border-neutral-400 p-2.5 outline-0 focus:border-primary-500 bg-white"
          >
            {defaultCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>
      </Field>

      <Field
        label="Frequency"
        htmlFor="frequency"
        error={errors.frequency?.message}
      >
        <div className="mt-1">
          <Select
            id="frequency"
            {...register("frequency")}
            className="w-full rounded-lg border border-neutral-400 p-2.5 outline-0 focus:border-primary-500 bg-white"
          >
            <option value="daily">Daily</option>
            <option value="specific_days">Specific Days</option>
            <option value="weekly_count">Weekly Target</option>
          </Select>
        </div>
      </Field>

      <div className="flex justify-end items-center gap-3 mt-4 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#1976e8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1267cf] disabled:opacity-50 transition"
        >
          {isSubmitting ? "Adding..." : "Add Habit"}
        </button>
      </div>
    </form>
  );
}


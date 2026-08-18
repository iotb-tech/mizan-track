"use client";

import { useHabits } from "@/hooks/useHabits";
import { useData } from "@/lib/UserDataContext";

export default function HabitsList() {
  const { user_id } = useData();
  const { data: habits = [], isLoading, error } = useHabits(user_id);

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-gray-400">
        Loading habits...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-sm text-red-500">
        Error loading habits.
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-gray-500">No habits tracked yet.</p>
        <p className="text-xs text-gray-400 mt-1">
          Add your first habit to begin tracking your streaks.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {habits.map((habit) => (
        <div
          key={habit.id}
          className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0"
        >
          {/* Checkmark circle icon */}
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm transition ${
              habit.doneToday
                ? "bg-[#1976e8] text-white shadow-sm"
                : "bg-blue-50 text-[#1976e8]"
            }`}
          >
            ✓
          </div>

          {/* Habit Details & 7 dots */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {habit.name}
            </p>
            <p className="text-xs text-gray-400">
              {habit.category || "General"}
            </p>

            {/* 7-day visual dots */}
            <div className="mt-1.5 flex items-center gap-1.5">
              {habit.recentHistory.map((done, index) => (
                <span
                  key={index}
                  title={done ? "Completed" : "Not completed"}
                  className={`h-2 w-2 rounded-full transition ${
                    done ? "bg-[#1976e8]" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Streak count */}
          <div className="shrink-0 text-right">
            <span className="text-sm font-bold text-gray-900">
              {habit.streak}{" "}
              <small className="text-xs font-normal text-gray-500">
                {habit.streak === 1 ? "day" : "days"}
              </small>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

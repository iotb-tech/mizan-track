"use client";

import { useState } from "react";
import { useHabits } from "@/hooks/useHabits";
import { useToggleHabit } from "@/hooks/useToggleHabit";
import { useDeleteHabit } from "@/hooks/useDeleteHabit";
import { useData } from "@/lib/UserDataContext";
import { ModalDialog } from "@/component/ModalDialog";
import { Form } from "@/component/HabitForm";

export default function HabitsPage() {
  const { user_id } = useData();
  const { data: habits = [], isLoading, error } = useHabits(user_id);
  const toggleMutation = useToggleHabit(user_id);
  const deleteMutation = useDeleteHabit(user_id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleToggle = async (habitId: string, currentDone: boolean) => {
    try {
      await toggleMutation.mutateAsync({
        habitId,
        targetCompleted: !currentDone,
      });
      showToast(!currentDone ? "Habit completed! 🔥" : "Marked incomplete");
    } catch {
      showToast("Failed to update habit status");
    }
  };

  const handleDelete = async (habitId: string) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;
    try {
      await deleteMutation.mutateAsync(habitId);
      showToast("Habit deleted");
    } catch {
      showToast("Failed to delete habit");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Your Habits
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Build routines and protect your streaks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-[#1976e8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1267cf] shadow-sm"
        >
          + Add Habit
        </button>
      </div>

      {/* Habits Content */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1976e8] border-r-transparent align-[-0.125em]" />
            <p className="mt-3 text-sm">Loading your habits...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">
            <p className="text-sm">Failed to load habits. Please try again.</p>
          </div>
        ) : habits.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-[#1976e8]">
              ✓
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No habits created yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start building your daily routine by adding your first habit.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-5 inline-flex items-center rounded-lg bg-[#1976e8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1267cf]"
            >
              + Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">Habit</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Streak</th>
                  <th className="px-6 py-4">Today</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {habits.map((habit) => (
                  <tr
                    key={habit.id}
                    className="transition hover:bg-gray-50/60"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {habit.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[#1976e8]">
                        {habit.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">
                        🔥 {habit.streak}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          {habit.streak === 1 ? "day" : "days"}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        disabled={toggleMutation.isPending}
                        onClick={() =>
                          handleToggle(habit.id, habit.doneToday)
                        }
                        className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                          habit.doneToday
                            ? "bg-[#1976e8] text-white shadow-sm hover:bg-[#1267cf]"
                            : "border border-gray-300 bg-white text-[#1976e8] hover:bg-blue-50"
                        }`}
                      >
                        {habit.doneToday ? "Completed ✓" : "Mark complete"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        disabled={deleteMutation.isPending}
                        onClick={() => handleDelete(habit.id)}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Habit Modal Dialog */}
      <ModalDialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        dismiss={true}
      >
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900">Add a new habit</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Set up a routine to build consistency.
          </p>
          <Form setIsOpen={setIsModalOpen} />
        </div>
      </ModalDialog>
    </div>
  );
}

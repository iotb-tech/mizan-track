"use client";
import { Button } from "@/component";
import { EmptyState } from "@/component/emptyState";
import { Form } from "@/component/HabitForm";
import { ModalDialog } from "@/component/ModalDialog";
import { useHabit } from "@/hooks/useHabits";
import { useData } from "@/lib/UserDataContext";
import { useState } from "react";

export default function Page() {
  const { user_id } = useData();
  const [isOpen, setIsOpen] = useState<boolean>(false);
   const { data: habits, isLoading, error, refetch } = useHabit(user_id);

   if (!habits || habits.length === 0)
     return <EmptyState title="No habits" message="Try adding a habit" />;
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <div className="px-9 py-3">
        <div className="flex max-sm:flex-col items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Your Habits</h2>
            <p className="text-xs text-neutral-400">
              Build routines and protect your streaks.
            </p>
          </div>
          <Button onClick={toggleModal} variant="primary">
            + Add habit
          </Button>
        </div>
      </div>
      <ModalDialog isOpen={isOpen} setIsOpen={setIsOpen} dismiss={true}>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-2">Add new habit</h2>
          <Form setIsOpen={setIsOpen} />
        </div>
      </ModalDialog>
      <div className="shadow-[0_10px_30px_rgba(15,45,85,0.08)] bg-white text-sm rounded-xl p-5 border border-white">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3.5 text-left text-xs uppercase text-neutral-400 border-b border-neutral-200">
                Habits
              </th>
              <th className="p-3.25 text-left border-b text-xs uppercase text-neutral-400 border-neutral-200">
                Category
              </th>
              <th className="p-3.25 text-left border-b text-xs uppercase text-neutral-400 border-neutral-200">
                Streaks
              </th>
              <th className="p-3.25 text-left border-b text-xs text-neutral-400 border-neutral-200">
                Today
              </th>
              <th className="p-3.25 text-left border-b text-xs text-neutral-400 border-neutral-200"></th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id}>
                <td className="p-3.25 text-xs  text-left border-b border-neutral-200 capitalize">
                  <b>{habit.name}</b>
                </td>
                <td className="p-3.25 text-left text-xs border-b border-neutral-200 capitalize">
                  {habit.category}
                </td>
                <td className="p-3.25 text-left text-xs border-b border-neutral-200">
                  🔥 7 days  {/**depends on habit_logs */}
                </td>
                <td className="p-3.25 text-left text-xs border-b border-neutral-200">
                  <Button variant="secondary" >Completed ✓</Button>
                </td>
                <td className="p-3.25 text-left border-b text-sm border-neutral-200">
                  <Button variant="error">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

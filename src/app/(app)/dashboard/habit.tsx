"use client";

import { Form } from "@/component/HabitForm";
import { ModalDialog } from "@/component/ModalDialog";
import Link from "next/link";
import { ReactNode, useState } from "react";

export function Habit({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Habit Streaks</h2>

        <Link
          href="/habits"
          className="text-sm font-medium text-[#1976e8] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="grow">{children}</div>

      <button
        type="button"
        className="mt-4 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-[#1976e8] hover:bg-gray-50 transition"
        onClick={() => setIsOpen(true)}
      >
        + Add New Habit
      </button>

      <ModalDialog isOpen={isOpen} setIsOpen={setIsOpen} dismiss={true}>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900">Add a new habit</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Set up a routine to build consistency.
          </p>
          <Form setIsOpen={setIsOpen} />
        </div>
      </ModalDialog>
    </div>
  );
}
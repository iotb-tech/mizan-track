"use client";
import { Form } from "@/component/HabitForm";
import { ModalDialog } from "@/component/ModalDialog";
import { useState } from "react";


export  function Habit(){
      const [isOpen, setIsOpen] = useState<boolean>(false);
      const toggleOpen = () => setIsOpen(!isOpen);
      
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Habit Streaks</h2>

          <button className="text-sm font-medium text-[#1976e8]">
            View all
          </button>
        </div>

        <div className="space-y-4">
          {[
            ["Daily Coding Practice", "7 days"],
            ["Reading", "3 days"],
            ["Exercise", "5 days"],
            ["Prayer / Dhikr", "14 days"],
          ].map(([habit, streak]) => (
            <div
              key={habit}
              className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-[#1976e8]">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">{habit}</p>

                  <div className="mt-1 flex gap-1">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <span
                        key={dot}
                        className="h-1.5 w-1.5 rounded-full bg-[#1976e8]"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <span className="text-sm font-semibold text-gray-700">
                {streak}
              </span>
            </div>
          ))}
        </div>

        <button
          className="mt-4 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-[#1976e8] hover:bg-gray-50"
          onClick={toggleOpen}
        >
          + Add New Habit
        </button>
        <ModalDialog isOpen={isOpen} setIsOpen={setIsOpen} dismiss={true}>
          <div className="flex flex-col">
            <h2 className="2xl mb-2">Add new habit</h2>
            <Form setIsOpen={setIsOpen}/>
          </div>
        </ModalDialog>
      </div>
    );
}
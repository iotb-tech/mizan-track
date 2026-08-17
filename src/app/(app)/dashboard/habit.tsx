"use client";
import { Form } from "@/component/HabitForm";
import { ModalDialog } from "@/component/ModalDialog";
import { useData } from "@/lib/UserDataContext";
import { ReactNode, useState } from "react";



export  function Habit({children}:{children: ReactNode}){
      const [isOpen, setIsOpen] = useState<boolean>(false);
      const toggleOpen = () => setIsOpen(!isOpen);
      const { user_id } = useData();
      
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Habit Streaks</h2>

          <button className="text-sm font-medium text-[#1976e8]">
            View all
          </button>
        </div>
        <div className="grow">{children}</div>
        <button
          className="mt-4 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-[#1976e8] hover:bg-gray-50"
          onClick={toggleOpen}
        >
          + Add New Habit
        </button>
        <ModalDialog isOpen={isOpen} setIsOpen={setIsOpen} dismiss={true}>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-2">Add new habit</h2>
            <Form setIsOpen={setIsOpen} />
          </div>
        </ModalDialog>
      </div>
    );
}
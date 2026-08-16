"use client";
import { Days } from "@/types/data";
import { Field, Input, Select, Button } from ".";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateHabitInput, createHabitSchema } from "@/app/lib/validation/input";
import { zodResolver } from "@hookform/resolvers/zod";


export function Form({ setIsOpen, userId }:{ setIsOpen:(val:boolean)=>void; userId: string }){
    const [select, setSelect] =useState<string>("");
    const { register, handleSubmit, reset, setError, formState:{ errors, isSubmitting }} = useForm<CreateHabitInput>({resolver:zodResolver(createHabitSchema), defaultValues:{
        name: '',
        category: '',
    frequency: "daily",
    }});

    //const createHaabit = 

    async function onSubmit(value: CreateHabitInput) {
        try{
            await 
        }
    }

   



    return (
      <form action="" noValidate className="flex flex-col gap-3">
        <Field label="Habit Name" htmlFor="habit-name">
          <Input type="text" id="habit-name" placeholder="name of the habit" />
        </Field>
        <Field label="Category" htmlFor="category">
          <Input
            type="text"
            id="category"
            placeholder="category of the habit"
          />
        </Field>
        <Field label="Frequency" htmlFor="frequency">
          <div className="flex flex-col">
            <Select
              id="frequency"
              name="frequency"
              value={select}
              onChange={(e) => setSelect(e.target.value)}
              className="p-2.5 border-neutral-400 focus:border-primary-500 rounded-lg border mt-4 focus:border"
            >
              <optgroup>
                <option value="daily">Daily</option>
                <option value="specific_days">Specific Day</option>
                <option value="weekly_count">Weekly Count</option>
              </optgroup>
            </Select>
          </div>
        </Field>

        {select === "specific_days" ? (
          <Field label="" htmlFor="frequency">
            <div className="flex flex-col">
              <Select
                id="specific_days"
                name="specific_days"
                value={""}
                onChange={()=> console.log("mm")}
                className="p-2.5 border-neutral-400 focus:border-primary-500 rounded-lg border mt-4 focus:border"
              >
                <option>--Select Days--</option>
                <optgroup>
                  {Days.map(([label, value]) => {
                    return (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    );
                  })}
                </optgroup>
              </Select>
            </div>
          </Field>
        ) : (
          ""
        )}
        {select === "weekly_count" ? (
          <Field label="Weekly Count" htmlFor="weekly_count">
         <Input type="text" id="weekly_count" />
          </Field>
        ) : (
          ""
        )}

        <div className="flex justify-end items-center gap-5 mt-4">
          <Button variant="muted" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            add habit
          </Button>
        </div>
      </form>
    );
}
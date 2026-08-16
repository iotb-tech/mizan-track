import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../supabase/client";
import { Habit } from "@/types/database";
import { CreateHabitInput } from "@/app/lib/validation/input";
import { createHabit } from "../api/habit";


export function useCreateHabit(userId: string){
    const supabase = createClient();
    const queryClient = useQueryClient();
    return useMutation<Habit, Error, CreateHabitInput>({
        mutationFn: (input: CreateHabitInput) => createHabit(supabase, userId, input),
        onSuccess: () =>{
            queryClient.invalidateQueries({})
        }
    })
}
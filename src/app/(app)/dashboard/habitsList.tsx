"use client"
import { EmptyState } from "@/component/emptyState";
import { useHabit } from "@/hooks/useHabits";
import { useData } from "@/lib/UserDataContext";



export default  function HabitsList(){
    const { user_id } = useData();
    //const supabase = await createClient();
    // const habits = await fetchHabits(supabase, user_id);

    const { data:habits, isLoading, error, refetch} = useHabit(user_id);

    if(!habits || habits.length === 0) return <EmptyState title="No habits" message="Try adding a habit" />;


        
    return (
      <>
          <div className="space-y-4">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="flexflex-col justify-center border-b border-gray-100 pb-4 last:border-0"
              >
                <p className="text-lg font-medium text-neutral-800">{habit.name}</p>
                <p className="text-sm">{habit.category}</p>
              </div>
            ))}
          </div>
      </>
    );
}
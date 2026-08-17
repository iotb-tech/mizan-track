import Dashboard from "@/component/dashboard/dashboard";
import HabitsList from "./habitsList";
import { Habit } from "./habit";


export default function Dashboardcover(){
  return(
    <Dashboard>
      <Habit>
        <HabitsList />
      </Habit>
    </Dashboard>
  )
}        
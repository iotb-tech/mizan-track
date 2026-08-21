"use client";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart,
  Tooltip,
  Legend,
  ArcElement,
  Title,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
} from "chart.js";
import { useExpenses } from "@/hooks/useExpenses";
import { useData } from "@/lib/UserDataContext";
import { useEffect, useMemo } from "react";
import { Expense } from "@/types/database";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LineElement,
  LinearScale,
);

export const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const date: Date = new Date();
export const targetMonth = date.getMonth() + 1;
export const targetYear = date.getFullYear();

export const generateColor = (value: number): string[] => {
  return Array.from({ length: value }, (_, i) => {
    const hue = ((i * 360) / value) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  });
};

export function filterData(arr: Expense[]) {
  const filtered = arr.filter((item: Expense) => {
    const month = new Date(item.date).getMonth() + 1 === targetMonth;
    const year = new Date(item.date).getFullYear() === targetYear;
    return month && year;
  });
  return filtered;
}

export function Chartdata({setaverageExpense, setTotal}:{setaverageExpense?: (e:number)=> void; setTotal?: (e:number)=>void }) {
  const { user_id } = useData();
  const { data: expenses = [], isLoading, error } = useExpenses(user_id);
  const filteredexpense = filterData(expenses);
  const grouped: Record<string, number> = {};
  for (const expense of filteredexpense) {
    if (Object.hasOwn(grouped, expense.category)) {
      const currentValue = grouped[expense.category]!;
      grouped[expense.category] = currentValue + expense.amount;
    } else {
      grouped[expense.category] = expense.amount;
    }
  }

  const dynamicColor = generateColor(expenses.length);

  const label = Object.keys(grouped);
  const value = Object.values(grouped);
    const total = Math.round(value.reduce(((current, total)=> total + current),0));
    const average = total/value.length
    useEffect(()=> { 
        if(setaverageExpense){
            setaverageExpense(average)}
        },[average,setaverageExpense])
    useEffect(()=> { 
        if(setTotal){
            setTotal(total)}
        },[total,setTotal])

  const data = useMemo(() => {
    return {
      labels: label,
      datasets: [
        {
          label: "expenses",
          data: value,
          backgroundColor: dynamicColor,
          borderWidth: 1,
        },
      ],
    };
  }, [value, dynamicColor, label]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Expenses Of This Month",
      },
    },
  } as const;

  return (
    <div>
      {isLoading ? (
        <div>
          <div className="p-12 text-center text-gray-500">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1976e8] border-r-transparent align-[-0.125em]" />
            <p className="mt-3 text-sm">Loading...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-12 text-center text-red-500">
          <p className="text-sm">Failed to load . Please try again.</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-[#1976e8]">
            ✓
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No Expenses created yet
          </h3>
        
          
        </div>
      ) : (
        <Doughnut data={data} options={options} />
      )}
    </div>
  );
}




export function BarChart({ islastWeek }: { islastWeek: string }) {
  const { user_id } = useData();
  const { data: expenses = [], isLoading, error } = useExpenses(user_id);
  const filteredexpense = filterData(expenses);
  const dynamicColor = generateColor(expenses.length);

  const isThisWeekexp = [];
  const isLastWeekexp = [];
  for (const expense of filteredexpense) {
    const withDay = {
      ...expense,
      day: new Date(expense.date).toLocaleDateString("en-US", {
        weekday: "short",
      }),
    };
    const dayAgo = Math.floor(
      (date.getTime() - new Date(expense.date).getTime()) / 86400000,
    );
    if (dayAgo <= 6) {
      isThisWeekexp.push(withDay);
    } else if (dayAgo >= 7 && dayAgo <= 13) {
      isLastWeekexp.push(withDay);
    }
  }

  const groupedthisWeek: Record<string, number> = {};
  for (const expense of isThisWeekexp) {
    if (Object.hasOwn(groupedthisWeek, expense.day)) {
      const currentValue = groupedthisWeek[expense.day]!;
      groupedthisWeek[expense.day] = currentValue + expense.amount;
    } else {
      groupedthisWeek[expense.day] = expense.amount;
    }
  }
  const groupedLastWeek: Record<string, number> = {};
  for (const expense of isLastWeekexp) {
    if (Object.hasOwn(groupedLastWeek, expense.day)) {
      const currentValue = groupedLastWeek[expense.day]!;
      groupedLastWeek[expense.day] = currentValue + expense.amount;
    } else {
      groupedLastWeek[expense.day] = expense.amount;
    }
  }
  let weekdata: number[] = useMemo(()=>[],[])
  if (islastWeek === "last_week") {
    weekdata = weekdays.map((day) => groupedLastWeek[day] ?? 0);
  } if (islastWeek === "this_week") {
    weekdata = weekdays.map((day) => groupedthisWeek[day] ?? 0);
  }

   const data = useMemo(() => {
     return {
       labels: weekdays,
       datasets: [
         {
           label: "expenses",
           data: weekdata,
           backgroundColor: dynamicColor,
           borderWidth: 1
         },
       ],
     };
   }, [dynamicColor, weekdata]);
   const options = {
     responsive: true,
     plugins: {
       legend: {
         position: "top",
       },
       title: {
         display: true,
         text: "Expenses Of This Month",
       },
     },
   } as const;

   return (
     <div>
       {isLoading ? (
         <div>
           <div className="p-12 text-center text-gray-500">
             <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1976e8] border-r-transparent align-[-0.125em]" />
             <p className="mt-3 text-sm">Loading...</p>
           </div>
         </div>
       ): error ? (
        <div className="p-12 text-center text-red-500">
          <p className="text-sm">Failed to load . Please try again.</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-[#1976e8]">
            ✓
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No Expenses created yet
          </h3>
        
          
        </div>
      )  : (
         <Bar data={data} options={options} />
       )}
     </div>
   );
}

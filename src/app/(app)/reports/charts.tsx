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
  LinearScale,
);

export const weekdays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export function generateColor(value: number): string[] {
  if (value === 0) return [];

  return Array.from({ length: value }, (_, i) => {
    const hue = ((i * 360) / value) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  });
}

function getMonthExpenses(expenses: Expense[]) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);

    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });
}

export function Chartdata({
  setAverageExpense,
  setTotal,
}: {
  setAverageExpense?: (value: number) => void;
  setTotal?: (value: number) => void;
}) {
  const { user_id } = useData();

  const {
    data: expenses = [],
    isLoading,
    error,
  } = useExpenses(user_id);

  const filteredExpenses = getMonthExpenses(expenses);

  const grouped = useMemo(() => {
    const result: Record<string, number> = {};

    for (const expense of filteredExpenses) {
      result[expense.category] =
        (result[expense.category] ?? 0) + expense.amount;
    }

    return result;
  }, [filteredExpenses]);

  const labels = Object.keys(grouped);
  const values = Object.values(grouped);

  const total = useMemo(
    () => values.reduce((sum, value) => sum + value, 0),
    [values],
  );

  const average = useMemo(
    () => (values.length > 0 ? total / values.length : 0),
    [total, values.length],
  );

  useEffect(() => {
    setAverageExpense?.(average);
    setTotal?.(total);
  }, [average, total, setAverageExpense, setTotal]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Expenses",
          data: values,
          backgroundColor: generateColor(labels.length),
          borderWidth: 1,
        },
      ],
    }),
    [labels, values],
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Expenses by Category",
      },
    },
  } as const;

  if (isLoading) {
    return (
      <div className="p-12 text-center text-gray-500">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1976e8] border-r-transparent align-[-0.125em]" />
        <p className="mt-3 text-sm">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center text-red-500">
        <p className="text-sm">
          Failed to load expenses. Please try again.
        </p>
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="p-12 text-center">
        <h3 className="text-lg font-semibold text-gray-500">
          No expenses recorded this month
        </h3>
      </div>
    );
  }

  return <Doughnut data={data} options={options} />;
}

export function BarChart({
  isLastWeek,
}: {
  isLastWeek: string;
}) {
  const { user_id } = useData();

  const {
    data: expenses = [],
    isLoading,
    error,
  } = useExpenses(user_id);

  const weekData = useMemo(() => {
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const selectedExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      const expenseDay = new Date(
        expenseDate.getFullYear(),
        expenseDate.getMonth(),
        expenseDate.getDate(),
      );

      const difference =
        Math.floor(
          (startOfToday.getTime() - expenseDay.getTime()) / 86400000,
        );

      if (isLastWeek === "this_week") {
        return difference >= 0 && difference <= 6;
      }

      return difference >= 7 && difference <= 13;
    });

    const grouped: Record<string, number> = {};

    for (const expense of selectedExpenses) {
      const day = new Date(expense.date).toLocaleDateString("en-US", {
        weekday: "short",
      });

      grouped[day] = (grouped[day] ?? 0) + expense.amount;
    }

    return weekdays.map((day) => grouped[day] ?? 0);
  }, [expenses, isLastWeek]);

  const data = useMemo(
    () => ({
      labels: weekdays,
      datasets: [
        {
          label:
            isLastWeek === "this_week"
              ? "This week"
              : "Last week",
          data: weekData,
          backgroundColor: generateColor(weekdays.length),
          borderWidth: 1,
        },
      ],
    }),
    [weekData, isLastWeek],
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text:
          isLastWeek === "this_week"
            ? "Spending This Week"
            : "Spending Last Week",
      },
    },
  } as const;

  if (isLoading) {
    return (
      <div className="p-12 text-center text-gray-500">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1976e8] border-r-transparent align-[-0.125em]" />
        <p className="mt-3 text-sm">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center text-red-500">
        <p className="text-sm">
          Failed to load expenses. Please try again.
        </p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="p-12 text-center">
        <h3 className="text-lg font-semibold text-gray-500">
          No expenses recorded yet
        </h3>
      </div>
    );
  }

  return <Bar data={data} options={options} />;
}
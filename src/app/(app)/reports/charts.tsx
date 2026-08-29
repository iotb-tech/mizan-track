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

export type DateRangeSelection = {
  from: string;
  to: string;
};

function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getRangeDates(isLastWeek: string, dateRange?: DateRangeSelection) {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  if (isLastWeek === "this_week") {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    return {
      start: new Date(startOfWeek),
      end: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6),
    };
  }

  if (isLastWeek === "last_week") {
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - today.getDay());

    const startOfLastWeek = new Date(startOfCurrentWeek);
    startOfLastWeek.setDate(startOfCurrentWeek.getDate() - 7);

    return {
      start: new Date(startOfLastWeek),
      end: new Date(startOfLastWeek.getFullYear(), startOfLastWeek.getMonth(), startOfLastWeek.getDate() + 6),
    };
  }

  if (isLastWeek === "this_month") {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    };
  }

  if (isLastWeek === "date_range") {
    if (!dateRange?.from || !dateRange?.to) {
      return { start: today, end: today };
    }

    const fromDate = parseLocalDate(dateRange.from);
    const toDate = parseLocalDate(dateRange.to);

    const rangeStart = fromDate <= toDate ? fromDate : toDate;
    const rangeEnd = fromDate <= toDate ? toDate : fromDate;

    return {
      start: new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate()),
      end: new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate()),
    };
  }

  return { start: today, end: today };
}

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
  dateRange,
}: {
  isLastWeek: string;
  dateRange?: DateRangeSelection;
}) {
  const { user_id } = useData();

  const {
    data: expenses = [],
    isLoading,
    error,
  } = useExpenses(user_id);

  const range = useMemo(
    () => getRangeDates(isLastWeek, dateRange),
    [dateRange, isLastWeek],
  );

  const { start, end } = range;

  const chartData = useMemo(() => {
    const selectedExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(`${expense.date}T00:00:00`);
      return expenseDate >= start && expenseDate <= end;
    });

    const grouped: Record<string, number> = {};

    for (const expense of selectedExpenses) {
      const expenseDate = new Date(`${expense.date}T00:00:00`);

      let key = "";

      if (isLastWeek === "this_week" || isLastWeek === "last_week") {
        key = expenseDate.toLocaleDateString("en-US", { weekday: "short" });
      } else if (isLastWeek === "this_month") {
        key = String(expenseDate.getDate());
      } else if (isLastWeek === "date_range") {
        const year = expenseDate.getFullYear();
        const month = String(expenseDate.getMonth() + 1).padStart(2, "0");
        const day = String(expenseDate.getDate()).padStart(2, "0");
        key = `${year}-${month}-${day}`;
      }

      grouped[key] = (grouped[key] ?? 0) + Number(expense.amount || 0);
    }

    if (isLastWeek === "this_week" || isLastWeek === "last_week") {
      return {
        labels: weekdays,
        values: weekdays.map((day) => grouped[day] ?? 0),
        title:
          isLastWeek === "this_week"
            ? "Spending This Week"
            : "Spending Last Week",
        label:
          isLastWeek === "this_week" ? "This week" : "Last week",
      };
    }

    if (isLastWeek === "this_month") {
      const daysInMonth = new Date(
        start.getFullYear(),
        start.getMonth() + 1,
        0,
      ).getDate();

      const labels = Array.from({ length: daysInMonth }, (_, index) =>
        String(index + 1),
      );

      return {
        labels,
        values: labels.map((day) => grouped[day] ?? 0),
        title: "Spending This Month",
        label: "This month",
      };
    }

    if (isLastWeek === "date_range") {
      const labels: string[] = [];
      const values: number[] = [];
      const currentDate = new Date(start);

      while (currentDate <= end) {
        const key = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
        labels.push(formatShortDate(currentDate));
        values.push(grouped[key] ?? 0);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return {
        labels,
        values,
        title:
          `Spending ${toDateInputValue(start)} to ${toDateInputValue(end)}`,
        label: "Selected range",
      };
    }

    return {
      labels: weekdays,
      values: weekdays.map((day) => grouped[day] ?? 0),
      title: "Spending Overview",
      label: "Spending",
    };
  }, [end, expenses, isLastWeek, start]);

  const data = useMemo(
    () => ({
      labels: chartData.labels,
      datasets: [
        {
          label: chartData.label,
          data: chartData.values,
          backgroundColor: generateColor(chartData.labels.length || 1),
          borderWidth: 1,
        },
      ],
    }),
    [chartData],
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: chartData.title,
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

  if (expenses.length === 0 || chartData.values.every((value) => value === 0)) {
    return (
      <div className="p-12 text-center">
        <h3 className="text-lg font-semibold text-gray-500">
          No expenses recorded for this period
        </h3>
      </div>
    );
  }

  return <Bar data={data} options={options} />;
}
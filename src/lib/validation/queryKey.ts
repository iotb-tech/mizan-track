export const queryKey = {
  profile: ["profile"] as const,
};

export const habitKeys = {
  all:['habits'] as const,
  list:(userId: string) => [...habitKeys.all, 'list', userId] as const,
  detail: (habitId: string) => [...habitKeys.all, 'detail', habitId] as const
};

export const expenseKeys = {
  all: ["expenses"] as const,
  list: (userId: string) => [...expenseKeys.all, "list", userId] as const,
  detail: (expenseId: string) =>
    [...expenseKeys.all, "detail", expenseId] as const,
};
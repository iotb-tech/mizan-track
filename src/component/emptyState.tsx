export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="flex h-auto w-full flex-col items-center justify-center font-semibold text-neutral-700 dark:text-neutral-300">
      <h3 className="text-3xl">{title}</h3>
      <p className="text-xl">{message}</p>
    </div>
  );
}
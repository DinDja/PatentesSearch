export const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
      <Icon className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
      <div className="text-center">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
    </div>
  );
};

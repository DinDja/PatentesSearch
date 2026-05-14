export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100',
    primary: 'bg-teal-100 dark:bg-teal-900/30 text-teal-900 dark:text-teal-400'
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

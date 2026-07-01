'use client';

const VARIANTS = {
  default: 'bg-bg-tertiary text-fg-secondary border-border-subtle',
  primary: 'bg-accent-primary-subtle text-accent-primary border-accent-primary/20',
  success: 'bg-accent-success-subtle text-accent-success border-accent-success/20',
  warning: 'bg-accent-warning-subtle text-accent-warning border-accent-warning/20',
  danger: 'bg-accent-danger-subtle text-accent-danger border-accent-danger/20',
};

export function StatusBadge({ children, variant = 'default', className = '' }) {
  const variantClass = VARIANTS[variant] || VARIANTS.default;

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium ${variantClass} ${className}`}
    >
      {children}
    </span>
  );
}
'use client';

const VARIANTS = {
  default: 'bg-surface text-text-secondary',
  primary: 'bg-brand-blueLight text-brand-blue',
  success: 'bg-brand-greenLight text-brand-green',
  warning: 'bg-brand-yellowLight text-brand-yellow',
  danger: 'bg-brand-redLight text-brand-red',
};

export function StatusBadge({ children, variant = 'default', className = '' }) {
  const variantClass = VARIANTS[variant] || VARIANTS.default;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClass} ${className}`}
    >
      {children}
    </span>
  );
}

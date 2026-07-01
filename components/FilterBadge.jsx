'use client';

import { X } from 'lucide-react';

export function FilterBadge({ label, onRemove, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg bg-accent-primary-subtle px-2.5 py-1.5 text-xs font-medium text-accent-primary border border-accent-primary/20 ${className}`}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="flex h-4 w-4 items-center justify-center rounded-md hover:bg-accent-primary/20 transition-colors duration-fast"
          aria-label={`Remover filtro: ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
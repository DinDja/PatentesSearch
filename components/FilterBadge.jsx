'use client';

import { X } from 'lucide-react';

export function FilterBadge({ label, onRemove, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md bg-accent-primary text-fg-inverse px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="flex h-3.5 w-3.5 items-center justify-center rounded-sm hover:bg-accent-primary/80 transition-colors duration-normal"
          aria-label={`Remover filtro: ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
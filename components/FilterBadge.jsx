'use client';

import { X } from 'lucide-react';

export function FilterBadge({ label, onRemove, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-brand-blueLight px-2.5 py-1 text-xs font-medium text-brand-blue ${className}`}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full hover:bg-brand-blue/20 transition-colors"
          aria-label={`Remover filtro: ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

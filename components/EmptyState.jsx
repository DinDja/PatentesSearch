'use client';

import { Search } from 'lucide-react';

export function EmptyState({ title, description, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-24 ${className}`}
      role="status"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-tertiary mb-5">
        <Search className="h-7 w-7 text-fg-muted" />
      </div>
      <h3 className="text-sm font-semibold text-fg-primary">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-center text-sm text-fg-secondary leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
'use client';

import { Search } from 'lucide-react';

export function EmptyState({ title, description, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-20 ${className}`}
      role="status"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-bg-tertiary mb-4">
        <Search className="h-5 w-5 text-fg-muted" />
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
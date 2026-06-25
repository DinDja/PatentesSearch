'use client';

import { Search } from 'lucide-react';

export function EmptyState({ title, description, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-20 ${className}`}
      role="status"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface">
        <Search className="h-6 w-6 text-text-tertiary" />
      </div>
      <h3 className="text-sm font-medium text-text-primary">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-center text-sm text-text-secondary">
          {description}
        </p>
      )}
    </div>
  );
}

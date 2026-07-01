'use client';

import { ResultItem } from './ResultItem';

export function ResultsList({ items, onItemClick, className = '' }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {items.map((item, idx) => (
        <ResultItem
          key={item.numero || idx}
          item={item}
          onClick={() => onItemClick(item)}
        />
      ))}
    </div>
  );
}
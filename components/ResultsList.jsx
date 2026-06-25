'use client';

import { ResultItem } from './ResultItem';

export function ResultsList({ items, onItemClick, className = '' }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`w-full ${className}`}>
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

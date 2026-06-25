'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage, totalPages, onPageChange, disabled = false }) {
  if (totalPages <= 1) return null;

  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const buttonBase =
    'flex h-9 min-w-9 items-center justify-center rounded-full text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const buttonActive = 'bg-brand-blueLight text-brand-blue cursor-default';
  const buttonInactive =
    'text-brand-link hover:bg-surface cursor-pointer';

  return (
    <nav
      className="flex items-center justify-center gap-1 pt-8 pb-4"
      aria-label="Paginacao dos resultados"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || disabled}
        className={`${buttonBase} px-2 text-brand-link hover:bg-surface`}
        aria-label="Pagina anterior"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">Anterior</span>
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => page !== currentPage && !disabled && onPageChange(page)}
            disabled={disabled}
            className={`${buttonBase} ${page === currentPage ? buttonActive : buttonInactive}`}
            aria-label={`Pagina ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || disabled}
        className={`${buttonBase} px-2 text-brand-link hover:bg-surface`}
        aria-label="Proxima pagina"
      >
        <span className="mr-1 hidden sm:inline">Proxima</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

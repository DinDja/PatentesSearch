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

  return (
    <nav
      className="flex items-center justify-center gap-2 pt-6 pb-4"
      aria-label="Paginação dos resultados"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || disabled}
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary transition-all duration-normal disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      <div className="flex items-center gap-1.5">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => page !== currentPage && !disabled && onPageChange(page)}
            disabled={disabled}
            className={`min-w-9 h-9 rounded-md text-sm font-medium transition-all duration-normal ${
              page === currentPage
                ? 'bg-accent-primary text-fg-inverse'
                : 'text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            aria-label={`Página ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || disabled}
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary transition-all duration-normal disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        aria-label="Próxima página"
      >
        <span className="hidden sm:inline">Próxima</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </nav>
  );
}
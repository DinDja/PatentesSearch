'use client';

import { motion } from 'framer-motion';
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
      className="flex items-center justify-center gap-2 pt-8 pb-4"
      aria-label="Paginacao dos resultados"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || disabled}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary transition-all duration-fast disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        aria-label="Pagina anterior"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      <div className="flex items-center gap-1.5">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => page !== currentPage && !disabled && onPageChange(page)}
            disabled={disabled}
            className={`min-w-9 h-9 rounded-lg text-sm font-medium transition-all duration-fast ${
              page === currentPage
                ? 'bg-accent-primary text-fg-inverse shadow-sm'
                : 'text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
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
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary transition-all duration-fast disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        aria-label="Proxima pagina"
      >
        <span className="hidden sm:inline">Proxima</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
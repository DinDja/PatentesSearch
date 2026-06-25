'use client';

import { Search, X, Loader2 } from 'lucide-react';

export function SearchBar({
  value,
  onChange,
  onSubmit,
  loading = false,
  placeholder = 'Pesquise por patentes, programas de computador, depositantes, numeros ou classificacao IPC...',
  autoFocus = false,
  compact = false,
  className = '',
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="group relative flex items-center">
        <div
          className={`relative flex w-full items-center rounded-search border border-transparent bg-white shadow-search transition-shadow hover:shadow-search-hover focus-within:shadow-search-hover focus-within:border-transparent ${
            compact ? 'h-11' : 'h-12 sm:h-14'
          }`}
        >
          <Search className="pointer-events-none ml-4 h-5 w-5 flex-shrink-0 text-text-tertiary" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            aria-label="Campo de busca de patentes"
            className={`flex-1 border-0 bg-transparent px-3 text-text-primary placeholder:text-text-tertiary outline-none ${
              compact ? 'text-sm' : 'text-base sm:text-lg'
            }`}
          />
          {value && !loading && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="mr-1 flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary hover:bg-surface transition-colors"
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {loading && (
            <Loader2 className="mr-4 h-5 w-5 flex-shrink-0 animate-spin text-brand-blue" aria-hidden="true" />
          )}
        </div>
      </div>

      {!compact && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="h-9 rounded-md bg-surface px-5 text-sm font-medium text-text-secondary hover:border hover:border-gray-300 hover:shadow-sm transition-all disabled:opacity-50"
            aria-label="Pesquisar patentes"
          >
            Pesquisa Patentes BR
          </button>
        </div>
      )}

      {compact && <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />}
    </form>
  );
}

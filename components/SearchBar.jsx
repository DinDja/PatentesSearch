'use client';

import { Search, X, Loader2, ArrowRight } from 'lucide-react';

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
      <div className="group relative">
        <div
          className={`relative flex w-full items-center overflow-hidden rounded-2xl transition-all duration-fast ease-out ${
            compact ? 'h-12' : 'h-14 sm:h-16'
          } ${
            loading
              ? 'shadow-lg shadow-accent-primary-subtle/50'
              : 'bg-bg-primary shadow-sm hover:shadow-md'
          } focus-within:shadow-lg focus-within:shadow-accent-primary-subtle/50`}
        >
          <div className="absolute left-4 flex items-center justify-center">
            <Search
              className={`h-5 w-5 flex-shrink-0 transition-all duration-fast ${
                loading
                  ? 'text-accent-primary'
                  : 'text-fg-muted group-focus-within:text-accent-primary'
              }`}
            />
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            aria-label="Campo de busca de patentes"
            disabled={loading}
            className={`flex-1 border-0 bg-transparent pl-12 pr-4 text-fg-primary placeholder:text-fg-muted outline-none disabled:opacity-60 ${
              compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
            }`}
          />

          <div className="absolute right-3 flex items-center gap-2">
            {value && !loading && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="flex h-8 w-8 items-center justify-center rounded-full text-fg-muted opacity-0 transition-all duration-fast hover:bg-bg-tertiary hover:text-fg-secondary group-focus-within:opacity-100"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            {loading && (
              <div className="flex h-8 w-8 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-accent-primary" />
              </div>
            )}

            {!compact && !loading && (
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-primary text-fg-inverse opacity-0 transition-all duration-fast hover:bg-accent-primary-hover hover:scale-105 group-focus-within:opacity-100 disabled:opacity-50 disabled:hover:scale-100"
                aria-label="Pesquisar"
                disabled={loading || !value.trim()}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {compact && (
          <button
            type="submit"
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
      </div>
    </form>
  );
}
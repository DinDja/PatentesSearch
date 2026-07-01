'use client';

import { Search, X, Loader2 } from 'lucide-react';

export function SearchBar({
  value,
  onChange,
  onSubmit,
  loading = false,
  placeholder = 'Pesquise por patentes, programas de computador, depositantes, números ou classificação IPC...',
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
          className={`relative flex w-full items-center overflow-hidden rounded-lg border border-border-primary bg-bg-elevated shadow-sm transition-all duration-normal ease-out ${
            compact ? 'h-10' : 'h-14 sm:h-16'
          } ${
            loading
              ? 'border-accent-primary bg-bg-secondary'
              : 'hover:border-border-secondary focus-within:border-accent-primary focus-within:bg-bg-primary'
          }`}
        >
          <div className="absolute left-4 flex items-center justify-center">
            <Search
              className={`h-4 w-4 flex-shrink-0 transition-all duration-normal ${
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
            className={`flex-1 border-0 bg-transparent pl-11 pr-4 text-fg-primary placeholder:text-fg-muted outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
              compact ? 'text-sm' : 'text-base'
            }`}
          />

          <div className="absolute right-3 flex items-center gap-2">
            {value && !loading && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="flex h-7 w-7 items-center justify-center rounded-md text-fg-muted opacity-0 transition-all duration-normal hover:bg-bg-tertiary hover:text-fg-secondary focus-within:opacity-100"
                aria-label="Limpar busca"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            
            {loading && (
              <div className="flex h-7 w-7 items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-accent-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
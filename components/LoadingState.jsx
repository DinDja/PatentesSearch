'use client';

export function LoadingState({ count = 5, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`} role="status" aria-label="Carregando resultados">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border-subtle bg-bg-primary p-5 shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="skeleton h-6 w-20 rounded" />
              <div className="skeleton h-6 w-16 rounded" />
            </div>
            <div className="skeleton h-5 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
          </div>
        </div>
      ))}
      <span className="sr-only">Carregando resultados...</span>
    </div>
  );
}
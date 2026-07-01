'use client';

export function LoadingState({ count = 5, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Carregando resultados">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-md border border-border-primary bg-bg-elevated p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="skeleton h-4 w-16 rounded-sm" />
              <div className="skeleton h-4 w-12 rounded-sm" />
            </div>
            <div className="skeleton h-4 w-3/4 rounded-sm" />
            <div className="skeleton h-3.5 w-1/2 rounded-sm" />
          </div>
        </div>
      ))}
      <span className="sr-only">Carregando resultados...</span>
    </div>
  );
}
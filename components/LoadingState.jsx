'use client';

export function LoadingState({ count = 5, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`} role="status" aria-label="Carregando resultados">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="py-5 border-b border-gray-100">
          <div className="skeleton h-3.5 w-32 mb-2" />
          <div className="skeleton h-5 w-3/4 mb-2" />
          <div className="skeleton h-3.5 w-1/2" />
        </div>
      ))}
      <span className="sr-only">Carregando resultados...</span>
    </div>
  );
}

'use client';

import { AlertTriangle, X } from 'lucide-react';

export function ErrorState({ message, onDismiss, className = '' }) {
  if (!message) return null;

  return (
    <div
      className={`flex items-start gap-3 rounded-xl bg-accent-danger-subtle border border-accent-danger/20 px-4 py-3.5 ${className}`}
      role="alert"
    >
      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-accent-danger mt-0.5" />
      <p className="flex-1 text-sm text-accent-danger leading-relaxed">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-accent-danger/70 hover:bg-accent-danger/10 transition-all duration-fast"
          aria-label="Fechar mensagem de erro"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
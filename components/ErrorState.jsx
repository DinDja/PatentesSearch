'use client';

import { AlertTriangle, X } from 'lucide-react';

export function ErrorState({ message, onDismiss, className = '' }) {
  if (!message) return null;

  return (
    <div
      className={`flex items-start gap-3 rounded-md bg-accent-danger-subtle border border-accent-danger/20 px-4 py-3 ${className}`}
      role="alert"
    >
      <AlertTriangle className="h-4 w-4 flex-shrink-0 text-accent-danger mt-0.5" />
      <p className="flex-1 text-sm text-accent-danger leading-relaxed">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex h-6 w-6 items-center justify-center rounded-sm text-accent-danger/70 hover:bg-accent-danger/10 transition-all duration-normal"
          aria-label="Fechar mensagem de erro"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
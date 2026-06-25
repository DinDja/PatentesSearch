'use client';

import { AlertTriangle, X } from 'lucide-react';

export function ErrorState({ message, onDismiss, className = '' }) {
  if (!message) return null;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg bg-brand-redLight border border-brand-red/20 px-4 py-3 ${className}`}
      role="alert"
    >
      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-brand-red mt-0.5" />
      <p className="flex-1 text-sm text-brand-red">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex h-6 w-6 items-center justify-center rounded-full text-brand-red/60 hover:bg-brand-red/10 transition-colors"
          aria-label="Fechar mensagem de erro"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

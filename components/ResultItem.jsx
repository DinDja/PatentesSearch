'use client';

import { FileText, ExternalLink } from 'lucide-react';

export function ResultItem({ item, onClick }) {
  const numero = item.numero || item.numero_processo || '';
  const titulo = item.titulo || 'Documento sem titulo';
  const depositante = item.depositante || item.titular || '';
  const ipc = item.ipc || '';
  const tipo = item.tipo || '';
  const dataPublicacao = item.data_publicacao || item.data_deposito || item.data_criacao || '';

  const tipoLabel = tipo
    ? tipo === 'programa'
      ? 'Programa de Computador'
      : tipo === 'patente'
        ? 'Patente'
        : tipo.charAt(0).toUpperCase() + tipo.slice(1)
    : '';

  return (
    <article
      className="group cursor-pointer rounded-lg border-b border-gray-100 py-5 transition-colors hover:bg-surface/50 last:border-b-0"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes de ${titulo}`}
    >
      <div className="max-w-results">
        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
          {numero && (
            <span className="font-mono font-medium text-text-secondary">
              {numero}
            </span>
          )}
          {tipoLabel && (
            <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium text-text-secondary">
              {tipoLabel}
            </span>
          )}
          {dataPublicacao && (
            <>
              <span aria-hidden="true">&middot;</span>
              <span>{dataPublicacao}</span>
            </>
          )}
        </div>

        <h3 className="mb-1 text-base font-normal leading-snug text-brand-link group-hover:underline group-hover:underline-offset-2 sm:text-lg">
          {titulo}
        </h3>

        <p className="text-sm text-text-secondary line-clamp-2">
          {depositante && (
            <span className="font-medium text-text-primary">
              {depositante}
            </span>
          )}
          {depositante && ipc && (
            <span className="mx-1.5 text-text-tertiary" aria-hidden="true">
              &middot;
            </span>
          )}
          {ipc && (
            <span>
              <span className="text-text-tertiary">IPC</span> {ipc.split(' ')[0]}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}

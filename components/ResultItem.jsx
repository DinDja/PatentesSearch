'use client';

import { motion } from 'framer-motion';

export function ResultItem({ item, onClick }) {
  const numero = item.numero || item.numero_processo || '';
  const titulo = item.titulo || 'Documento sem título';
  const depositante = item.depositante || item.titular || '';
  const ipc = item.ipc || '';
  const tipo = item.tipo || '';
  const dataPublicacao = item.data_publicacao || item.data_deposito || item.data_criacao || '';

  const tipoLabel = tipo
    ? tipo === 'programa'
      ? 'Programa'
      : tipo === 'patente'
        ? 'Patente'
        : tipo.charAt(0).toUpperCase() + tipo.slice(1)
    : '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="group cursor-pointer rounded-md border border-border-primary bg-bg-elevated p-4 transition-all duration-normal hover:border-border-secondary hover:shadow-sm"
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
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {numero && (
            <span className="inline-flex items-center rounded-md bg-bg-tertiary px-2 py-0.5 text-xs font-mono font-medium text-fg-tertiary border border-border-subtle">
              {numero}
            </span>
          )}
          {tipoLabel && (
            <span className="inline-flex items-center rounded-md bg-accent-primary-subtle px-2 py-0.5 text-xs font-medium text-accent-primary border border-accent-primary/10">
              {tipoLabel}
            </span>
          )}
          {dataPublicacao && (
            <span className="text-xs text-fg-muted">{dataPublicacao}</span>
          )}
        </div>

        <h3 className="text-sm font-semibold text-fg-primary line-clamp-2 leading-relaxed">
          {titulo}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          {depositante && (
            <span className="font-medium text-fg-secondary">
              {depositante}
            </span>
          )}
          {depositante && ipc && (
            <span className="text-fg-muted" aria-hidden="true">
              ·
            </span>
          )}
          {ipc && (
            <span className="text-fg-muted">
              <span className="font-medium">IPC</span> {ipc.split(' ')[0]}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
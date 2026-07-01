'use client';

import { motion } from 'framer-motion';

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
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005, y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group cursor-pointer rounded-xl border border-border-subtle bg-bg-primary p-5 shadow-sm transition-all duration-fast hover:shadow-md hover:border-border-secondary"
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
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {numero && (
            <span className="inline-flex items-center rounded-md bg-bg-tertiary px-2 py-1 text-xs font-mono font-medium text-fg-secondary border border-border-subtle">
              {numero}
            </span>
          )}
          {tipoLabel && (
            <span className="inline-flex items-center rounded-md bg-accent-primary-subtle px-2 py-1 text-xs font-medium text-accent-primary border border-accent-primary/10">
              {tipoLabel}
            </span>
          )}
          {dataPublicacao && (
            <span className="text-xs text-fg-muted">{dataPublicacao}</span>
          )}
        </div>

        <h3 className="text-base font-semibold text-fg-primary group-hover:text-accent-primary transition-colors duration-fast line-clamp-2 sm:text-lg">
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
              &middot;
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
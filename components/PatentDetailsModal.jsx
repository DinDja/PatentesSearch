'use client';

import { useEffect, useRef } from 'react';
import { X, ExternalLink, AlertTriangle, FileText, Building2, Calendar, Tag, Hash, Globe, Shield } from 'lucide-react';

const SECTIONS = [
  {
    key: 'identificacao',
    label: 'Identificacao',
    icon: Hash,
    fields: ['numero_processo', 'numero', 'tipo', 'despacho_codigo'],
  },
  {
    key: 'titulo-section',
    label: 'Titulo',
    icon: FileText,
    fields: ['titulo'],
  },
  {
    key: 'depositante-section',
    label: 'Depositante',
    icon: Building2,
    fields: ['depositante', 'titular', 'autor', 'cr'],
  },
  {
    key: 'datas-section',
    label: 'Datas',
    icon: Calendar,
    fields: ['data_deposito', 'data_publicacao', 'data_criacao', 'dl', 'consultado_em'],
  },
  {
    key: 'classificacao-section',
    label: 'Classificacoes',
    icon: Tag,
    fields: ['ipc', 'classificacao_nacional', 'campo_aplicacao', 'cp', 'lg', 'tp'],
  },
  {
    key: 'resumo-section',
    label: 'Resumo',
    icon: FileText,
    fields: ['resumo', 'abstract'],
  },
];

const SKIP_FIELDS = new Set([
  'titulo',
  'numero_processo',
  'numero',
  'tipo',
  'depositante',
  'titular',
  'autor',
  'data_deposito',
  'data_publicacao',
  'data_criacao',
  'ipc',
  'classificacao_nacional',
  'resumo',
  'abstract',
  'fonte',
  'url_oficial',
  'erro_consulta_inpi',
  'despacho_codigo',
  'consultado_em',
  'campo_aplicacao',
  'cp',
  'lg',
  'tp',
  'dl',
  'cr',
  'arquivo_oficial',
  'detalhes_oficiais',
]);

function formatFieldName(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatFieldValue(value) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function DetailSection({ icon: Icon, label, data, fields }) {
  const sectionData = {};
  let hasData = false;

  fields.forEach((field) => {
    if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
      sectionData[field] = data[field];
      hasData = true;
    }
  });

  if (!hasData) return null;

  return (
    <div className="py-4 first:pt-0">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="space-y-2">
        {Object.entries(sectionData).map(([key, value]) => (
          <div key={key}>
            <dt className="text-xs text-text-tertiary">{formatFieldName(key)}</dt>
            <dd className="mt-0.5 text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
              {formatFieldValue(value)}
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
}

function FallbackNotice({ message }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-brand-yellowLight border border-brand-yellow/20 px-4 py-3">
      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-brand-yellow mt-0.5" />
      <div>
        <p className="text-sm font-medium text-brand-yellow">
          Dados alternativos
        </p>
        <p className="mt-1 text-xs text-text-secondary leading-relaxed">
          Os dados oficiais do INPI nao responderam no momento. Exibindo dados
          alternativos disponiveis para manter a experiencia funcionando.
        </p>
        {message && (
          <p className="mt-1 text-xs text-text-tertiary italic">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export function PatentDetailsModal({
  isOpen,
  onClose,
  loading,
  error,
  data,
  selectedItem,
  patentId,
}) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }
        if (e.key === 'Tab' && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isFallback = data?.fonte === 'UPSTREAM_FALLBACK';
  const fallbackMessage = data?.erro_consulta_inpi;

  const extraFields = Object.entries(data || {})
    .filter(([key]) => !SKIP_FIELDS.has(key))
    .filter(([, value]) => value !== null && value !== undefined && value !== '');

  const numero = data?.numero_processo || data?.numero || patentId || '';
  const tipo = data?.tipo || selectedItem?.tipo || '';
  const tipoLabel = tipo
    ? tipo === 'programa'
      ? 'Programa de Computador'
      : tipo === 'patente'
        ? 'Patente'
        : tipo.charAt(0).toUpperCase() + tipo.slice(1)
    : '';

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes do processo ${numero}`}
    >
      <div
        ref={modalRef}
        className="flex h-full w-full max-w-2xl flex-col overflow-hidden rounded-l-2xl bg-white shadow-modal animate-in"
        style={{ animationDuration: '250ms' }}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-text-tertiary" />
            <h2 className="text-base font-semibold text-text-primary">
              Ficha do Processo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary hover:bg-surface transition-colors"
            aria-label="Fechar detalhes"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="skeleton h-6 w-48 mb-4" />
              <div className="skeleton h-4 w-32 mb-8" />
              <div className="space-y-4 w-full max-w-sm">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-5/6" />
                <div className="skeleton h-16 w-full" />
              </div>
              <p className="mt-6 text-sm text-text-tertiary">
                Recuperando documento oficial...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <AlertTriangle className="h-10 w-10 text-brand-red mb-3" />
              <p className="text-sm font-medium text-text-primary">
                Erro ao carregar detalhes
              </p>
              <p className="mt-1 text-sm text-text-secondary">{error}</p>
            </div>
          )}

          {data && !loading && !error && (
            <div className="space-y-1 divide-y divide-gray-100">
              {isFallback && (
                <FallbackNotice message={fallbackMessage} />
              )}

              <div className="pb-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {numero && (
                    <span className="rounded-full bg-brand-blueLight px-2.5 py-1 text-xs font-medium text-brand-blue font-mono">
                      {numero}
                    </span>
                  )}
                  {tipoLabel && (
                    <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary">
                      {tipoLabel}
                    </span>
                  )}
                  {data.fonte && (
                    <span className="rounded-full bg-surface px-2.5 py-1 text-xs text-text-tertiary">
                      Fonte: {data.fonte}
                    </span>
                  )}
                </div>

                {(data.url_oficial || selectedItem?.url_detalhe || selectedItem?.fonte_zip_url) && (
                  <a
                    href={data.url_oficial || selectedItem?.url_detalhe || selectedItem?.fonte_zip_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-blue hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Abrir fonte oficial no INPI
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                <h3 className="mt-3 text-xl font-semibold leading-tight text-text-primary">
                  {data.titulo || 'Sem titulo'}
                </h3>
              </div>

              {SECTIONS.map((section) => (
                <DetailSection
                  key={section.key}
                  icon={section.icon}
                  label={section.label}
                  data={data}
                  fields={section.fields}
                />
              ))}

              {data.detalhes_oficiais && typeof data.detalhes_oficiais === 'object' && (
                <div className="py-4">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                    <Shield className="h-3.5 w-3.5" />
                    Dados Oficiais (INPI)
                  </div>
                  <div className="space-y-2">
                    {Object.entries(data.detalhes_oficiais).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-xs text-text-tertiary">{formatFieldName(key)}</dt>
                        <dd className="mt-0.5 text-sm text-text-primary">
                          {formatFieldValue(value)}
                        </dd>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {extraFields.length > 0 && (
                <div className="py-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                    Outras informacoes
                  </div>
                  <div className="space-y-2">
                    {extraFields.map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-xs text-text-tertiary">{formatFieldName(key)}</dt>
                        <dd className="mt-0.5 text-sm text-text-primary whitespace-pre-wrap">
                          {formatFieldValue(value)}
                        </dd>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

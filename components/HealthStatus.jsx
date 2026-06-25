'use client';

import { Wifi, WifiOff, AlertTriangle, CloudOff } from 'lucide-react';

const STATUS_CONFIG = {
  online: {
    icon: Wifi,
    label: 'API online',
    className: 'bg-brand-greenLight text-brand-green border-brand-green/20',
    dotClassName: 'bg-brand-green',
  },
  offline: {
    icon: WifiOff,
    label: 'API offline',
    className: 'bg-brand-redLight text-brand-red border-brand-red/20',
    dotClassName: 'bg-brand-red',
  },
  degraded: {
    icon: AlertTriangle,
    label: 'INPI indisponivel',
    className: 'bg-brand-yellowLight text-brand-yellow border-brand-yellow/20',
    dotClassName: 'bg-brand-yellow',
  },
  fallback: {
    icon: CloudOff,
    label: 'Usando dados alternativos',
    className: 'bg-brand-yellowLight text-brand-yellow border-brand-yellow/20',
    dotClassName: 'bg-brand-yellow',
  },
  unknown: {
    icon: Wifi,
    label: 'Conectando...',
    className: 'bg-surface text-text-tertiary border-gray-200',
    dotClassName: 'bg-text-tertiary',
  },
};

export function HealthStatus({ ok, message, source, children }) {
  let status = 'unknown';
  if (ok === true) status = 'online';
  else if (ok === false) status = 'offline';

  if (children) {
    status = children;
  }

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
  const Icon = config.icon;
  const displayLabel = message || config.label;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${config.className}`}
      role="status"
      aria-label={`Status da API: ${displayLabel}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {status === 'online' && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${config.dotClassName}`} />
      </span>
      {displayLabel}
    </div>
  );
}

'use client';

import { Wifi, WifiOff, AlertTriangle, CloudOff } from 'lucide-react';

const STATUS_CONFIG = {
  online: {
    icon: Wifi,
    label: 'Sistemas online',
    className: 'bg-accent-success-subtle text-accent-success border-accent-success/20',
    dotClassName: 'bg-accent-success',
  },
  offline: {
    icon: WifiOff,
    label: 'Sistemas indisponíveis',
    className: 'bg-accent-danger-subtle text-accent-danger border-accent-danger/20',
    dotClassName: 'bg-accent-danger',
  },
  degraded: {
    icon: AlertTriangle,
    label: 'INPI indisponível',
    className: 'bg-accent-warning-subtle text-accent-warning border-accent-warning/20',
    dotClassName: 'bg-accent-warning',
  },
  fallback: {
    icon: CloudOff,
    label: 'Dados alternativos',
    className: 'bg-accent-warning-subtle text-accent-warning border-accent-warning/20',
    dotClassName: 'bg-accent-warning',
  },
  unknown: {
    icon: Wifi,
    label: 'Conectando...',
    className: 'bg-bg-tertiary text-fg-tertiary border-border-subtle',
    dotClassName: 'bg-fg-tertiary',
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
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[11px] font-medium ${config.className}`}
      role="status"
      aria-label={`Status dos sistemas: ${displayLabel}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${config.dotClassName}`} />
      </span>
      {displayLabel}
    </div>
  );
}
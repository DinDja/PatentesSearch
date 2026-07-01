'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BAHIA_TERRITORIES, BAHIA_MUNICIPALITY_SUGGESTIONS, getMunicipalitiesByTerritory } from '../lib/bahiaTerritories';

const FILTER_OPTIONS = [
  { value: 'q', label: 'Todos os campos' },
  { value: 'numero', label: 'Numero' },
  { value: 'titulo', label: 'Titulo' },
  { value: 'depositante', label: 'Depositante' },
  { value: 'ipc', label: 'Classificacao (IPC)' },
];

export function AdvancedFilters({
  filterType,
  territory,
  municipality,
  onUpdate,
  onApply,
  onClear,
  activeCount = 0,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [localTerritory, setLocalTerritory] = useState(territory);
  const municipalityOptions = localTerritory
    ? getMunicipalitiesByTerritory(localTerritory)
    : BAHIA_MUNICIPALITY_SUGGESTIONS;

  const handleTerritoryChange = (e) => {
    const val = e.target.value;
    setLocalTerritory(val);
    onUpdate({ territory: val, municipality: '' });
  };

  const handleClear = () => {
    setLocalTerritory('');
    onUpdate({ territory: '', municipality: '' });
    if (onClear) onClear();
  };

  const hasActiveFilters = activeCount > 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-fast ${
          hasActiveFilters || isOpen
            ? 'bg-accent-primary-subtle text-accent-primary'
            : 'bg-bg-tertiary text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary'
        }`}
        aria-expanded={isOpen}
        aria-controls="advanced-filters-panel"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
        {hasActiveFilters > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-primary px-1.5 text-[10px] font-bold text-fg-inverse">
            {activeCount}
          </span>
        )}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-fast ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="advanced-filters-panel"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 top-full z-20 mt-2 w-full min-w-[320px] max-w-lg origin-top-left rounded-xl border border-border-primary bg-bg-elevated p-5 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-fg-primary">
                Refinar busca
              </h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted hover:text-fg-secondary transition-colors"
                  aria-label="Limpar todos os filtros"
                >
                  <X className="h-3.5 w-3.5" />
                  Limpar
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <legend className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-fg-muted">
                  Campo de busca
                </legend>
                <div className="flex flex-wrap gap-2">
                  {FILTER_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => onUpdate({ filterType: f.value })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-fast ${
                        filterType === f.value
                          ? 'bg-accent-primary text-fg-inverse shadow-sm'
                          : 'bg-bg-tertiary text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary border border-transparent hover:border-border-subtle'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border-subtle">
                <legend className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-fg-muted">
                  Filtro geografico (Bahia)
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-fg-secondary">
                      Territorio
                    </span>
                    <select
                      value={territory}
                      onChange={handleTerritoryChange}
                      className="h-10 rounded-lg border border-border-primary bg-bg-primary px-3 text-sm text-fg-primary outline-none transition-all duration-fast focus:border-accent-primary focus:ring-2 focus:ring-accent-primary-subtle"
                    >
                      <option value="">Todos</option>
                      {BAHIA_TERRITORIES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-fg-secondary">
                      Municipio
                    </span>
                    <input
                      type="text"
                      list="bahia-municipios"
                      value={municipality}
                      onChange={(e) => onUpdate({ municipality: e.target.value })}
                      placeholder="Ex.: Salvador"
                      className="h-10 rounded-lg border border-border-primary bg-bg-primary px-3 text-sm text-fg-primary outline-none transition-all duration-fast focus:border-accent-primary focus:ring-2 focus:ring-accent-primary-subtle placeholder:text-fg-muted"
                    />
                    <datalist id="bahia-municipios">
                      {municipalityOptions.map((city) => (
                        <option key={city} value={city} />
                      ))}
                    </datalist>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
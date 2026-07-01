'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';
import { BAHIA_TERRITORIES, BAHIA_MUNICIPALITY_SUGGESTIONS, getMunicipalitiesByTerritory } from '../lib/bahiaTerritories';

const FILTER_OPTIONS = [
  { value: 'q', label: 'Todos os campos' },
  { value: 'numero', label: 'Número' },
  { value: 'titulo', label: 'Título' },
  { value: 'depositante', label: 'Depositante' },
  { value: 'ipc', label: 'Classificação (IPC)' },
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
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const municipalityOptions = localTerritory
    ? getMunicipalitiesByTerritory(localTerritory)
    : BAHIA_MUNICIPALITY_SUGGESTIONS;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

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
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-normal ${
          hasActiveFilters || isOpen
            ? 'bg-accent-primary text-fg-inverse'
            : 'bg-bg-tertiary text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary'
        }`}
        aria-expanded={isOpen}
        aria-controls="advanced-filters-panel"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filtros
        {hasActiveFilters > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-accent-primary text-[11px] font-bold text-fg-inverse">
            {activeCount}
          </span>
        )}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-normal ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          id="advanced-filters-panel"
          className="absolute left-0 top-full z-20 mt-1 w-full min-w-[320px] max-w-lg origin-top-left rounded-md border border-border-primary bg-bg-elevated shadow-lg"
        >
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-fg-primary">
              Refinar busca
            </h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-xs font-medium text-fg-muted hover:text-accent-primary transition-colors"
                aria-label="Limpar todos os filtros"
              >
                <X className="h-3 w-3" />
                Limpar
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs font-semibold text-fg-muted uppercase tracking-wider">
                Campo de busca
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FILTER_OPTIONS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => onUpdate({ filterType: f.value })}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-normal ${
                      filterType === f.value
                        ? 'bg-accent-primary text-fg-inverse'
                        : 'bg-bg-tertiary text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle">
              <div className="mb-2 text-xs font-semibold text-fg-muted uppercase tracking-wider">
                Filtro geográfico (Bahia)
              </div>
              <div className="grid grid-cols-1 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-fg-secondary">
                    Território
                  </span>
                  <select
                    value={territory}
                    onChange={handleTerritoryChange}
                    className="h-9 rounded-md border border-border-primary bg-bg-primary px-3 text-sm text-fg-primary outline-none transition-all duration-normal focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
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
                    Município
                  </span>
                  <input
                    type="text"
                    list="bahia-municipios"
                    value={municipality}
                    onChange={(e) => onUpdate({ municipality: e.target.value })}
                    placeholder="Ex.: Salvador"
                    className="h-9 rounded-md border border-border-primary bg-bg-primary px-3 text-sm text-fg-primary outline-none transition-all duration-normal focus:border-accent-primary focus:ring-1 focus:ring-accent-primary placeholder:text-fg-muted"
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
        </div>
      </div>)}
    </div>
  );
}
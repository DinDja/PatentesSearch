'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';
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
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
          hasActiveFilters
            ? 'text-brand-blue'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        aria-expanded={isOpen}
        aria-controls="advanced-filters-panel"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros avancados
        {hasActiveFilters > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-blue px-1.5 text-[10px] font-bold text-white">
            {activeCount}
          </span>
        )}
        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>

      {isOpen && (
        <div
          id="advanced-filters-panel"
          className="mt-4 animate-in rounded-xl border border-gray-200 bg-white p-5 shadow-card"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">
              Refinar busca
            </h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-xs font-medium text-text-tertiary hover:text-text-secondary transition-colors"
                aria-label="Limpar todos os filtros"
              >
                <X className="h-3.5 w-3.5" />
                Limpar filtros
              </button>
            )}
          </div>

          <div className="space-y-4">
            <fieldset>
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Campo de busca
              </legend>
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => onUpdate({ filterType: f.value })}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                      filterType === f.value
                        ? 'bg-brand-blueLight text-brand-blue border border-brand-blue/20'
                        : 'bg-surface text-text-secondary border border-transparent hover:border-gray-200 hover:bg-surface-dark'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Filtro geografico (Bahia)
              </legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-text-secondary">
                    Territorio de Identidade
                  </span>
                  <select
                    value={territory}
                    onChange={handleTerritoryChange}
                    className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-brand-blue"
                  >
                    <option value="">Todos os territorios</option>
                    {BAHIA_TERRITORIES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-text-secondary">
                    Municipio
                  </span>
                  <input
                    type="text"
                    list="bahia-municipios"
                    value={municipality}
                    onChange={(e) => onUpdate({ municipality: e.target.value })}
                    placeholder="Ex.: Salvador"
                    className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-brand-blue placeholder:text-text-tertiary"
                  />
                  <datalist id="bahia-municipios">
                    {municipalityOptions.map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </label>
              </div>
            </fieldset>
          </div>
        </div>
      )}
    </div>
  );
}

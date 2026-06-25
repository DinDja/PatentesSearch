'use client';

import { useEffect, useState } from 'react';
import { usePatentSearch } from '../hooks/usePatentSearch';
import { usePatentDetails } from '../hooks/usePatentDetails';
import { SearchBar } from '../components/SearchBar';
import { AdvancedFilters } from '../components/AdvancedFilters';
import { HealthStatus } from '../components/HealthStatus';
import { ResultsList } from '../components/ResultsList';
import { PatentDetailsModal } from '../components/PatentDetailsModal';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { Pagination } from '../components/Pagination';
import { FilterBadge } from '../components/FilterBadge';

export default function PatentSearchPage() {
  const [health, setHealth] = useState({ ok: null, message: '' });
  const [hasSearched, setHasSearched] = useState(false);

  const {
    query,
    filterType,
    territory,
    municipality,
    results,
    loading,
    error,
    page,
    updateState,
    handleSearch,
    goToPage,
  } = usePatentSearch();

  const {
    selectedPatentId,
    selectedItem,
    data: patentDetails,
    loading: detailsLoading,
    error: detailsError,
    isOpen,
    openDetails,
    closeDetails,
  } = usePatentDetails();

  useEffect(() => {
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) =>
        setHealth({
          ok: true,
          message: data.status || 'Sistemas operacionais',
        })
      )
      .catch(() =>
        setHealth({ ok: false, message: 'Sistemas indisponiveis' })
      );
  }, []);

  const onSearch = (e) => {
    if (e) e.preventDefault();
    if (!query.trim() && !territory && !municipality) {
      updateState({ error: 'Digite um termo para pesquisar.' });
      return;
    }
    setHasSearched(true);
    handleSearch(e);
  };

  const onResultClick = (item) => {
    openDetails(item);
  };

  const onPageChange = (newPage) => {
    goToPage(newPage);
  };

  const filterLabels = {
    q: 'Todos os campos',
    numero: 'Numero',
    titulo: 'Titulo',
    depositante: 'Depositante',
    ipc: 'IPC',
  };

  const activeFilterCount =
    (filterType !== 'q' ? 1 : 0) +
    (territory ? 1 : 0) +
    (municipality ? 1 : 0);

  const showResults = hasSearched || results?.items?.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!showResults ? (
        <LandingView
          query={query}
          onQueryChange={(val) => updateState({ query: val })}
          onSearch={onSearch}
          loading={loading}
          filterType={filterType}
          territory={territory}
          municipality={municipality}
          onUpdate={updateState}
          onClearFilters={() =>
            updateState({ filterType: 'q', territory: '', municipality: '' })
          }
          activeFilterCount={activeFilterCount}
          health={health}
        />
      ) : (
        <ResultsView
          query={query}
          onQueryChange={(val) => updateState({ query: val })}
          onSearch={onSearch}
          loading={loading}
          filterType={filterType}
          territory={territory}
          municipality={municipality}
          onUpdate={updateState}
          onClearFilters={() =>
            updateState({ filterType: 'q', territory: '', municipality: '' })
          }
          activeFilterCount={activeFilterCount}
          filterLabels={filterLabels}
          results={results}
          error={error}
          page={page}
          onPageChange={onPageChange}
          onResultClick={onResultClick}
          onDismissError={() => updateState({ error: '' })}
          onBackToHome={() => {
            setHasSearched(false);
            updateState({ results: null, error: '' });
          }}
          health={health}
        />
      )}

      <PatentDetailsModal
        isOpen={isOpen}
        onClose={closeDetails}
        loading={detailsLoading}
        error={detailsError}
        data={patentDetails}
        selectedItem={selectedItem}
        patentId={selectedPatentId}
      />
    </div>
  );
}

function LandingView({
  query,
  onQueryChange,
  onSearch,
  loading,
  filterType,
  territory,
  municipality,
  onUpdate,
  onClearFilters,
  activeFilterCount,
  health,
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex justify-end px-4 pt-4 sm:px-6 sm:pt-5">
        <HealthStatus ok={health.ok} message={health.message} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-20">
        <div className="w-full max-w-[584px]">
          <div className="mb-8 text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              Patentes BR
            </h1>
            <p className="mt-3 text-sm text-text-secondary sm:text-base">
              Consulte patentes, programas de computador e processos do INPI
            </p>
          </div>

          <SearchBar
            value={query}
            onChange={onQueryChange}
            onSubmit={onSearch}
            loading={loading}
            autoFocus
          />

          <div className="mt-4">
            <AdvancedFilters
              filterType={filterType}
              territory={territory}
              municipality={municipality}
              onUpdate={onUpdate}
              onClear={onClearFilters}
              activeCount={activeFilterCount}
            />
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-surface py-3">
        <p className="text-center text-xs text-text-tertiary">
          Patentes BR — Consulta de propriedade intelectual brasileira
        </p>
      </footer>
    </div>
  );
}

function ResultsView({
  query,
  onQueryChange,
  onSearch,
  loading,
  filterType,
  territory,
  municipality,
  onUpdate,
  onClearFilters,
  activeFilterCount,
  filterLabels,
  results,
  error,
  page,
  onPageChange,
  onResultClick,
  onDismissError,
  onBackToHome,
  health,
}) {
  const totalResults = results?.total || 0;
  const totalPages = results?.pages || 1;
  const hasGeoFilter = Boolean(territory || municipality);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:gap-6 sm:px-6">
          <button
            onClick={onBackToHome}
            className="flex-shrink-0 font-display text-xl font-bold tracking-tight text-text-primary hover:opacity-80 transition-opacity"
            aria-label="Voltar para pagina inicial"
          >
            <span className="text-brand-blue">P</span>
            <span className="text-brand-red">a</span>
            <span className="text-brand-yellow">t</span>
            <span className="text-brand-blue">e</span>
            <span className="text-brand-green">n</span>
            <span className="text-brand-red">t</span>
            <span className="text-text-tertiary">es</span>
          </button>

          <div className="flex-1 max-w-xl">
            <SearchBar
              value={query}
              onChange={onQueryChange}
              onSubmit={onSearch}
              loading={loading}
              compact
            />
          </div>

          <HealthStatus ok={health.ok} message={health.message} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-4 flex-1">
        <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <AdvancedFilters
              filterType={filterType}
              territory={territory}
              municipality={municipality}
              onUpdate={onUpdate}
              onClear={onClearFilters}
              activeCount={activeFilterCount}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filterType !== 'q' && (
              <FilterBadge
                label={filterLabels[filterType] || filterType}
                onRemove={() => onUpdate({ filterType: 'q' })}
              />
            )}
            {territory && (
              <FilterBadge
                label={`Territorio: ${territory}`}
                onRemove={() => onUpdate({ territory: '', municipality: '' })}
              />
            )}
            {municipality && !territory && (
              <FilterBadge
                label={`Municipio: ${municipality}`}
                onRemove={() => onUpdate({ municipality: '' })}
              />
            )}
          </div>
        </div>

        {error && <ErrorState message={error} onDismiss={onDismissError} className="mb-4" />}

        {loading && <LoadingState count={5} />}

        {!loading && results?.items?.length === 0 && (
          <EmptyState
            title="Nenhum resultado encontrado"
            description="Tente termos mais abrangentes, troque o campo de busca ou remova filtros ativos."
          />
        )}

        {!loading && results?.items?.length > 0 && (
          <div className="animate-in">
            <div className="mb-3 text-xs text-text-tertiary">
              Aproximadamente{' '}
              <span className="font-medium text-text-secondary">
                {totalResults?.toLocaleString()}
              </span>{' '}
              resultados
              {hasGeoFilter && (
                <span className="ml-2 text-brand-yellow">
                  (filtrado por localizacao na Bahia)
                </span>
              )}
            </div>

            <ResultsList items={results.items} onItemClick={onResultClick} />

            {!results.geoFiltered && totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
                disabled={loading}
              />
            )}

            {results.geoFiltered && results.items.length > 0 && (
              <div className="mt-4 text-center text-xs text-text-tertiary">
                Mostrando {results.items.length} resultados filtrados por
                localizacao
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-surface py-3 mt-auto">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-center text-xs text-text-tertiary">
            Patentes BR — Consulta de propriedade intelectual brasileira
          </p>
        </div>
      </footer>
    </div>
  );
}

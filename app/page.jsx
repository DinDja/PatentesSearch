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
    <div className="min-h-screen flex flex-col bg-bg-primary">
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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-20 pt-20 sm:pt-28">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-fg-primary sm:text-3xl lg:text-4xl">
              Pesquisa de Patentes<br />
              <span className="">
                SECTI
              </span>
            </h1>
          </div>

          <div className="space-y-3">
            <SearchBar
              value={query}
              onChange={onQueryChange}
              onSubmit={onSearch}
              loading={loading}
              autoFocus
            />
          </div>
  
        </div>
      </div>

      <footer className="border-t border-border-subtle bg-bg-elevated/80 backdrop-blur-md py-3">
        <p className="text-center text-xs text-fg-muted">
          Sistema de Patentes Brasileiras — Consulta de Propriedade Intelectual
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-bg-secondary to-bg-tertiary">
      <header className="sticky top-0 z-30 border-b border-border-primary bg-bg-elevated/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <button
            onClick={onBackToHome}
            className="group flex-shrink-0 flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-fg-secondary transition-colors hover:bg-bg-tertiary hover:text-fg-primary"
            aria-label="Voltar para página inicial"
          >
            <span className="text-fg-muted group-hover:text-accent-primary transition-colors">←</span>
            <span className="text-fg-primary group-hover:text-accent-primary transition-colors">Patentes</span>
            <span className="text-fg-muted">BR</span>
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

        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 flex-1">
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex flex-wrap items-center gap-2">
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
                label={`Território: ${territory}`}
                onRemove={() => onUpdate({ territory: '', municipality: '' })}
              />
            )}
            {municipality && !territory && (
              <FilterBadge
                label={`Município: ${municipality}`}
                onRemove={() => onUpdate({ municipality: '' })}
              />
            )}
          </div>
        </div>

        {error && <ErrorState message={error} onDismiss={onDismissError} className="mb-5" />}

        {loading && <LoadingState count={5} />}

        {!loading && results?.items?.length === 0 && (
          <EmptyState
            title="Nenhum resultado encontrado"
            description="Tente termos mais abrangentes, troque o campo de busca ou remova filtros ativos."
          />
        )}

        {!loading && results?.items?.length > 0 && (
          <div className="animate-in">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-fg-secondary">
                <span className="font-medium text-fg-primary">{totalResults?.toLocaleString()}</span> resultado{totalResults !== 1 && 's'} encontrado{totalResults !== 1 && 's'}
                {hasGeoFilter && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium text-accent-warning bg-accent-warning-subtle rounded">
                    Filtrado por localização
                  </span>
                )}
              </div>
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
              <div className="mt-5 text-center text-sm text-fg-muted">
                Mostrando {results.items.length} resultado{results.items.length !== 1 && 's'} filtrados por localização
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-border-subtle bg-bg-elevated/80 backdrop-blur-md py-4 mt-auto">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs text-fg-muted">
            Sistema de Patentes Brasileiras — Consulta de Propriedade Intelectual
          </p>
        </div>
      </footer>
    </div>
  );
}
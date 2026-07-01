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
import { SectiLogo } from '../components/SectiLogo';

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
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-20 pt-32 sm:pt-40">
        <div className="w-full max-w-2xl">
          <div className="mb-10 text-center">
            
            <h1 className="font-display text-4xl font-semibold tracking-tight text-fg-primary sm:text-5xl lg:text-6xl">
              Patentes SECTI
            </h1>
          </div>

          <div className="space-y-4">
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

      <footer className="border-t border-border-subtle bg-bg-secondary py-4">
        <p className="text-center text-xs text-fg-muted">
          Patentes SECTI — Consulta de propriedade intelectual brasileira
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
      <header className="sticky top-0 z-30 border-b border-border-primary bg-bg-primary/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <button
            onClick={onBackToHome}
            className="group flex-shrink-0 font-display text-lg font-semibold tracking-tight text-fg-primary transition-colors hover:text-accent-primary"
            aria-label="Voltar para pagina inicial"
          >
            <span className="bg-gradient-to-r from-secti-teal to-secti-purple bg-clip-text text-transparent">P</span>
            <span className="text-fg-primary group-hover:text-accent-primary transition-colors">atentes</span>
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
        <div className="flex flex-col gap-4 mb-6">
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

        {error && <ErrorState message={error} onDismiss={onDismissError} className="mb-6" />}

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
                <span className="font-medium text-fg-primary">{totalResults?.toLocaleString()}</span> resultados encontrados
                {hasGeoFilter && (
                  <span className="ml-2 text-accent-warning">(filtrado por localizacao na Bahia)</span>
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
              <div className="mt-6 text-center text-sm text-fg-muted">
                Mostrando {results.items.length} resultados filtrados por localizacao
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-border-subtle bg-bg-secondary py-4 mt-auto">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs text-fg-muted">
            Patentes SECTI — Consulta de propriedade intelectual brasileira
          </p>
        </div>
      </footer>
    </div>
  );
}
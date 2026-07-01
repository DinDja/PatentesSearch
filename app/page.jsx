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

import { Cpu } from 'lucide-react';

function LandingView({
  query,
  onQueryChange,
  onSearch,
  loading,
  health,
}) {
  const [localQuery, setLocalQuery] = useState(query || '');

  useEffect(() => {
    setLocalQuery(query || '');
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onQueryChange(localQuery);
    onSearch(e);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-3xl">
          <div className="mb-10 flex flex-col items-center text-center">
                <div className="mt-5 flex items-center gap-3 text-slate-700">
              <div className="flex flex-col leading-none mb-1">
                <span className="text-lg font-bold uppercase tracking-[0.18em] text-slate-900">
                  SECTI
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">
                  Secretaria de Ciência, Tecnologia e Inovação
                </span>
              </div>
            </div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Pesquisa de Patentes
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex w-full items-stretch border border-slate-300 bg-white">
              <div className="pointer-events-none flex items-center justify-center bg-slate-50 px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  className="h-5 w-5 text-slate-500"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Digite o termo de pesquisa (ex: Acompanhatec, depositante, número)"
                aria-label="Campo de busca de patentes"
                disabled={loading}
                className="h-14 flex-1 bg-transparent px-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:bg-slate-50 sm:h-16 disabled:opacity-60 border-0"
              />

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center bg-blue-800 px-6 text-sm font-bold uppercase tracking-[0.18em] text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-0 disabled:opacity-60 sm:px-10"
              >
                {loading ? 'Pesquisando…' : 'Pesquisar'}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-slate-600">
              <span className="font-medium text-slate-700">
                Pesquisas Populares:
              </span>
              <button
                type="button"
                onClick={() => {
                  setLocalQuery('Invenção');
                  onQueryChange('Invenção');
                }}
                className="border-b border-transparent text-blue-800 hover:border-blue-800"
              >
                Invenção
              </button>
              <span className="text-slate-400">|</span>
              <button
                type="button"
                onClick={() => {
                  setLocalQuery('Modelo de Utilidade');
                  onQueryChange('Modelo de Utilidade');
                }}
                className="border-b border-transparent text-blue-800 hover:border-blue-800"
              >
                Modelo de Utilidade
              </button>
              <span className="text-slate-400">|</span>
              <button
                type="button"
                onClick={() => {
                  setLocalQuery('Desenho Industrial');
                  onQueryChange('Desenho Industrial');
                }}
                className="border-b border-transparent text-blue-800 hover:border-blue-800"
              >
                Desenho Industrial
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-200 bg-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <div className="flex w-20 items-center justify-center">
              <img src="https://imgs.search.brave.com/O36dfhujpJ6Sdyg3pVNqngfxE3QX8fXXdZNvYiSNEck/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8x/LzEyL0JyYXMlQzMl/QTNvX2RvX2VzdGFk/b19kYV9CYWhpYS5z/dmc" alt="" />
            </div>
          </div>

          <p className="text-center text-xs text-slate-500">
            Sistema de consulta de patentes — Consulta de Propriedade Intelectual
          </p>

          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          </div>
        </div>
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
            className="group flex-shrink-0 flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-fg-secondary transition-colors hover:bg-bg-tertiary hover:text-fg-primary"
            aria-label="Voltar para página inicial"
          >
            <span className="text-fg-muted group-hover:text-accent-primary transition-colors">←</span>
            <span className="text-fg-primary group-hover:text-accent-primary transition-colors">Secti</span>
            <span className="text-fg-muted">Search</span>
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

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
                disabled={loading}
              />
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
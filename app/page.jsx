'use client';

import { useEffect, useState } from 'react';
import { Search, Server, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { usePatentSearch } from '../hooks/usePatentSearch';
import { usePatentDetails } from '../hooks/usePatentDetails';
import { Button, Badge, EmptyState } from './ui';

const FILTERS = [
  { val: 'q', label: 'Todos os campos' },
  { val: 'numero', label: 'Número da Patente' },
  { val: 'titulo', label: 'Título' },
  { val: 'depositante', label: 'Depositante / Empresa' },
  { val: 'ipc', label: 'Classificação (IPC)' }
];

export default function PatentSearchPage() {
  const [health, setHealth] = useState({ ok: null, message: 'Conectando...' });
  
  const {
    query, filterType, results, loading, error, page,
    updateState, handleSearch, goToPage
  } = usePatentSearch();

  const {
    selectedPatentId, data: patentDetails, loading: detailsLoading, error: detailsError, isOpen,
    openDetails, closeDetails
  } = usePatentDetails();

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setHealth({ ok: true, message: data.status || 'Sistemas operacionais' }))
      .catch(() => setHealth({ ok: false, message: 'Sistemas indisponíveis' }));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-teal-500/30">
      
      {/* Topbar SaaS */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-50">
            <Search className="h-4 w-4 text-white dark:text-zinc-900" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Hub de Patentes</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className={`relative flex h-2 w-2 rounded-full ${health.ok ? 'bg-teal-500' : 'bg-red-500'}`}>
              {health.ok && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>}
            </span>
            {health.message}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Search Header */}
        <div className="mb-12 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Pesquisa de Propriedade Intelectual</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Busque no banco de dados de inovações brasileiras por número, depositante ou termos técnicos.
          </p>
        </div>

        {/* Search Input & Filters */}
        <form onSubmit={handleSearch} className="mb-12 space-y-6">
          <div className="group relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => updateState({ query: e.target.value })}
              placeholder="Digite termos, empresas ou números de processos..."
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-12 py-4 text-base shadow-sm outline-none transition-all focus:border-zinc-400 focus:bg-white dark:focus:border-zinc-700 dark:focus:bg-zinc-950"
            />
            <div className="absolute right-3">
              <Button type="submit" isLoading={loading}>Buscar</Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button
                key={f.val}
                type="button"
                onClick={() => updateState({ filterType: f.val })}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  filterType === f.val 
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' 
                    : 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 flex justify-between items-center">
            {error}
            <button onClick={() => updateState({ error: '' })}><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Empty States */}
        {!results && !loading && !error && (
          <EmptyState icon={Search} title="Pronto para buscar" description="Utilize o campo acima para iniciar sua pesquisa no repositório de patentes." />
        )}
        
        {results?.items?.length === 0 && (
          <EmptyState icon={Server} title="Nenhum resultado" description="Sua busca não retornou patentes. Tente termos mais abrangentes ou troque o filtro." />
        )}

        {/* Results Grid */}
        {results?.items?.length > 0 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h2 className="text-sm font-semibold">Resultados da Busca</h2>
              <Badge>{results.total?.toLocaleString()} registros encontrados</Badge>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.items.map((item, idx) => (
                <div 
                  key={item.numero || idx} 
                  onClick={() => openDetails(item.numero)}
                  className="group cursor-pointer rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <code className="text-[11px] font-mono font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded">
                        {item.numero || 'N/A'}
                      </code>
                      {item.ipc && <Badge variant="primary">{item.ipc.split(' ')[0]}</Badge>}
                    </div>
                    <h3 className="text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-100 line-clamp-3 mb-4 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {item.titulo || 'Documento sem título'}
                    </h3>
                  </div>
                  
                  {item.depositante && (
                    <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                      <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate">
                        {item.depositante}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Component */}
            {results.pages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8">
                <Button variant="outline" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                </Button>
                <span className="text-sm font-medium text-zinc-500">
                  Página {page} de {results.pages}
                </span>
                <Button variant="outline" disabled={page >= results.pages} onClick={() => goToPage(page + 1)}>
                  Próxima <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Drawer (Substitui o dialog nativo para melhor UX) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-zinc-900/40 backdrop-blur-sm p-4 sm:p-6 transition-opacity">
          <div className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 shadow-2xl animate-in slide-in-from-right-8 duration-300">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
              <h3 className="text-lg font-semibold tracking-tight">Detalhes do Processo</h3>
              <button onClick={closeDetails} className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {detailsLoading && (
                <div className="flex h-full items-center justify-center flex-col gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                  <p className="text-sm text-zinc-500">Recuperando documento oficial...</p>
                </div>
              )}
              
              {detailsError && (
                <EmptyState icon={X} title="Erro na leitura" description={detailsError} />
              )}

              {patentDetails && !detailsLoading && (
                <div className="space-y-6">
                  <div>
                    <Badge variant="primary">{selectedPatentId}</Badge>
                    <h2 className="mt-3 text-xl font-bold leading-tight">{patentDetails.titulo || 'Sem Título'}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {Object.entries(patentDetails).filter(([k]) => k !== 'titulo').map(([key, value]) => (
                      <div key={key} className="pt-4">
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                          {key.replace(/_/g, ' ')}
                        </dt>
                        <dd className="text-sm text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap leading-relaxed">
                          {Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                        </dd>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { Search, Server, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import Lottie from 'lottie-react';
import blueCubeAnim from '../Blue Cube Loader.json';
import searchingAnim from '../Searching.json';
import apiTestingAnim from '../API Testing.json';
import { usePatentSearch } from '../hooks/usePatentSearch';
import { usePatentDetails } from '../hooks/usePatentDetails';
import { BAHIA_TERRITORIES, BAHIA_MUNICIPALITY_SUGGESTIONS } from '../lib/bahiaTerritories';
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
    query, filterType, territory, municipality, results, loading, error, page,
    updateState, handleSearch, goToPage
  } = usePatentSearch();

  const hasGeoFilter = Boolean(territory || municipality);

  const {
    selectedPatentId, selectedItem, data: patentDetails, loading: detailsLoading, error: detailsError, isOpen,
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
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-200/80 bg-white/70 px-6 backdrop-blur-lg transition-all dark:border-zinc-800/80 dark:bg-zinc-950/70">

        {/* Lado Esquerdo: Logo e Título */}
        <div className="group flex cursor-pointer items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center transition-transform group-hover:scale-105">
          </div>
          <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Patentes
          </span>
        </div>

        {/* Lado Direito: Badge de Status (Health) */}
        <div className="flex items-center">
          <div
            className={`flex items-center gap-2.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors ${health.ok
              ? "border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "border-red-200/60 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-500/10 dark:text-red-400"
              }`}
          >
            <span className="relative flex h-2 w-2 items-center justify-center">
              {health.ok && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 duration-1000"></span>
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${health.ok ? "bg-emerald-500 dark:bg-emerald-400" : "bg-red-500 dark:bg-red-400"
                  }`}
              ></span>
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
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-12 py-4 text-base text-zinc-900 placeholder-zinc-400 dark:text-zinc-100 dark:placeholder-zinc-500 shadow-sm outline-none transition-all focus:border-zinc-400 dark:focus:border-zinc-700 dark:focus:bg-zinc-950"
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
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${filterType === f.val
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Território de Identidade (BA)
              <select
                value={territory}
                onChange={(e) => updateState({ territory: e.target.value })}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-zinc-900 outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
              >
                <option value="">Todos os territórios</option>
                {BAHIA_TERRITORIES.map((territoryName) => (
                  <option key={territoryName} value={territoryName}>
                    {territoryName}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Município (BA)
              <input
                type="text"
                list="bahia-municipios"
                value={municipality}
                onChange={(e) => updateState({ municipality: e.target.value })}
                placeholder="Ex.: Salvador"
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-zinc-900 outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
              />
              <datalist id="bahia-municipios">
                {BAHIA_MUNICIPALITY_SUGGESTIONS.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </label>
          </div> */}

          {/* <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Combine os campos geográficos da Bahia com qualquer filtro de patente para refinar os resultados.
          </p> */}
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
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-500">
            <h3 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Desvende o Mundo da Propriedade Intelectual
            </h3>
            <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
              <div>
                <h4 className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-2">Patentes</h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  Protegem invenções que apresentam uma solução técnica nova para um problema existente, como um novo produto ou processo. As patentes de invenção (PI) têm validade de 20 anos.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-2">Modelo de Utilidade</h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  Concede proteção a objetos de uso prático, ou parte deles, que apresentem nova forma ou disposição e resultem em melhoria funcional no seu uso ou fabricação. Válido por 15 anos.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-2">Outros Registros Importantes</h4>
                <ul className="list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                  <li><span className="font-medium">Marcas:</span> Protegem sinais distintivos visualmente perceptíveis que identificam produtos ou serviços.</li>
                  <li><span className="font-medium">Desenho Industrial:</span> Protege a forma plástica ornamental de um objeto ou o conjunto ornamental de linhas e cores que possa ser aplicado a um produto.</li>
                  <li><span className="font-medium">Programa de Computador:</span> Garante os direitos autorais sobre o software.</li>
                  <li><span className="font-medium">Indicação Geográfica:</span> Identifica a origem de produtos ou serviços quando a reputação, característica ou qualidade se deve essencialmente a esse local.</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-2">Como Pesquisar?</h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  Utilize o campo de busca acima para encontrar registros por termos livres, número do processo, título, depositante ou classificação internacional (IPC).
                </p>
              </div>
            </div>

            <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Pronto para iniciar sua busca?
            </p>
            <div className="w-64 h-64 mb-4">
              <Lottie animationData={blueCubeAnim} loop={true} />
            </div>
          </div>
        )}

        {results?.items?.length === 0 && (
          <EmptyState icon={Server} title="Nenhum resultado" description="Sua busca não retornou patentes. Tente termos mais abrangentes ou troque o filtro." />
        )}

        {/* Results Grid */}
        {results?.items?.length > 0 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h2 className="text-sm font-semibold">Resultados da Busca</h2>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{results.total?.toLocaleString()} registros encontrados</Badge>
                {hasGeoFilter ? (
                  <Badge className="bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300">
                    BA: {[territory, municipality].filter(Boolean).join(' / ')}
                  </Badge>
                ) : null}
              </div>
            </div>

            {/* {results.geoFiltered && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 -mt-4">
                Filtro geográfico aplicado por varredura textual em {results.geoFilterLimit || results.limit} registros.
              </p>
            )} */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.items.map((item, idx) => (
                <div
                  key={item.numero || idx}
                  onClick={() => openDetails(item)}
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
            {results.pages > 1 && !results.geoFiltered && (
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
                <div className="flex h-full min-h-[300px] items-center justify-center flex-col gap-3">
                  <div className="w-32 h-32">
                    <Lottie animationData={apiTestingAnim} loop={true} />
                  </div>
                  <p className="text-sm font-medium text-zinc-500 animate-pulse">Recuperando documento oficial...</p>
                </div>
              )}

              {detailsError && (
                <EmptyState icon={X} title="Erro na leitura" description={detailsError} />
              )}

              {patentDetails && !detailsLoading && (
                <div className="space-y-6">
                  <div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant="primary">{selectedPatentId}</Badge>
                      {patentDetails.tipo && <Badge>{patentDetails.tipo}</Badge>}
                      {patentDetails.fonte && <Badge>{`Fonte: ${patentDetails.fonte}`}</Badge>}
                    </div>
                    {(patentDetails.url_oficial || selectedItem?.url_detalhe || selectedItem?.fonte_zip_url) && (
                      <div className="mt-3">
                        <a
                          href={patentDetails.url_oficial || selectedItem?.url_detalhe || selectedItem?.fonte_zip_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-teal-700 hover:text-teal-600 underline underline-offset-2"
                        >
                          Abrir fonte oficial no INPI
                        </a>
                      </div>
                    )}
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
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { SearchFilters } from './SearchFilters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

export default function PatentSearchClient() {
  const [health, setHealth] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const runSearch = useCallback(async (params) => {
    const query = new URLSearchParams(params).toString();
    if (!query || (!params.q && !params.numero && !params.titulo && !params.depositante && !params.ipc)) {
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?${query}`);
      if (!res.ok) throw new Error(`A busca falhou: ${res.statusText}`);
      const data = await res.json();
      setResults(data);
    } catch (e) {
      setError(e.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => setHealth({ status: 'error', message: 'Proxy da API está offline.' }));
  }, []);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    runSearch(params);
  }, [searchParams, runSearch]);

  const handleSearch = (newParams) => {
    const params = new URLSearchParams();
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleViewDetails = async (patentNumber) => {
    setSelectedPatent(patentNumber);
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const res = await fetch(`/api/patents/${patentNumber}`);
      if (!res.ok) throw new Error('Não foi possível encontrar os detalhes da patente.');
      const data = await res.json();
      setModalContent(data);
    } catch (e) {
      setModalContent({ error: e.message });
    } finally {
      setModalLoading(false);
    }
  };

  const filterKeys = ['q', 'numero', 'titulo', 'depositante', 'ipc'];
  const initialFilter = filterKeys.find(f => searchParams.has(f)) || 'q';
  const initialQuery = searchParams.get(initialFilter) || '';

  const hasSearched = results !== null || loading;

  return (
    <div className={`flex flex-col ${hasSearched ? 'items-start' : 'items-center justify-center min-h-[70vh]'} max-w-6xl mx-auto px-4 py-8 w-full`}>
      {!hasSearched && (
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold tracking-tighter mb-2 cursor-default">
            <span className="text-[#4285F4]">P</span><span className="text-[#EA4335]">a</span><span className="text-[#FBBC05]">t</span><span className="text-[#4285F4]">e</span><span className="text-[#34A853]">n</span><span className="text-[#EA4335]">t</span><span className="text-gray-600">es BR</span>
          </h1>
          <p className="text-gray-500">Busca avançada de propriedade intelectual</p>
        </div>
      )}

      {hasSearched && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-6 pb-6 border-b border-gray-100 mb-6">
          <h1 className="text-3xl font-bold tracking-tighter whitespace-nowrap cursor-pointer" onClick={() => { router.push(pathname); setResults(null); }}>
             <span className="text-[#4285F4]">P</span><span className="text-[#EA4335]">a</span><span className="text-[#FBBC05]">t</span><span className="text-[#4285F4]">e</span><span className="text-[#34A853]">n</span><span className="text-[#EA4335]">t</span><span className="text-gray-600">es</span>
          </h1>
          <div className="flex-grow w-full max-w-3xl">
            <SearchFilters onSearch={handleSearch} loading={loading} initialFilter={initialFilter} initialQuery={initialQuery} compact={true} />
          </div>
        </div>
      )}

      {!hasSearched && (
        <SearchFilters onSearch={handleSearch} loading={loading} initialFilter={initialFilter} initialQuery={initialQuery} compact={false} />
      )}

      {error && <p className="text-red-500 w-full max-w-3xl mt-6">{error}</p>}
      
      {loading && hasSearched && <div className="text-gray-500 mt-4 max-w-3xl w-full">Buscando documentos no banco de dados...</div>}

      {results && !loading && (
        <div className="w-full pb-8">
          <SearchResultsList results={results} onViewDetails={handleViewDetails} />
          {results.meta.total > 0 && <PaginationControls meta={results.meta} onPageChange={handlePageChange} loading={loading} />}
        </div>
      )}
      
      <div className={`fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm border border-gray-100 ${hasSearched ? 'opacity-50 hover:opacity-100 transition-opacity' : ''}`}>
         <ApiHealthCheck health={health} />
      </div>

      <PatentDetailsModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} loading={modalLoading} content={modalContent} />
    </div>
  );
}

function ApiHealthCheck({ health }) {
  if (!health) return <div className="text-center text-xs text-gray-500">Verificando API...</div>;
  const isOk = health.status === 'ok';
  return (
    <div className="flex justify-center items-center gap-2 text-xs">
      <div className={`w-2 h-2 rounded-full ${isOk ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="text-gray-600 font-medium">API do INPI</span>
    </div>
  );
}

function SearchResultsList({ results, onViewDetails }) {
  if (results?.data?.length === 0) return <p className="text-gray-600 mt-4">Sua pesquisa não encontrou nenhum documento correspondente.</p>;
  
  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mt-2">
      <p className="text-sm text-gray-500 -mb-2">
        Aproximadamente {results?.meta?.total || 0} resultados (página {results?.meta?.currentPage || 1} de {results?.meta?.totalPages || 1})
      </p>
      
      {results?.data?.map((patent) => (
        <div key={patent.numero_processo_sem_formatacao} className="flex flex-col gap-1">
          <div className="text-sm text-gray-700 truncate flex items-center gap-2">
            <span className="font-medium">BR {patent.numero_processo}</span>
            <span className="text-gray-400">•</span>
            <span>Publicado em {patent.data_publicacao}</span>
          </div>
          <h3 
            className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium leading-tight"
            onClick={() => onViewDetails(patent.numero_processo_sem_formatacao)}
          >
            {patent.titulo || 'Título não disponível'}
          </h3>
          <p className="text-sm text-[#4d5156] line-clamp-2 mt-1">
            <span className="font-medium">Depositante:</span> {patent.depositante || 'Não informado'} 
            {patent.ipc && <span className="ml-2"><span className="font-medium">IPC:</span> {patent.ipc}</span>}
          </p>
        </div>
      ))}
    </div>
  );
}

function PaginationControls({ meta, onPageChange, loading }) {
  const { currentPage, totalPages } = meta;
  if (totalPages <= 1) return null;
  
  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col items-start gap-4 mt-12 py-8 border-t border-gray-100 max-w-3xl">
       <div className="flex items-center space-x-1 sm:space-x-4 text-sm font-medium">
        <Button variant="ghost" className="text-[#1a0dab] hover:text-blue-800 hover:bg-transparent px-2 sm:px-4" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1 || loading}>&lt; Anterior</Button>
        <div className="flex gap-1 sm:gap-2">
           {pages.map((p) => (
              <button 
                key={p} 
                onClick={() => p !== currentPage && !loading && onPageChange(p)} 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${p === currentPage ? 'bg-blue-100 text-blue-700 cursor-default' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {p}
              </button>
           ))}
        </div>
        <Button variant="ghost" className="text-[#1a0dab] hover:text-blue-800 hover:bg-transparent px-2 sm:px-4" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages || loading}>Mais &gt;</Button>
      </div>
    </div>
  );
}

function PatentDetailsModal({ isOpen, setIsOpen, loading, content }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] bg-white border-0 shadow-2xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl text-[#1a0dab]">{loading ? 'Carregando detalhes...' : content?.titulo || 'Detalhes da Patente'}</DialogTitle>
          <DialogDescription className="text-gray-500">
            {loading ? 'Buscando informações no banco de dados...' : `Processo: BR ${content?.numero_processo || 'N/A'}`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-2 max-h-[60vh] overflow-y-auto text-sm">
          {loading && (
             <div className="flex justify-center py-12">
               <div className="animate-pulse flex flex-col items-center gap-3">
                 <div className="h-6 w-32 bg-gray-200 rounded"></div>
                 <div className="h-4 w-48 bg-gray-200 rounded"></div>
               </div>
             </div>
          )}
          {content?.error && <p className="text-red-500 py-4">{content.error}</p>}
          {content && !content.error && !loading && (
            <div className="bg-[#f8f9fa] p-4 rounded-md border border-gray-200 font-mono text-xs overflow-x-auto text-gray-800">
              <pre className="whitespace-pre-wrap">{JSON.stringify(content, null, 2)}</pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
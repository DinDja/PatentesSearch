'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SearchFilters({ onSearch, loading, initialFilter, initialQuery, compact }) {
  const [filterType, setFilterType] = useState(initialFilter || 'q');
  const [query, setQuery] = useState(initialQuery || '');

  // Atualiza o estado interno se os parâmetros da URL mudarem (ex: navegação no histórico)
  useEffect(() => {
    setFilterType(initialFilter || 'q');
    setQuery(initialQuery || '');
  }, [initialFilter, initialQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return; // Não busca se o campo estiver vazio
    // Constrói o objeto de busca baseado no tipo de filtro e no valor
    const searchParams = { [filterType]: query, page: 1 };
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSearch} className={`w-full ${compact ? 'max-w-3xl' : 'max-w-2xl mx-auto'} flex flex-col gap-3 relative`}>
      <div className={`relative flex items-center w-full border border-gray-200 bg-white transition-shadow px-4 ${compact ? 'rounded-full shadow-sm hover:shadow-md focus-within:shadow-md py-2' : 'rounded-full shadow-md hover:shadow-lg focus-within:shadow-lg py-3'}`}>
        <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
        <input
          type="search"
          placeholder={filterType === 'q' ? 'Pesquise por patentes, inventores, termos...' : `Buscar por ${filterType}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow outline-none bg-transparent text-base w-full text-gray-900"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="p-1 ml-2 text-gray-400 hover:text-gray-600 transition-colors">
             <span className="sr-only">Limpar</span>
             <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className={`flex flex-col sm:flex-row items-center ${compact ? 'justify-start' : 'justify-center mt-2'} gap-2 text-sm text-gray-600`}>
        <div className="flex items-center gap-2">
          <span>Filtrar por:</span>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-8 border-none bg-transparent shadow-none hover:bg-gray-100 rounded-md focus:ring-0 px-2 w-auto gap-1 font-medium text-gray-700">
              <SelectValue placeholder="Termo Livre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q">Termo Livre</SelectItem>
              <SelectItem value="numero">Número do Pedido</SelectItem>
              <SelectItem value="titulo">Título</SelectItem>
              <SelectItem value="depositante">Depositante</SelectItem>
              <SelectItem value="ipc">Classificação (IPC)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!compact && (
           <div className="flex gap-3 mt-4 sm:mt-0 sm:ml-4">
             <Button type="submit" disabled={loading} className="bg-[#f8f9fa] hover:bg-[#e8eaed] text-gray-800 border border-[#f8f9fa] hover:border-gray-300 shadow-none hover:shadow-sm rounded-md px-4 h-9 transition-all">
              {loading ? 'Buscando...' : 'Pesquisa de Patentes'}
            </Button>
           </div>
        )}
        {compact && (
          <button type="submit" className="hidden" disabled={loading}>Buscar</button>
        )}
      </div>
    </form>
  );
}
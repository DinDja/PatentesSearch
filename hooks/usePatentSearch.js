import { useState, useCallback } from 'react';

// hook: usePatentSearch.js
export function usePatentSearch(initialLimit = 15) {
  const [searchState, setSearchState] = useState({
    query: '',
    filterType: 'q',
    results: null,
    loading: false,
    error: '',
    page: 1,
    limit: initialLimit,
  });

  const fetchResults = useCallback(async (query, filterType, page) => {
    if (!query.trim()) return;

    setSearchState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const params = new URLSearchParams({
        [filterType]: query,
        page,
        limit: searchState.limit,
      });

      const res = await fetch(`/api/search?${params}`);
      if (!res.ok) throw new Error('Falha ao buscar patentes. Tente novamente.');

      const data = await res.json();
      setSearchState(prev => ({ ...prev, results: data, page, loading: false }));
    } catch (err) {
      setSearchState(prev => ({ ...prev, error: err.message, results: null, loading: false }));
    }
  }, [searchState.limit]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults(searchState.query, searchState.filterType, 1);
  };

  const goToPage = (newPage) => {
    fetchResults(searchState.query, searchState.filterType, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateState = (updates) => setSearchState(prev => ({ ...prev, ...updates }));

  return { ...searchState, updateState, handleSearch, goToPage };
}

// hook: usePatentDetails.js
export function usePatentDetails() {
  const [detailsState, setDetailsState] = useState({
    selectedPatentId: null,
    data: null,
    loading: false,
    error: '',
    isOpen: false,
  });

  const openDetails = async (numero) => {
    setDetailsState({ selectedPatentId: numero, data: null, loading: true, error: '', isOpen: true });

    try {
      const res = await fetch(`/api/patents/${encodeURIComponent(numero)}`);
      if (!res.ok) throw new Error('Detalhes não encontrados.');
      const data = await res.json();
      setDetailsState(prev => ({ ...prev, data, loading: false }));
    } catch (err) {
      setDetailsState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  };

  const closeDetails = () => setDetailsState(prev => ({ ...prev, isOpen: false }));

  return { ...detailsState, openDetails, closeDetails };
}
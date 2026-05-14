import { useState, useCallback } from 'react';
import { buildLocationSeedQuery, filterItemsByBahiaLocation } from '../lib/bahiaTerritories';

const GEO_FILTER_LIMIT = 300;

// hook: usePatentSearch.js
export function usePatentSearch(initialLimit = 15) {
  const [searchState, setSearchState] = useState({
    query: '',
    filterType: 'q',
    territory: '',
    municipality: '',
    results: null,
    loading: false,
    error: '',
    page: 1,
    limit: initialLimit,
  });

  const fetchResults = useCallback(async (query, filterType, page, territory, municipality) => {
    const normalizedQuery = query.trim();
    const hasLocationFilter = Boolean(territory?.trim() || municipality?.trim());
    const locationSeedQuery = buildLocationSeedQuery(territory, municipality);

    if (!normalizedQuery && !hasLocationFilter) {
      setSearchState(prev => ({ ...prev, results: null, error: '', loading: false, page: 1 }));
      return;
    }

    setSearchState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const requestPage = hasLocationFilter ? 1 : page;
      const requestLimit = hasLocationFilter
        ? Math.max(Number(searchState.limit) || 15, GEO_FILTER_LIMIT)
        : Number(searchState.limit) || 15;

      const params = new URLSearchParams({
        page: String(requestPage),
        limit: String(requestLimit),
      });

      if (normalizedQuery) {
        params.set(filterType, normalizedQuery);
      }

      if (locationSeedQuery) {
        const currentQ = params.get('q');
        params.set('q', currentQ ? `${currentQ} ${locationSeedQuery}` : locationSeedQuery);
      }

      if (!normalizedQuery && !params.get('q')) {
        params.set('q', 'bahia');
      }

      const res = await fetch(`/api/search?${params}`);
      if (!res.ok) throw new Error('Falha ao buscar patentes. Tente novamente.');

      const data = await res.json();
      const rawItems = Array.isArray(data.items) ? data.items : [];
      const filteredItems = hasLocationFilter
        ? filterItemsByBahiaLocation(rawItems, { territory, municipality })
        : rawItems;

      const normalizedData = hasLocationFilter
        ? {
            ...data,
            items: filteredItems,
            total: filteredItems.length,
            page: 1,
            pages: 1,
            geoFiltered: true,
            geoFilterLimit: requestLimit,
          }
        : {
            ...data,
            geoFiltered: false,
          };

      setSearchState(prev => ({
        ...prev,
        results: normalizedData,
        page: hasLocationFilter ? 1 : page,
        loading: false,
      }));
    } catch (err) {
      setSearchState(prev => ({ ...prev, error: err.message, results: null, loading: false }));
    }
  }, [searchState.limit]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults(
      searchState.query,
      searchState.filterType,
      1,
      searchState.territory,
      searchState.municipality
    );
  };

  const goToPage = (newPage) => {
    if (searchState.territory.trim() || searchState.municipality.trim()) {
      return;
    }

    fetchResults(
      searchState.query,
      searchState.filterType,
      newPage,
      searchState.territory,
      searchState.municipality
    );
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
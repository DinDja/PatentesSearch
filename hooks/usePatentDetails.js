import { useState } from 'react';

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

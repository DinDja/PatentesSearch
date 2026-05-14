import { useState } from 'react';

export function usePatentDetails() {
  const [detailsState, setDetailsState] = useState({
    selectedPatentId: null,
    selectedItem: null,
    data: null,
    loading: false,
    error: '',
    isOpen: false,
  });

  const openDetails = async (processo) => {
    const numero = typeof processo === 'string' ? processo : processo?.numero;
    if (!numero) return;

    const selectedItem = typeof processo === 'object' && processo !== null ? processo : null;
    setDetailsState({ selectedPatentId: numero, selectedItem, data: null, loading: true, error: '', isOpen: true });

    const query = new URLSearchParams();
    if (selectedItem?.tipo) query.set('tipo', selectedItem.tipo);
    if (selectedItem?.url_detalhe) query.set('url_detalhe', selectedItem.url_detalhe);
    if (selectedItem?.fonte_zip_url) query.set('fonte_zip_url', selectedItem.fonte_zip_url);

    const queryString = query.toString();
    const endpoint = `/api/patents/${encodeURIComponent(numero)}${queryString ? `?${queryString}` : ''}`;

    try {
      const res = await fetch(endpoint, { cache: 'no-store' });
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

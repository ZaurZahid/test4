import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = useCallback(async ({ page = 1, limit = 10, q = '' } = {}) => {
    // Build query params
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (q) params.append('q', q);

    const res = await fetch(`http://localhost:3001/api/items?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch items');

    const json = await res.json();
    setItems(json.results || []);
    setTotalPages(json.totalPages || 1);
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems, totalPages }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);

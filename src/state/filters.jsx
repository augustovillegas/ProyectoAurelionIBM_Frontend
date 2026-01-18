import React, { createContext, useContext, useMemo, useState } from 'react';

const FiltersContext = createContext(null);

export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState({});
  const value = useMemo(() => ({ filters, setFilters }), [filters]);
  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
};

export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFilters debe usarse dentro de FiltersProvider');
  }
  return context;
};

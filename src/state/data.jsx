import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCsv, fetchJson, fetchText } from '../data/csvLoader';
import { DATA_FILES } from '../data/files';
import {
  normalizeBaseRow,
  normalizeClienteClusterRow,
  normalizeClienteRiesgoRow,
  normalizeFeatureImportanceRow,
  normalizeMlClienteRow,
  normalizePerfilSegmentoRow,
  normalizePrediccionValorRow,
} from '../data/normalize';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [
          baseAurelion,
          baseMlClientes,
          perfilesSegmentos,
          clientesClusters,
          clientesRiesgo,
          prediccionesValor,
          featureImportanceChurn,
          featureImportanceValue,
          metricasChurn,
          metricasValue,
          documentacion,
        ] = await Promise.all([
          fetchCsv(DATA_FILES.baseAurelion, normalizeBaseRow),
          fetchCsv(DATA_FILES.baseMlClientes, normalizeMlClienteRow),
          fetchCsv(DATA_FILES.perfilesSegmentos, normalizePerfilSegmentoRow),
          fetchCsv(DATA_FILES.clientesClusters, normalizeClienteClusterRow),
          fetchCsv(DATA_FILES.clientesRiesgo, normalizeClienteRiesgoRow),
          fetchCsv(DATA_FILES.prediccionesValor, normalizePrediccionValorRow),
          fetchCsv(DATA_FILES.featureImportanceChurn, normalizeFeatureImportanceRow),
          fetchCsv(DATA_FILES.featureImportanceValue, normalizeFeatureImportanceRow),
          fetchJson(DATA_FILES.metricasChurn),
          fetchJson(DATA_FILES.metricasValue),
          fetchText(DATA_FILES.documentacion),
        ]);
        if (!mounted) return;
        setData({
          baseAurelion,
          baseMlClientes,
          perfilesSegmentos,
          clientesClusters,
          clientesRiesgo,
          prediccionesValor,
          featureImportanceChurn,
          featureImportanceValue,
          metricasChurn,
          metricasValue,
          documentacion,
        });
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Error inesperado');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => ({ data, loading, error }), [data, loading, error]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe usarse dentro de DataProvider');
  }
  return context;
};

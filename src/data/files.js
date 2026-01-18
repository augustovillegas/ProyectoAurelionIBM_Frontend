export const DATA_FILES = {
  baseAurelion: '/INFORMACION/db/base_final_aurelion.csv',
  baseMlClientes: '/INFORMACION/db/base_final_ML_clientes.csv',
  perfilesSegmentos: '/INFORMACION/modelos/perfiles_segmentos.csv',
  clientesClusters: '/INFORMACION/modelos/clientes_con_clusters.csv',
  clientesRiesgo: '/INFORMACION/modelos/clientes_alto_riesgo.csv',
  prediccionesValor: '/INFORMACION/modelos/predicciones_customer_value.csv',
  featureImportanceChurn: '/INFORMACION/modelos/feature_importance_churn.csv',
  featureImportanceValue: '/INFORMACION/modelos/feature_importance_customer_value.csv',
  metricasChurn: '/INFORMACION/modelos/metricas_churn.json',
  metricasValue: '/INFORMACION/modelos/metricas_customer_value.json',
  documentacion: '/INFORMACION/DOCUMENTACION.md',
  resumenEjecutivo: '/INFORMACION/resumen_ejecutivo.pdf',
  pbix: '/INFORMACION/Proyecto Aurelion - Power BI.pbix'
};

export const DOWNLOADS = [
  { label: 'Base final Aurelion', path: DATA_FILES.baseAurelion },
  { label: 'Base ML clientes', path: DATA_FILES.baseMlClientes },
  { label: 'Perfiles segmentos', path: DATA_FILES.perfilesSegmentos },
  { label: 'Clientes con clusters', path: DATA_FILES.clientesClusters },
  { label: 'Clientes alto riesgo', path: DATA_FILES.clientesRiesgo },
  { label: 'Predicciones customer value', path: DATA_FILES.prediccionesValor },
  { label: 'Feature importance churn', path: DATA_FILES.featureImportanceChurn },
  { label: 'Feature importance customer value', path: DATA_FILES.featureImportanceValue },
  { label: 'Metricas churn', path: DATA_FILES.metricasChurn },
  { label: 'Metricas customer value', path: DATA_FILES.metricasValue },
  { label: 'Documento ejecutivo (PDF)', path: DATA_FILES.resumenEjecutivo },
  { label: 'Power BI (PBIX)', path: DATA_FILES.pbix }
];

import React, { useMemo } from 'react';
import { useData } from '../state/data';
import SectionHeader from '../components/SectionHeader';
import ChartCard from '../components/ChartCard';
import DataBadge from '../components/DataBadge';
import { EmptyState, LoadingState } from '../components/States';
import { aggregateBy } from '../features/bi/aggregations';
import { formatPercent } from '../lib/format';
import { sum } from '../lib/stats';

const Conclusiones = () => {
  const { data, loading, error } = useData();

  const insights = useMemo(() => {
    if (!data) return null;
    const totalVentas = sum(data.baseAurelion.map((row) => row.importe));
    const ventasPorCiudad = aggregateBy(data.baseAurelion, (row) => row.ciudad).sort(
      (a, b) => b.value - a.value,
    );
    const ventasPorCategoria = aggregateBy(data.baseAurelion, (row) => row.categoria).sort(
      (a, b) => b.value - a.value,
    );
    const topCiudad = ventasPorCiudad[0];
    const topCategoria = ventasPorCategoria[0];
    return {
      topCiudad,
      topCiudadPct: topCiudad ? topCiudad.value / totalVentas : 0,
      topCategoria,
      topCategoriaPct: topCategoria ? topCategoria.value / totalVentas : 0,
      totalClientes: data.baseMlClientes.length,
      silhouette: data.documentacion.match(/Silhouette Score:\s*([0-9.]+)/i)?.[1],
    };
  }, [data]);

  if (loading) return <LoadingState label="Cargando conclusiones..." />;
  if (error || !data) return <EmptyState label={error || 'Datos no disponibles'} />;

  const churn = data.metricasChurn;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Conclusiones y roadmap"
        subtitle="Implicancias, riesgos y siguientes pasos"
        actions={<DataBadge source="db/base_final_aurelion.csv" />}
      />

      <ChartCard title="Implicancias estrategicas" source="db/base_final_aurelion.csv">
        <ul className="space-y-2 text-sm text-slate-600">
          <li>
            Concentracion geografica: {insights?.topCiudad?.label || 'N/D'} representa{' '}
            {formatPercent(insights?.topCiudadPct || 0, 1)} de la facturacion total.
          </li>
          <li>
            Mix de categorias: {insights?.topCategoria?.label || 'N/D'} concentra{' '}
            {formatPercent(insights?.topCategoriaPct || 0, 1)} del total.
          </li>
          <li>Segmentacion y churn habilitan priorizacion de clientes por valor y riesgo.</li>
        </ul>
      </ChartCard>

      <ChartCard title="Riesgos y limitaciones" source="modelos/metricas_churn.json">
        <ul className="space-y-2 text-sm text-slate-600">
          <li>Dataset reducido: {insights?.totalClientes || 0} clientes en el dataset ML.</li>
          <li>Silhouette bajo: {insights?.silhouette || 'N/D'} (segun documentacion).</li>
          <li>
            Sobreajuste en churn: accuracy train{' '}
            {churn?.accuracy_train ? formatPercent(churn.accuracy_train) : 'N/D'} vs test{' '}
            {churn?.accuracy_test ? formatPercent(churn.accuracy_test) : 'N/D'}.
          </li>
          <li>ROC-AUC modesto en churn (0.57) requiere iteraciones adicionales.</li>
          <li>Solapamiento entre clusters: silhouette moderado indica segmentos utiles pero no puros.</li>
        </ul>
      </ChartCard>

      <ChartCard title="Recomendaciones tecnicas" source="DOCUMENTACION.md">
        <ul className="space-y-2 text-sm text-slate-600">
          <li>Churn: mantener exclusion de recency en features.</li>
          <li>Churn: definir churn futuro (no compra en 90 dias) y calibrar threshold por precision/recall.</li>
          <li>Customer Value: comunicar como prediccion de valor, no CLV formal.</li>
          <li>Customer Value: cruzar con segmentos para priorizar campanas.</li>
          <li>Clustering: integrar segmentos en CRM/BI y monitorear drift mensualmente.</li>
        </ul>
      </ChartCard>

      <ChartCard title="Recomendaciones ejecutivas" source="DOCUMENTACION.md">
        <ul className="space-y-2 text-sm text-slate-600">
          <li>Reforzar la gestion de stock en la categoria dominante.</li>
          <li>Activar campanas de retencion en clientes con alto riesgo de churn.</li>
          <li>Usar el modelo de valor para priorizar acciones comerciales.</li>
        </ul>
      </ChartCard>

      <ChartCard title="Proximos pasos" source="DOCUMENTACION.md">
        <ul className="space-y-2 text-sm text-slate-600">
          <li>Automatizacion del pipeline: ETL completo y reentrenamiento automatico.</li>
          <li>Dashboard interactivo con segmentos, churn y valor estimado.</li>
          <li>Testing y optimizacion: A/B testing de campanas y validacion de ROI.</li>
        </ul>
      </ChartCard>

      <ChartCard title="Trazabilidad y calidad de datos" source="DOCUMENTACION.md">
        <ul className="space-y-2 text-sm text-slate-600">
          <li>Integridad referencial validada.</li>
          <li>0 nulos en campos clave y 0 duplicados en identificadores unicos.</li>
          <li>Tipos de datos consistentes y rangos dentro de limites esperados.</li>
        </ul>
      </ChartCard>

      <ChartCard title="Seleccion de hiperparametros" source="DOCUMENTACION.md">
        <ul className="space-y-2 text-sm text-slate-600">
          <li>K-Means: K=3 con elbow + silhouette, n_init=20, max_iter=500.</li>
          <li>Random Forest: n_estimators=100, max_depth=10, min_samples_split=5.</li>
          <li>Random Forest: min_samples_leaf=2, random_state=42.</li>
        </ul>
      </ChartCard>

      <ChartCard title="Etica, privacidad y buenas practicas" source="DOCUMENTACION.md">
        <ul className="space-y-2 text-sm text-slate-600">
          <li>Datasets ML sin PII sensible (emails y nombres eliminados).</li>
          <li>Validar resultados con datos nuevos antes de produccion.</li>
        </ul>
      </ChartCard>

      <ChartCard title="Roadmap 30/60/90 dias" source="DOCUMENTACION.md">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2 text-left">Horizonte</th>
                <th className="px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-3 py-2">30 dias</td>
                <td className="px-3 py-2">Pendiente de definicion en archivos oficiales.</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-3 py-2">60 dias</td>
                <td className="px-3 py-2">Pendiente de definicion en archivos oficiales.</td>
              </tr>
              <tr>
                <td className="px-3 py-2">90 dias</td>
                <td className="px-3 py-2">Pendiente de definicion en archivos oficiales.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Nota de consistencia: no se encontraron detalles de roadmap en los CSV/MD provistos.
        </p>
      </ChartCard>

      <ChartCard title="Notas de consistencia" source="db/base_final_aurelion.csv">
        <p className="text-sm text-slate-600">
          Las cifras mostradas provienen de los datasets y metricas disponibles. Si alguna cifra
          difiere de documentos externos, se prioriza el dato calculado en runtime.
        </p>
      </ChartCard>
    </div>
  );
};

export default Conclusiones;


import React, { useMemo } from 'react';
import { useData } from '../state/data';
import { useFilters } from '../state/filters';
import { applyFilters } from '../data/filtering';
import { formatARS, formatNumber, formatPercent } from '../lib/format';
import { aggregateBy, aggregateByTicket } from '../features/bi/aggregations';
import { computeKpis } from '../features/bi/kpis';
import { groupBy } from '../lib/stats';
import { EmptyState, LoadingState } from '../components/States';
import KpiCard from '../components/KpiCard';
import DataBadge from '../components/DataBadge';
import SectionHeader from '../components/SectionHeader';

const Home = () => {
  const { data, loading, error } = useData();
  const { filters } = useFilters();

  const filteredRows = useMemo(() => {
    if (!data) return [];
    return applyFilters(data.baseAurelion, filters);
  }, [data, filters]);

  const kpis = useMemo(() => computeKpis(filteredRows), [filteredRows]);
  const pagoMix = useMemo(
    () => aggregateByTicket(filteredRows, (row) => row.medio_pago),
    [filteredRows],
  );
  const categoriaMix = useMemo(
    () => aggregateBy(filteredRows, (row) => row.categoria),
    [filteredRows],
  );
  const insights = useMemo(() => {
    const pagoTotal = pagoMix.reduce((acc, item) => acc + item.value, 0);
    const topPago = pagoMix.reduce(
      (best, item) => (item.value > (best?.value ?? 0) ? item : best),
      null,
    );
    const categoriaTotal = categoriaMix.reduce((acc, item) => acc + item.value, 0);
    const topCategoria = categoriaMix.reduce(
      (best, item) => (item.value > (best?.value ?? 0) ? item : best),
      null,
    );

    return {
      topPago,
      pagoShare: pagoTotal ? topPago?.value / pagoTotal : 0,
      topCategoria,
      categoriaShare: categoriaTotal ? topCategoria?.value / categoriaTotal : 0,
    };
  }, [categoriaMix, pagoMix]);
  const mlFeatureCount = useMemo(() => {
    if (!data?.baseMlClientes?.length) return 0;
    return Object.keys(data.baseMlClientes[0]).filter(
      (key) => !['id_cliente', 'ciudad'].includes(key),
    ).length;
  }, [data]);
  const clusterSummary = useMemo(() => {
    if (!data?.clientesClusters?.length) return [];
    const grouped = groupBy(data.clientesClusters, (row) => row.cluster);
    return Object.entries(grouped)
      .map(([cluster, items]) => ({ cluster, count: items.length }))
      .sort((a, b) => Number(a.cluster) - Number(b.cluster));
  }, [data]);

  if (loading) return <LoadingState label="Cargando resumen ejecutivo..." />;
  if (error || !data) return <EmptyState label={error || 'Datos no disponibles'} />;

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Executive Summary"
        subtitle="Historia completa del proyecto: BI + ML sobre retail minorista"
        actions={<DataBadge source="db/base_final_aurelion.csv" />}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Ventas totales" value={formatARS(kpis.totalVentas)} />
        <KpiCard
          label="Ticket promedio"
          value={formatARS(kpis.ticketPromedio)}
          helper="Calculado por id_venta"
        />
        <KpiCard label="Ticket mediana" value={formatARS(kpis.ticketMediana)} />
        <KpiCard
          label="Items por venta"
          value={formatNumber(kpis.itemsPorVenta, 2)}
        />
        <KpiCard label="Clientes unicos" value={formatNumber(kpis.clientesUnicos)} />
        <KpiCard label="Transacciones" value={formatNumber(kpis.transacciones)} />
        <KpiCard label="SKUs" value={formatNumber(kpis.skus)} />
        <KpiCard
          label="Calidad"
          value={`${formatNumber(kpis.nulls)} nulos / ${formatNumber(kpis.duplicates)} duplicados`}
        />
      </div>
      <div className="flex items-center justify-end">
        <DataBadge source="db/base_final_aurelion.csv" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-base font-semibold text-slate-900">Insights clave</h4>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            {insights.topPago ? (
              <>
                Medio de pago lider: {insights.topPago.label} con{' '}
                {formatPercent(insights.pagoShare, 0)} de los tickets.
              </>
            ) : (
              <>Medio de pago lider: N/D.</>
            )}
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            {insights.topCategoria ? (
              <>
                Categoria dominante: {insights.topCategoria.label} con{' '}
                {formatPercent(insights.categoriaShare, 0)} de la facturacion.
              </>
            ) : (
              <>Categoria dominante: N/D.</>
            )}
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            Base operativa: {formatNumber(kpis.clientesUnicos)} clientes,{' '}
            {formatNumber(kpis.transacciones)} transacciones, {formatNumber(kpis.skus)} SKUs.
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <DataBadge source="db/base_final_aurelion.csv" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="text-base font-semibold text-slate-900">Problema de negocio</h4>
          <p className="mt-3 text-sm text-slate-600">
            Convertir datos transaccionales en decisiones: optimizar inventario y mix, mejorar
            retencion y priorizar recursos segun valor esperado.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="text-base font-semibold text-slate-900">Solucion</h4>
          <p className="mt-3 text-sm text-slate-600">
            ETL + dataset master BI + tablero Power BI + modelos ML: KMeans, churn RF y
            customer value RF.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="text-base font-semibold text-slate-900">Evidencia</h4>
          <p className="mt-3 text-sm text-slate-600">
            KPIs, graficos y tablas construidos desde los CSV oficiales del proyecto.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <DataBadge source="DOCUMENTACION.md" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-base font-semibold text-slate-900">Baseline del dataset</h4>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            Filas procesadas: {formatNumber(filteredRows.length)}
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            Filas totales (sin filtros): {formatNumber(data.baseAurelion.length)}
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            Filtros activos: {Object.values(filters).filter(Boolean).length}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <DataBadge source="db/base_final_aurelion.csv" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-base font-semibold text-slate-900">Controles de calidad y definiciones</h4>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>
            Nulos detectados: {formatNumber(kpis.nulls)}. Duplicados detectados:{' '}
            {formatNumber(kpis.duplicates)} (id_venta + id_producto).
          </li>
          <li>
            Normalizacion: valores vacios numericos pasan a 0; ciudad y categoria sin dato se
            registran como sin-ciudad / sin-categoria.
          </li>
          <li>
            Medio de pago sin match queda como Desconocido para mantener consistencia de filtros.
          </li>
          <li>
            Ticket promedio = promedio del importe total por id_venta (mismo criterio en BI).
          </li>
        </ul>
        <div className="mt-4 flex items-center justify-end">
          <DataBadge source="db/base_final_aurelion.csv" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-base font-semibold text-slate-900">Metodologia ML (resumen)</h4>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Segmentacion
            </p>
            <p className="mt-2">
              K-Means (K=3) sobre {mlFeatureCount} variables numericas.
            </p>
            <p className="mt-2">
              Distribucion: {clusterSummary.length ? clusterSummary.map((item) => item.count).join(' / ') : 'N/D'}{' '}
              clientes.
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Churn</p>
            <p className="mt-2">Random Forest (clasificacion).</p>
            <p className="mt-2">
              Accuracy test:{' '}
              {data.metricasChurn?.accuracy_test
                ? formatPercent(data.metricasChurn.accuracy_test, 1)
                : 'N/D'}{' '}
              | ROC-AUC:{' '}
              {data.metricasChurn?.roc_auc ? formatNumber(data.metricasChurn.roc_auc, 3) : 'N/D'}.
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Customer value
            </p>
            <p className="mt-2">Random Forest Regressor.</p>
            <p className="mt-2">
              MAE test:{' '}
              {data.metricasValue?.mae_test ? formatARS(data.metricasValue.mae_test) : 'N/D'} | R2
              test:{' '}
              {data.metricasValue?.r2_test ? formatNumber(data.metricasValue.r2_test, 3) : 'N/D'}.
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <DataBadge source="modelos/metricas_churn.json" />
        </div>
      </div>
    </div>
  );
};

export default Home;


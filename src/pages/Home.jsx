import React, { useMemo } from 'react';
import { useData } from '../state/data';
import { useFilters } from '../state/filters';
import { applyFilters } from '../data/filtering';
import { formatARS, formatNumber } from '../lib/format';
import { computeKpis } from '../features/bi/kpis';
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
    </div>
  );
};

export default Home;


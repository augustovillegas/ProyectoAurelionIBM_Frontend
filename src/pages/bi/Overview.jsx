import React, { useMemo } from 'react';
import { ResponsiveContainer, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useData } from '../../state/data';
import { useFilters } from '../../state/filters';
import { applyFilters } from '../../data/filtering';
import { computeKpis } from '../../features/bi/kpis';
import { aggregateByMonth } from '../../features/bi/aggregations';
import { formatARS, formatNumber } from '../../lib/format';
import KpiCard from '../../components/KpiCard';
import SectionHeader from '../../components/SectionHeader';
import DataBadge from '../../components/DataBadge';
import ChartCard from '../../components/ChartCard';
import { EmptyState, LoadingState } from '../../components/States';

const BiOverview = () => {
  const { data, loading, error } = useData();
  const { filters } = useFilters();

  const filteredRows = useMemo(() => {
    if (!data) return [];
    return applyFilters(data.baseAurelion, filters);
  }, [data, filters]);

  const kpis = useMemo(() => computeKpis(filteredRows), [filteredRows]);
  const mensual = useMemo(() => aggregateByMonth(filteredRows), [filteredRows]);

  if (loading) return <LoadingState label="Cargando overview BI..." />;
  if (error || !data) return <EmptyState label={error || 'Datos no disponibles'} />;
  if (!filteredRows.length) return <EmptyState />;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="BI Overview"
        subtitle="KPIs ejecutivos y evolucion mensual de ventas"
        actions={<DataBadge source="db/base_final_aurelion.csv" />}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Ventas totales" value={formatARS(kpis.totalVentas)} />
        <KpiCard label="Ticket promedio" value={formatARS(kpis.ticketPromedio)} />
        <KpiCard label="Clientes unicos" value={formatNumber(kpis.clientesUnicos)} />
        <KpiCard label="Transacciones" value={formatNumber(kpis.transacciones)} />
      </div>
      <div className="flex items-center justify-end">
        <DataBadge source="db/base_final_aurelion.csv" />
      </div>
      <ChartCard
        title="Ventas por mes"
        helper="Importe total por mes (filtrado)"
        source="db/base_final_aurelion.csv"
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mensual}>
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatARS(value)} />
              <Line type="monotone" dataKey="value" stroke="#0f172a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

export default BiOverview;



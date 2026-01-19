import React, { useMemo } from 'react';
import { ResponsiveContainer, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useData } from '../../state/data';
import { useFilters } from '../../state/filters';
import { applyFilters } from '../../data/filtering';
import { computeKpis } from '../../features/bi/kpis';
import { aggregateByMonth } from '../../features/bi/aggregations';
import { formatARS, formatNumber } from '../../lib/format';
import { groupBy, sum } from '../../lib/stats';
import KpiCard from '../../components/KpiCard';
import SectionHeader from '../../components/SectionHeader';
import DataBadge from '../../components/DataBadge';
import ChartCard from '../../components/ChartCard';
import Gauge from '../../components/Gauge';
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
  const ticketStats = useMemo(() => {
    if (!filteredRows.length) return { min: 0, max: 0 };
    const ticketsByVenta = groupBy(filteredRows, (row) => row.id_venta);
    const ticketValues = Object.values(ticketsByVenta).map((items) =>
      sum(items.map((row) => row.importe)),
    );
    return {
      min: Math.min(...ticketValues),
      max: Math.max(...ticketValues),
    };
  }, [filteredRows]);

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
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ChartCard
            title="Tickets promedio"
            helper="Ticket promedio = promedio del importe total por id_venta. Rango min/max calculado sobre tickets filtrados."
            source="db/base_final_aurelion.csv"
          >
            <Gauge
              value={kpis.ticketPromedio}
              min={ticketStats.min}
              max={ticketStats.max}
              label="Ticket promedio"
              formatValue={formatARS}
            />
          </ChartCard>
        </div>
        <div className="lg:col-span-2">
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
      </div>
    </div>
  );
};

export default BiOverview;



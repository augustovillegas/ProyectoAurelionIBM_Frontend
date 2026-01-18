import React, { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useData } from '../../state/data';
import { useFilters } from '../../state/filters';
import { applyFilters } from '../../data/filtering';
import { aggregateByTicket } from '../../features/bi/aggregations';
import { formatNumber, formatPercent } from '../../lib/format';
import ChartCard from '../../components/ChartCard';
import DataBadge from '../../components/DataBadge';
import SectionHeader from '../../components/SectionHeader';
import { EmptyState, LoadingState } from '../../components/States';

const colors = ['#0f172a', '#1e293b', '#0f766e', '#a16207'];

const BiPagos = () => {
  const { data, loading, error } = useData();
  const { filters, setFilters } = useFilters();

  const filteredRows = useMemo(() => {
    if (!data) return [];
    return applyFilters(data.baseAurelion, filters);
  }, [data, filters]);

  const pagoMix = useMemo(
    () => aggregateByTicket(filteredRows, (row) => row.medio_pago),
    [filteredRows],
  );
  const total = useMemo(
    () => pagoMix.reduce((acc, item) => acc + item.value, 0),
    [pagoMix],
  );

  if (loading) return <LoadingState label="Cargando mix de pagos..." />;
  if (error || !data) return <EmptyState label={error || 'Datos no disponibles'} />;
  if (!filteredRows.length) return <EmptyState />;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Mix de medios de pago"
        subtitle="Distribucion de tickets por medio de pago"
        actions={<DataBadge source="db/base_final_aurelion.csv" />}
      />
      <ChartCard
        title="Participacion por medio de pago"
        helper="Click en una porcion para filtrar"
        source="db/base_final_aurelion.csv"
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pagoMix}
                dataKey="value"
                nameKey="label"
                innerRadius={60}
                outerRadius={110}
                labelLine={false}
                label={({ percent }) => formatPercent(percent, 0)}
                onClick={(dataPoint) =>
                  setFilters((prev) => ({
                    ...prev,
                    medioPago: dataPoint?.label || undefined,
                  }))
                }
              >
                {pagoMix.map((entry, index) => (
                  <Cell key={entry.label} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  total ? `${formatNumber(value)} (${formatPercent(value / total, 1)})` : formatNumber(value)
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {filters.medioPago && (
          <div className="mt-4 text-xs text-slate-500">
            Filtro activo: {filters.medioPago} -
            <button
              onClick={() => setFilters((prev) => ({ ...prev, medioPago: undefined }))}
              className="ml-2 text-slate-700 underline"
            >
              Limpiar
            </button>
          </div>
        )}
      </ChartCard>
    </div>
  );
};

export default BiPagos;



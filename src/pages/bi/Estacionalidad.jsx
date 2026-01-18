import React, { useMemo } from 'react';
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useData } from '../../state/data';
import { useFilters } from '../../state/filters';
import { applyFilters } from '../../data/filtering';
import { aggregateByMonth } from '../../features/bi/aggregations';
import { formatARS } from '../../lib/format';
import ChartCard from '../../components/ChartCard';
import DataBadge from '../../components/DataBadge';
import SectionHeader from '../../components/SectionHeader';
import { EmptyState, LoadingState } from '../../components/States';

const BiEstacionalidad = () => {
  const { data, loading, error } = useData();
  const { filters } = useFilters();

  const filteredRows = useMemo(() => {
    if (!data) return [];
    return applyFilters(data.baseAurelion, filters);
  }, [data, filters]);

  const mensual = useMemo(() => aggregateByMonth(filteredRows), [filteredRows]);
  const maxValue = useMemo(
    () => (mensual.length ? Math.max(...mensual.map((item) => item.value)) : 0),
    [mensual],
  );
  const barColors = ['#0f172a', '#1e293b', '#0f766e', '#1d4ed8', '#a16207'];

  if (loading) return <LoadingState label="Cargando estacionalidad..." />;
  if (error || !data) return <EmptyState label={error || 'Datos no disponibles'} />;
  if (!filteredRows.length) return <EmptyState />;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Estacionalidad"
        subtitle="Ventas por mes"
        actions={<DataBadge source="db/base_final_aurelion.csv" />}
      />
      <ChartCard title="Ventas por mes" helper="Suma de importe por periodo" source="db/base_final_aurelion.csv">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mensual}>
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatARS(value)} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {mensual.map((entry, index) => (
                  <Cell
                    key={entry.label}
                    fill={entry.value === maxValue ? '#0f766e' : barColors[index % barColors.length]}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="insideTop"
                  formatter={(value) => formatARS(value)}
                  className="fill-white text-xs"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

export default BiEstacionalidad;

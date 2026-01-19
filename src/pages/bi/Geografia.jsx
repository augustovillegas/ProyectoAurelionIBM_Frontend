import React, { useMemo } from 'react';
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useData } from '../../state/data';
import { useFilters } from '../../state/filters';
import { applyFilters } from '../../data/filtering';
import { aggregateBy } from '../../features/bi/aggregations';
import { formatARS } from '../../lib/format';
import ChartCard from '../../components/ChartCard';
import DataBadge from '../../components/DataBadge';
import SectionHeader from '../../components/SectionHeader';
import { EmptyState, LoadingState } from '../../components/States';

const BiGeografia = () => {
  const { data, loading, error } = useData();
  const { filters, setFilters } = useFilters();

  const filteredRows = useMemo(() => {
    if (!data) return [];
    return applyFilters(data.baseAurelion, filters);
  }, [data, filters]);

  const ciudades = useMemo(() => aggregateBy(filteredRows, (row) => row.ciudad), [filteredRows]);
  const maxValue = useMemo(
    () => (ciudades.length ? Math.max(...ciudades.map((item) => item.value)) : 0),
    [ciudades],
  );
  const barColors = ['#0f172a', '#1e293b', '#0f766e', '#1d4ed8', '#a16207'];

  if (loading) return <LoadingState label="Cargando geografia..." />;
  if (error || !data) return <EmptyState label={error || 'Datos no disponibles'} />;
  if (!filteredRows.length) return <EmptyState />;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Ventas por ciudad"
        subtitle="Distribucion geografica de facturacion"
        actions={<DataBadge source="db/base_final_aurelion.csv" />}
      />
      <ChartCard
        title="Facturacion por ciudad"
        helper="Click en una barra para filtrar"
        source="db/base_final_aurelion.csv"
      >
        <div className="h-80 -mx-3 pl-2 sm:mx-0 sm:pl-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ciudades} margin={{ left: 32 }}>
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatARS(value)} />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                onClick={(entry) =>
                  setFilters((prev) => ({
                    ...prev,
                    ciudad: entry?.label || undefined,
                  }))
                }
              >
                {ciudades.map((entry, index) => (
                  <Cell
                    key={entry.label}
                    fill={entry.value === maxValue ? '#0f766e' : barColors[index % barColors.length]}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  content={({ x, y, width, height, value, index }) => {
                    if (
                      x === undefined ||
                      y === undefined ||
                      width === undefined ||
                      height === undefined ||
                      index === undefined
                    ) {
                      return null;
                    }
                    const label = String(ciudades[index]?.label || '').toLowerCase();
                    const isRioCuarto = label === 'rio cuarto' || label === 'río cuarto';
                    const labelX = x + width / 2;
                    const labelY = isRioCuarto ? y + 14 : y - 6;
                    const fill = isRioCuarto ? '#ffffff' : '#475569';
                    return (
                      <text x={labelX} y={labelY} textAnchor="middle" fill={fill} fontSize={12}>
                        {formatARS(value)}
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {filters.ciudad && (
          <div className="mt-4 text-xs text-slate-500">
            Filtro activo: {filters.ciudad} -
            <button
              onClick={() => setFilters((prev) => ({ ...prev, ciudad: undefined }))}
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

export default BiGeografia;

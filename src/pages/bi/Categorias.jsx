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

const colors = ['#0f172a', '#1e293b', '#0f766e', '#1d4ed8', '#a16207'];

const BiCategorias = () => {
  const { data, loading, error } = useData();
  const { filters, setFilters } = useFilters();

  const filteredRows = useMemo(() => {
    if (!data) return [];
    return applyFilters(data.baseAurelion, filters);
  }, [data, filters]);

  const categorias = useMemo(
    () => aggregateBy(filteredRows, (row) => row.categoria),
    [filteredRows],
  );
  const maxValue = useMemo(
    () => (categorias.length ? Math.max(...categorias.map((item) => item.value)) : 0),
    [categorias],
  );

  if (loading) return <LoadingState label="Cargando categorias..." />;
  if (error || !data) return <EmptyState label={error || 'Datos no disponibles'} />;
  if (!filteredRows.length) return <EmptyState />;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Mix de categorias"
        subtitle="Facturacion por categoria con accion de cross-filter"
        actions={<DataBadge source="db/base_final_aurelion.csv" />}
      />
      <ChartCard
        title="Facturacion por categoria"
        helper="Click en una barra para filtrar"
        source="db/base_final_aurelion.csv"
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categorias} layout="vertical" margin={{ left: 32 }}>
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="label" type="category" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatARS(value)} />
              <Bar
                dataKey="value"
                radius={[6, 6, 6, 6]}
                onClick={(entry) =>
                  setFilters((prev) => ({
                    ...prev,
                    categoria: entry?.label || undefined,
                  }))
                }
              >
                <LabelList
                  dataKey="value"
                  position="insideRight"
                  formatter={(value) => formatARS(value)}
                  className="fill-white text-xs"
                />
                {categorias.map((entry, index) => (
                  <Cell
                    key={entry.label}
                    fill={entry.value === maxValue ? '#0f766e' : colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {filters.categoria && (
          <div className="mt-4 text-xs text-slate-500">
            Filtro activo: {filters.categoria} -
            <button
              onClick={() => setFilters((prev) => ({ ...prev, categoria: undefined }))}
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

export default BiCategorias;

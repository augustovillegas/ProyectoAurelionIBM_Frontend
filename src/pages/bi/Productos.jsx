import React, { useMemo } from 'react';
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useData } from '../../state/data';
import { useFilters } from '../../state/filters';
import { applyFilters } from '../../data/filtering';
import { aggregateByProducto } from '../../features/bi/aggregations';
import { formatARS, formatPercent } from '../../lib/format';
import { sum } from '../../lib/stats';
import ChartCard from '../../components/ChartCard';
import DataBadge from '../../components/DataBadge';
import SectionHeader from '../../components/SectionHeader';
import { DataTable } from '../../components/DataTable';
import { EmptyState, LoadingState } from '../../components/States';

const BiProductos = () => {
  const { data, loading, error } = useData();
  const { filters } = useFilters();

  const filteredRows = useMemo(() => {
    if (!data) return [];
    return applyFilters(data.baseAurelion, filters);
  }, [data, filters]);

  const productos = useMemo(() => aggregateByProducto(filteredRows), [filteredRows]);
  const topTen = useMemo(() => productos.slice(0, 10), [productos]);
  const maxValue = useMemo(
    () => (topTen.length ? Math.max(...topTen.map((item) => item.value)) : 0),
    [topTen],
  );
  const barColors = ['#0f172a', '#1e293b', '#0f766e', '#1d4ed8', '#a16207'];
  const tabla = useMemo(() => {
    const total = sum(productos.map((row) => row.value));
    let acumulado = 0;
    return productos.slice(0, 20).map((row) => {
      acumulado += row.value;
      return {
        ...row,
        acumulado,
        acumuladoPct: total ? acumulado / total : 0,
      };
    });
  }, [productos]);

  const columns = useMemo(
    () => [
      { header: 'Producto', accessorKey: 'label' },
      { header: 'Facturacion', accessorKey: 'value', cell: (info) => formatARS(info.getValue()) },
      { header: '% acumulado', accessorKey: 'acumuladoPct', cell: (info) => formatPercent(info.getValue()) },
    ],
    [],
  );

  if (loading) return <LoadingState label="Cargando productos..." />;
  if (error || !data) return <EmptyState label={error || 'Datos no disponibles'} />;
  if (!filteredRows.length) return <EmptyState />;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Top productos"
        subtitle="Facturacion acumulada por producto"
        actions={<DataBadge source="db/base_final_aurelion.csv" />}
      />
      <ChartCard title="Top 10 productos por facturacion" source="db/base_final_aurelion.csv">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topTen} margin={{ left: 24 }}>
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} angle={-15} height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatARS(value)} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {topTen.map((entry, index) => (
                  <Cell
                    key={entry.label}
                    fill={entry.value === maxValue ? '#0f766e' : barColors[index % barColors.length]}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="insideTop"
                  formatter={(value) => formatARS(value)}
                  className="fill-white text-[10px]"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
      <ChartCard title="Detalle de productos" source="db/base_final_aurelion.csv">
        <DataTable data={tabla} columns={columns} searchPlaceholder="Buscar producto" />
      </ChartCard>
    </div>
  );
};

export default BiProductos;

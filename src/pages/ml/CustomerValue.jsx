import React, { useMemo } from 'react';
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useData } from '../../state/data';
import { formatARS, formatNumber } from '../../lib/format';
import ChartCard from '../../components/ChartCard';
import DataBadge from '../../components/DataBadge';
import SectionHeader from '../../components/SectionHeader';
import { DataTable } from '../../components/DataTable';
import { EmptyState, LoadingState } from '../../components/States';

const CustomerValue = () => {
  const { data, loading, error } = useData();

  const topFeatures = useMemo(() => {
    if (!data) return [];
    return [...data.featureImportanceValue]
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10);
  }, [data]);
  const maxValue = useMemo(
    () => (topFeatures.length ? Math.max(...topFeatures.map((item) => item.importance)) : 0),
    [topFeatures],
  );
  const barColors = ['#0f172a', '#1e293b', '#0f766e', '#1d4ed8', '#a16207'];

  const ranking = useMemo(() => {
    if (!data) return [];
    return [...data.prediccionesValor]
      .sort((a, b) => b.valor_predicho - a.valor_predicho)
      .slice(0, 10);
  }, [data]);

  const columns = useMemo(
    () => [
      { header: 'Cliente', accessorKey: 'id_cliente' },
      {
        header: 'Valor predicho',
        accessorKey: 'valor_predicho',
        cell: (info) => formatARS(info.getValue()),
      },
      {
        header: 'Valor real',
        accessorKey: 'importe_total_cliente',
        cell: (info) => (info.getValue() ? formatARS(info.getValue()) : 'N/D'),
      },
      {
        header: 'Error abs',
        accessorKey: 'error_absoluto',
        cell: (info) => (info.getValue() ? formatARS(info.getValue()) : 'N/D'),
      },
    ],
    [],
  );

  if (loading) return <LoadingState label="Cargando customer value..." />;
  if (error || !data) return <EmptyState label={error || 'Datos no disponibles'} />;

  const metricas = data.metricasValue;
  const hasReal = data.prediccionesValor.some((row) => row.importe_total_cliente !== undefined);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="ML Customer Value (Random Forest Regressor)"
        subtitle="Prediccion de valor esperado por cliente"
        actions={<DataBadge source="modelos/predicciones_customer_value.csv" />}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="MAE train" source="modelos/metricas_customer_value.json">
          <p className="text-2xl font-semibold text-slate-900">
            {metricas?.mae_train ? formatARS(metricas.mae_train) : 'N/D'}
          </p>
        </ChartCard>
        <ChartCard title="MAE test" source="modelos/metricas_customer_value.json">
          <p className="text-2xl font-semibold text-slate-900">
            {metricas?.mae_test ? formatARS(metricas.mae_test) : 'N/D'}
          </p>
        </ChartCard>
        <ChartCard title="RMSE test" source="modelos/metricas_customer_value.json">
          <p className="text-2xl font-semibold text-slate-900">
            {metricas?.rmse_test ? formatARS(metricas.rmse_test) : 'N/D'}
          </p>
        </ChartCard>
        <ChartCard title="R2 test" source="modelos/metricas_customer_value.json">
          <p className="text-2xl font-semibold text-slate-900">
            {metricas?.r2_test ? formatNumber(metricas.r2_test, 3) : 'N/D'}
          </p>
        </ChartCard>
      </div>

      <ChartCard title="Estadisticas del target" source="modelos/metricas_customer_value.json">
        <div className="grid gap-3 md:grid-cols-3 text-sm text-slate-600">
          <div className="rounded-xl bg-slate-50 p-4">
            Media: {metricas?.media_importe_total_cliente ? formatARS(metricas.media_importe_total_cliente) : 'N/D'}
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            Mediana: {metricas?.mediana_importe_total_cliente ? formatARS(metricas.mediana_importe_total_cliente) : 'N/D'}
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            Desvio: {metricas?.std_importe_total_cliente ? formatARS(metricas.std_importe_total_cliente) : 'N/D'}
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title="Feature importance (top 10)"
        helper="Variables mas influyentes en el modelo"
        source="modelos/feature_importance_customer_value.csv"
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topFeatures} layout="vertical" margin={{ left: 60 }}>
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="feature" type="category" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="importance" radius={[6, 6, 6, 6]}>
                {topFeatures.map((entry, index) => (
                  <Cell
                    key={entry.feature}
                    fill={
                      entry.importance === maxValue
                        ? '#0f766e'
                        : barColors[index % barColors.length]
                    }
                  />
                ))}
                <LabelList
                  dataKey="importance"
                  position="right"
                  formatter={(value) => formatNumber(value, 3)}
                  className="fill-slate-600 text-xs"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {hasReal && (
        <ChartCard
          title="Real vs predicho"
          helper="Dispersion de clientes"
          source="modelos/predicciones_customer_value.csv"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <XAxis dataKey="importe_total_cliente" tick={{ fontSize: 12 }} name="Real" />
                <YAxis dataKey="valor_predicho" tick={{ fontSize: 12 }} name="Predicho" />
                <Tooltip formatter={(value) => formatARS(value)} />
                <Scatter data={data.prediccionesValor} fill="#0f172a" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <ChartCard title="Top 10 clientes por valor predicho" source="modelos/predicciones_customer_value.csv">
        <DataTable data={ranking} columns={columns} searchPlaceholder="Buscar cliente" />
      </ChartCard>
    </div>
  );
};

export default CustomerValue;

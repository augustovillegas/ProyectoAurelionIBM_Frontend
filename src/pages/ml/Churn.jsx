import React, { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useData } from '../../state/data';
import { formatNumber, formatPercent } from '../../lib/format';
import ChartCard from '../../components/ChartCard';
import DataBadge from '../../components/DataBadge';
import SectionHeader from '../../components/SectionHeader';
import { DataTable } from '../../components/DataTable';
import { EmptyState, LoadingState } from '../../components/States';

const Churn = () => {
  const { data, loading, error } = useData();
  const [threshold, setThreshold] = useState(0.7);

  useEffect(() => {
    if (data?.metricasChurn?.umbral_riesgo !== undefined) {
      setThreshold(data.metricasChurn.umbral_riesgo);
    }
  }, [data]);

  const topFeatures = useMemo(() => {
    if (!data) return [];
    return [...data.featureImportanceChurn]
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10);
  }, [data]);
  const maxValue = useMemo(
    () => (topFeatures.length ? Math.max(...topFeatures.map((item) => item.importance)) : 0),
    [topFeatures],
  );
  const barColors = ['#0f172a', '#1e293b', '#0f766e', '#1d4ed8', '#a16207'];

  const clientesFiltrados = useMemo(() => {
    if (!data) return [];
    return data.clientesRiesgo.filter((row) => row.churn_proba >= threshold);
  }, [data, threshold]);

  const columns = useMemo(
    () => [
      { header: 'Cliente', accessorKey: 'id_cliente' },
      {
        header: 'Probabilidad churn',
        accessorKey: 'churn_proba',
        cell: (info) => formatPercent(info.getValue(), 1),
      },
    ],
    [],
  );

  if (loading) return <LoadingState label="Cargando churn..." />;
  if (error || !data) return <EmptyState label={error || 'Datos no disponibles'} />;

  const metricas = data.metricasChurn;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="ML Churn (Random Forest)"
        subtitle="Target: churn si recency > 60 dias (segun docs)"
        actions={<DataBadge source="modelos/metricas_churn.json" />}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="Accuracy train" source="modelos/metricas_churn.json">
          <p className="text-2xl font-semibold text-slate-900">
            {metricas?.accuracy_train ? formatPercent(metricas.accuracy_train) : 'N/D'}
          </p>
        </ChartCard>
        <ChartCard title="Accuracy test" source="modelos/metricas_churn.json">
          <p className="text-2xl font-semibold text-slate-900">
            {metricas?.accuracy_test ? formatPercent(metricas.accuracy_test) : 'N/D'}
          </p>
        </ChartCard>
        <ChartCard title="ROC-AUC" source="modelos/metricas_churn.json">
          <p className="text-2xl font-semibold text-slate-900">
            {metricas?.roc_auc ? formatNumber(metricas.roc_auc, 3) : 'N/D'}
          </p>
        </ChartCard>
        <ChartCard title="Umbral optimo" source="modelos/metricas_churn.json">
          <p className="text-2xl font-semibold text-slate-900">
            {metricas?.optimal_threshold ? formatNumber(metricas.optimal_threshold, 3) : 'N/D'}
          </p>
        </ChartCard>
      </div>

      <ChartCard
        title="Feature importance (top 10)"
        helper="Variables mas influyentes en el modelo churn"
        source="modelos/feature_importance_churn.csv"
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

      <ChartCard
        title="Clientes alto riesgo"
        helper="Lista filtrable por umbral"
        source="modelos/clientes_alto_riesgo.csv"
      >
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <label className="flex items-center gap-2">
            Umbral actual: {formatPercent(threshold, 0)}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
              className="ml-3"
            />
          </label>
          {metricas?.umbral_riesgo !== undefined && (
            <span className="text-xs text-slate-500">
              Umbral sugerido en metricas: {formatPercent(metricas.umbral_riesgo, 0)}
            </span>
          )}
          {metricas?.n_clientes_alto_riesgo !== undefined && (
            <span className="text-xs text-slate-500">
              Clientes alto riesgo reportados: {formatNumber(metricas.n_clientes_alto_riesgo, 0)}
            </span>
          )}
        </div>
        <div className="mt-4">
          <DataTable data={clientesFiltrados} columns={columns} searchPlaceholder="Buscar" />
        </div>
      </ChartCard>

      <ChartCard
        title="Acciones sugeridas"
        helper="Basado en documentacion"
        source="DOCUMENTACION.md"
      >
        <ul className="space-y-2 text-sm text-slate-600">
          <li>Retencion focalizada en clientes con alta probabilidad de churn.</li>
          <li>Campanas de reactivacion con incentivos personalizados.</li>
          <li>Monitoreo continuo antes de automatizar decisiones de negocio.</li>
        </ul>
      </ChartCard>
    </div>
  );
};

export default Churn;

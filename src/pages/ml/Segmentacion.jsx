import React, { useMemo, useState } from 'react';
import { Scatter, ScatterChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useData } from '../../state/data';
import { uniq } from '../../lib/stats';
import { formatARS, formatNumber } from '../../lib/format';
import ChartCard from '../../components/ChartCard';
import DataBadge from '../../components/DataBadge';
import SectionHeader from '../../components/SectionHeader';
import { DataTable } from '../../components/DataTable';
import { EmptyState, LoadingState } from '../../components/States';

const Segmentacion = () => {
  const { data, loading, error } = useData();
  const [clusterFilter, setClusterFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  const clusters = useMemo(() => {
    if (!data) return [];
    return uniq(data.clientesClusters.map((row) => row.cluster)).sort((a, b) => a - b);
  }, [data]);

  const ciudades = useMemo(() => {
    if (!data) return [];
    return uniq(data.clientesClusters.map((row) => row.ciudad)).sort();
  }, [data]);

  const filteredClientes = useMemo(() => {
    if (!data) return [];
    return data.clientesClusters.filter((row) => {
      if (clusterFilter !== 'all' && row.cluster !== clusterFilter) return false;
      if (cityFilter !== 'all' && row.ciudad !== cityFilter) return false;
      return true;
    });
  }, [data, clusterFilter, cityFilter]);

  const distribucion = useMemo(() => {
    if (!data) return [];
    const counts = {};
    data.clientesClusters.forEach((row) => {
      const label = row.cluster_label || `Cluster ${row.cluster}`;
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [data]);

  const metricas = useMemo(() => {
    if (!data?.documentacion) return null;
    const extract = (pattern) => {
      const match = data.documentacion.match(pattern);
      return match ? match[1] : undefined;
    };
    return {
      silhouette: extract(/Silhouette Score:\s*([0-9.]+)/i),
      calinski: extract(/Calinski-Harabasz:\s*([0-9.]+)/i),
      davies: extract(/Davies-Bouldin:\s*([0-9.]+)/i),
      inertia: extract(/Inertia:\s*([0-9.]+)/i),
    };
  }, [data]);

  const columns = useMemo(
    () => [
      { header: 'Cliente', accessorKey: 'id_cliente' },
      { header: 'Ciudad', accessorKey: 'ciudad' },
      { header: 'Cluster', accessorKey: 'cluster_label' },
      { header: 'Ventas', accessorKey: 'n_ventas' },
      {
        header: 'Importe total',
        accessorKey: 'importe_total_cliente',
        cell: (info) => formatARS(info.getValue()),
      },
      {
        header: 'Ticket promedio',
        accessorKey: 'ticket_promedio',
        cell: (info) => formatARS(info.getValue()),
      },
    ],
    [],
  );

  if (loading) return <LoadingState label="Cargando segmentacion..." />;
  if (error || !data) return <EmptyState label={error || 'Datos no disponibles'} />;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="ML Segmentacion (K-Means)"
        subtitle="Distribucion de clusters y perfiles promedio"
        actions={<DataBadge source="modelos/clientes_con_clusters.csv" />}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title="Distribucion de clusters"
          helper="Conteo de clientes por cluster"
          source="modelos/clientes_con_clusters.csv"
        >
          <div className="grid gap-3">
            {distribucion.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{item.label}</span>
                <span className="font-semibold text-slate-900">{formatNumber(item.value)}</span>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard
          title="Metricas de cluster"
          helper="Valores desde DOCUMENTACION.md"
          source="DOCUMENTACION.md"
        >
          <div className="grid gap-2 text-sm text-slate-600">
            <div>Silhouette: {metricas?.silhouette || 'N/D'}</div>
            <div>Calinski-Harabasz: {metricas?.calinski || 'N/D'}</div>
            <div>Davies-Bouldin: {metricas?.davies || 'N/D'}</div>
            <div>Inertia: {metricas?.inertia || 'N/D'}</div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Nota: los valores se leen de la documentacion tecnica.
          </p>
        </ChartCard>
      </div>

      <ChartCard
        title="Scatter PCA (PCA1 vs PCA2)"
        helper="Clientes coloreados por cluster"
        source="modelos/clientes_con_clusters.csv"
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <XAxis dataKey="PCA1" tick={{ fontSize: 12 }} name="PCA1" />
              <YAxis dataKey="PCA2" tick={{ fontSize: 12 }} name="PCA2" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={filteredClientes} fill="#0f172a" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        title="Perfiles promedio por cluster"
        helper="Fuente perfiles_segmentos.csv"
        source="modelos/perfiles_segmentos.csv"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {data.perfilesSegmentos.map((perfil) => (
            <div key={perfil.cluster} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Cluster {perfil.cluster}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Ventas promedio: {formatNumber(perfil.n_ventas, 2)} - Ticket promedio:{' '}
                {formatARS(perfil.ticket_promedio)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Mix pagos: Ef {formatNumber(perfil.pct_ventas_efectivo, 2)} - QR{' '}
                {formatNumber(perfil.pct_ventas_qr, 2)} - Tarjeta{' '}
                {formatNumber(perfil.pct_ventas_tarjeta, 2)} - Transf{' '}
                {formatNumber(perfil.pct_ventas_transferencia, 2)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-slate-500">
          {data.perfilesSegmentos.length} perfiles disponibles.
        </div>
      </ChartCard>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={clusterFilter}
            onChange={(event) =>
              setClusterFilter(event.target.value === 'all' ? 'all' : Number(event.target.value))
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="all">Todos los clusters</option>
            {clusters.map((cluster) => (
              <option key={cluster} value={cluster}>
                Cluster {cluster}
              </option>
            ))}
          </select>
          <select
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="all">Todas las ciudades</option>
            {ciudades.map((ciudad) => (
              <option key={ciudad} value={ciudad}>
                {ciudad}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ChartCard title="Clientes por cluster" source="modelos/clientes_con_clusters.csv">
        <DataTable data={filteredClientes} columns={columns} searchPlaceholder="Buscar cliente" />
      </ChartCard>
    </div>
  );
};

export default Segmentacion;

import React from 'react';
import { DATA_FILES } from '../data/files';
import ChartCard from '../components/ChartCard';
import SectionHeader from '../components/SectionHeader';
import DataBadge from '../components/DataBadge';

const PowerBi = () => {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Power BI"
        subtitle="Entregable oficial y descripcion de contenidos"
        actions={<DataBadge source="Proyecto Aurelion - Power BI.pbix" />}
      />
      <ChartCard title="Entregable PBIX" source="Proyecto Aurelion - Power BI.pbix">
        <p className="text-sm text-slate-600">
          El PBIX es un archivo de Power BI Desktop. Para verlo, descargue y abra en Power BI
          Desktop.
        </p>
        <a
          href={DATA_FILES.pbix}
          download
          className="mt-4 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Descargar PBIX
        </a>
      </ChartCard>
      <ChartCard title="Contenido del tablero" source="DOCUMENTACION.md">
        <ul className="space-y-2 text-sm text-slate-600">
          <li>KPIs de ventas, tickets y clientes.</li>
          <li>Tendencias temporales y estacionalidad.</li>
          <li>Mix de medios de pago y categorias.</li>
          <li>Segmentacion por ciudad y categoria.</li>
        </ul>
      </ChartCard>
      <ChartCard title="Resumen ejecutivo (PDF)" source="resumen_ejecutivo.pdf">
        <a
          href={DATA_FILES.resumenEjecutivo}
          download
          className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Descargar resumen ejecutivo
        </a>
      </ChartCard>
    </div>
  );
};

export default PowerBi;


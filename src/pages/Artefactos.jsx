import React from 'react';
import { DOWNLOADS } from '../data/files';
import SectionHeader from '../components/SectionHeader';
import ChartCard from '../components/ChartCard';

const Artefactos = () => {
  return (
    <div className="space-y-6">
      <SectionHeader title="Artefactos y descargas" subtitle="Archivos oficiales del proyecto" />
      <ChartCard title="Repositorio de archivos" source="INFORMACION/">
        <div className="grid gap-3 md:grid-cols-2">
          {DOWNLOADS.map((item) => (
            <a
              key={item.path}
              href={item.path}
              download
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 hover:bg-white"
            >
              <span>{item.label}</span>
              <span className="text-xs text-slate-400">descargar</span>
            </a>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default Artefactos;


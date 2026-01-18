import React from 'react';
import { useData } from '../state/data';
import FiltersBar from './FiltersBar';

const Topbar = () => {
  const { loading, error } = useData();

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Retail minorista - IBM & Guayerd
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Proyecto Aurelion - Panel Ejecutivo
          </h2>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            loading
              ? 'bg-amber-100 text-amber-700'
              : error
                ? 'bg-rose-100 text-rose-700'
                : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {loading ? 'Cargando datasets' : error ? 'Error en datos' : 'Datos listos'}
        </div>
      </div>
      <FiltersBar />
    </header>
  );
};

export default Topbar;


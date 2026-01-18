import React from 'react';

export const LoadingState = ({ label }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
        <span>{label || 'Cargando datos...'}</span>
      </div>
    </div>
  );
};

export const EmptyState = ({ label }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
      {label || 'No hay datos para estos filtros.'}
    </div>
  );
};

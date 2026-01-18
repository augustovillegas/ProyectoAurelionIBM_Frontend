import React from 'react';

export const LoadingState = ({ label }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
      {label || 'Cargando datos...'}
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

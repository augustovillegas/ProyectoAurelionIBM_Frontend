import React from 'react';

const KpiCard = ({ label, value, helper }) => {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      {helper && <p className="mt-2 text-xs text-slate-500">{helper}</p>}
    </div>
  );
};

export default KpiCard;

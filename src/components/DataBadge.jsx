import React from 'react';

const DataBadge = ({ source }) => {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
      Fuente: {source}
    </span>
  );
};

export default DataBadge;

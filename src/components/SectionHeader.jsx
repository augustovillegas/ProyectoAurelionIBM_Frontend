import React from 'react';

const SectionHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default SectionHeader;

import React from 'react';
import DataBadge from './DataBadge';

const ChartCard = ({ title, helper, source, children }) => {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 sm:gap-3">
        <div>
          <h4 className="text-base font-semibold text-slate-900">{title}</h4>
          {helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
        </div>
        {source && <DataBadge source={source} />}
      </div>
      <div className="mt-3 flex-1 sm:mt-4">{children}</div>
    </section>
  );
};

export default ChartCard;

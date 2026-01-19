import React, { useMemo } from 'react';

const describeSemiArc = (x, y, radius) => {
  const startX = x - radius;
  const endX = x + radius;
  return ['M', startX, y, 'A', radius, radius, 0, 0, 1, endX, y].join(' ');
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const Gauge = ({ value, min = 0, max = 100, label, formatValue }) => {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 1;
  const safeValue = Number.isFinite(value) ? value : safeMin;
  const clamped = clamp(safeValue, safeMin, safeMax);
  const percent = safeMax > safeMin ? (clamped - safeMin) / (safeMax - safeMin) : 0;
  const progress = Math.max(0, Math.min(percent, 1)) * 100;

  const arcPath = useMemo(() => describeSemiArc(100, 100, 80), []);

  const format = (val) => (formatValue ? formatValue(val) : val);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="w-full max-w-[260px]">
        <svg viewBox="0 0 200 120" className="w-full">
          <path
            d={arcPath}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d={arcPath}
            fill="none"
            stroke="#0f172a"
            strokeWidth="16"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray={`${progress} 100`}
          />
          <text
            x="100"
            y="90"
            textAnchor="middle"
            fill="#0f172a"
            style={{ fontSize: '20px', fontWeight: 600 }}
          >
            {format(safeValue)}
          </text>
        </svg>
      </div>
      {label && (
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      )}
      <div className="mt-2 flex w-full max-w-[260px] justify-between text-xs text-slate-500">
        <span>Min {format(safeMin)}</span>
        <span>Max {format(safeMax)}</span>
      </div>
    </div>
  );
};

export default Gauge;

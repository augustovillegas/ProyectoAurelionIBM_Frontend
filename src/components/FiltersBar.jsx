import React, { useMemo } from 'react';
import { useData } from '../state/data';
import { useFilters } from '../state/filters';
import { uniq } from '../lib/stats';

const selectClass =
  'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200';

const labelClass = 'text-xs font-semibold uppercase tracking-wide text-slate-400';

const FiltersBar = () => {
  const { data } = useData();
  const { filters, setFilters } = useFilters();

  const options = useMemo(() => {
    if (!data) return { ciudades: [], categorias: [], medios: [], fechas: [] };
    const fechas = data.baseAurelion.map((row) => row.fecha).filter(Boolean);
    return {
      ciudades: uniq(data.baseAurelion.map((row) => row.ciudad)).sort(),
      categorias: uniq(data.baseAurelion.map((row) => row.categoria)).sort(),
      medios: uniq(data.baseAurelion.map((row) => row.medio_pago)).sort(),
      fechas,
    };
  }, [data]);

  const minDate = useMemo(() => {
    if (!options.fechas.length) return '';
    return options.fechas.reduce((min, val) => (val < min ? val : min), options.fechas[0]);
  }, [options.fechas]);

  const maxDate = useMemo(() => {
    if (!options.fechas.length) return '';
    return options.fechas.reduce((max, val) => (val > max ? val : max), options.fechas[0]);
  }, [options.fechas]);

  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
      <div className="flex flex-col gap-2">
        <span className={labelClass}>Desde</span>
        <input
          type="date"
          min={minDate}
          max={filters.endDate || maxDate}
          value={filters.startDate || ''}
          onChange={(event) => setFilters((prev) => ({ ...prev, startDate: event.target.value }))}
          className={selectClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className={labelClass}>Hasta</span>
        <input
          type="date"
          min={filters.startDate || minDate}
          max={maxDate}
          value={filters.endDate || ''}
          onChange={(event) => setFilters((prev) => ({ ...prev, endDate: event.target.value }))}
          className={selectClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className={labelClass}>Ciudad</span>
        <select
          value={filters.ciudad || ''}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, ciudad: event.target.value || undefined }))
          }
          className={selectClass}
        >
          <option value="">Todas</option>
          {options.ciudades.map((ciudad) => (
            <option key={ciudad} value={ciudad}>
              {ciudad}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <span className={labelClass}>Categoria</span>
        <select
          value={filters.categoria || ''}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, categoria: event.target.value || undefined }))
          }
          className={selectClass}
        >
          <option value="">Todas</option>
          {options.categorias.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <span className={labelClass}>Medio de pago</span>
        <select
          value={filters.medioPago || ''}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, medioPago: event.target.value || undefined }))
          }
          className={selectClass}
        >
          <option value="">Todos</option>
          {options.medios.map((medio) => (
            <option key={medio} value={medio}>
              {medio}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FiltersBar;


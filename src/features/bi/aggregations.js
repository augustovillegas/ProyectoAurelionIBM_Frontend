import { groupBy, sum } from '../../lib/stats';

export const aggregateBy = (rows, key) => {
  const grouped = groupBy(rows, key);
  return Object.entries(grouped).map(([label, items]) => ({
    label,
    value: sum(items.map((row) => row.importe)),
    count: items.length,
  }));
};

export const aggregateByCount = (rows, key) => {
  const grouped = groupBy(rows, key);
  return Object.entries(grouped).map(([label, items]) => ({
    label,
    value: items.length,
  }));
};

export const aggregateByTicket = (rows, key) => {
  const tickets = groupBy(rows, (row) => row.id_venta);
  const grouped = {};
  Object.values(tickets).forEach((items) => {
    const label = key(items[0]);
    grouped[label] = (grouped[label] || 0) + 1;
  });
  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
};

export const aggregateByMonth = (rows) => {
  const grouped = groupBy(rows, (row) => `${row.anio}-${String(row.mes).padStart(2, '0')}`);
  return Object.entries(grouped)
    .map(([label, items]) => ({
      label,
      value: sum(items.map((row) => row.importe)),
    }))
    .sort((a, b) => (a.label > b.label ? 1 : -1));
};

export const aggregateByProducto = (rows) => {
  const grouped = groupBy(rows, (row) => row.nombre_producto);
  return Object.entries(grouped)
    .map(([label, items]) => ({
      label,
      value: sum(items.map((row) => row.importe)),
    }))
    .sort((a, b) => b.value - a.value);
};

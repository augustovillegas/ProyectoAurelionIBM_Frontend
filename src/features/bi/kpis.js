import { groupBy, mean, median, sum, uniq } from '../../lib/stats';

export const computeKpis = (rows) => {
  const totalVentas = sum(rows.map((row) => row.importe));
  const ticketsByVenta = groupBy(rows, (row) => row.id_venta);
  const ticketValues = Object.values(ticketsByVenta).map((items) =>
    sum(items.map((row) => row.importe)),
  );
  const ticketPromedio = mean(ticketValues);
  const ticketMediana = median(ticketValues);
  const itemsPorVenta = mean(
    Object.values(ticketsByVenta).map((items) => sum(items.map((row) => row.cantidad))),
  );
  const clientesUnicos = uniq(rows.map((row) => row.id_cliente)).length;
  const transacciones = Object.keys(ticketsByVenta).length;
  const skus = uniq(rows.map((row) => row.id_producto)).length;

  let nulls = 0;
  rows.forEach((row) => {
    Object.values(row).forEach((value) => {
      if (value === '' || value === null || value === undefined) nulls += 1;
    });
  });
  const duplicates =
    rows.length - uniq(rows.map((row) => `${row.id_venta}-${row.id_producto}`)).length;

  return {
    totalVentas,
    ticketPromedio,
    ticketMediana,
    itemsPorVenta,
    clientesUnicos,
    transacciones,
    skus,
    nulls,
    duplicates,
  };
};

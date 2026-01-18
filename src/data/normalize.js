const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const cleaned = String(value).replace(',', '.');
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const toInt = (value) => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const pickMedioPago = (row) => {
  const mapping = [
    ['medio_pago_efectivo', 'Efectivo'],
    ['medio_pago_qr', 'QR'],
    ['medio_pago_tarjeta', 'Tarjeta'],
    ['medio_pago_transferencia', 'Transferencia'],
  ];
  for (const [key, label] of mapping) {
    if (toNumber(row[key]) > 0) {
      return label;
    }
  }
  return 'Desconocido';
};

export const normalizeBaseRow = (row) => ({
  id_cliente: toInt(row.id_cliente),
  ciudad: row.ciudad?.trim() || 'sin-ciudad',
  fecha_alta: row.fecha_alta?.trim() || '',
  id_venta: toInt(row.id_venta),
  fecha: row.fecha?.trim() || '',
  medio_pago_efectivo: toNumber(row.medio_pago_efectivo),
  medio_pago_qr: toNumber(row.medio_pago_qr),
  medio_pago_tarjeta: toNumber(row.medio_pago_tarjeta),
  medio_pago_transferencia: toNumber(row.medio_pago_transferencia),
  anio: toInt(row.anio),
  mes: toInt(row.mes),
  dia_semana: row.dia_semana?.trim() || '',
  trimestre: toInt(row.trimestre),
  transacciones_cliente: toInt(row.transacciones_cliente),
  id_producto: toInt(row.id_producto),
  cantidad: toNumber(row.cantidad),
  precio_unitario: toNumber(row.precio_unitario),
  importe: toNumber(row.importe),
  importe_std: toNumber(row.importe_std),
  nombre_producto: row.nombre_producto?.trim() || '',
  categoria: row.categoria?.trim() || 'sin-categoria',
  medio_pago: pickMedioPago(row),
});

export const normalizeMlClienteRow = (row) => ({
  id_cliente: toInt(row.id_cliente),
  ciudad: row.ciudad?.trim() || 'sin-ciudad',
  n_ventas: toNumber(row.n_ventas),
  importe_total_cliente: toNumber(row.importe_total_cliente),
  ticket_promedio: toNumber(row.ticket_promedio),
  ticket_max: toNumber(row.ticket_max),
  ticket_min: toNumber(row.ticket_min),
  desvio_ticket: toNumber(row.desvio_ticket),
  pct_importe_alimentos: toNumber(row.pct_importe_alimentos),
  pct_importe_limpieza: toNumber(row.pct_importe_limpieza),
  pct_ventas_efectivo: toNumber(row.pct_ventas_efectivo),
  pct_ventas_qr: toNumber(row.pct_ventas_qr),
  pct_ventas_tarjeta: toNumber(row.pct_ventas_tarjeta),
  pct_ventas_transferencia: toNumber(row.pct_ventas_transferencia),
  antiguedad_cliente_dias: toNumber(row.antiguedad_cliente_dias),
  ventas_por_mes: toNumber(row.ventas_por_mes),
  lineas_promedio_por_venta: toNumber(row.lineas_promedio_por_venta),
  cantidad_promedio_por_venta: toNumber(row.cantidad_promedio_por_venta),
});

export const normalizePerfilSegmentoRow = (row) => ({
  cluster: toInt(row.cluster),
  n_ventas: toNumber(row.n_ventas),
  importe_total_cliente: toNumber(row.importe_total_cliente),
  ticket_promedio: toNumber(row.ticket_promedio),
  ticket_max: toNumber(row.ticket_max),
  ticket_min: toNumber(row.ticket_min),
  desvio_ticket: toNumber(row.desvio_ticket),
  pct_importe_alimentos: toNumber(row.pct_importe_alimentos),
  pct_importe_limpieza: toNumber(row.pct_importe_limpieza),
  pct_ventas_efectivo: toNumber(row.pct_ventas_efectivo),
  pct_ventas_qr: toNumber(row.pct_ventas_qr),
  pct_ventas_tarjeta: toNumber(row.pct_ventas_tarjeta),
  pct_ventas_transferencia: toNumber(row.pct_ventas_transferencia),
  antiguedad_cliente_dias: toNumber(row.antiguedad_cliente_dias),
  ventas_por_mes: toNumber(row.ventas_por_mes),
  lineas_promedio_por_venta: toNumber(row.lineas_promedio_por_venta),
  cantidad_promedio_por_venta: toNumber(row.cantidad_promedio_por_venta),
});

export const normalizeClienteClusterRow = (row) => ({
  ...normalizeMlClienteRow(row),
  cluster: toInt(row.cluster),
  cluster_label: row.cluster_label?.trim() || '',
  PCA1: toNumber(row.PCA1),
  PCA2: toNumber(row.PCA2),
});

export const normalizeClienteRiesgoRow = (row) => ({
  id_cliente: toInt(row.id_cliente),
  churn_proba: toNumber(row.churn_proba),
});

export const normalizePrediccionValorRow = (row) => ({
  id_cliente: toInt(row.id_cliente),
  importe_total_cliente: row.importe_total_cliente ? toNumber(row.importe_total_cliente) : undefined,
  valor_predicho: toNumber(row.valor_predicho),
  error_absoluto: row.error_absoluto ? toNumber(row.error_absoluto) : undefined,
});

export const normalizeFeatureImportanceRow = (row) => ({
  feature: row.feature?.trim() || '',
  importance: toNumber(row.importance),
});

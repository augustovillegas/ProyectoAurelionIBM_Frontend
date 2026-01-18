export const formatARS = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

export const formatNumber = (value, digits = 0) =>
  new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: digits,
  }).format(value);

export const formatPercent = (value, digits = 1) => `${formatNumber(value * 100, digits)}%`;

export const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return date.toLocaleDateString('es-AR');
};

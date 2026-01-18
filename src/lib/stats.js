export const sum = (values) => values.reduce((acc, val) => acc + val, 0);

export const mean = (values) => (values.length ? sum(values) / values.length : 0);

export const median = (values) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

export const uniq = (values) => Array.from(new Set(values));

export const groupBy = (values, key) => {
  return values.reduce((acc, item) => {
    const groupKey = key(item);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});
};

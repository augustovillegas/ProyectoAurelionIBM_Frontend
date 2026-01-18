export const applyFilters = (rows, filters) => {
  return rows.filter((row) => {
    if (filters.ciudad && row.ciudad !== filters.ciudad) return false;
    if (filters.categoria && row.categoria !== filters.categoria) return false;
    if (filters.medioPago && row.medio_pago !== filters.medioPago) return false;
    if (filters.startDate && row.fecha < filters.startDate) return false;
    if (filters.endDate && row.fecha > filters.endDate) return false;
    return true;
  });
};

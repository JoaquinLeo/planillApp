export function calcularTotalViajes(viajes) {
  return viajes.reduce((acc, v) => acc + (parseFloat(v.monto) || 0), 0);
}

export function calcularTotalGastos(gastos) {
  return gastos.reduce((acc, g) => acc + (parseFloat(g.monto) || 0), 0);
}

export function calcularGanancia(viajes, gastos, porcentaje) {
  const totalViajes = calcularTotalViajes(viajes);
  const totalGastos = calcularTotalGastos(gastos);
  const porcentajeMonto = (totalViajes * (parseFloat(porcentaje) || 0)) / 100;
  return totalViajes - porcentajeMonto - totalGastos;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString; // Devuelve el original si no tiene el formato esperado
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}
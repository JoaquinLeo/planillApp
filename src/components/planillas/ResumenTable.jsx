import React from 'react';
import { Button } from '../ui';
import { calcularTotalViajes, formatDate } from "../../utils/planillaUtils.js";

export default function ResumenTable({ planillas, onVerPlanilla }) {
  if (!planillas || planillas.length === 0) {
    return (
      <p className="text-gray-600 text-center p-4">No se han encontrado planillas para los filtros seleccionados.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="text-xs md:text-sm bg-gray-400 text-gray-700 uppercase leading-normal">
            <th className="py-1 md:py-3 px-1 md:px-6 text-left">Fecha</th>
            <th className="py-1 md:py-3 px-1 md:px-6 text-left">Chofer</th>
            <th className="py-1 md:py-3 px-1 md:px-6 text-left">Remisería (%)</th>
            <th className="py-1 md:py-3 px-1 md:px-6 text-left">Accion</th>
          </tr>
        </thead>
        <tbody className="text-xs md:text-sm font-light">
          {planillas.map((planilla) => {
            const totalViajes = calcularTotalViajes(planilla.viajes);
            const porcentaje = parseFloat(planilla.porcentaje_remisera) || 0;
            const montoRemiseria = (totalViajes * porcentaje) / 100;
            
            return (
              <tr key={planilla.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-1 md:py-3 px-1 md:px-6 text-left whitespace-nowrap">{formatDate(planilla.fecha)}</td>
                <td className="py-1 md:py-3 px-1 md:px-6 text-left">{planilla.chofer?.nombre ?? 'N/A'}</td>
                <td className="py-1 md:py-3 px-1 md:px-6 text-left">
                  {montoRemiseria.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                </td>
                <td className="py-3 px-1 sm:px-6 text-center">
                  <Button label="Ver" onClick={() => onVerPlanilla(planilla)} className="p-1 px-3 text-xs" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import React from 'react';
import { InputFecha } from '../ui';
import { SelectDueños } from './';

export default function PlanillaHeader({ 
    selectedDueño,
    onDueñoChange,
    fecha,
    onFechaChange
}) {
  return (
    <div className="border border-gray-300 shadow-lg rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mb-4 md:mb-6">
        <div className="flex items-center gap-3">
            <label htmlFor="dueño-select" className="font-semibold text-gray-700">Dueño:</label>
            <SelectDueños id="dueño-select" selectedDueño={selectedDueño} setSelectedDueño={onDueñoChange} />
        </div>
        <div className="flex items-center gap-3">
            <label htmlFor="fecha-input" className="font-semibold text-gray-700">Fecha:</label>
            <InputFecha id="fecha-input" value={fecha} onChange={onFechaChange} />
        </div>
    </div>
  );
}
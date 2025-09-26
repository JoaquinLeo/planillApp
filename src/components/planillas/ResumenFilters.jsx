import React from 'react';
import { InputFecha, Button } from '../ui';

export default function ResumenFilters({ 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate, 
  choferes, 
  selectedChofer, 
  setSelectedChofer, 
  onSearch 
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
      <InputFecha
        id="start-date"
        label="Fecha de Inicio"
        value={startDate}
        onChange={setStartDate}
      />
      <InputFecha
        id="end-date"
        label="Fecha de Fin"
        value={endDate}
        onChange={setEndDate}
      />
      <div>
        <label htmlFor="chofer-select" className="block text-sm font-medium text-gray-700 mb-1">Chofer</label>
        <select 
          id="chofer-select"
          value={selectedChofer}
          onChange={(e) => setSelectedChofer(e.target.value)}
          className="w-9/12 sm:w-1/2 md:w-full border border-gray-300 shadow-md rounded px-2 py-2 gap-4"
        >
          <option value="Todos">Todos</option>
          {choferes.map(chofer => (
            <option key={chofer.id} value={chofer.id}>{chofer.nombre}</option>
          ))}
        </select>
      </div>
      <Button 
        label="Buscar" 
        onClick={onSearch} 
        className="w-9/12 sm:w-1/2 md:w-full"
      />
    </div>
  );
}

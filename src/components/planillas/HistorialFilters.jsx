import React from 'react';
import { InputFecha, Button } from '../ui';

export default function HistorialFilters({ startDate, setStartDate, endDate, setEndDate, onSearch }) {
  return (
    <div className="border border-gray-300 shadow-lg rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 mb-4 md:mb-6">
      <div className="flex justify-center items-center gap-3">
        <label htmlFor="start-date" className="font-semibold text-gray-700">Desde:</label>
        <InputFecha id="start-date" value={startDate} onChange={setStartDate} />
      </div>
      <div className="flex justify-center items-center gap-3">
        <label htmlFor='end-date' className="font-semibold text-gray-700">Hasta:</label>
        <InputFecha id='end-date' value={endDate} onChange={setEndDate} />
      </div>
      <div className="flex justify-center items-center gap-3">
        <Button onClick={onSearch} label="Buscar" className="w-fit px-20 sm:w-auto" />
      </div>
    </div>
  );
}

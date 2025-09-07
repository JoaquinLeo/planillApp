import React, { useState, useEffect } from "react";
import { useHistorialPlanillas } from "../../hooks/useHistorialPlanillas";
import { HistorialFilters, HistorialTable, PlanillaDetalle } from "./";
import { ModalGenerico } from "../ui";

export default function HistorialPlanillas() {
  // Función para formatear la fecha a YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split("T")[0];

  // Calcular la fecha de hoy y la de hace 10 días
  const today = new Date();
  const tenDaysAgo = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);

  // Estado para manejar el rango de fechas seleccionado por el usuario
  const [filterStartDate, setFilterStartDate] = useState(
    formatDate(tenDaysAgo)
  );
  const [filterEndDate, setFilterEndDate] = useState(formatDate(today));

  // Estado que realmente se pasa al hook para disparar la búsqueda
  const [searchStartDate, setSearchStartDate] = useState(filterStartDate);
  const [searchEndDate, setSearchEndDate] = useState(filterEndDate);

  // Estado para manejar el modal de una planilla
  const [selectedPlanilla, setSelectedPlanilla] = useState(null);

  // Llamada al hook de datos
  const { planillas, loading, error } = useHistorialPlanillas(
    searchStartDate,
    searchEndDate
  );

  // Función para manejar la búsqueda cuando el usuario hace clic en el botón
  const handleSearch = () => {
    setSearchStartDate(filterStartDate);
    setSearchEndDate(filterEndDate);
  };


  // Funciones mostrar una planilla

  const handleVerPlanilla = (planilla) => {
    setSelectedPlanilla(planilla);
  };

  const handleCerrarPlanilla = () => {
    setSelectedPlanilla(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <HistorialFilters
        startDate={filterStartDate}
        setStartDate={setFilterStartDate}
        endDate={filterEndDate}
        setEndDate={setFilterEndDate}
        onSearch={handleSearch}
      />

      <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
        {loading && <p>Cargando historial de planillas...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <HistorialTable
            planillas={planillas}
            onVerPlanilla={handleVerPlanilla}
          />
        )}
      </div>

      <ModalGenerico
        isOpen={!!selectedPlanilla}
        onClose={handleCerrarPlanilla}
        title="Detalle de la Planilla"
      >
        {selectedPlanilla && (
          <PlanillaDetalle planilla={selectedPlanilla} />
        )}
      </ModalGenerico>
    </div>
  );
}

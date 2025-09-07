import React, { useState } from "react";
import { useResumenDueno } from "../../hooks/useResumenDueno";
import { ResumenFilters, ResumenTable, PlanillaDetalle } from "./";
import { ModalGenerico, Titulo } from "../ui";

export default function ResumenDueno() {
  const formatDate = (date) => date.toISOString().split("T")[0];

  const today = new Date();
  const tenDaysAgo = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);

  const [filterStartDate, setFilterStartDate] = useState(formatDate(tenDaysAgo));
  const [filterEndDate, setFilterEndDate] = useState(formatDate(today));
  const [filterChoferId, setFilterChoferId] = useState('Todos');

  const [searchStartDate, setSearchStartDate] = useState(filterStartDate);
  const [searchEndDate, setSearchEndDate] = useState(filterEndDate);
  const [searchChoferId, setSearchChoferId] = useState(filterChoferId);

  const [selectedPlanilla, setSelectedPlanilla] = useState(null);

  const { planillas, choferes, loading, error } = useResumenDueno(
    searchStartDate,
    searchEndDate,
    searchChoferId
  );

  const handleSearch = () => {
    setSearchStartDate(filterStartDate);
    setSearchEndDate(filterEndDate);
    setSearchChoferId(filterChoferId);
  };

  const handleVerPlanilla = (planilla) => {
    setSelectedPlanilla(planilla);
  };

  const handleCerrarPlanilla = () => {
    setSelectedPlanilla(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="border border-gray-300 shadow-lg rounded-lg p-2">
        <ResumenFilters
          startDate={filterStartDate}
          setStartDate={setFilterStartDate}
          endDate={filterEndDate}
          setEndDate={setFilterEndDate}
          choferes={choferes}
          selectedChofer={filterChoferId}
          setSelectedChofer={setFilterChoferId}
          onSearch={handleSearch}
        />
      </div>

      <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
        {loading && <p className="text-center p-4">Cargando resumen de planillas...</p>}
        {error && <p className="text-red-500 text-center p-4">Error: {error}</p>}
        {!loading && !error && (
          <ResumenTable
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
          <PlanillaDetalle planilla={selectedPlanilla} vista="dueno" />
        )}
      </ModalGenerico>
    </div>
  );
}

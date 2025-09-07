import React, { useState, useEffect, useContext } from "react";
import { PlanillaHeader, PlanillaTable, PlanillaModals } from "./";
import { usePlanillaManager } from "../../hooks/usePlanillaManager.js";
import { getPlanillaAbiertaParaChofer } from "../../lib/api.js";
import { useAuth } from '../../context/AuthContext';

export default function Planilla() {
  const [selectedDueño, setSelectedDueño] = useState("");
  const [fecha, setFecha] = useState(() => new Date().toISOString().split("T")[0]);
  const { usuario } = useAuth(useAuth);

  useEffect(() => {
    const checkForOpenPlanilla = async () => {
      if (usuario && usuario.id) {
        try {
          const openPlanilla = await getPlanillaAbiertaParaChofer(usuario.id);
          if (openPlanilla && openPlanilla.dueno_id) {
            setSelectedDueño(openPlanilla.dueno_id);
          }
        } catch (error) {
          console.error("Error al verificar planilla abierta por defecto:", error);
        }
      }
    };

    checkForOpenPlanilla();
  }, [usuario]); // Se ejecuta cuando el usuario está disponible.

  const {
    state,
    planillaId,
    loading,
    modalStates,
    itemToDelete,
    handlers,
  } = usePlanillaManager(selectedDueño, fecha, () => setSelectedDueño(""));

  return (
    <div className="max-w-3xl mx-auto">
      <PlanillaHeader 
        selectedDueño={selectedDueño}
        onDueñoChange={setSelectedDueño}
        fecha={fecha}
        onFechaChange={setFecha}
      />

      {!selectedDueño && (
        <div className="max-w-3xl mx-auto p-1 md:p-4 text-center bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg mb-4">
          <p>Por favor, selecciona un dueño para empezar a cargar una planilla.</p>
        </div>
      )}
      
      <PlanillaTable 
        state={state}
        handlers={handlers}
        planillaId={planillaId}
        loading={loading}
        selectedDueño={selectedDueño}
      />

      <PlanillaModals 
        state={state}
        modalStates={modalStates}
        itemToDelete={itemToDelete}
        handlers={handlers}
      />
    </div>
  );
}
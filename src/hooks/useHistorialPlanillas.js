import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getPlanillasCerradasPorFecha } from "../lib/api"; 

export function useHistorialPlanillas(startDate, endDate) {
  const [planillas, setPlanillas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { usuario } = useAuth(); // Asumiendo que useAuth proporciona el usuario logueado

  useEffect(() => {
    if (!usuario || !startDate || !endDate) {
      setPlanillas([]);
      return;
    }

    const obtenerPlanillas = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPlanillasCerradasPorFecha(usuario.id, startDate, endDate);
        
        setPlanillas(data);
      } catch (err) {
        setError("Error al cargar el historial de planillas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    obtenerPlanillas();
  }, [usuario, startDate, endDate]);

  return { planillas, loading, error };
}


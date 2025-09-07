import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getPlanillasCerradasParaDueno, getRelaciones } from "../lib/api";

export function useResumenDueno(startDate, endDate, choferId) {
  const [planillas, setPlanillas] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { usuario } = useAuth();

  // Cargar la lista de choferes activos una sola vez
  useEffect(() => {
    if (usuario?.rol !== 'dueno') return;

    const fetchChoferes = async () => {
      try {
        const relaciones = await getRelaciones(usuario.id, 'activa');
        const choferesActivos = relaciones.map(rel => rel.chofer);
        setChoferes(choferesActivos);
      } catch (err) {
        console.error("Error al cargar los choferes", err);
        setError("No se pudieron cargar los choferes.");
      }
    };

    fetchChoferes();
  }, [usuario]);

  // Cargar las planillas filtradas cuando cambian los filtros
  const fetchPlanillas = useCallback(async () => {
    if (!usuario || !startDate || !endDate) {
      setPlanillas([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getPlanillasCerradasParaDueno(
        usuario.id,
        choferId,
        startDate,
        endDate
      );
      setPlanillas(data);
    } catch (err) {
      setError("Error al cargar el resumen de planillas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [usuario, startDate, endDate, choferId]);

  useEffect(() => {
    fetchPlanillas();
  }, [fetchPlanillas]);

  return { planillas, choferes, loading, error, refetch: fetchPlanillas };
}
